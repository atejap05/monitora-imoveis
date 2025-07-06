import { VisaoGeralTable } from "./VisaoGeralTable.tsx";
import { distFreqColumns } from "./VisaoGeralColumns.tsx";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState.ts";
import { formatNumber } from "@/lib/utils";
import { FiltroHeader } from "@/components/Layout/FiltroHeader";

import LocalEtlSection from "./LocalEtlSection";
import { FileText, User, Building2, Factory } from "lucide-react";
import DashCard from "@/components/DashCard";

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
      <FiltroHeader
        submittedFilters={submittedFilters}
        returnedYears={returnedYears}
      />

      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <DashCard isPending title="" value="" description="" />
              <DashCard isPending title="" value="" description="" />
              <DashCard isPending title="" value="" description="" />
              <DashCard isPending title="" value="" description="" />
            </>
          ) : (
            <>
              <DashCard
                title="Total de NFSe"
                description="Total de NFSe emitidas"
                value={formatNumber(aggregatedTotals.total)}
                icon={<FileText size={18} />}
              />
              <DashCard
                title="MEI"
                description="Total de NFSe MEI"
                value={formatNumber(aggregatedTotals.mei)}
                icon={<User size={18} />}
              />
              <DashCard
                title="ME/EPP"
                description="Total de NFSe ME/EPP"
                value={formatNumber(aggregatedTotals.me_epp)}
                icon={<Building2 size={18} />}
              />
              <DashCard
                title="Não Optantes"
                description="Total de NFSe de Não Optantes"
                value={formatNumber(aggregatedTotals.nao_optante)}
                icon={<Factory size={18} />}
              />
            </>
          )}
        </div>

        {/* Tabela de distribuição de frequência abaixo do histograma */}
        <div className="w-full">
          <VisaoGeralTable
            title="Distribuição de Frequência"
            subtitle="Distribuição de frequência das notas fiscais por valor"
            data={distFreqData?.tabela_frequencias || []}
            columns={distFreqColumns}
            isLoading={isLoading}
            Loader={() => (
              <div className="text-green animate-pulse">
                Carregando tabela...
              </div>
            )}
            estatisticas={distFreqData?.estatisticas}
            metodoCalculo={distFreqData?.metodo_calculo}
          />
        </div>

        {/* Gráfico sobre as ETL no Banco de dados. */}
        <LocalEtlSection />
      </div>
    </div>
  );
};

export default VisaoGeralDashboard;
