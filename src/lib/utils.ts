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

export const formatCurrency = (number: number | string) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(number));
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

///////////// Funções de Cálculo ETL /////////////
export type EtlData = {
  data_etl: string; // yyyy-mm-dd
  qtd_nfse: number;
};

export type EtlCalculations = {
  ultimoDia: EtlData | null;
  media: number;
  pico: number;
  totalPeriodo: number;
  diasComDados: number;
  diasSemDados: number;
  ultimaAtualizacao: string | null;
  periodoReal: {
    inicio: string | null;
    fim: string | null;
  };
  periodoCompleto: {
    inicio: string | null;
    fim: string | null;
  };
  dadosCompletos: EtlData[];
};

/**
 * Gera um array de datas desde a data inicial até a data final
 */
const gerarArrayDatas = (dataInicio: string, dataFim: string): string[] => {
  const datas: string[] = [];
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  const dataAtual = new Date(inicio);
  while (dataAtual <= fim) {
    datas.push(dataAtual.toISOString().slice(0, 10));
    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  return datas;
};

/**
 * Completa as datas faltantes com valores 0 desde a última data com dados até hoje
 */
const completarDatasFaltantes = (etlData: EtlData[]): EtlData[] => {
  if (!etlData || etlData.length === 0) return [];

  // Ordenar dados por data
  const dadosOrdenados = [...etlData].sort((a, b) =>
    a.data_etl.localeCompare(b.data_etl)
  );

  const primeiraDataComDados = dadosOrdenados[0].data_etl;
  const hoje = new Date().toISOString().slice(0, 10);

  // Gerar array de datas desde a primeira data com dados até hoje
  const datasCompletas = gerarArrayDatas(primeiraDataComDados, hoje);

  // Criar mapa dos dados existentes para busca rápida
  const dadosExistentes = new Map(
    dadosOrdenados.map(d => [d.data_etl, d.qtd_nfse])
  );

  // Completar com dados faltantes (valor 0)
  const dadosCompletos: EtlData[] = [];

  for (const data of datasCompletas) {
    if (dadosExistentes.has(data)) {
      // Data existe, usar valor real
      dadosCompletos.push({
        data_etl: data,
        qtd_nfse: dadosExistentes.get(data)!,
      });
    } else {
      // Data não existe, adicionar com valor 0
      dadosCompletos.push({
        data_etl: data,
        qtd_nfse: 0,
      });
    }
  }

  return dadosCompletos;
};

/**
 * Calcula os KPIs ETL considerando o período selecionado
 * @param etlData - Array de dados ETL
 * @param period - Período selecionado ("7d", "30d", "all")
 * @returns Objeto com todos os cálculos ETL
 */
export const calcularKpisEtl = (
  etlData: EtlData[],
  period: "7d" | "30d" | "all"
): EtlCalculations => {
  if (!etlData || etlData.length === 0) {
    return {
      ultimoDia: null,
      media: 0,
      pico: 0,
      totalPeriodo: 0,
      diasComDados: 0,
      diasSemDados: 0,
      ultimaAtualizacao: null,
      periodoReal: { inicio: null, fim: null },
      periodoCompleto: { inicio: null, fim: null },
      dadosCompletos: [],
    };
  }

  // Completar datas faltantes desde a última data com dados até hoje
  const dadosCompletos = completarDatasFaltantes(etlData);

  // Ordenar do mais antigo para o mais recente
  const sortedData = [...dadosCompletos].sort((a, b) =>
    a.data_etl.localeCompare(b.data_etl)
  );

  // Filtrar dados por período
  let filteredData = sortedData;
  if (period === "7d") {
    // Para 7 dias: pegar os últimos 7 dias dos dados reais (não dos completos)
    const dadosReais = etlData.sort((a, b) =>
      a.data_etl.localeCompare(b.data_etl)
    );
    filteredData = dadosReais.slice(-7);
  } else if (period === "30d") {
    // Para 30 dias: pegar os últimos 30 dias dos dados reais (não dos completos)
    const dadosReais = etlData.sort((a, b) =>
      a.data_etl.localeCompare(b.data_etl)
    );
    filteredData = dadosReais.slice(-30);
  }
  // Para período "all", usar todos os dados completos (desde primeira data até hoje)

  // Calcular período real dos dados (apenas dias com dados > 0)
  const dadosComValores = filteredData.filter(d => d.qtd_nfse > 0);
  const periodoReal = {
    inicio: dadosComValores[0]?.data_etl || null,
    fim: dadosComValores[dadosComValores.length - 1]?.data_etl || null,
  };

  // Calcular período completo (incluindo dias sem dados)
  const periodoCompleto = {
    inicio: filteredData[0]?.data_etl || null,
    fim: filteredData[filteredData.length - 1]?.data_etl || null,
  };

  // Calcular dias sem dados (considerando o período solicitado)
  const diasSemDados = calcularDiasSemDados(filteredData, period);

  // KPIs básicos
  const ultimoDia = filteredData[filteredData.length - 1] || null;
  const totalPeriodo = filteredData.reduce((acc, d) => acc + d.qtd_nfse, 0);
  const pico = Math.max(...filteredData.map(d => d.qtd_nfse));

  // Média considerando dias sem dados
  const media = calcularMediaComDiasSemDados(filteredData, period);

  // Última atualização (última data com dados > 0)
  const ultimaAtualizacao = periodoReal.fim;

  return {
    ultimoDia,
    media,
    pico,
    totalPeriodo,
    diasComDados: filteredData.filter(d => d.qtd_nfse > 0).length,
    diasSemDados,
    ultimaAtualizacao,
    periodoReal,
    periodoCompleto,
    dadosCompletos,
  };
};

/**
 * Calcula quantos dias não têm dados no período selecionado
 */
const calcularDiasSemDados = (
  filteredData: EtlData[],
  period: "7d" | "30d" | "all"
): number => {
  if (period === "all") {
    // Para período "all", calcular dias sem dados em todo o período
    const totalDias = filteredData.length;
    const diasComDados = filteredData.filter(d => d.qtd_nfse > 0).length;
    return totalDias - diasComDados;
  }

  // Para períodos 7d e 30d, calcular dias sem dados no período filtrado
  const totalDias = filteredData.length;
  const diasComDados = filteredData.filter(d => d.qtd_nfse > 0).length;
  return totalDias - diasComDados;
};

/**
 * Calcula a média considerando dias sem dados como 0
 */
const calcularMediaComDiasSemDados = (
  filteredData: EtlData[],
  period: "7d" | "30d" | "all"
): number => {
  if (period === "all") {
    // Para período "all", média considerando todos os dias (incluindo dias sem dados)
    const totalDias = filteredData.length;
    const totalComDados = filteredData.reduce((acc, d) => acc + d.qtd_nfse, 0);
    return Math.round(totalComDados / totalDias);
  }

  // Para períodos 7d e 30d, média considerando todos os dias do período filtrado
  const totalDias = filteredData.length;
  const totalComDados = filteredData.reduce((acc, d) => acc + d.qtd_nfse, 0);
  return Math.round(totalComDados / totalDias);
};

/**
 * Formata a data para exibição em português
 */
export const formatarDataEtl = (data: string): string => {
  if (!data) return "";

  try {
    const [ano, mes, dia] = data.split("-");
    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));

    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return data;
  }
};

/**
 * Verifica se os dados estão desatualizados (mais de 1 dia sem atualização)
 */
export const verificarDadosDesatualizados = (
  ultimaAtualizacao: string | null
): boolean => {
  if (!ultimaAtualizacao) return true;

  try {
    const ultimaData = new Date(ultimaAtualizacao);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - ultimaData.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 1;
  } catch {
    return true;
  }
};
