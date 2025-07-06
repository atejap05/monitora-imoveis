import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchNotasFiscaisCanceladas, NFSeFiltro } from "@/service";
import { useNotasFiscaisFiltersState } from "@/state/notasFiscaisFiltersSate";

/**
 * Hook para buscar dados de notas fiscais canceladas (KPIs de cancelamento)
 * Usa os filtros globais do Zustand
 */

export const useNotasFiscaisCanceladas = () => {
  const { submittedFilters, setLoading, setError } =
    useNotasFiscaisFiltersState();

  const query = useQuery({
    queryKey: ["notasFiscaisCanceladas", submittedFilters],
    queryFn: () => fetchNotasFiscaisCanceladas(submittedFilters as NFSeFiltro),
    enabled: !!submittedFilters,
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
  });

  // Sincroniza loading e erro do Zustand com o React Query
  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);
  useEffect(() => {
    setError(query.error ?? null);
  }, [query.error, setError]);

  // Mapeamento para facilitar uso nas KPIs
  const kpis = {
    substituicao:
      query.data?.find(e => e.cod_evento === "105102")?.total_notas || 0,
    deferidoAnaliseFiscal:
      query.data?.find(e => e.cod_evento === "105104")?.total_notas || 0,
    oficio: query.data?.find(e => e.cod_evento === "305101")?.total_notas || 0,
    outros: (() => {
      // Soma todos os cancelamentos que não são os principais
      const known = ["105102", "105104", "305101"];
      return (
        query.data
          ?.filter(e => !known.includes(e.cod_evento))
          .reduce((acc, cur) => acc + cur.total_notas, 0) || 0
      );
    })(),
    total: query.data?.reduce((acc, cur) => acc + cur.total_notas, 0) || 0,
  };

  return { ...query, kpis };
};
