import { Consulta } from "@/pages/Consultas/@types";

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
