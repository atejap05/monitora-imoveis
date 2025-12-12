import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVolumetriaFiltersState } from "@/state/volumetriaFiltersState";
import { fetchVolumetriaData } from "@/service/volumetria";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";
import { VolumetriaItem } from "@/@types";

export const useSyncVolumetriaData = () => {
  const { submittedFilters, setData, setLoading, setError } =
    useVolumetriaFiltersState();

  const { isLoading, error, data, isSuccess } = useQuery<
    VolumetriaItem[],
    Error
  >({
    queryKey: QUERY_KEYS.volumetriaData(submittedFilters!),

    queryFn: async () => {
      if (!submittedFilters) {
        throw new Error("Filtros não submetidos para a busca.");
      }

      console.log(
        "[useSyncVolumetriaData] Filtros enviados para o backend:",
        submittedFilters
      );

      const data = await queuedBackendCall(
        () => fetchVolumetriaData(submittedFilters),
        "normal"
      );

      return data;
    },

    enabled: !!submittedFilters,
  });

  // Sincroniza loading
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Sincroniza sucesso
  useEffect(() => {
    if (isSuccess) {
      setData(data ?? null);
      setError(null);
    }
  }, [isSuccess, data, setData, setError]);

  // Sincroniza erro
  useEffect(() => {
    if (error) {
      console.error("Erro ao buscar dados de volumetria:", error);
      setError(error);
      setData(null);
    }
  }, [error, setError, setData]);
};
