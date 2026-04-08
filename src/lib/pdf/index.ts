export {
  ReportDocument,
  ReportPage,
  ReportHeader,
  SectionTitle,
  FiltersSummary,
  KpiGrid,
  PdfTable,
  ChartImage,
  InfoRow,
  Disclaimer,
} from "./components";
export {
  ExecutiveSummary,
  DataQualityAlert,
  AppendixSectionTitle,
} from "./reportBlocks";
export type { ExecutiveSummaryProps, DataQualityAlertProps } from "./reportBlocks";
export { styles, COLORS, FONT_SIZES } from "./styles";
export {
  formatPdfDate,
  formatPdfDateTime,
  parseToDate,
  truncateMiddle,
} from "./formatters";
export {
  PDF_TOP_N_DEFAULT,
  PDF_APPENDIX_MAX_ROWS,
  PDF_CHAVE_NFSE_MAX_DISPLAY,
  PDF_CHAVE_COLUMN_WIDTH,
} from "./pdfContentPolicy";
export { svgToBase64Png, captureChartFromContainer, captureAllCharts } from "./chartCapture";
export { generateAndDownloadPdf, buildReportFilename } from "./generatePdf";
