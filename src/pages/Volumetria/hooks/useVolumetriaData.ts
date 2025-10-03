import { useQuery } from "@tanstack/react-query";
import { fetchVolumetriaData } from "@/service";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

export const useVolumetriaData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.volumetria(),
    queryFn: () => queuedBackendCall(() => fetchVolumetriaData(), "normal"),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
