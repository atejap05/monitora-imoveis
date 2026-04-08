/**
 * Formatadores compartilhados para PDFs — datas (ISO, epoch ms), moeda, truncamento legível.
 */

/** Detecta valor numérico em epoch ms ( típico > 1e12 ). */
function isEpochMs(n: number): boolean {
  return Number.isFinite(n) && n > 1_000_000_000_000 && n < 10_000_000_000_000_000;
}

/**
 * Converte valor de data vindo da API para `Date` válida ou null.
 */
export function parseToDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(isEpochMs(value) ? value : value);
    return isNaN(d.getTime()) ? null : d;
  }
  const s = String(value).trim();
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    if (!Number.isFinite(n)) return null;
    const d = new Date(isEpochMs(n) ? n : n);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function formatPdfDate(value: unknown): string {
  const d = parseToDate(value);
  if (!d) return String(value ?? "—");
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPdfDateTime(value: unknown): string {
  const d = parseToDate(value);
  if (!d) return String(value ?? "—");
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Trunca string longa no meio (ex.: chave NFSe). */
export function truncateMiddle(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text;
  const keep = maxLen - 3;
  const head = Math.ceil(keep / 2);
  const tail = Math.floor(keep / 2);
  return `${text.slice(0, head)}…${text.slice(-tail)}`;
}
