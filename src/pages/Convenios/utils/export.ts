import { MunicipioStatus } from "@/@types";

export function formatDataForExport(rows: MunicipioStatus[]) {
  return rows.map(row => ({
    ...row,
    UltimaAtividade: row.UltimaAtividade
      ? new Date(row.UltimaAtividade).toLocaleDateString("pt-BR")
      : "N/A",
  }));
}
