import { CardValor } from "@/components/CardValor";
import { useNotasFiscaisCanceladas } from "./hooks/useNotasFiscaisCanceladas";
import { useSyncNotasFiscaisData } from "./hooks/useSyncNotasFiscaisData";
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

export const NotasFiscais = () => {
  const { submittedFilters, isLoading, error } = useNotasFiscaisFiltersState();
  const { data: notasCanceladasData } =
    useNotasFiscaisCanceladas(submittedFilters);
  const { data: top100Data, isLoading: isLoadingTop100 } =
    useTop100NotasFiscais(submittedFilters);

  // Hook para sincronizar os dados dos KPIs com o estado de filtros
  useSyncNotasFiscaisData();

  // Calcula os KPIs a partir dos dados brutos
  const kpis = notasCanceladasData
    ? {
      substituicao:
        notasCanceladasData?.find(e => e.cod_evento === "105102")
          ?.total_notas || 0,
      deferidoAnaliseFiscal:
        notasCanceladasData?.find(e => e.cod_evento === "105104")
          ?.total_notas || 0,
      oficio:
        notasCanceladasData?.find(e => e.cod_evento === "305101")
          ?.total_notas || 0,
      outros: (() => {
        const known = ["105102", "105104", "305101"];
        return (
          notasCanceladasData
            ?.filter(e => !known.includes(e.cod_evento))
            .reduce((acc, cur) => acc + cur.total_notas, 0) || 0
        );
      })(),
    }
    : null;

  if (!submittedFilters) {
    return <NotasFiscaisWelcome />;
  }

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

      {submittedFilters && (
        <>
          {error && (
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
            {isLoading ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Cancelamentos por Tipo
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <NotasFiscaisKpiCardSkeleton />
                  <NotasFiscaisKpiCardSkeleton />
                  <NotasFiscaisKpiCardSkeleton />
                  <NotasFiscaisKpiCardSkeleton />
                </div>
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
                      icon={<FileCheck className="text-green h-5 w-5" />}
                      title={
                        <span className="text-green">
                          Deferido por Análise Fiscal
                        </span>
                      }
                      description="Total de notas fiscais canceladas"
                      value={kpis.deferidoAnaliseFiscal}
                    />
                    <CardValor
                      icon={<FileSignature className="text-green h-5 w-5" />}
                      title={<span className="text-green">De Ofício</span>}
                      description="Total de notas fiscais canceladas"
                      value={kpis.oficio}
                    />
                    <CardValor
                      icon={<FileX2 className="text-green h-5 w-5" />}
                      title={<span className="text-green">Outros</span>}
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
            ) : error ? (
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
