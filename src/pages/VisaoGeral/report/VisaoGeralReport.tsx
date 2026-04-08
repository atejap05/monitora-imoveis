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
  InfoRow,
} from "@/lib/pdf";
import type { TConsultaNFSeTotais, TAdesaoMunicipios } from "@/@types";
import { formatCurrency, formatNumber } from "@/lib/utils";

type TabelaFrequenciaItem = {
  faixa: string;
  frequencia: number;
  frequencia_acumulada: number;
  frequencia_acumulada_percentual: number;
  frequencia_relativa_percentual: number;
};

/** Contrato API / UI: pode vir como `tabela_frequencias` (dashboard) ou `tabela_frequencia`. */
type DistribuicaoFrequenciaInput = {
  tabela_frequencia?: TabelaFrequenciaItem[];
  tabela_frequencias?: TabelaFrequenciaItem[];
  estatisticas?: Record<string, number | string>;
  metodo_calculo?: string;
};
type VisaoGeralReportProps = {
  nfseTotais: TConsultaNFSeTotais;
  distribuicaoFrequencia: DistribuicaoFrequenciaInput | null;
  adesaoMunicipios: TAdesaoMunicipios | null;
  filters: {
    filtro: string;
    uf?: string | null;
    municipio?: string | null;
    regiao?: string | null;
    anos?: number[];
  };
  charts?: {
    adesao?: string;
  };
};

function buildFilterItems(filters: VisaoGeralReportProps["filters"]) {
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

function getFreqTable(df: DistribuicaoFrequenciaInput | null): TabelaFrequenciaItem[] {
  if (!df) return [];
  const rows = df.tabela_frequencias ?? df.tabela_frequencia;
  return Array.isArray(rows) ? rows : [];
}

export function VisaoGeralReport({
  nfseTotais,
  distribuicaoFrequencia,
  filters,
  charts,
}: VisaoGeralReportProps) {
  const years = Object.keys(nfseTotais);
  const totals = years.reduce(
    (acc, year) => {
      const y = nfseTotais[year];
      acc.total += y.total;
      acc.mei += y.mei;
      acc.me_epp += y.me_epp;
      acc.nao_optante += y.nao_optante;
      return acc;
    },
    { total: 0, mei: 0, me_epp: 0, nao_optante: 0 },
  );

  const freqColumns = [
    { header: "Faixa de Valor", accessor: "faixa", width: "30%" },
    {
      header: "Frequência",
      accessor: "frequencia",
      width: "15%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "Freq. Acumulada",
      accessor: "frequencia_acumulada",
      width: "18%",
      align: "right" as const,
      format: (v: unknown) => formatNumber(Number(v)),
    },
    {
      header: "% Relativa",
      accessor: "frequencia_relativa_percentual",
      width: "17%",
      align: "right" as const,
      format: (v: unknown) => `${Number(v).toFixed(2)}%`,
    },
    {
      header: "% Acumulada",
      accessor: "frequencia_acumulada_percentual",
      width: "17%",
      align: "right" as const,
      format: (v: unknown) => `${Number(v).toFixed(2)}%`,
    },
  ];

  const freqTable = getFreqTable(distribuicaoFrequencia);
  const stats = distribuicaoFrequencia?.estatisticas;
  const pctMei =
    totals.total > 0 ? ((totals.mei / totals.total) * 100).toFixed(1) : "0";
  const pctMeEpp =
    totals.total > 0 ? ((totals.me_epp / totals.total) * 100).toFixed(1) : "0";
  const pctNao =
    totals.total > 0
      ? ((totals.nao_optante / totals.total) * 100).toFixed(1)
      : "0";

  const insights: string[] = [
    `No recorte selecionado, a base soma ${formatNumber(totals.total)} NFSe emitidas.`,
    `Participação aproximada: MEI ${pctMei}%, ME/EPP ${pctMeEpp}%, não optantes ${pctNao}%.`,
  ];
  if (distribuicaoFrequencia?.metodo_calculo) {
    insights.push(
      `Distribuição de frequência por valor: método ${distribuicaoFrequencia.metodo_calculo}.`,
    );
  }

  const formatStat = (v: number | string | undefined) => {
    if (v === undefined) return "—";
    return typeof v === "number" ? formatCurrency(v) : String(v);
  };

  return (
    <ReportDocument title="Relatório Visão Geral NFSe">
      <ReportPage>
        <ReportHeader
          title="Visão Geral — Painel NFSe"
          subtitle={`Resumo consolidado das Notas Fiscais de Serviço Eletrônicas`}
          badge="VISÃO GERAL"
        />

        <FiltersSummary filters={buildFilterItems(filters)} />

        <ExecutiveSummary
          lead="Consolidado de volume de NFSe por regime tributário e, quando disponível, distribuição de frequência por faixa de valor de serviço."
          insights={insights}
        />

        <SectionTitle>Indicadores Principais</SectionTitle>
        <KpiGrid
          items={[
            { label: "Total NFSe", value: formatNumber(totals.total) },
            { label: "MEI", value: formatNumber(totals.mei) },
            { label: "ME/EPP", value: formatNumber(totals.me_epp) },
            { label: "Não Optantes", value: formatNumber(totals.nao_optante) },
          ]}
        />

        {stats && (
          <>
            <SectionTitle>Estatísticas da distribuição de frequência</SectionTitle>
            {stats.media !== undefined && (
              <InfoRow label="Média" value={formatStat(stats.media)} />
            )}
            {stats.mediana !== undefined && (
              <InfoRow label="Mediana" value={formatStat(stats.mediana)} />
            )}
            {stats.moda !== undefined && (
              <InfoRow label="Moda (faixa)" value={String(stats.moda)} />
            )}
            {stats.desvio_padrao !== undefined && (
              <InfoRow label="Desvio padrão" value={formatStat(stats.desvio_padrao)} />
            )}
          </>
        )}

        {charts?.adesao && (
          <>
            <SectionTitle>Adesão de Municípios</SectionTitle>
            <ChartImage
              src={charts.adesao}
              caption="Evolução da adesão de municípios ao longo do tempo"
            />
          </>
        )}

        {freqTable.length > 0 && (
          <>
            <SectionTitle>Distribuição de Frequência</SectionTitle>
            {distribuicaoFrequencia?.metodo_calculo && (
              <InfoRow
                label="Método de cálculo"
                value={distribuicaoFrequencia.metodo_calculo}
              />
            )}
            <PdfTable
              columns={freqColumns}
              data={freqTable as unknown as Record<string, unknown>[]}
            />
          </>
        )}

        <Disclaimer />
      </ReportPage>
    </ReportDocument>
  );
}
