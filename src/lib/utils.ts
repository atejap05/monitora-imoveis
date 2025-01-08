import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const UFS = [
  { uf: "AC", codigo: "12" },
  { uf: "AL", codigo: "27" },
  { uf: "AP", codigo: "16" },
  { uf: "AM", codigo: "13" },
  { uf: "BA", codigo: "29" },
  { uf: "CE", codigo: "23" },
  { uf: "DF", codigo: "53" },
  { uf: "ES", codigo: "32" },
  { uf: "GO", codigo: "52" },
  { uf: "MA", codigo: "21" },
  { uf: "MT", codigo: "51" },
  { uf: "MS", codigo: "50" },
  { uf: "MG", codigo: "31" },
  { uf: "PA", codigo: "15" },
  { uf: "PB", codigo: "25" },
  { uf: "PR", codigo: "41" },
  { uf: "PE", codigo: "26" },
  { uf: "PI", codigo: "22" },
  { uf: "RJ", codigo: "33" },
  { uf: "RN", codigo: "24" },
  { uf: "RS", codigo: "43" },
  { uf: "RO", codigo: "11" },
  { uf: "RR", codigo: "14" },
  { uf: "SC", codigo: "42" },
  { uf: "SP", codigo: "35" },
  { uf: "SE", codigo: "28" },
  { uf: "TO", codigo: "17" },
];

export const selectUFOptions = [
  { label: "AC", value: "AC" },
  { label: "AL", value: "AL" },
  { label: "AP", value: "AP" },
  { label: "AM", value: "AM" },
  { label: "BA", value: "BA" },
  { label: "CE", value: "CE" },
  { label: "DF", value: "DF" },
  { label: "ES", value: "ES" },
  { label: "GO", value: "GO" },
  { label: "MA", value: "MA" },
  { label: "MT", value: "MT" },
  { label: "MS", value: "MS" },
  { label: "MG", value: "MG" },
  { label: "PA", value: "PA" },
  { label: "PB", value: "PB" },
  { label: "PR", value: "PR" },
  { label: "PE", value: "PE" },
  { label: "PI", value: "PI" },
  { label: "RJ", value: "RJ" },
  { label: "RN", value: "RN" },
  { label: "RS", value: "RS" },
  { label: "RO", value: "RO" },
  { label: "RR", value: "RR" },
  { label: "SC", value: "SC" },
  { label: "SP", value: "SP" },
  { label: "SE", value: "SE" },
  { label: "TO", value: "TO" },
];

export const findUFCodigo = async (uf: string) => {
  return UFS.find(item => item.uf === uf)!.codigo;
};

export const currentYear = new Date().getFullYear();
export const years = Array.from({ length: currentYear - 2022 + 1 }, (_, i) =>
  (2022 + i).toString()
);
