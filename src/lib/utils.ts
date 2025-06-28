import { TConsultaNFSeTotais, TFormData } from "@/@types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STALE_TIME = 3600000;

export const UFS = [
  { uf: "AC", codigo: "12", name: "Acre" },
  { uf: "AL", codigo: "27", name: "Alagoas" },
  { uf: "AP", codigo: "16", name: "Amapá" },
  { uf: "AM", codigo: "13", name: "Amazonas" },
  { uf: "BA", codigo: "29", name: "Bahia" },
  { uf: "CE", codigo: "23", name: "Ceará" },
  { uf: "DF", codigo: "53", name: "Distrito Federal" },
  { uf: "ES", codigo: "32", name: "Espírito Santo" },
  { uf: "GO", codigo: "52", name: "Goiás" },
  { uf: "MA", codigo: "21", name: "Maranhão" },
  { uf: "MT", codigo: "51", name: "Mato Grosso" },
  { uf: "MS", codigo: "50", name: "Mato Grosso do Sul" },
  { uf: "MG", codigo: "31", name: "Minas Gerais" },
  { uf: "PA", codigo: "15", name: "Pará" },
  { uf: "PB", codigo: "25", name: "Paraíba" },
  { uf: "PR", codigo: "41", name: "Paraná" },
  { uf: "PE", codigo: "26", name: "Pernambuco" },
  { uf: "PI", codigo: "22", name: "Piauí" },
  { uf: "RJ", codigo: "33", name: "Rio de Janeiro" },
  { uf: "RN", codigo: "24", name: "Rio Grande do Norte" },
  { uf: "RS", codigo: "43", name: "Rio Grande do Sul" },
  { uf: "RO", codigo: "11", name: "Rondônia" },
  { uf: "RR", codigo: "14", name: "Roraima" },
  { uf: "SC", codigo: "42", name: "Santa Catarina" },
  { uf: "SP", codigo: "35", name: "São Paulo" },
  { uf: "SE", codigo: "28", name: "Sergipe" },
  { uf: "TO", codigo: "17", name: "Tocantins" },
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

const REGIONS = [
  {
    name: "Norte",
    abbr: "N",
    states: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  },
  {
    name: "Nordeste",
    abbr: "NE",
    states: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  },
  { name: "Centro-Oeste", abbr: "CO", states: ["DF", "GO", "MT", "MS"] },
  { name: "Sudeste", abbr: "SE", states: ["ES", "MG", "RJ", "SP"] },
  { name: "Sul", abbr: "S", states: ["PR", "RS", "SC"] },
];

export const formatNumber = (number: number | string) => {
  return new Intl.NumberFormat("pt-BR").format(Number(number));
};

export const findUFCodigo = async (uf: string) => {
  return UFS.find(item => item.uf === uf)!.codigo;
};

export const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: currentYear - 2022 + 1 }, (_, i) =>
  (2022 + i).toString()
);

export const formataCNPJ = (cnpj?: string | null) => {
  if (!cnpj) return "";
  if (typeof cnpj !== "string") return String(cnpj);
  return cnpj.length === 8
    ? cnpj.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3")
    : cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export const formataCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const setFileName = (ni: string, anos: string[]) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "")
    .split("-")
    .slice(0, 5)
    .join("");
  return `consulta-${ni}-${anos.join("-")}-${timestamp}`;
};

export const exportXLSX = async (data: any, ni: string, anos: string[]) => {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "NFSe");
  XLSX.writeFile(wb, `${setFileName(ni, anos)}.xlsx`);
};

///////////// setFormData para FormNotasFiscais.tsx /////////////
export function setFormData(
  data: Omit<TFormData, "filtro">,
  selectedOption: string
): TFormData {
  return {
    ...data,
    filtro: selectedOption,
    uf: selectedOption === "uf" ? data.uf || null : null,
    municipio: selectedOption === "municipio" ? data.municipio || null : null,
    regiao: selectedOption === "regiao" ? data.regiao || null : null,
    anos: data.anos.length === 0 ? YEARS : data.anos, // se não tiver anos selecionados, seleciona todos
  };
}

type ChartData = Array<{
  emitente: string;
  total: number;
  fill: string;
}>;

export const prepareData = (consulta: TConsultaNFSeTotais) => {
  const pieChartData = Object.entries(consulta).map(([year, data]) => {
    const chartData: ChartData = Object.entries(data)
      .filter(([emitente]) => emitente !== "total")
      .map(([emitente, total]) => {
        let fill = "";
        switch (emitente) {
          case "mei":
            fill = "hsl(var(--chart-2))";
            break;
          case "me_epp":
            fill = "hsl(var(--chart-3))";
            break;
          case "nao_optante":
            fill = "hsl(var(--chart-1))";
            break;
        }
        return {
          emitente,
          total,
          fill,
        };
      });
    return {
      year,
      data: chartData,
    };
  });

  return pieChartData;
};

export const dashboardDisplayTitle = (
  text: string,
  filtro: string,
  uf: string,
  municipio: string,
  regiao: string,
  chartData: Array<{ year: string }>
) => {
  const anos = chartData.map(chart => chart.year).join(", ");

  if (filtro === "todos") return `${text} no Brasil em ${anos}`;
  if (filtro === "uf")
    return `${text} em ${UFS.find(u => u.uf === uf)?.name} em ${anos}`;
  if (filtro === "municipio") return `${text} em ${municipio} em ${anos}`;
  if (filtro === "regiao")
    return `${text} na região ${
      REGIONS.find(r => r.abbr === regiao)?.name
    } em ${anos}`;
};

export const corrigeCodificacao = (texto: string | null): string => {
  if (!texto) return "";
  return texto.replace(/Ã£o/g, "ão");
};
