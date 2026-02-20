import {
  TVolumetriaRaw,
  TVolumetriaEvolucaoMensal,
  TVolumetriaSazonalidade,
  TVolumetriaPadraoSemanal,
  TVolumetriaPadraoHorario,
  TVolumetriaKpis,
} from "@/@types";

const MESES_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const DIAS_PT = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

// Função auxiliar para converter data_processamento para string YYYY-MM-DD (exportada para uso em mapeamento)
export const formatarDataProcessamento = (data: string | number): string => {
  if (typeof data === "string") {
    return data; // Já está no formato "YYYY-MM-DD"
  }
  // Se for número (timestamp), converte para data
  const date = new Date(data);
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

// Função 1: Calcular KPIs gerais
export const calcularKpis = (data: TVolumetriaRaw[]): TVolumetriaKpis => {
  if (!data || data.length === 0) {
    return {
      total_registros: 0,
      periodo_inicial: "",
      periodo_final: "",
      total_nfse_processadas: 0,
      volume_medio_diario: 0,
      municipios_unicos: 0,
      prestadores_unicos: 0,
      dias_com_hora_valida: 0,
      percentual_hora_valida: 0,
    };
  }

  const datasOrdenadas = [...data].sort((a, b) => {
    const dataA =
      typeof a.data_processamento === "string"
        ? new Date(a.data_processamento).getTime()
        : a.data_processamento;
    const dataB =
      typeof b.data_processamento === "string"
        ? new Date(b.data_processamento).getTime()
        : b.data_processamento;
    return dataA - dataB;
  });

  const diasComHora = data.filter(
    d => (d.nfse_com_hora_valida ?? 0) > 0
  ).length;

  return {
    total_registros: data.length,
    periodo_inicial: formatarDataProcessamento(
      datasOrdenadas[0].data_processamento
    ),
    periodo_final: formatarDataProcessamento(
      datasOrdenadas[data.length - 1].data_processamento
    ),
    total_nfse_processadas: data.reduce(
      (acc, d) => acc + d.total_nfse_processadas,
      0
    ),
    volume_medio_diario:
      data.reduce((acc, d) => acc + d.total_nfse_processadas, 0) / data.length,
    municipios_unicos: Math.max(
      0,
      ...data.map(d => d.municipios_diferentes ?? 0)
    ),
    prestadores_unicos: Math.max(
      0,
      ...data.map(d => d.prestadores_diferentes ?? 0)
    ),
    dias_com_hora_valida: diasComHora,
    percentual_hora_valida: (diasComHora / data.length) * 100,
  };
};

// Função 2: Processar evolução mensal
export const processarEvolucaoMensal = (
  data: TVolumetriaRaw[]
): TVolumetriaEvolucaoMensal[] => {
  // Agrupar por ano e mês
  const agrupado = data.reduce((acc, row) => {
    const key = `${row.ano_processamento}-${String(
      row.mes_processamento
    ).padStart(2, "0")}`;

    if (!acc[key]) {
      acc[key] = {
        periodo: key,
        volumes: [],
        municipios_total: 0,
        prestadores_total: 0,
      };
    }

    acc[key].volumes.push(row.total_nfse_processadas);
    acc[key].municipios_total += row.municipios_diferentes ?? 0;
    acc[key].prestadores_total += row.prestadores_diferentes ?? 0;

    return acc;
  }, {} as Record<string, any>);

  // Calcular métricas
  return Object.entries(agrupado)
    .map(([periodo, dados]) => {
      const volumes = dados.volumes;
      const soma = volumes.reduce((a: number, b: number) => a + b, 0);
      const media = soma / volumes.length;
      const variancia =
        volumes.reduce(
          (acc: number, v: number) => acc + Math.pow(v - media, 2),
          0
        ) / volumes.length;
      const desvio = Math.sqrt(variancia);

      return {
        periodo,
        volume_total: soma,
        volume_medio_dia: media,
        desvio_padrao: desvio,
        municipios: dados.municipios_total,
        prestadores: dados.prestadores_total,
        dias_mes: volumes.length,
      };
    })
    .sort((a, b) => a.periodo.localeCompare(b.periodo));
};

// Função 3: Calcular sazonalidade mensal
export const calcularSazonalidade = (
  data: TVolumetriaRaw[]
): TVolumetriaSazonalidade[] => {
  const porMes = data.reduce((acc, row) => {
    const mes = row.mes_processamento;
    if (!acc[mes]) acc[mes] = [];
    acc[mes].push(row.total_nfse_processadas);
    return acc;
  }, {} as Record<number, number[]>);

  return Object.entries(porMes)
    .map(([mes, volumes]) => {
      const mesNum = parseInt(mes);
      const ordenado = [...volumes].sort((a, b) => a - b);
      const media = volumes.reduce((a, b) => a + b, 0) / volumes.length;
      const mediana = ordenado[Math.floor(ordenado.length / 2)];
      const variancia =
        volumes.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) /
        volumes.length;

      return {
        mes: mesNum,
        mes_nome: MESES_PT[mesNum - 1],
        media,
        mediana,
        desvio: Math.sqrt(variancia),
      };
    })
    .sort((a, b) => a.mes - b.mes);
};

