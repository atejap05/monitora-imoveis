import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState";
import {
  fetchNotasFiscais,
  fetchDistribuicaoFrequencia,
  fetchAdesaoMunicipios,
} from "@/service";
import { TVisaoGeral } from "@/@types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

export const useSyncVisaoGeralData = () => {
  const { submittedFilters, setLoading, setData, setError } =
    useVisaoGeralFiltersState();

  const { isLoading, isError, error, data, isSuccess } = useQuery<
    TVisaoGeral,
    Error
  >({
    queryKey: QUERY_KEYS.visaoGeralData(submittedFilters!),

    queryFn: async () => {
      if (!submittedFilters) {
        throw new Error("Filtros não submetidos para a busca.");
      }
      console.log(
        "[useSyncVisaoGeralData] Filtros enviados para o backend:",
        submittedFilters,
      );

      // Usar fila sequencial do backend em vez de Promise.all
      const nfseTotais = await queuedBackendCall(() => fetchNotasFiscais(submittedFilters), 'high');
      const distribuicaoFrequencia = await queuedBackendCall(() => fetchDistribuicaoFrequencia(submittedFilters));
      const adesaoMunicipios = await queuedBackendCall(() => fetchAdesaoMunicipios(submittedFilters));

      return { nfseTotais, distribuicaoFrequencia, adesaoMunicipios };
    },

    enabled: !!submittedFilters,
    // staleTime removido - usar configuração global de 1 hora
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isSuccess) {
      setData(data ?? null);
      setError(null);
    }
  }, [isSuccess, data, setData, setError]);

  useEffect(() => {
    if (isError) {
      setError(error);
      setData(null); // Limpa dados antigos em caso de erro
    }
  }, [isError, error, setError, setData]);
};
