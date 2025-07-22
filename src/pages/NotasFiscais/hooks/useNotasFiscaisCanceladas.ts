import { useQuery } from "@tanstack/react-query";
import { fetchNotasFiscaisCanceladas } from "@/service";
import { TFilter } from "@/@types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

/**
 * Hook para buscar dados de notas fiscais canceladas (KPIs de cancelamento)
 * Usa os filtros globais do Zustand
 */

export const useNotasFiscaisCanceladas = (filters: TFilter | null) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.notasFiscaisCanceladas(filters!),
    queryFn: () =>
      queuedBackendCall(
        () => fetchNotasFiscaisCanceladas(filters as TFilter),
        "normal"
      ),
    enabled: !!filters,
    // staleTime removido - usar configuração global de 1 hora
  });

  return query;
};
