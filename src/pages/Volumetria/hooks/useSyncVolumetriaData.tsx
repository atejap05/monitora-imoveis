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

  const { isLoading, error, data, isSuccess, isError } = useQuery<
    VolumetriaItem[],
    Error
  >({
    queryKey: QUERY_KEYS.volumetriaData(submittedFilters!),

    queryFn: async () => {
      if (!submittedFilters) {
        throw new Error("Filtros não submetidos para a busca.");
      }

      const data = await queuedBackendCall(
        () => fetchVolumetriaData(submittedFilters),
        "normal"
      );

      return data;
    },

    enabled: !!submittedFilters,
  });

  useEffect(() => {
    setLoading(isLoading);
    if (isError && error) {
      console.error("Erro ao buscar dados de volumetria:", error);
      setError(error);
      setData(null);
      return;
    }
    if (isSuccess) {
      setData(data ?? null);
      setError(null);
    }
  }, [
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    setLoading,
    setData,
    setError,
  ]);
};
