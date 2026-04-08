import {
  ReportDocument,
  ReportPage,
  ReportHeader,
  SectionTitle,
  FiltersSummary,
  KpiGrid,
  ChartImage,
  Disclaimer,
  ExecutiveSummary,
  DataQualityAlert,
  formatPdfDate,
} from "@/lib/pdf";
import type { TVolumetriaKpis, TVolumetriaRaw } from "@/@types";
import { formatNumber } from "@/lib/utils";

type VolumetriaReportProps = {
  kpis: TVolumetriaKpis;
  /** Série diária bruta — usada para nota de qualidade/completude. */
  data?: TVolumetriaRaw[];
  filters: {
    filtro?: string;
    uf?: string;
    municipio?: string | number;
    regiao?: string;
    anos?: number[];
  };
  charts?: {
    evolucaoMensal?: string;
    sazonalidade?: string;
    padroesSemanais?: string;
    padroesHorarios?: string;
    diario?: string;
  };
};

function buildFilterItems(filters: VolumetriaReportProps["filters"]) {
  const items = [];
  if (filters.filtro)
    items.push({
      label: "Escopo",
      value: filters.filtro === "todos" ? "Nacional" : filters.filtro.toUpperCase(),
    });
  if (filters.uf) items.push({ label: "UF", value: filters.uf });
  if (filters.municipio)
    items.push({ label: "Município", value: String(filters.municipio) });
  if (filters.regiao) items.push({ label: "Região", value: filters.regiao });
  if (filters.anos?.length)
    items.push({ label: "Anos", value: filters.anos.join(", ") });
  return items;
}

function buildDataQualityNote(raw: TVolumetriaRaw[], kpis: TVolumetriaKpis): string {
  const sorted = [...raw].sort((a, b) => {
    const ta =
      typeof a.data_processamento === "string"
        ? new Date(a.data_processamento).getTime()
        : Number(a.data_processamento);
    const tb =
      typeof b.data_processamento === "string"
        ? new Date(b.data_processamento).getTime()
        : Number(b.data_processamento);
    return ta - tb;
  });
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const pctHora =
    kpis.percentual_hora_valida !== undefined
      ? `${kpis.percentual_hora_valida.toFixed(1)}%`
      : "—";
  return [
    `Série diária com ${raw.length} ponto(s).`,
    `Cobertura calendário: ${formatPdfDate(first.data_processamento)} a ${formatPdfDate(last.data_processamento)}.`,
    `Dias com marcação de hora válida: ${pctHora} dos registros.`,
  ].join(" ");
}

export function VolumetriaReport({
  kpis,
  data,
  filters,
  charts,
}: VolumetriaReportProps) {
  const hasSecondChartPage =
    !!(charts?.sazonalidade || charts?.padroesSemanais || charts?.padroesHorarios);

  const insights: string[] = [
    `Volume total processado no período: ${formatNumber(kpis.total_nfse_processadas)} NFSe.`,
    `Média diária na série: ${formatNumber(Math.round(kpis.volume_medio_diario))} NFSe/dia (referência dos registros diários).`,
  ];

  return (
    <ReportDocument title="Relatório de Volumetria NFSe">
      <ReportPage>
        <ReportHeader
          title="Volumetria de Processamento"
          subtitle="Análise de volumes, padrões e sazonalidade de NFSe"
          badge="VOLUMETRIA"
        />

        <FiltersSummary filters={buildFilterItems(filters)} />

        <ExecutiveSummary
          lead="Consolidado de processamento de NFSe a partir da série diária e indicadores derivados. Gráficos reproduzem a visualização da página no momento da geração."
          insights={insights}
        />

        {data && data.length > 0 && (
          <DataQualityAlert>{buildDataQualityNote(data, kpis)}</DataQualityAlert>
        )}

        <SectionTitle>Indicadores Principais</SectionTitle>
        <KpiGrid
          items={[
            {
              label: "Total Registros",
              value: formatNumber(kpis.total_registros),
            },
            {
              label: "NFSe Processadas",
              value: formatNumber(kpis.total_nfse_processadas),
            },
            {
              label: "Vol. Médio Diário",
              value: formatNumber(kpis.volume_medio_diario),
            },
            {
              label: "Municípios Únicos",
              value: formatNumber(kpis.municipios_unicos),
            },
            {
              label: "Prestadores Únicos",
              value: formatNumber(kpis.prestadores_unicos),
            },
            {
              label: "Período",
              value: `${kpis.periodo_inicial || "—"} a ${kpis.periodo_final || "—"}`,
            },
          ]}
        />

        {charts?.diario && (
          <>
            <SectionTitle>Monitoramento Diário</SectionTitle>
            <ChartImage
              src={charts.diario}
              caption="Volume diário de processamento de NFSe"
            />
          </>
        )}

        {charts?.evolucaoMensal && (
          <>
            <SectionTitle>Evolução Mensal</SectionTitle>
            <ChartImage
              src={charts.evolucaoMensal}
              caption="Evolução mensal do volume de NFSe processadas"
            />
          </>
        )}

        {!hasSecondChartPage && <Disclaimer />}
      </ReportPage>

      {hasSecondChartPage && (
        <ReportPage>
          {charts?.sazonalidade && (
            <>
              <SectionTitle>Sazonalidade</SectionTitle>
              <ChartImage
                src={charts.sazonalidade}
                caption="Padrão sazonal (média por mês do ano)"
              />
            </>
          )}

          {charts?.padroesSemanais && (
            <>
              <SectionTitle>Padrões Semanais</SectionTitle>
              <ChartImage
                src={charts.padroesSemanais}
                caption="Volume médio por dia da semana"
              />
            </>
          )}

          {charts?.padroesHorarios && (
            <>
              <SectionTitle>Padrões Horários</SectionTitle>
              <ChartImage
                src={charts.padroesHorarios}
                caption="Distribuição de volume por hora do dia"
              />
            </>
          )}

          <Disclaimer />
        </ReportPage>
      )}
    </ReportDocument>
  );
}
