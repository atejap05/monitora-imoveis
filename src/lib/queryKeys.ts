import type { TFilter, TContribuintesFilter, VolumetriaParams } from "@/@types";

/**
 * Query Keys hierárquicas para melhor gerenciamento de cache
 * Permite invalidação granular e compartilhamento de cache entre páginas
 */
export const QUERY_KEYS = {
  // Visão Geral
  visaoGeral: ["visaoGeral"] as const,
  visaoGeralData: (filters: TFilter) =>
    [...QUERY_KEYS.visaoGeral, "data", filters] as const,
  visaoGeralTotais: (filters: TFilter) =>
    [...QUERY_KEYS.visaoGeral, "totais", filters] as const,
  visaoGeralDistribuicao: (filters: TFilter) =>
    [...QUERY_KEYS.visaoGeral, "distribuicao", filters] as const,
  visaoGeralAdesao: (filters: TFilter) =>
    [...QUERY_KEYS.visaoGeral, "adesao", filters] as const,

  // Contribuintes
  contribuintes: ["contribuintes"] as const,
  contribuintesData: (filters: TContribuintesFilter) =>
    [...QUERY_KEYS.contribuintes, "data", filters] as const,
  contribuintesMap: (filters: TContribuintesFilter) =>
    [...QUERY_KEYS.contribuintes, "map", filters] as const,
  contribuintesKpi: (filters: TContribuintesFilter) =>
    [...QUERY_KEYS.contribuintes, "kpi", filters] as const,
  contribuintesCharts: (filters: TContribuintesFilter) =>
    [...QUERY_KEYS.contribuintes, "charts", filters] as const,
  contribuintesTabela: (
    filters: TContribuintesFilter & { page?: number; limit?: number }
  ) => [...QUERY_KEYS.contribuintes, "tabela", filters] as const,
  contribuintesTipo: (filters: TContribuintesFilter) =>
    [...QUERY_KEYS.contribuintes, "tipo", filters] as const,

  // Notas Fiscais
  notasFiscais: ["notasFiscais"] as const,
  notasFiscaisCanceladas: (filters: TFilter) =>
    [...QUERY_KEYS.notasFiscais, "canceladas", filters] as const,
  notasFiscaisTop100: (filters: TFilter) =>
    [...QUERY_KEYS.notasFiscais, "top100", filters] as const,

  // Ambiente
  ambiente: ["ambiente"] as const,
  ambienteEmissao: (filters: TFilter) =>
    [...QUERY_KEYS.ambiente, "emissao", filters] as const,

  // Convênios
  convenios: ["convenios"] as const,
  conveniosRelatorio: () => [...QUERY_KEYS.convenios, "relatorio"] as const,

  // Consultas
  consultas: ["consultas"] as const,
  consultasCnpj: (ni: string, anos: number[]) =>
    [...QUERY_KEYS.consultas, "cnpj", { ni, anos }] as const,

  // ETL
  etl: ["etl"] as const,
  etlDados: () => [...QUERY_KEYS.etl, "dados"] as const,

  // IBGE
  ibge: ["ibge"] as const,
  ibgeMunicipios: (uf: string) =>
    [...QUERY_KEYS.ibge, "municipios", uf] as const,

  // Volumetria
  volumetria: () => ["volumetria"] as const,
  volumetriaData: (filters: VolumetriaParams) =>
    [...QUERY_KEYS.volumetria(), "data", filters] as const,
} as const;

/**
 * Utilitários para invalidação de cache
 */
export const invalidateQueries = {
  all: () => [],
  visaoGeral: () => QUERY_KEYS.visaoGeral,
  contribuintes: () => QUERY_KEYS.contribuintes,
  notasFiscais: () => QUERY_KEYS.notasFiscais,
  ambiente: () => QUERY_KEYS.ambiente,
  convenios: () => QUERY_KEYS.convenios,
  consultas: () => QUERY_KEYS.consultas,
  etl: () => QUERY_KEYS.etl,
  volumetria: () => QUERY_KEYS.volumetria(),
} as const;
