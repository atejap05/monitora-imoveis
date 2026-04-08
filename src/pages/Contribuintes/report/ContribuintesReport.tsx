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
import type {
  TTipoContribuinteResponsavel,
  TContribuintesKpi,
  TMunicipioMapa,
} from "@/@types";
import { formatNumber, formatCurrency } from "@/lib/utils";

type ContribuintesReportProps = {
  kpis: TContribuintesKpi | null;
  tipoContribuinte: TTipoContribuinteResponsavel[];
  /** Soma de faturamento por município (quando disponível) — alinhado ao mapa. */
  mapaMunicipios?: TMunicipioMapa[];
  filters: {
    filtro: string;
    uf?: string | null;
    municipio?: string | null;
    regiao?: string | null;
    anos?: number[];
  };
  charts?: {
    mapa?: string;
  };
};

function buildFilterItems(filters: ContribuintesReportProps["filters"]) {
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

function deriveFromTipo(tipo: TTipoContribuinteResponsavel[]) {
  let totalTomadores = 0;
  let totalPrestadores = 0;
  let totalIntermediarios = 0;
  const byTipo: { tipo: string; total: number }[] = [];

  for (const row of tipo) {
    const t =
      (row.total_tomadores ?? 0) +
      (row.total_prestadores ?? 0) +
      (row.total_intermediarios ?? 0);
    totalTomadores += row.total_tomadores ?? 0;
    totalPrestadores += row.total_prestadores ?? 0;
    totalIntermediarios += row.total_intermediarios ?? 0;
    byTipo.push({ tipo: row.tipo_contribuinte, total: t });
  }

  const totalContribuintes = totalTomadores + totalPrestadores + totalIntermediarios;
  const perfilDominante =
    byTipo.length > 0
      ? [...byTipo].sort((a, b) => b.total - a.total)[0].tipo
      : "—";

  return {
    totalTomadores,
    totalPrestadores,
    totalIntermediarios,
    totalContribuintes,
    perfilDominante,
  };
}

export function ContribuintesReport({
  kpis,
  tipoContribuinte,
  mapaMunicipios,
  filters,
  charts,
}: ContribuintesReportProps) {
  const derived = deriveFromTipo(tipoContribuinte);
  const faturamentoFromMapa =
    mapaMunicipios?.reduce((s, m) => s + (m.valor_total ?? 0), 0) ?? null;

  const totalContribuintes =
    derived.totalContribuintes > 0
      ? derived.totalContribuintes
      : (kpis?.total_contribuintes ?? 0);

  const faturamentoTotal =
    faturamentoFromMapa != null && faturamentoFromMapa > 0
      ? faturamentoFromMapa
      : (kpis?.faturamento_total ?? 0);

  const perfilDominante =
    derived.perfilDominante !== "—"
      ? derived.perfilDominante
      : (kpis?.perfil_dominante ?? "—");

  const faturamentoMedio =
    totalContribuintes > 0
      ? faturamentoTotal / totalContribuintes
      : (kpis?.faturamento_medio_por_contribuinte ?? 0);

  const tipoColumns = [
    {
      header: "Tipo Contribuinte",
      accessor: "tipo_contribuinte",
      width: "28%",
    },
    {
      header: "Tomadores",
      accessor: "total_tomadores",
      width: "18%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Prestadores",
      accessor: "total_prestadores",
      width: "18%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Intermediários",
      accessor: "total_intermediarios",
      width: "18%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Total",
      accessor: "_total",
      width: "18%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
  ];

  const tipoData = tipoContribuinte.map((t) => ({
    ...t,
    _total: t.total_tomadores + t.total_prestadores + t.total_intermediarios,
  }));

  const insights: string[] = [
    `Totais por papel: ${formatNumber(derived.totalTomadores)} tomadores, ${formatNumber(derived.totalPrestadores)} prestadores, ${formatNumber(derived.totalIntermediarios)} intermediários.`,
    faturamentoFromMapa != null && faturamentoFromMapa > 0
      ? `Faturamento estimado pela soma dos municípios no mapa: ${formatCurrency(faturamentoFromMapa)}.`
      : "Faturamento agregado indisponível neste recorte (use exportações na tela se necessário).",
  ];

  return (
    <ReportDocument title="Relatório de Contribuintes NFSe">
      <ReportPage>
        <ReportHeader
          title="Contribuintes"
          subtitle="Análise do perfil de contribuintes de NFSe"
          badge="CONTRIBUINTES"
        />

        <FiltersSummary filters={buildFilterItems(filters)} />

        <ExecutiveSummary
          lead="Os totais de contribuintes e o perfil dominante são derivados da distribuição por tipo (tomador/prestador/intermediário), alinhando o PDF aos cards principais da página."
          insights={insights}
        />

        <SectionTitle>Indicadores Principais</SectionTitle>
        <KpiGrid
          items={[
            {
              label: "Total Contribuintes",
              value: formatNumber(totalContribuintes),
            },
            {
              label: "Faturamento Total",
              value: formatCurrency(faturamentoTotal),
            },
            {
              label: "Perfil Dominante",
              value: perfilDominante,
            },
            {
              label: "Fat. Médio/Contrib.",
              value: formatCurrency(faturamentoMedio),
            },
          ]}
        />

        {charts?.mapa && (
          <>
            <SectionTitle>Distribuição Geográfica</SectionTitle>
            <ChartImage src={charts.mapa} caption="Mapa de contribuintes por UF" />
          </>
        )}

        {tipoContribuinte.length > 0 && (
          <>
            <SectionTitle>Distribuição por Tipo de Contribuinte</SectionTitle>
            <PdfTable
              columns={tipoColumns}
              data={tipoData as unknown as Record<string, unknown>[]}
            />
          </>
        )}

        <Disclaimer />
      </ReportPage>
    </ReportDocument>
  );
}
