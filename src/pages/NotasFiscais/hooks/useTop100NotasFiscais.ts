import { useQuery } from "@tanstack/react-query";
import { fetchTop100NotasFiscais, NFSeFiltro } from "@/service";
import { useNotasFiscaisFiltersState } from "@/state/notasFiscaisFiltersSate";

/**
 * Hook para buscar o top 100 de notas fiscais com maiores valores.
 * Usa os filtros globais do Zustand.
 */
export const useTop100NotasFiscais = () => {
  const { submittedFilters } = useNotasFiscaisFiltersState();

  const query = useQuery({
    queryKey: ["top100NotasFiscais", submittedFilters],
    queryFn: () => fetchTop100NotasFiscais(submittedFilters as NFSeFiltro),
    enabled: !!submittedFilters, // A query só será executada se houver filtros submetidos
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
  });

  return query;
};
