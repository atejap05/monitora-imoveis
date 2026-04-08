import { useMutation } from "@tanstack/react-query";
import { fetchDanfseBase64 } from "@/service/notas-fiscais";

/**
 * Hook para buscar o DANFSe em PDF (base64) a partir da chave de acesso.
 * Retorna o estado da requisição e uma função para disparar o download.
 */
export function useDanfseBase64() {
  return useMutation({
    mutationFn: async (chaveAcesso: string) => {
      return await fetchDanfseBase64(chaveAcesso);
    },
  });
}
