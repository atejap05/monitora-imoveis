import type { TAmbienteEmissao, TFilter } from "@/@types";

//////////////// Fetching Ambiente de Emissão //////////////
export const fetchAmbienteEmissao = async (
  params: TFilter
): Promise<TAmbienteEmissao[]> => {
  const win = window as Window & {
    consulta_nfse_ambiente_emissao?: (
      params: TFilter
    ) => Promise<TAmbienteEmissao[]>;
  };
  //@ts-ignore
  const response = await win.consulta_nfse_ambiente_emissao(params);
  return response;
};
