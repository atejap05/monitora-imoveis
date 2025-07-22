import type { MunicipioStatus } from "@/@types";

//////////////// Fetching Relatório de Convenios //////////////
export const fetchRelatrioConvenios = async (): Promise<MunicipioStatus[]> => {
  const win = window as Window & {
    gerar_relatorio_conveniados?: () => Promise<MunicipioStatus[]>;
  };
  //@ts-ignore
  const response = await win.gerar_relatorio_conveniados();
  return response;
};
