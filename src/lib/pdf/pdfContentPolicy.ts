/**
 * Política de conteúdo para relatórios PDF — alinhada a `docs/PDF_REPORTS_MATRIX.md`.
 * Exportações detalhadas (CSV/XLSX) permanecem na UI; o PDF prioriza leitura humana.
 */

/** Linhas máximas no corpo principal para rankings / listas tabulares. */
export const PDF_TOP_N_DEFAULT = 25;

/** Linhas máximas para anexo curto (continuação), se existir segunda página de tabela. */
export const PDF_APPENDIX_MAX_ROWS = 50;

/** Chave de acesso NFSe: exibir truncada no resumo (caracteres visíveis aproximados). */
export const PDF_CHAVE_NFSE_MAX_DISPLAY = 28;

/** Largura sugerida % para coluna de chave quando ainda presente. */
export const PDF_CHAVE_COLUMN_WIDTH = "22%";
