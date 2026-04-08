import { pdf } from "@react-pdf/renderer";
import type { ReactElement } from "react";

export async function generateAndDownloadPdf(
  pdfDocument: ReactElement,
  filename: string,
): Promise<void> {
  const blob = await pdf(pdfDocument).toBlob();
  const url = URL.createObjectURL(blob);

  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${filename}.pdf`;
  link.style.display = "none";
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function buildReportFilename(
  pageName: string,
  filters?: Record<string, string | null | undefined>,
): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);

  const parts = [`relatorio-${pageName}`];

  if (filters) {
    for (const [, value] of Object.entries(filters)) {
      if (value) parts.push(value);
    }
  }

  parts.push(timestamp);
  return parts.join("-").replace(/\s+/g, "_");
}
