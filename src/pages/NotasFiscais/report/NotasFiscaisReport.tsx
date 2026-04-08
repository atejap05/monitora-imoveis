import {
  ReportDocument,
  ReportPage,
  ReportHeader,
  SectionTitle,
  FiltersSummary,
  KpiGrid,
  PdfTable,
  Disclaimer,
  COLORS,
  ExecutiveSummary,
  AppendixSectionTitle,
  formatPdfDate,
  truncateMiddle,
  PDF_TOP_N_DEFAULT,
  PDF_APPENDIX_MAX_ROWS,
  PDF_CHAVE_COLUMN_WIDTH,
  PDF_CHAVE_NFSE_MAX_DISPLAY,
} from "@/lib/pdf";
import type { TNotasFiscaisCanceladas, TTop100NFSe } from "@/@types";
import { formataCNPJ } from "@/lib/utils";

type NotasFiscaisReportProps = {
  canceladas: TNotasFiscaisCanceladas;
  top100: TTop100NFSe;
  filters: {
    filtro: string;
    uf?: string | null;
    municipio?: string | null;
    regiao?: string | null;
    anos?: number[];
  };
};

const formatCurrency = (v: unknown) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function buildFilterItems(filters: NotasFiscaisReportProps["filters"]) {
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

function buildTopRowsForPdf(top100: TTop100NFSe): Record<string, unknown>[] {
  return top100.map(row => ({
    chave_curta: truncateMiddle(String(row.chaveacesso), PDF_CHAVE_NFSE_MAX_DISPLAY),
    nome_prestador: row.nome_prestador,
    cnpjcpf_prestador: formataCNPJ(String(row.cnpjcpf_prestador)),
    nome_tomador: row.nome_tomador,
    valordoservico: row.valordoservico,
    dataemissao: row.dataemissao,
    statusnota: row.statusnota,
    uf_prestador: row.uf_prestador,
    municipio_prestador: row.municipio_prestador,
  }));
}

export function NotasFiscaisReport({
  canceladas,
  top100,
  filters,
}: NotasFiscaisReportProps) {
  const substituicao = canceladas.find((c) => c.cod_evento === "105102");
  const deferido = canceladas.find((c) => c.cod_evento === "105104");
  const oficio = canceladas.find((c) => c.cod_evento === "305101");
  const outros = canceladas.filter(
    (c) => !["105102", "105104", "305101"].includes(c.cod_evento),
  );
  const outrosTotal = outros.reduce((acc, c) => acc + c.total_notas, 0);

  const tableData = buildTopRowsForPdf(top100);
  const restAfterFirst = tableData.slice(PDF_TOP_N_DEFAULT);
  const appendixChunks: Record<string, unknown>[][] = [];
  for (let i = 0; i < restAfterFirst.length; i += PDF_APPENDIX_MAX_ROWS) {
    appendixChunks.push(restAfterFirst.slice(i, i + PDF_APPENDIX_MAX_ROWS));
  }

  const columns = [
    {
      header: "Chave (resumo)",
      accessor: "chave_curta",
      width: PDF_CHAVE_COLUMN_WIDTH,
    },
    { header: "Prestador", accessor: "nome_prestador", width: "14%" },
    {
      header: "CNPJ Prest.",
      accessor: "cnpjcpf_prestador",
      width: "12%",
    },
    { header: "Tomador", accessor: "nome_tomador", width: "12%" },
    {
      header: "Valor",
      accessor: "valordoservico",
      width: "10%",
      align: "right" as const,
      format: formatCurrency,
    },
    {
      header: "Emissão",
      accessor: "dataemissao",
      width: "9%",
      format: (v: unknown) => formatPdfDate(v),
    },
    { header: "Status", accessor: "statusnota", width: "8%" },
    { header: "UF", accessor: "uf_prestador", width: "5%", align: "center" as const },
    { header: "Município", accessor: "municipio_prestador", width: "12%" },
  ];

  return (
    <ReportDocument title="Relatório de Notas Fiscais">
      <ReportPage>
        <ReportHeader
          title="Relatório de Notas Fiscais"
          subtitle="Cancelamentos e Top 100 por Valor"
          badge="NOTAS FISCAIS"
        />

        <FiltersSummary filters={buildFilterItems(filters)} />

        <ExecutiveSummary
          lead="Panorama de cancelamentos por tipo de evento e ranking das maiores NFSe por valor no recorte filtrado. A coluna de chave exibe apenas trechos inicial/final para leitura; use a exportação CSV/XLSX na tela para a chave completa."
          insights={[
            `Ranking limitado a ${Math.min(top100.length, 100)} notas (Top 100) conforme consulta.`,
            "Valores e datas seguem o retorno da API; emissão normalizada para calendário (inclui epoch em ms).",
          ]}
        />

        <SectionTitle>Cancelamentos por Tipo de Evento</SectionTitle>
        <KpiGrid
          items={[
            {
              label: "Substituição",
              value: (substituicao?.total_notas ?? 0).toLocaleString("pt-BR"),
              color: COLORS.kpiBlue,
            },
            {
              label: "Deferido Análise Fiscal",
              value: (deferido?.total_notas ?? 0).toLocaleString("pt-BR"),
              color: COLORS.kpiGreen,
            },
            {
              label: "De Ofício",
              value: (oficio?.total_notas ?? 0).toLocaleString("pt-BR"),
              color: COLORS.kpiAmber,
            },
            {
              label: "Outros",
              value: outrosTotal.toLocaleString("pt-BR"),
              color: COLORS.kpiRed,
            },
          ]}
        />

        <SectionTitle>Top 100 Notas Fiscais por Valor</SectionTitle>
        <PdfTable
          columns={columns}
          data={tableData}
          maxRows={PDF_TOP_N_DEFAULT}
          compact
        />

        <Disclaimer />
      </ReportPage>

      {appendixChunks.map((chunk, idx) => (
        <ReportPage key={idx}>
          <AppendixSectionTitle>
            {`Top 100 — continuação (${idx + 2}/${appendixChunks.length + 1})`}
          </AppendixSectionTitle>
          <PdfTable columns={columns} data={chunk} compact />
        </ReportPage>
      ))}
    </ReportDocument>
  );
}
