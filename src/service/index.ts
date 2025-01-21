import { findUFCodigo } from "@/lib/utils";
import type { Municipio } from "@/@types";

export const fecthMunicipioByUf = async (uf: string) => {
  const ufCodigo = await findUFCodigo(uf);
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufCodigo}/municipios`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
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
