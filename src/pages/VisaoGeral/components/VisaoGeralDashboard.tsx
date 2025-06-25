import { VisaoGeralTable } from "./VisaoGeralTable.tsx";
import { distFreqColumns } from "./VisaoGeralColumns.tsx";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState.ts";
import BasicLoading from "@/components/BasicLoading";
import { UFS } from "@/lib/utils";
import { CardValor } from "@/components/CardValor";
import { TFilter } from "@/@types/index.ts";

const contribuinteOptions = [
  { label: "Não Optante", value: 1 },
  { label: "MEI", value: 2 },
  { label: "ME/EPP", value: 3 },
];

function getFiltroHeader({
  submittedFilters,
  returnedYears,
}: {
  submittedFilters: TFilter | null;
  returnedYears: string[];
}) {
  if (!submittedFilters) {
    return (
      <div className="mb-4 text-sm text-gray-500">
        <strong>Filtros não aplicados.</strong>
      </div>
    );
  }

  const { filtro, municipio, uf, regiao, contribuintes, valorMin, valorMax } =
    submittedFilters;

  let filtroInfo = "";
  if (filtro === "todos") {
    filtroInfo = "Brasil";
  } else if (filtro === "uf" && uf) {
    filtroInfo = UFS.find(u => u.uf === uf)?.name || uf;
  } else if (filtro === "municipio" && municipio) {
    filtroInfo = municipio;
  } else if (filtro === "regiao" && regiao) {
    filtroInfo = regiao;
  }

  const getContribuintesText = () => {
    if (!contribuintes || contribuintes.length === 0) return "Nenhum";
    if (contribuintes.length === contribuinteOptions.length) return "Todos";
    return contribuinteOptions
      .filter(opt => contribuintes.includes(opt.value))
      .map(opt => opt.label)
      .join(", ");
  };

  const getValorText = () => {
    if (valorMin && valorMax) return `entre R$ ${valorMin} e R$ ${valorMax}`;
    if (valorMin) return `a partir de R$ ${valorMin}`;
    if (valorMax) return `até R$ ${valorMax}`;
    return "Qualquer valor";
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 border rounded-lg">
      <h3 className="text-md font-semibold text-gray-800 mb-2">
        Filtros Aplicados
      </h3>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
        <div className="flex items-baseline gap-2">
          <strong className="font-medium text-gray-900">Anos:</strong>
          <span>
            {returnedYears.length > 0 ? returnedYears.join(", ") : "N/A"}
          </span>
        </div>
        {filtroInfo && (
          <div className="flex items-baseline gap-2">
            <strong className="font-medium text-gray-900">Local:</strong>
            <span>{filtroInfo}</span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <strong className="font-medium text-gray-900">Contribuintes:</strong>
          <span>{getContribuintesText()}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <strong className="font-medium text-gray-900">Valor:</strong>
          <span>{getValorText()}</span>
        </div>
      </div>
    </div>
  );
}

const VisaoGeralDashboard = () => {
  const { data, isLoading, error, submittedFilters } =
    useVisaoGeralFiltersState();

  const nfseTotaisData = data?.nfseTotais;
  const distFreqData = data?.distribuicaoFrequencia;

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

  if (error) {
    return (
      <div>
        Error loading data:
        <ul>
          <li>{error?.message}</li>
        </ul>
      </div>
    );
  }

  if (!submittedFilters) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-center text-gray-500">
          Selecione os filtros desejados e clique em "Aplicar Filtros" para
          visualizar os dados.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
        Visão Geral da Base NFSe
      </h1>
      {getFiltroHeader({
        submittedFilters,
        returnedYears,
      })}

      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardValor
            title="Total de NFSe"
            description="Total de NFSe emitidas"
            value={aggregatedTotals.total}
          />
          <CardValor
            title="MEI"
            description="Total de NFSe MEI"
            value={aggregatedTotals.mei}
          />
          <CardValor
            title="ME/EPP"
            description="Total de NFSe ME/EPP"
            value={aggregatedTotals.me_epp}
          />
          <CardValor
            title="Não Optantes"
            description="Total de NFSe de Não Optantes"
            value={aggregatedTotals.nao_optante}
          />
        </div>

        {/* Tabela de distribuição de frequência abaixo do histograma */}
        <div className="w-full">
          <VisaoGeralTable
            title="Distribuição de Frequência"
            subtitle="Distribuição de frequência das notas fiscais por valor"
            data={distFreqData?.tabela_frequencias || []}
            columns={distFreqColumns}
            isLoading={isLoading}
            Loader={() => <div>Carregando tabela...</div>}
            estatisticas={distFreqData?.estatisticas}
            metodoCalculo={distFreqData?.metodo_calculo}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardValor
            title="Cancelamento por Substituição"
            description="Total de notas fiscais canceladas"
            value={5000}
          />
          <CardValor
            title="Cancelamento por Deferido por Análise Fiscal"
            description="Total de notas fiscais canceladas"
            value={5000}
          />
          <CardValor
            title="Cancelamento por Ofício"
            description="Total de notas fiscais canceladas"
            value={5000}
          />
          <CardValor
            title="Cancelamento - Outros"
            description="Total de notas fiscais canceladas"
            value={5000}
          />
        </div>
      </div>
    </div>
  );
};

export default VisaoGeralDashboard;
