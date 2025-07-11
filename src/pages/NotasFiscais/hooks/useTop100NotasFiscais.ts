import { useQuery } from "@tanstack/react-query";
import { fetchTop100NotasFiscais } from "@/service";
import type { TFilter } from "@/@types";

export const useTop100NotasFiscais = (filters: TFilter | null) => {
  return useQuery({
    queryKey: ["top100NotasFiscais", filters],
    queryFn: () => fetchTop100NotasFiscais(filters as TFilter),
    enabled: !!filters, // A query só será executada se houver filtros submetidos
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
  });
};
