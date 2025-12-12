import { VolumetriaParams, VolumetriaItem } from "@/@types";

export const fetchVolumetriaData = async (
  params: VolumetriaParams
): Promise<VolumetriaItem[]> => {
  const win = window as Window & {
    get_volumetria_nfse?: (
      params: VolumetriaParams
    ) => Promise<VolumetriaItem[]>;
  };

  if (!win.get_volumetria_nfse) {
    throw new Error("Método get_volumetria_nfse não disponível no backend");
  }

  try {
    //@ts-ignore
    const response = await win.get_volumetria_nfse(params);

    if (!Array.isArray(response)) {
      throw new Error("Resposta inválida do backend - esperado array");
    }

    return response;
  } catch (error) {
    console.error("Erro ao buscar dados de volumetria:", error);
    throw error;
  }
};
