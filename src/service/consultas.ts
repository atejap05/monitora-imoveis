import { Consulta, NfseData } from "@/pages/Consultas/components/@types";

//////////// Fetching Contribuintes para a página de Consultas //////////////
export const fetchContribuintes = async (params: {
  ni: string;
  anos: number[];
}): Promise<Consulta> => {
  const win = window as Window & {
    consulta_nfse_por_cnpj?: (params: {
      ni: string;
      anos: number[];
    }) => Promise<Consulta>;
  };

  //@ts-ignore
  const response = await win.consulta_nfse_por_cnpj(params);
  return response;
};

//////////// Fetching NFSe por Chave de Acesso //////////////
export const fetchNfsePorChave = async (
  chave: string,
): Promise<NfseData | null> => {
  const win = window as Window & {
    consulta_nfse_por_chave_acesso?: (params: {
      chave: string;
    }) => Promise<NfseData[]>;
  };

  //@ts-ignore
  const response = await win.consulta_nfse_por_chave_acesso({ chave });
  return response && response.length > 0 ? response[0] : null;
};
