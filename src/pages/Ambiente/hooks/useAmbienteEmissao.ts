import { useQuery } from "@tanstack/react-query";
import { fetchAmbienteEmissao } from "@/service";
import { useAmbienteFiltersState } from "@/state/ambienteFiltersSate";

export const useAmbienteEmissao = () => {
  const { filters } = useAmbienteFiltersState();
  return useQuery({
    queryKey: ["ambienteEmissao", filters],
    queryFn: () => fetchAmbienteEmissao(filters),
    enabled: !!filters,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
