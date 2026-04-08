import {
  ReportDocument,
  ReportPage,
  ReportHeader,
  SectionTitle,
  FiltersSummary,
  KpiGrid,
  PdfTable,
  ChartImage,
  Disclaimer,
  ExecutiveSummary,
} from "@/lib/pdf";
import type { TAmbienteEmissao } from "@/@types";
import { formatNumber } from "@/lib/utils";

type AmbienteReportProps = {
  data: TAmbienteEmissao[];
  filters: {
    filtro: string;
    uf?: string | null;
    municipio?: string | null;
    regiao?: string | null;
    anos?: number[];
  };
  charts?: {
    pizza?: string;
    barras?: string;
    linha?: string;
  };
};

function buildFilterItems(filters: AmbienteReportProps["filters"]) {
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

export function AmbienteReport({ data, filters, charts }: AmbienteReportProps) {
  const totalGeral = data.reduce((acc, d) => acc + d.total_geral_ano, 0);
  const totalNacional = data.reduce(
    (acc, d) => acc + d.total_ambiente_nacional,
    0,
  );
  const totalMunicipio = data.reduce(
    (acc, d) => acc + d.total_ambiente_municipio,
    0,
  );
  const totalTranscrita = data.reduce(
    (acc, d) => acc + d.total_tipo_transcrita,
    0,
  );
  const percNacional =
    totalGeral > 0 ? ((totalNacional / totalGeral) * 100).toFixed(1) : "0";
  const percTranscrita =
    totalGeral > 0 ? ((totalTranscrita / totalGeral) * 100).toFixed(1) : "0";

  const meioMaior = [
    { nome: "Web", total: data.reduce((a, d) => a + d.total_web, 0) },
    {
      nome: "Webservice",
      total: data.reduce((a, d) => a + d.total_webservice, 0),
    },
    { nome: "App", total: data.reduce((a, d) => a + d.total_app, 0) },
  ].sort((a, b) => b.total - a.total)[0];

  const columns = [
    {
      header: "Ano",
      accessor: "ano",
      width: "8%",
      align: "center" as const,
      format: (v: unknown) => String(v),
    },
    {
      header: "Amb. Nacional",
      accessor: "total_ambiente_nacional",
      width: "13%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Amb. Município",
      accessor: "total_ambiente_municipio",
      width: "13%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Web",
      accessor: "total_web",
      width: "11%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Webservice",
      accessor: "total_webservice",
      width: "11%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "App",
      accessor: "total_app",
      width: "10%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Tipo Nacional",
      accessor: "total_tipo_nacional",
      width: "11%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Transcrita",
      accessor: "total_tipo_transcrita",
      width: "10%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Total Geral",
      accessor: "total_geral_ano",
      width: "13%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
  ];

  return (
    <ReportDocument title="Relatório Ambiente de Emissão NFSe">
      <ReportPage>
        <ReportHeader
          title="Ambiente de Emissão"
          subtitle="Análise dos meios e ambientes de emissão de NFSe"
          badge="AMBIENTE"
        />

        <FiltersSummary filters={buildFilterItems(filters)} />

        <ExecutiveSummary
          lead="Panorama do uso do ambiente nacional versus municipal e dos meios de emissão (Web, Webservice, App), com evolução anual consolidada na tabela seguinte."
          insights={[
            `Adoção nacional (acumulado): ${percNacional}% das emissões no período agregado.`,
            `Transcritas: ${percTranscrita}% do total agregado (${formatNumber(totalTranscrita)} notas).`,
          ]}
        />

        <SectionTitle>Indicadores Principais</SectionTitle>
        <KpiGrid
          items={[
            {
              label: "Adoção Nacional",
              value: `${percNacional}%`,
              subtext: `${formatNumber(totalNacional)} de ${formatNumber(totalGeral)}`,
            },
            {
              label: "Principal Meio",
              value: meioMaior?.nome || "—",
              subtext: `${formatNumber(meioMaior?.total || 0)} emissões`,
            },
            {
              label: "% Transcrita",
              value: `${percTranscrita}%`,
              subtext: `${formatNumber(totalTranscrita)} transcritas`,
            },
            {
              label: "Amb. Município",
              value: formatNumber(totalMunicipio),
            },
          ]}
        />

        {charts?.pizza && (
          <>
            <SectionTitle>Distribuição por Ambiente</SectionTitle>
            <ChartImage src={charts.pizza} caption="Proporção Nacional vs Município" />
          </>
        )}

        {charts?.barras && (
          <>
            <SectionTitle>Emissões por Meio e Ano</SectionTitle>
            <ChartImage src={charts.barras} caption="Evolução dos meios de emissão (Web, Webservice, App)" />
          </>
        )}
      </ReportPage>

      <ReportPage>
        {charts?.linha && (
          <>
            <SectionTitle>Evolução Nacional vs Município</SectionTitle>
            <ChartImage src={charts.linha} caption="Comparativo de ambientes ao longo dos anos" />
          </>
        )}

        <SectionTitle>Dados por Ano</SectionTitle>
        <PdfTable
          columns={columns}
          data={data as unknown as Record<string, unknown>[]}
        />

        <Disclaimer />
      </ReportPage>
    </ReportDocument>
  );
}
