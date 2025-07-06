import { findUFCodigo } from "@/lib/utils";
import type {
  DadosUsuarioAutenticado,
  Municipio,
  MunicipioStatus,
  TConsultaNFSeTotais,
  TTop100NFSe,
} from "@/@types";
import { Consulta } from "@/pages/Consultas/@types";
//////////// Fetching Municipios IBGE //////////////
export const fecthMunicipioByUf = async (uf: string) => {
  const ufCodigo = await findUFCodigo(uf);
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCodigo}/municipios`;
  const response = await fetch(url);
  const data = await response.json();
  return data as Municipio[];
};

export type formType<T> = T;

//////////// Fetching Dados do Usuário Autenticado //////////
export const getDadosUsuarioAutenticado =
  async (): Promise<DadosUsuarioAutenticado> => {
    const win = window as unknown as Window & {
      runScript: (
        a: string,
        b: string
      ) => Promise<{ nome: string; cpf: string }>;
    };

    //@ts-ignore
    const resposta = await win.get_dados_usuario_autenticado();
    return resposta as DadosUsuarioAutenticado;
  };

//////////// Fetching Contribuintes //////////////
export const fetchContribuintes = async (params: {
  ni: string;
  anos: number[];
}): Promise<Consulta> => {
  console.log("[fetchContribuintes] chamada com:", params);
  const win = window as Window & {
    runScript?: (
      a: string,
      b: string,
      c: { ni: string; anos: number[] }
    ) => Promise<Consulta>;
  };

  if (!win.runScript) {
    console.error("[fetchContribuintes] window.runScript não está disponível!");
    throw new Error("window.runScript não está disponível");
  }

  try {
    const response = await win.runScript!("", "consulta_nfse_por_cnpj", params);
    console.log("[fetchContribuintes] resposta:", response);
    return response as Consulta;
  } catch (err) {
    console.error("[fetchContribuintes] erro:", err);
    throw err;
  }
};

//////////////// Fetching Notas Fiscais //////////////
// Ajuste: municipio deve ser number | null para alinhar com TFilter
export type NFSeFiltro = {
  filtro: string;
  anos: number[];
  contribuintes: number[];
  valorMin: number | null;
  valorMax: number | null;
  uf: string | null;
  municipio: number | null;
  regiao: string | null;
};

export const fetchNotasFiscais = async (
  params: NFSeFiltro
): Promise<TConsultaNFSeTotais> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: NFSeFiltro
    ) => Promise<TConsultaNFSeTotais>;
  };

  const response = await win.runScript!(
    "", // Script name, assuming empty
    "get_totais_nfse_com_filtro", // Function name
    params // Passa o objeto params diretamente
  );

  return response as TConsultaNFSeTotais;
};

export const fetchNotasFiscaisCanceladas = async (
  params: NFSeFiltro
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
      params: NFSeFiltro
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

export const fetchTop100NotasFiscais = async (
  params: NFSeFiltro
): Promise<TTop100NFSe> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: NFSeFiltro
    ) => Promise<TTop100NFSe>;
  };
  //@ts-ignore
  const response = await win.consulta_top_100_valor(params);

  return response;
};

export const fetchNotasFiscaisMeiAmbiente = async (
  params: NFSeFiltro
): Promise<
  Array<{
    year: string;
    app: number;
    web: number;
    webservice: number;
    proprio: number;
  }>
> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: NFSeFiltro
    ) => Promise<
      Array<{
        year: string;
        app: number;
        web: number;
        webservice: number;
        proprio: number;
      }>
    >;
  };

  const response = await win.runScript!(
    "", // Script name, assuming empty
    "get_totais_ambiente_nfse_mei_com_filtro", // Function name
    params // Passa o objeto params diretamente
  );
  return response;
};

export const fetchDistribuicaoFrequencia = async (
  params: NFSeFiltro
): Promise<any> => {
  const win = window as Window & {
    runScript?: (
      scriptName: string,
      functionName: string,
      params: NFSeFiltro
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

export const fetchRelatrioConvenios = async (): Promise<MunicipioStatus[]> => {
  console.log(`[fetchRelatrioConvenios] Buscando relatório...`);
  try {
    const win = window as Window & {
      runScript?: (
        scriptName: string,
        functionName: string
      ) => Promise<MunicipioStatus[]>;
    };

    if (!win.runScript) {
      console.error(
        "[fetchRelatrioConvenios] window.runScript não disponível."
      );
      throw new Error(
        "A função 'runScript' não foi encontrada no objeto window."
      );
    }

    const response = await win.runScript(
      "", // Script name, assuming empty
      "gerar_relatorio_conveniados"
    );

    console.log("[fetchRelatrioConvenios] Dados recebidos:", response);

    if (!Array.isArray(response)) {
      console.error(
        "[fetchRelatrioConvenios] A resposta não é um array:",
        response
      );
      throw new Error("Formato de resposta inesperado do backend.");
    }

    return response;
  } catch (err) {
    console.error("[fetchRelatrioConvenios] Erro ao buscar relatório:", err);
    throw err; // Re-throw para que o React Query possa capturá-lo
  }
};
