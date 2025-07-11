import type { TTop100NFSe, TFilter } from "@/@types";

//////////////// Fetching Notas Fiscais Canceladas //////////////
export const fetchNotasFiscaisCanceladas = async (
  params: TFilter
): Promise<
  Array<{
    cod_evento: string;
    descr_evento: string;
    total_notas: number;
  }>
> => {
  const win = window as unknown as Window & {
    runScript: (
      scriptName: string,
      functionName: string,
      params: TFilter
    ) => Promise<
      Array<{
        cod_evento: string;
        descr_evento: string;
        total_notas: number;
      }>
    >;
  };

  //@ts-ignore
  const response = await win.consulta_nfse_canceladas(params);
  return response as Array<{
    cod_evento: string;
    descr_evento: string;
    total_notas: number;
  }>;
};

//////////////// Fetching Top 100 Notas Fiscais //////////////
export const fetchTop100NotasFiscais = async (
  params: TFilter
): Promise<TTop100NFSe> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: TFilter
    ) => Promise<TTop100NFSe>;
  };
  //@ts-ignore
  const response = await win.consulta_top_100_valor(params);

  return response;
};
