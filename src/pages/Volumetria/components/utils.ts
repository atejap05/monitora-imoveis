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

  const datasOrdenadas = [...data].sort(
    (a, b) => a.data_processamento - b.data_processamento
  );

  const diasComHora = data.filter(d => d.nfse_com_hora_valida > 0).length;

  return {
    total_registros: data.length,
    periodo_inicial: new Date(
      datasOrdenadas[0].data_processamento
    ).toLocaleDateString("pt-BR"),
    periodo_final: new Date(
      datasOrdenadas[data.length - 1].data_processamento
    ).toLocaleDateString("pt-BR"),
    total_nfse_processadas: data.reduce(
      (acc, d) => acc + d.total_nfse_processadas,
      0
    ),
    volume_medio_diario:
      data.reduce((acc, d) => acc + d.total_nfse_processadas, 0) / data.length,
    municipios_unicos: Math.max(...data.map(d => d.municipios_diferentes)),
    prestadores_unicos: Math.max(...data.map(d => d.prestadores_diferentes)),
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
    acc[key].municipios_total += row.municipios_diferentes;
    acc[key].prestadores_total += row.prestadores_diferentes;

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
  const porDia = data.reduce((acc, row) => {
    const dia = row.dia_semana;
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(row.total_nfse_processadas);
    return acc;
  }, {} as Record<number, number[]>);

  return Object.entries(porDia)
    .map(([dia, volumes]) => {
      const diaNum = parseInt(dia);
      const ordenado = [...volumes].sort((a, b) => a - b);
      const media = volumes.reduce((a, b) => a + b, 0) / volumes.length;
      const mediana = ordenado[Math.floor(ordenado.length / 2)];
      const variancia =
        volumes.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) /
        volumes.length;
      const desvio = Math.sqrt(variancia);

      return {
        dia_semana: diaNum,
        dia_nome: DIAS_PT[diaNum],
        dias_total: volumes.length,
        volume_medio: media,
        volume_mediano: mediana,
        desvio_padrao: desvio,
        volume_min: Math.min(...volumes),
        volume_max: Math.max(...volumes),
        variabilidade: (desvio / media) * 100,
      };
    })
    .sort((a, b) => {
      // Ordenar: segunda=1, terça=2, ..., domingo=0
      const ordemCorreto = [1, 2, 3, 4, 5, 6, 0];
      return (
        ordemCorreto.indexOf(a.dia_semana) - ordemCorreto.indexOf(b.dia_semana)
      );
    });
};

// Função 5: Processar padrões horários
export const processarPadroesHorarios = (
  data: TVolumetriaRaw[]
): TVolumetriaPadraoHorario[] => {
  const comHora = data.filter(
    d => d.hora_media_processamento !== null && d.hora_media_processamento >= 0
  );

  const porHora = comHora.reduce((acc, row) => {
    const hora = Math.floor(row.hora_media_processamento as number);
    if (!acc[hora]) acc[hora] = [];
    acc[hora].push(row.total_nfse_processadas);
    return acc;
  }, {} as Record<number, number[]>);

  return Object.entries(porHora)
    .map(([hora, volumes]) => ({
      hora: parseInt(hora),
      dias_registrados: volumes.length,
      volume_medio: volumes.reduce((a, b) => a + b, 0) / volumes.length,
      volume_total: volumes.reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => a.hora - b.hora);
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
