import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState";
import {
  fetchNotasFiscais,
  fetchDistribuicaoFrequencia,
  fetchAdesaoMunicipios,
} from "@/service";
import { TVisaoGeral } from "@/@types";

export const useSyncVisaoGeralData = () => {
  const { submittedFilters, setLoading, setData, setError } =
    useVisaoGeralFiltersState();

  const { isLoading, isError, error, data, isSuccess } = useQuery<
    TVisaoGeral,
    Error
  >({
    queryKey: ["visaoGeralData", submittedFilters],

    queryFn: async () => {
      if (!submittedFilters) {
        throw new Error("Filtros não submetidos para a busca.");
      }
      console.log(
        "[useSyncVisaoGeralData] Filtros enviados para o backend:",
        submittedFilters,
      );
      const [nfseTotais, distribuicaoFrequencia, adesaoMunicipios] =
        await Promise.all([
          fetchNotasFiscais(submittedFilters),
          fetchDistribuicaoFrequencia(submittedFilters),
          fetchAdesaoMunicipios(submittedFilters),
        ]);
      return { nfseTotais, distribuicaoFrequencia, adesaoMunicipios };
    },

    enabled: !!submittedFilters,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 1,
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
