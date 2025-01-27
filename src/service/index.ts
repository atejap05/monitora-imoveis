import { findUFCodigo } from "@/lib/utils";
import type { DadosUsuarioAutenticado, Municipio } from "@/@types";

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

export const getDadosUsuarioAutenticado = async () => {
  const url =
    "https://localhost:8443/ctx/once/PainelNFSe/get_dados_usuario_autenticado";
  const response = await fetch(url);
  const data = await response.json();
  return data as DadosUsuarioAutenticado;
};

export const fetchNotasFiscais = async (
  filtro: string | null,
  anos: Array<number | string>,
  regiao: string | null,
  municipio: string | null,
  uf: string | null
) => {
  const url = `https://localhost:8443/ctx/once/PainelNFSe/get_totais_nfse_com_filtro?filtro=${filtro}&anos=${anos.join(
    ","
  )}&regiao=${regiao}&municipio=${municipio}&uf=${uf}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Erro ao buscar notas fiscais");
  }
  return await response.json();
};
