import {
  ReportDocument,
  ReportPage,
  ReportHeader,
  SectionTitle,
  KpiGrid,
  PdfTable,
  ChartImage,
  Disclaimer,
  ExecutiveSummary,
  formatPdfDate,
} from "@/lib/pdf";
import type { MunicipioStatus } from "@/@types";

type ConveniosReportProps = {
  /** Dataset já filtrado como na tela (região, UF, status, etc.). */
  data: MunicipioStatus[];
  charts?: {
    graficos?: string;
  };
};

export function ConveniosReport({ data, charts }: ConveniosReportProps) {
  const total = data.length;
  const conveniados = data.filter(
    (d) => d.StatusConvenioSEFIN === "Conveniado Ativo",
  ).length;
  const conveniadosNaoAtivos = data.filter(
    (d) => d.StatusConvenioSEFIN === "Conveniado - Nao Ativo",
  ).length;
  const naoConveniados = data.filter(
    (d) => d.StatusConvenioSEFIN === "Nao Conveniado",
  ).length;
  const ativosBase = data.filter((d) => d.AtivoNaBase === "Sim").length;
  const ativosUltimoPeriodo = data.filter(
    (d) => d.AtivoUltimoPeriodo === "Sim",
  ).length;
  const semAtividade = data.filter((d) => !d.UltimaAtividade).length;

  const columns = [
    { header: "Região", accessor: "Regiao", width: "10%" },
    { header: "RF", accessor: "RegiaoFiscal", width: "7%" },
    { header: "UF", accessor: "UF", width: "5%", align: "center" as const },
    { header: "Cód. Mun.", accessor: "CodigoMunicipio", width: "8%" },
    { header: "Município", accessor: "NomeMunicipio", width: "18%" },
    { header: "Status SEFIN", accessor: "StatusConvenioSEFIN", width: "14%" },
    {
      header: "Ativo Base",
      accessor: "AtivoNaBase",
      width: "8%",
      align: "center" as const,
    },
    {
      header: "Ativo Período",
      accessor: "AtivoUltimoPeriodo",
      width: "10%",
      align: "center" as const,
    },
    {
      header: "Última Atividade",
      accessor: "UltimaAtividade",
      width: "12%",
      format: (v: unknown) => {
        if (v == null || v === "") return "—";
        return formatPdfDate(v);
      },
    },
  ];

  const insights: string[] = [
    `Total analisado no recorte: ${total.toLocaleString("pt-BR")} município(s).`,
    `Conveniados ativos: ${conveniados.toLocaleString("pt-BR")}; não ativos (convênio): ${conveniadosNaoAtivos.toLocaleString("pt-BR")}.`,
    `Municípios sem registro de última atividade: ${semAtividade.toLocaleString("pt-BR")}.`,
  ];

  return (
    <ReportDocument title="Relatório de Convênios NFSe">
      <ReportPage>
        <ReportHeader
          title="Relatório de Convênios"
          subtitle="Situação consolidada dos municípios conveniados"
          badge="CONVÊNIOS"
        />

        <ExecutiveSummary
          lead="Indicadores e amostra tabular do mesmo recorte aplicado nos filtros da página (alinhado aos gráficos e KPIs da tela)."
          insights={insights}
        />

        <SectionTitle>Indicadores Gerais</SectionTitle>
        <KpiGrid
          items={[
            { label: "Total Municípios", value: total.toLocaleString("pt-BR") },
            {
              label: "Conveniados Ativos",
              value: conveniados.toLocaleString("pt-BR"),
              subtext: `${total > 0 ? ((conveniados / total) * 100).toFixed(1) : 0}%`,
            },
            {
              label: "Não Conveniados",
              value: naoConveniados.toLocaleString("pt-BR"),
            },
            {
              label: "Ativos na Base",
              value: ativosBase.toLocaleString("pt-BR"),
              subtext: `${ativosUltimoPeriodo} ativos no período`,
            },
          ]}
        />

        {charts?.graficos && (
          <>
            <SectionTitle>Visão Gráfica</SectionTitle>
            <ChartImage src={charts.graficos} caption="Distribuição dos convênios" />
          </>
        )}
      </ReportPage>

      <ReportPage>
        <SectionTitle>Detalhamento por Município</SectionTitle>
        <PdfTable
          columns={columns}
          data={data as unknown as Record<string, unknown>[]}
          maxRows={60}
          compact
        />
        <Disclaimer />
      </ReportPage>

      {data.length > 60 && (
        <ReportPage>
          <SectionTitle>Detalhamento por Município (cont.)</SectionTitle>
          <PdfTable
            columns={columns}
            data={(data as unknown as Record<string, unknown>[]).slice(60, 120)}
            compact
          />
        </ReportPage>
      )}

      {data.length > 120 && (
        <ReportPage>
          <SectionTitle>Detalhamento por Município (cont.)</SectionTitle>
          <PdfTable
            columns={columns}
            data={(data as unknown as Record<string, unknown>[]).slice(120)}
            maxRows={60}
            compact
          />
        </ReportPage>
      )}
    </ReportDocument>
  );
}