// Função 4: Processar padrões semanais
export const processarPadroesSemanais = (
  data: TVolumetriaRaw[]
): TVolumetriaPadraoSemanal[] => {
  // Agrupar dados por dia da semana
  const porDia = data.reduce((acc, row) => {
    const dia = row.dia_semana;
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(row.total_nfse_processadas);
    return acc;
  }, {} as Record<number, number[]>);

  // Garantir que todos os 7 dias estejam presentes (0-6)
  const ordemCorreto = [1, 2, 3, 4, 5, 6, 0]; // segunda até domingo
  const resultado: TVolumetriaPadraoSemanal[] = [];

  for (const diaNum of ordemCorreto) {
    const volumes = porDia[diaNum] ?? [];

    // Se não há dados para o dia, cria um registro com valores padrão
    if (volumes.length === 0) {
      resultado.push({
        dia_semana: diaNum,
        dia_nome: DIAS_PT[diaNum] ?? "Desconhecido",
        dias_total: 0,
        volume_medio: 0,
        volume_mediano: 0,
        desvio_padrao: 0,
        volume_min: 0,
        volume_max: 0,
        variabilidade: 0,
      });
    } else {
      const ordenado = [...volumes].sort((a, b) => a - b);
      const media = volumes.reduce((a, b) => a + b, 0) / volumes.length;
      const mediana = ordenado[Math.floor(ordenado.length / 2)];
      const variancia =
        volumes.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) /
        volumes.length;
      const desvio = Math.sqrt(variancia);

      resultado.push({
        dia_semana: diaNum,
        dia_nome: DIAS_PT[diaNum] ?? "Desconhecido",
        dias_total: volumes.length,
        volume_medio: media,
        volume_mediano: mediana,
        desvio_padrao: desvio,
        volume_min: Math.min(...volumes),
        volume_max: Math.max(...volumes),
        variabilidade: (desvio / media) * 100,
      });
    }
  }

  return resultado;
};

