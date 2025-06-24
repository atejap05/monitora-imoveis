import React from "react";
import { VisaoGeralHistogram } from "@/pages/VisaoGeral/components/VisaoGeralHistogram";
import { VisaoGeralTable } from "@/pages/VisaoGeral/components/VisaoGeralTable";
import { distFreqColumns } from "@/pages/VisaoGeral/components/VisaoGeralColumns";
import { useVisaoGeralData } from "@/pages/VisaoGeral/hooks/useVisaoGeralData";
import { useVisaoGeralFilters } from "@/pages/VisaoGeral/hooks/useVisaoGeralFilters";
import BasicLoading from "@/components/BasicLoading";
import { UFS } from "@/lib/utils";
import { CardValor } from "@/components/CardValor";

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

const VisaoGeral: React.FC = () => {
  const {
    nfseTotaisData,
    isLoading: isLoadingFilters,
    errorNfseTotais,
    selectedOption,
    selectedMunicipio,
    selectedUF,
    selectedRegiao,
  } = useVisaoGeralFilters();

  const {
    distFreqData,
    isLoading: isLoadingDistFreq,
    error: errorDistFreq,
    estatisticas,
    metodoCalculo,
  } = useVisaoGeralData();

  const isLoading = isLoadingFilters || isLoadingDistFreq;

  const errors: (Error | null)[] = [
    errorNfseTotais,
    errorDistFreq ? (errorDistFreq as Error) : null,
  ].filter(Boolean);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <BasicLoading
          loading={true}
          label="Carregando dados da Visão Geral..."
          Loader={() => <div>Carregando...</div>}
        />
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div>
          Error loading data:
          <ul>
            {errors.map((err, index) => (
              <li key={index}>{err?.message}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
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
          <CardValor
            title="Total de NFSe"
            description="Total de notas fiscais emitidas"
            value={aggregatedTotals.total}
          />
          <CardValor
            title="MEI"
            description="Total de notas fiscais MEI"
            value={aggregatedTotals.mei}
          />
          <CardValor
            title="ME/EPP"
            description="Total de notas fiscais ME/EPP"
            value={aggregatedTotals.me_epp}
          />
          <CardValor
            title="Grandes Empresas"
            description="Total de nfse de grandes empresas"
            value={aggregatedTotals.nao_optante}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <VisaoGeralHistogram
            data={distFreqData?.map(
              (item: { faixa: string; frequencia: number }) => ({
                faixa: item.faixa,
                frequencia: item.frequencia,
              })
            )}
          />
        </div>

        {/* A tabela de distribuição de frequência agora volta ao modo padrão (cada faixa em uma linha) */}
        <div className="w-full">
          <VisaoGeralTable
            title="Distribuição de Frequência"
            subtitle="Distribuição de frequência das notas fiscais por valor"
            data={distFreqData}
            columns={distFreqColumns}
            isLoading={isLoadingDistFreq}
            Loader={() => <div>Carregando tabela...</div>}
            estatisticas={estatisticas}
            metodoCalculo={metodoCalculo}
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

export default VisaoGeral;
