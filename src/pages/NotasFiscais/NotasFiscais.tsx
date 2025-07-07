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
import { NotasFiscaisWelcome } from "./components/NotasFiscaisWelcome";
import {
  FileCheck,
  FileSignature,
  FileText,
  FileX2,
} from "lucide-react";

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

  const consultaIniciada = !!(
    submittedFilters || // Se há filtros submetidos, considera iniciada
    kpis ||
    (top100Data && top100Data.length > 0)
  );

  // Debug para verificar o estado
  console.log("[NotasFiscais] consultaIniciada:", consultaIniciada, {
    submittedFilters,
    kpis,
    top100Data: top100Data?.length || 0,
    isLoadingKpis,
    isLoadingTop100,
  });

  // Anos retornados do filtro submetido (padrão das demais páginas)
  const returnedYears =
    Array.isArray(submittedFilters?.anos) && submittedFilters.anos.length > 0
      ? submittedFilters.anos.map(String)
      : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4">
        Notas Fiscais
      </h1>

      {/* Só mostra a tela de boas-vindas se ainda não iniciou consulta e não há dados */}
      {!consultaIniciada && <NotasFiscaisWelcome />}

      {consultaIniciada && (
        <>
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
          <div className="mb-6">
            {isLoadingKpis ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <NotasFiscaisKpiCardSkeleton />
                <NotasFiscaisKpiCardSkeleton />
                <NotasFiscaisKpiCardSkeleton />
                <NotasFiscaisKpiCardSkeleton />
              </div>
            ) : (
              kpis && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Cancelamentos por Tipo
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <CardValor
                      icon={<FileText className="text-green h-5 w-5" />}
                      title={<span className="text-green">Substituição</span>}
                      description="Total de notas fiscais canceladas"
                      value={kpis.substituicao}
                    />
                    <CardValor
                      icon={<FileCheck className="text-yellow-600 h-5 w-5" />}
                      title={
                        <span className="text-yellow-600">
                          Deferido por Análise Fiscal
                        </span>
                      }
                      description="Total de notas fiscais canceladas"
                      value={kpis.deferidoAnaliseFiscal}
                    />
                    <CardValor
                      icon={<FileSignature className="text-blue-600 h-5 w-5" />}
                      title={<span className="text-blue-600">De Ofício</span>}
                      description="Total de notas fiscais canceladas"
                      value={kpis.oficio}
                    />
                    <CardValor
                      icon={<FileX2 className="text-purple-600 h-5 w-5" />}
                      title={<span className="text-purple-600">Outros</span>}
                      description="Total de notas fiscais canceladas"
                      value={kpis.outros}
                    />
                  </div>
                </div>
              )
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
        </>
      )}
    </div>
  );
};

export default NotasFiscais;
