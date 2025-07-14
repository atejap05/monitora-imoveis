import type { TConsultaNFSeTotais, TFilter, TAdesaoMunicipios } from "@/@types";

//////////// Fetching para Visão Geral //////////////
export const fetchNotasFiscais = async (
  params: TFilter
): Promise<TConsultaNFSeTotais> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: TFilter
    ) => Promise<TConsultaNFSeTotais>;
  };

  const response = await win.runScript!(
    "", // Script name, assuming empty
    "get_totais_nfse_com_filtro", // Function name
    params // Passa o objeto params diretamente
  );

  return response as TConsultaNFSeTotais;
};

export const fetchDistribuicaoFrequencia = async (
  params: TFilter
): Promise<any> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: TFilter
    ) => Promise<any>;
  };

  const response = await win.runScript!(
    "", // Script name, assuming empty
    "get_distribuicao_freq_nfse_com_filtro", // Function name
    params // Passa o objeto params diretamente
  );

  return response;
};

export const fetchDadosETL = async (): Promise<any> => {
  const win = window as Window & {
    runScript?: (scriptName: string, functionName: string) => Promise<any>;
  };

  const response = await win.runScript!(
    "", // Script name, assuming empty
    "get_dados_etl_nfse" // Function name
  );

  return response;
};

export const fetchAdesaoMunicipios = async (
  params: TFilter
): Promise<TAdesaoMunicipios> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: TFilter
    ) => Promise<TAdesaoMunicipios>;
  };

  const response = await win.runScript!(
    "", // Script name, assuming empty
    "get_adesao_municipios", // Function name
    params // Passa o objeto params diretamente
  );

  return response as TAdesaoMunicipios;
};
