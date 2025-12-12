// Parâmetros enviados ao backend
export interface VolumetriaParams {
  filtro?: "uf" | "regiao" | "municipio" | "todos";
  uf?: string;
  regiao?: string;
  municipio?: string | number;
  contribuintes?: number[];
  anos?: number[];
  dataInicio?: string; // "YYYY-MM-DD"
  dataFim?: string; // "YYYY-MM-DD"
  valorMin?: number;
  valorMax?: number;
  incluir_canceladas?: boolean;
}

// Cada item retornado pelo backend
export interface VolumetriaItem {
  data_processamento: string | number; // "YYYY-MM-DD" ou timestamp milissegundos
  ano_processamento: number;
  mes_processamento: number;
  dia_processamento: number;
  dia_semana: number;
  dia_semana_nome: string;
  total_nfse_processadas: number;
  nfse_com_hora_valida?: number;
  hora_media_processamento?: string;
  hora_media_decimal?: number;
  municipios_diferentes?: number;
  prestadores_diferentes?: number;
  valor_total_processado?: number;
}

// Tipo compatível com processamento (substitui TVolumetriaRaw)
export type TVolumetriaRaw = VolumetriaItem;

// Tipos para visualizações específicas
export type TVolumetriaEvolucaoMensal = {
  periodo: string; // "2024-01"
  volume_total: number;
  volume_medio_dia: number;
  desvio_padrao: number;
  municipios: number;
  prestadores: number;
  dias_mes: number;
};

export type TVolumetriaSazonalidade = {
  mes: number;
  mes_nome: string;
  media: number;
  mediana: number;
  desvio: number;
};

export type TVolumetriaPadraoSemanal = {
  dia_semana: number;
  dia_nome: string;
  dias_total: number;
  volume_medio: number;
  volume_mediano: number;
  desvio_padrao: number;
  volume_min: number;
  volume_max: number;
  variabilidade: number; // CV%
};

export type TVolumetriaPadraoHorario = {
  hora: number;
  dias_registrados: number;
  volume_medio: number;
  volume_total: number;
};

export type TVolumetriaKpis = {
  total_registros: number;
  periodo_inicial: string;
  periodo_final: string;
  total_nfse_processadas: number;
  volume_medio_diario: number;
  municipios_unicos: number;
  prestadores_unicos: number;
  dias_com_hora_valida: number;
  percentual_hora_valida: number;
};
