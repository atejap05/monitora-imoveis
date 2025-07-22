import type { TConsultaNFSeTotais, TFilter, TAdesaoMunicipios } from "@/@types";

//////////// Fetching para Visão Geral //////////////
export const fetchNotasFiscais = async (
  params: TFilter
): Promise<TConsultaNFSeTotais> => {
  const win = window as Window & {
    get_totais_nfse_com_filtro?: (
      params: TFilter
    ) => Promise<TConsultaNFSeTotais>;
  };
  //@ts-ignore
  const response = await win.get_totais_nfse_com_filtro(params);
  return response;
};

export const fetchDistribuicaoFrequencia = async (
  params: TFilter
): Promise<any> => {
  const win = window as Window & {
    get_distribuicao_freq_nfse_com_filtro?: (params: TFilter) => Promise<any>;
  };
  //@ts-ignore
  const response = await win.get_distribuicao_freq_nfse_com_filtro(params);
  return response;
};

export const fetchDadosETL = async (): Promise<any> => {
  const win = window as Window & {
    get_dados_etl_nfse?: () => Promise<any>;
  };
  //@ts-ignore
  const response = await win.get_dados_etl_nfse();
  return response;
};

export const fetchAdesaoMunicipios = async (
  params: TFilter
): Promise<TAdesaoMunicipios> => {
  const win = window as Window & {
    get_adesao_municipios?: (params: TFilter) => Promise<TAdesaoMunicipios>;
  };
  //@ts-ignore
  const response = await win.get_adesao_municipios(params);
  return response;
};
