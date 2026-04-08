import { useQuery } from "@tanstack/react-query";
import { fetchTop100NotasFiscais } from "@/service/notas-fiscais";
import type { TFilter } from "@/@types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

export const useTop100NotasFiscais = (filters: TFilter | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.notasFiscaisTop100(filters!),
    queryFn: () =>
      queuedBackendCall(
        () => fetchTop100NotasFiscais(filters as TFilter),
        "normal"
      ),
    enabled: !!filters, // A query só será executada se houver filtros submetidos
    // staleTime removido - usar configuração global de 1 hora
  });
};
