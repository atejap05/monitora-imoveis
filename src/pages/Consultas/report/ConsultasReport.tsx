import { View, Text } from "@react-pdf/renderer";
import {
  ReportDocument,
  ReportPage,
  ReportHeader,
  SectionTitle,
  KpiGrid,
  PdfTable,
  Disclaimer,
  styles,
  ExecutiveSummary,
  truncateMiddle,
  PDF_CHAVE_NFSE_MAX_DISPLAY,
} from "@/lib/pdf";
import type { NfseData } from "../components/@types";
import { formataCNPJ } from "@/lib/utils";

type ConsultasReportProps = {
  data: NfseData[];
  cnpj: string;
  anos: string[];
};

const MAX_ROWS_PER_PAGE = 35;

const formatCurrency = (v: unknown) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ConsultasReport({ data, cnpj, anos }: ConsultasReportProps) {
  const totalValorServico = data.reduce(
    (acc, d) => acc + (d.valor_servico || 0),
    0,
  );
  const totalValorLiq = data.reduce((acc, d) => acc + (d.valor_liq || 0), 0);
  const municipios = new Set(data.map((d) => d.municipio)).size;

  const columns = [
    {
      header: "Chave (resumo)",
      accessor: "chave_acesso",
      width: "22%",
      format: (v: unknown) =>
        truncateMiddle(String(v ?? ""), PDF_CHAVE_NFSE_MAX_DISPLAY),
    },
    {
      header: "Prestador",
      accessor: "ni_prestador",
      width: "12%",
      format: (v: unknown) => formataCNPJ(String(v)),
    },
    {
      header: "Tomador",
      accessor: "ni_tomador",
      width: "12%",
      format: (v: unknown) => formataCNPJ(String(v)),
    },
    {
      header: "Valor Serviço",
      accessor: "valor_servico",
      width: "12%",
      align: "right" as const,
      format: formatCurrency,
    },
    {
      header: "Valor Líq.",
      accessor: "valor_liq",
      width: "12%",
      align: "right" as const,
      format: formatCurrency,
    },
    { header: "Município", accessor: "municipio", width: "14%" },
    {
      header: "Ano",
      accessor: "ano",
      width: "6%",
      align: "center" as const,
      format: (v: unknown) => String(v),
    },
    {
      header: "Mês",
      accessor: "mes",
      width: "5%",
      align: "center" as const,
      format: (v: unknown) => String(v).padStart(2, "0"),
    },
  ];

  const pages: NfseData[][] = [];
  for (let i = 0; i < data.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(data.slice(i, i + MAX_ROWS_PER_PAGE));
  }

  return (
    <ReportDocument title={`Consulta NFSe - ${formataCNPJ(cnpj)}`}>
      <ReportPage>
        <ReportHeader
          title="Relatório de Consulta NFSe"
          subtitle={`Contribuinte: ${formataCNPJ(cnpj)} | Anos: ${anos.join(", ")}`}
          badge="CONSULTAS"
        />

        <ExecutiveSummary
          lead={`Consulta de NFSe do contribuinte ${formataCNPJ(cnpj)} para o(s) ano(s) ${anos.join(", ")}. Chaves exibidas de forma resumida; use exportação na tela para dados completos.`}
        />

        <KpiGrid
          items={[
            { label: "Total de Registros", value: data.length.toLocaleString("pt-BR") },
            { label: "Valor Total Serviços", value: formatCurrency(totalValorServico) },
            { label: "Valor Total Líquido", value: formatCurrency(totalValorLiq) },
            { label: "Municípios", value: municipios.toLocaleString("pt-BR") },
          ]}
        />

        <SectionTitle>Notas Fiscais de Serviço</SectionTitle>

        {pages.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={styles.footerText}>Nenhum registro encontrado.</Text>
          </View>
        ) : (
          <PdfTable
            columns={columns}
            data={pages[0] as unknown as Record<string, unknown>[]}
            compact
          />
        )}

        {data.length > MAX_ROWS_PER_PAGE && (
          <View style={{ alignItems: "center", marginTop: 4 }}>
            <Text style={{ fontSize: 7, color: "#718096" }}>
              {`Exibindo ${Math.min(MAX_ROWS_PER_PAGE, data.length)} de ${data.length} registros`}
            </Text>
          </View>
        )}

        <Disclaimer />
      </ReportPage>

      {pages.slice(1).map((pageData, idx) => (
        <ReportPage key={idx}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 8, color: "#4a5568", fontFamily: "Helvetica-Bold" }}>
              {`Consulta NFSe — ${formataCNPJ(cnpj)} — Continuação (${idx + 2}/${pages.length})`}
            </Text>
          </View>
          <PdfTable
            columns={columns}
            data={pageData as unknown as Record<string, unknown>[]}
            compact
          />
        </ReportPage>
      ))}
    </ReportDocument>
  );
}
