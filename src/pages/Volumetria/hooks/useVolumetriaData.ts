import { useQuery } from "@tanstack/react-query";
import { fetchVolumetriaData } from "@/service";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

import { VolumetriaParams } from "@/@types";

export const useVolumetriaData = (filters: VolumetriaParams | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.volumetriaData(filters ?? {}),
    queryFn: () =>
      queuedBackendCall(() => fetchVolumetriaData(filters ?? {}), "normal"),
    enabled: !!filters,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
