import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { VisaoGeralLineChart } from "./VisaoGeralLineChart";
import { VisaoGeralTable } from "./VisaoGeralTable";
import { distFreqColumns } from "./VisaoGeralColumns.tsx";
import { useVisaoGeralData } from "../hooks/useVisaoGeralData"; // Still used for distFreqData
import { useVisaoGeralFilters } from "../hooks/useVisaoGeralFilters"; // Import the new hook
import BasicLoading from "@/components/BasicLoading";
import { formatNumber, UFS } from "@/lib/utils";

function getFiltroHeader({
  selectedOption,
  selectedMunicipio,
  selectedUF,
  selectedRegiao,
  returnedYears,
}: {
  selectedOption: string;
  selectedMunicipio?: string | null;
  selectedUF?: string | null;
  selectedRegiao?: string | null;
  returnedYears: string[];
}) {
  let filtroInfo = "";
  if (selectedOption === "todos") {
    filtroInfo = "Dados para todo o Brasil";
  } else if (selectedOption === "uf" && selectedUF) {
    const ufName = UFS.find(u => u.uf === selectedUF)?.name || selectedUF;
    filtroInfo = `Dados para o estado: ${ufName}`;
  } else if (selectedOption === "municipio" && selectedMunicipio) {
    filtroInfo = `Dados para o município: ${selectedMunicipio}`;
  } else if (selectedOption === "regiao" && selectedRegiao) {
    filtroInfo = `Dados para a região: ${selectedRegiao}`;
  }
  return (
    <div className="mb-2 text-sm text-gray-500">
      <strong>Anos retornados:</strong>{" "}
      {returnedYears.length > 0
        ? returnedYears.join(", ")
        : "Nenhum ano retornado"}
      {filtroInfo && (
        <>
          <br />
          <span>{filtroInfo}</span>
        </>
      )}
    </div>
  );
}

const VisaoGeralDashboard = () => {
  // Log para depuração do ciclo de vida e dados recebidos
  const {
    nfseTotaisData,
    meiAmbienteData,
    isLoading: isLoadingFilters,
    errorNfseTotais,
    errorMeiAmbiente,
    selectedOption,
    selectedMunicipio,
    selectedUF,
    selectedRegiao,
  } = useVisaoGeralFilters();

  // Continue to use useVisaoGeralData for distFreqData for now
  // This will need to be refactored to accept filters from useVisaoGeralFilters
  const {
    distFreqData,
    isLoading: isLoadingDistFreq,
    error: errorDistFreq,
  } = useVisaoGeralData();

  // Combine loading states
  const isLoading = isLoadingFilters || isLoadingDistFreq;

  // Combine error states for display
  const errors: (Error | null)[] = [
    errorNfseTotais,
    errorMeiAmbiente,
    errorDistFreq ? (errorDistFreq as Error) : null,
  ].filter(Boolean);

  // Calculate aggregated totals from nfseTotaisData (SEM useMemo para garantir atualização)
  // Agora também exibe os anos retornados e lida com anos ausentes
  let aggregatedTotals = { total: 0, mei: 0, me_epp: 0, nao_optante: 0 };
  let returnedYears: string[] = [];
  if (nfseTotaisData) {
    returnedYears = Object.keys(nfseTotaisData);
    Object.values(nfseTotaisData).forEach(yearData => {
      aggregatedTotals.total += yearData.total || 0;
      aggregatedTotals.mei += yearData.mei || 0;
      aggregatedTotals.me_epp += yearData.me_epp || 0;
      aggregatedTotals.nao_optante += yearData.nao_optante || 0;
    });
  }

  if (isLoading) {
    return (
      <BasicLoading
        loading={true}
        label="Carregando dados da Visão Geral..."
        Loader={() => <div>Carregando...</div>}
      />
    );
  }

  if (errors.length > 0) {
    return (
      <div>
        Error loading data:
        <ul>
          {errors.map((err, index) => (
            <li key={index}>{err?.message}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <TabsContent className="px-4 py-8" value="visao-geral">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
        Visão Geral da Base NFSe
      </h1>
      {getFiltroHeader({
        selectedOption,
        selectedMunicipio,
        selectedUF,
        selectedRegiao,
        returnedYears,
      })}

      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de NFSe</CardTitle>
              <CardDescription>Total de notas fiscais emitidas</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(aggregatedTotals.total)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>MEI</CardTitle>
              <CardDescription>Total de notas fiscais MEI</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(aggregatedTotals.mei)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ME/EPP</CardTitle>
              <CardDescription>Total de notas fiscais ME/EPP</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(aggregatedTotals.me_epp)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Grandes Empresas</CardTitle>
              <CardDescription>
                Total de notas fiscais de grandes empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(aggregatedTotals.nao_optante)}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-4 flex flex-col lg:flex-row gap-4">
          {/* VisaoGeralLineChart: O gráfico já está integrado ao sistema de filtros e reflete os dados filtrados. */}
          <VisaoGeralLineChart chartData={meiAmbienteData} />
          {/* VisaoGeralTable: A tabela ainda está em implementação e será integrada ao backend futuramente. */}
          <VisaoGeralTable
            title="Distribuição de Frequência"
            subtitle="Distribuição de frequência das notas fiscais"
            data={distFreqData} // TODO: Integrar com filtros e backend
            columns={distFreqColumns}
            isLoading={isLoading}
            Loader={() => <div>Carregando tabela...</div>}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* These cards seem to have static data for now, will need dynamic data eventually */}
          <Card>
            <CardHeader>
              <CardTitle>Cancelamento por Substituição</CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(5000)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Cancelamento por Deferido por Análise Fiscal
              </CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(5000)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancelamento por Ofício</CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(5000)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cancelamento - Outros</CardTitle>
              <CardDescription>
                Total de notas fiscais canceladas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold text-gray-800">
                {formatNumber(5000)}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

export default VisaoGeralDashboard;
