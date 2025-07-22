import type { TTop100NFSe, TFilter, TNotasFiscaisCanceladas } from "@/@types";

////////////////? Fetching Notas Fiscais Canceladas //////////////
export const fetchNotasFiscaisCanceladas = async (
  params: TFilter
): Promise<TNotasFiscaisCanceladas> => {
  const win = window as Window & {
    consulta_nfse_canceladas?: (
      params: TFilter
    ) => Promise<TNotasFiscaisCanceladas>;
  };

  //@ts-ignore
  const response = await win.consulta_nfse_canceladas(params);
  return response;
};

////////////////? Fetching Top 100 Notas Fiscais //////////////
export const fetchTop100NotasFiscais = async (
  params: TFilter
): Promise<TTop100NFSe> => {
  const win = window as Window & {
    consulta_top_100_valor?: (params: TFilter) => Promise<TTop100NFSe>;
  };
  //@ts-ignore
  const response = await win.consulta_top_100_valor(params);

  return response;
};

////////////////? Download DANFSe //////////////
export const fetchDanfseBase64 = async (chaveAcesso: string): Promise<Blob> => {
  const win = window as Window & {
    download_danfse?: (chaveAcesso: string) => Promise<{ danfeBase64: string }>;
  };

  if (!win.download_danfse) {
    throw new Error("Função download_danfse não está disponível");
  }

  try {
    //@ts-ignore
    const response = await win.download_danfse(chaveAcesso);

    if (!response || !response.danfeBase64) {
      throw new Error(
        "Resposta inválida do backend: danfeBase64 não encontrado"
      );
    }

    // Converter base64 para Blob
    const base64Data = response.danfeBase64;
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    return blob;
  } catch (error) {
    throw error;
  }
};
