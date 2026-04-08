import { useQuery } from "@tanstack/react-query";
import { fetchAmbienteEmissao } from "@/service/ambiente";
import { useAmbienteFiltersState } from "@/state/ambienteFiltersSate";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

export const useAmbienteEmissao = () => {
  const { filters } = useAmbienteFiltersState();
  return useQuery({
    queryKey: QUERY_KEYS.ambienteEmissao(filters),
    queryFn: () =>
      queuedBackendCall(() => fetchAmbienteEmissao(filters), "normal"),
    enabled: !!filters,
    // staleTime removido - usar configuração global de 1 hora
  });
};