// Função 5: Processar padrões horários
export const processarPadroesHorarios = (
  data: TVolumetriaRaw[]
): TVolumetriaPadraoHorario[] => {
  // Tenta usar hora_media_decimal primeiro, se não existir tenta hora_media_processamento como número
  const comHora = data.filter(d => {
    const hora =
      d.hora_media_decimal ??
      (typeof d.hora_media_processamento === "number"
        ? d.hora_media_processamento
        : undefined);
    return hora !== null && hora !== undefined && hora >= 0;
  });

  const porHora = comHora.reduce((acc, row) => {
    // Usa hora_media_decimal se disponível, senão usa hora_media_processamento como número
    const horaDecimal =
      row.hora_media_decimal ??
      (typeof row.hora_media_processamento === "number"
        ? row.hora_media_processamento
        : 0);
    const hora = Math.floor(horaDecimal);
    if (!acc[hora]) acc[hora] = [];
    acc[hora].push(row.total_nfse_processadas);
    return acc;
  }, {} as Record<number, number[]>);

  const resultado = Object.entries(porHora)
    .map(([hora, volumes]) => ({
      hora: parseInt(hora),
      dias_registrados: volumes.length,
      volume_medio: volumes.reduce((a, b) => a + b, 0) / volumes.length,
      volume_total: volumes.reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => a.hora - b.hora);

  return resultado;
};

// Função 6: Preparar dados para gráfico de barras (evolução mensal)
export const prepararDadosBarChart = (
  evolucaoMensal: TVolumetriaEvolucaoMensal[]
) => {
  return evolucaoMensal.map(item => ({
    periodo: item.periodo,
    volume: item.volume_total,
    media: item.volume_medio_dia,
  }));
};

// Função 7: Preparar dados para gráfico de pizza (padrões semanais)
export const prepararDadosPieChart = (
  padroesSemanais: TVolumetriaPadraoSemanal[]
) => {
  return padroesSemanais.map(item => ({
    name: item.dia_nome,
    value: Math.round(item.volume_medio),
    fill: `hsl(var(--chart-${(item.dia_semana % 5) + 1}))`,
  }));
};

// Tipo de retorno para KPIs diários de volumetria
export type VolumDiarioKpis = {
  ultimoDia: TVolumetriaRaw | null;
  media: number;
  pico: number;
  picoData: string | null;
  totalPeriodo: number;
  filteredData: TVolumetriaRaw[];
  diasComDados: number;
  diasSemDados: number;
  periodoReal: { inicio: string | null; fim: string | null };
  periodoCompleto: { inicio: string | null; fim: string | null };
  ultimaData: string | null;
};

/**
 * Gera array de datas entre dataInicio e dataFim (YYYY-MM-DD)
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
 * Calcula KPIs diários de volumetria considerando o período selecionado
 */
export const calcularKpisVolumDiario = (
  data: TVolumetriaRaw[],
  period: "7d" | "30d" | "90d" | "all"
): VolumDiarioKpis => {
  if (!data || data.length === 0) {
    return {
      ultimoDia: null,
      media: 0,
      pico: 0,
      picoData: null,
      totalPeriodo: 0,
      filteredData: [],
      diasComDados: 0,
      diasSemDados: 0,
      periodoReal: { inicio: null, fim: null },
      periodoCompleto: { inicio: null, fim: null },
      ultimaData: null,
    };
  }

  const dadosOrdenados = [...data].sort((a, b) => {
    const dataA =
      typeof a.data_processamento === "string"
        ? new Date(a.data_processamento).getTime()
        : a.data_processamento;
    const dataB =
      typeof b.data_processamento === "string"
        ? new Date(b.data_processamento).getTime()
        : b.data_processamento;
    return dataA - dataB;
  });

  let filteredData: TVolumetriaRaw[];
  if (period === "7d") {
    filteredData = dadosOrdenados.slice(-7);
  } else if (period === "30d") {
    filteredData = dadosOrdenados.slice(-30);
  } else if (period === "90d") {
    filteredData = dadosOrdenados.slice(-90);
  } else {
    filteredData = dadosOrdenados;
  }

  const ultimoDia = filteredData[filteredData.length - 1] ?? null;
  const totalPeriodo = filteredData.reduce(
    (acc, d) => acc + d.total_nfse_processadas,
    0
  );
  const media =
    filteredData.length > 0 ? totalPeriodo / filteredData.length : 0;
  const pico = Math.max(
    ...filteredData.map(d => d.total_nfse_processadas),
    0
  );
  const picoRegistro = filteredData.find(
    d => d.total_nfse_processadas === pico
  );
  const picoData = picoRegistro
    ? formatarDataProcessamento(picoRegistro.data_processamento)
    : null;

  const primeiraData = formatarDataProcessamento(
    filteredData[0].data_processamento
  );
  const ultimaData = formatarDataProcessamento(
    filteredData[filteredData.length - 1].data_processamento
  );
  const totalDiasNoRange = gerarArrayDatas(primeiraData, ultimaData).length;
  const diasComDados = filteredData.length;
  const diasSemDados = Math.max(0, totalDiasNoRange - diasComDados);

  const dadosComValores = filteredData.filter(d => d.total_nfse_processadas > 0);
  const periodoReal = {
    inicio: dadosComValores[0]
      ? formatarDataProcessamento(dadosComValores[0].data_processamento)
      : null,
    fim:
      dadosComValores.length > 0
        ? formatarDataProcessamento(
            dadosComValores[dadosComValores.length - 1].data_processamento
          )
        : null,
  };
  const periodoCompleto = {
    inicio: primeiraData,
    fim: ultimaData,
  };

  return {
    ultimoDia,
    media,
    pico,
    picoData,
    totalPeriodo,
    filteredData,
    diasComDados,
    diasSemDados,
    periodoReal,
    periodoCompleto,
    ultimaData,
  };
};
