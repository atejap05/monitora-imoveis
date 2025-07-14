import { TFilter } from "./shared.types";

// ============== TIPOS PARA PÁGINA CONTRIBUINTES ==============

/**
 * Dados individuais de um contribuinte
 */
export type TContribuinte = {
  fc001_ni: string; // CNPJ/CPF
  fc001_xnome: string; // Nome do contribuinte
  fc010_uf_descricao: string; // UF
  fc010_cmun_descricao: string; // Município
  fh030_opsimpnac_descricao: string; // Tipo (MEI, ME/EPP, Não Optante)
  faturamento_total: number; // Faturamento total no período
  total_notas: number; // Total de notas emitidas
};

/**
 * KPIs principais da página Contribuintes
 */
export type TContribuintesKpi = {
  total_contribuintes: number;
  faturamento_total: number;
  perfil_dominante: string; // MEI, ME/EPP ou Não Optante
  faturamento_medio_por_contribuinte: number;
};

/**
 * Dados para o mapa coroplético por UF
 */
export type TContribuintesMapaUF = {
  uf: string;
  uf_nome: string;
  total_contribuintes: number;
};

/**
 * Dados para gráfico de barras - Top 10 municípios
 */
export type TContribuintesTopMunicipios = {
  municipio: string;
  uf: string;
  total_contribuintes: number;
};

/**
 * Dados para gráfico de pizza - Composição por tipo
 */
export type TContribuintesPorTipo = {
  tipo: string; // MEI, ME/EPP, Não Optante
  total_contribuintes: number;
  percentual: number;
};

/**
 * Dados para gráfico de barras agrupadas - Faturamento por tipo
 */
export type TContribuintesFaturamentoPorTipo = {
  tipo: string;
  faturamento_total: number;
  percentual_faturamento: number;
};

/**
 * Dados para gráfico de linha - Crescimento por ano
 */
export type TContribuintesCrescimentoAnual = {
  ano: number;
  total_contribuintes: number;
  novos_contribuintes: number;
};

/**
 * Estrutura completa dos gráficos
 */
export type TContribuintesCharts = {
  mapa_uf: TUfMapa[]; // Dados para o mapa (será calculado no frontend)
  top_municipios: TContribuintesTopMunicipios[];
  composicao_por_tipo: TContribuintesPorTipo[];
  faturamento_por_tipo: TContribuintesFaturamentoPorTipo[];
  crescimento_anual: TContribuintesCrescimentoAnual[];
};

/**
 * Dados consolidados da página Contribuintes
 */
export type TContribuintesData = {
  kpis: TContribuintesKpi;
  charts: TContribuintesCharts;
  contribuintes: TContribuinte[];
  total_pages: number;
  current_page: number;
  // Dados brutos para o mapa (foco atual)
  mapa_municipios: TMunicipioMapa[];
  // Dados para a tabela de tipo de contribuinte responsável
  tipo_contribuinte_responsavel?: TTipoContribuinteResponsavel[];
};

/**
 * Filtros específicos para página Contribuintes (herda de TFilter)
 */
export type TContribuintesFilter = TFilter;

/**
 * Dados por tipo de contribuinte responsável
 */
export type TTipoContribuinteResponsavel = {
  total_tomadores: number;
  total_prestadores: number;
  total_intermediarios: number;
  tipo_contribuinte: string;
};

// Tipos para dados do mapa (foco atual)
export type TMunicipioMapa = {
  cod_municipio: string;
  nome_municipio: string;
  uf: string;
  total_nfse: number;
  valor_total: number;
  valor_medio: number;
  total_nao_optante: number; // Corrigido: era "nao_optante"
  total_mei: number; // Corrigido: era "mei"
  total_me_epp: number; // Corrigido: era "me_epp"
};

// Agregação por UF para o mapa (será calculada no frontend)
export type TUfMapa = {
  uf: string;
  total_contribuintes: number;
  total_nfse: number;
  valor_total: number;
  valor_medio: number;
  nao_optante: number;
  mei: number;
  me_epp: number;
};
