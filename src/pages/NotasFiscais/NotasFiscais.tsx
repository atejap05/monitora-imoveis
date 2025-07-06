import { CardValor } from "@/components/CardValor";
import React from "react";
import { useNotasFiscaisCanceladas } from "./hooks/useNotasFiscaisCanceladas";
import { NotasFiscaisKpiCardSkeleton } from "./components/NotasFiscaisKpiCardSkeleton";
import { FiltroHeader } from "@/components/Layout/FiltroHeader";
import { useNotasFiscaisFiltersState } from "@/state/notasFiscaisFiltersSate";
import { useTop100NotasFiscais } from "./hooks/useTop100NotasFiscais";
import { Top100NotasFiscaisTable } from "./components/Top100NotasFiscaisTable";
import { BarLoader } from "react-spinners";
import { Separator } from "@/components/ui/separator";

const NotasFiscais: React.FC = () => {
  const {
    kpis,
    isLoading: isLoadingKpis,
    error: errorKpis,
  } = useNotasFiscaisCanceladas();
  const {
    data: top100Data,
    isLoading: isLoadingTop100,
    error: errorTop100,
  } = useTop100NotasFiscais();
  const submittedFilters = useNotasFiscaisFiltersState(
    state => state.submittedFilters
  );
  // Simula anos retornados (ajuste conforme backend)
  const returnedYears = (submittedFilters?.anos || []).map(String);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Notas Fiscais
      </h1>

      {errorKpis && (
        <div className="text-red-500 text-center mb-4">
          Erro ao carregar dados de cancelamento
        </div>
      )}

      {/* Filtros aplicados */}
      <FiltroHeader
        submittedFilters={submittedFilters}
        returnedYears={returnedYears}
      />

      {/* Cards de resumo de cancelamentos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {isLoadingKpis ? (
          <>
            <NotasFiscaisKpiCardSkeleton />
            <NotasFiscaisKpiCardSkeleton />
            <NotasFiscaisKpiCardSkeleton />
            <NotasFiscaisKpiCardSkeleton />
          </>
        ) : (
          <>
            <CardValor
              title="Cancelamento por Substituição"
              description="Total de notas fiscais canceladas"
              value={kpis.substituicao}
            />
            <CardValor
              title="Cancelamento por Deferido por Análise Fiscal"
              description="Total de notas fiscais canceladas"
              value={kpis.deferidoAnaliseFiscal}
            />
            <CardValor
              title="Cancelamento por Ofício"
              description="Total de notas fiscais canceladas"
              value={kpis.oficio}
            />
            <CardValor
              title="Cancelamento - Outros"
              description="Total de notas fiscais canceladas"
              value={kpis.outros}
            />
          </>
        )}
      </div>

      <Separator />

      {/* Top 100 Notas Fiscais */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Top 100 Notas Fiscais (Maiores Valores)
        </h2>
        {isLoadingTop100 ? (
          <div className="flex flex-col justify-center items-center h-40 gap-3">
            <BarLoader color="#709f77" />
            <span className="text-green text-lg font-semibold ml-4 animate-pulse">
              Carregando dados...
            </span>
          </div>
        ) : errorTop100 ? (
          <div className="text-red-500 text-center">
            Erro ao carregar os dados das top 100 notas fiscais.
          </div>
        ) : (
          <Top100NotasFiscaisTable data={top100Data || []} />
        )}
      </div>
    </div>
  );
};

export default NotasFiscais;
