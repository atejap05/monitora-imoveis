// Tipo retornado pelo backend
export type TVolumetriaRaw = {
  data_processamento: number; // timestamp em ms
  ano_processamento: number;
  prestadores_diferentes: number;
  nfse_com_hora_valida: number;
  hora_media_processamento: number | null;
  dia_semana_nome: string;
  municipios_diferentes: number;
  dia_processamento: number;
  mes_processamento: number;
  total_nfse_processadas: number;
  dia_semana: number; // 0=domingo, 6=sábado
};

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
