import { findUFCodigo } from "@/lib/utils";
import type {
  DadosUsuarioAutenticado,
  Municipio,
  TConsultaNFSeTotais,
} from "@/@types";
import { Consulta } from "@/dashboards/Consultas/@types";

export const fecthMunicipioByUf = async (uf: string) => {
  const ufCodigo = await findUFCodigo(uf);
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCodigo}/municipios`;
  const response = await fetch(url);
  const data = await response.json();
  return data as Municipio[];
};

export type formType<T> = T;

export const getDadosUsuarioAutenticado =
  async (): Promise<DadosUsuarioAutenticado> => {
    const win = window as unknown as Window & {
      runScript: (
        a: string,
        b: string
      ) => Promise<{ nome: string; cpf: string }>;
    };

    const resposta = await win.runScript("", "get_dados_usuario_autenticado");
    return resposta as DadosUsuarioAutenticado;
  };

export const fetchContribuintes = async (
  ni: string,
  anos: Array<string>
): Promise<Consulta> => {
  const win = window as Window & {
    runScript?: (
      a: string,
      b: string,
      c: string,
      d: Array<string>
    ) => Promise<Consulta>;
  };

  const response = await win.runScript!("", "consulta_nfse_por_cnpj", ni, anos);

  return response as Consulta;
};
// Notas Fiscais //

type NFSeFiltro = {
  filtro: string | null;
  anos: Array<number | string>;
  regiao: string | null;
  municipio: string | null;
  uf: string | null;
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
