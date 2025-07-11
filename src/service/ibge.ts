import { findUFCodigo } from "@/lib/utils";
import type { Municipio } from "@/@types";

//////////// Fetching Municipios IBGE //////////////
export const fecthMunicipioByUf = async (uf: string) => {
  const ufCodigo = await findUFCodigo(uf);
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCodigo}/municipios`;
  const response = await fetch(url);
  const data = await response.json();
  return data as Municipio[];
};
