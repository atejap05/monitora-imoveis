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

export const pushFormData = async <T>(data: formType<T>) => {
  const response = await fetch(
    "https://localhost:8443/ctx/once/PainelNFSe/push_data",
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};

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

  console.log("Response from consulta_nfse_por_cnpj:", response);
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
export const fetchNotasFiscais = async ({
  filtro,
  anos,
  regiao,
  municipio,
  uf,
}: NFSeFiltro) => {
  const url = `https://localhost:8443/ctx/once/PainelNFSe/get_totais_nfse_com_filtro?filtro=${filtro}&anos=${anos.join(
    ","
  )}&regiao=${regiao}&municipio=${municipio}&uf=${uf}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar notas fiscais");
  }
  return (await response.json()) as TConsultaNFSeTotais;
};

export const fetchNotasFiscaisMeiAmbiente = async ({
  filtro,
  anos,
  regiao,
  municipio,
  uf,
}: NFSeFiltro) => {
  const url = `https://localhost:8443/ctx/once/PainelNFSe/get_totais_ambiente_nfse_mei_com_filtro?filtro=${filtro}&anos=${anos.join(
    ","
  )}&regiao=${regiao}&municipio=${municipio}&uf=${uf}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar notas fiscais");
  }
  return (await response.json()) as Array<{
    year: string;
    app: number;
    web: number;
    webservice: number;
    proprio: number;
  }>;
};
