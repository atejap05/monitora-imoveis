import { useQuery } from "@tanstack/react-query";
import { fetchNfsePorChave } from "@/service/consultas";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";
import type { NfseData } from "@/pages/Consultas/components/@types";

export const useConsultaPorChave = (chave: string, enabled: boolean) => {
  return useQuery<NfseData | null, Error>({
    queryKey: QUERY_KEYS.consultasChave(chave),
    queryFn: () => queuedBackendCall(() => fetchNfsePorChave(chave), "normal"),
    enabled: enabled && chave.length === 50,
  });
};
