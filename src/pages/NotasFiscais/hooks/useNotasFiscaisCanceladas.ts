import { useQuery } from "@tanstack/react-query";
import { fetchNotasFiscaisCanceladas } from "@/service";
import { TFilter } from "@/@types";

/**
 * Hook para buscar dados de notas fiscais canceladas (KPIs de cancelamento)
 * Usa os filtros globais do Zustand
 */

export const useNotasFiscaisCanceladas = (filters: TFilter | null) => {
  const query = useQuery({
    queryKey: ["notasFiscaisCanceladas", filters],
    queryFn: () => fetchNotasFiscaisCanceladas(filters as TFilter),
    enabled: !!filters,
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
  });

  return query;
};
