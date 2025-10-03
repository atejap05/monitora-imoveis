import { TVolumetriaRaw } from "@/@types";

export const fetchVolumetriaData = async (): Promise<TVolumetriaRaw[]> => {
  const win = window as Window & {
    get_volumetria_nfse?: () => Promise<TVolumetriaRaw[]>;
  };

  if (!win.get_volumetria_nfse) {
    throw new Error("Método get_volumetria_nfse não disponível no backend");
  }

  try {
    const response = await win.get_volumetria_nfse();
    console.log("response volumetria", response);

    if (!Array.isArray(response)) {
      throw new Error("Resposta inválida do backend - esperado array");
    }

    return response;
  } catch (error) {
    console.error("Erro ao buscar dados de volumetria:", error);
    throw error;
  }
};
