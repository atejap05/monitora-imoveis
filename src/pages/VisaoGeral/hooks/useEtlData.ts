import { useQuery } from "@tanstack/react-query";
import { fetchDadosETL } from "@/service/visao-geral";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";
import { type EtlData } from "@/lib/utils";

function normalizeDate(dateStr: string): string {
  // Aceita tanto yyyy-mm-dd quanto ISO, retorna yyyy-mm-dd
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toISOString().slice(0, 10);
}

export function useEtlData() {
  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: QUERY_KEYS.etlDados(),
    queryFn: async () => {
      const response = await queuedBackendCall(() => fetchDadosETL(), "low"); // Prioridade baixa

      // response: { "2025-05-03": 762084, ... }
      if (!response || typeof response !== "object") {
        throw new Error("Dados ETL inválidos");
      }

      const rows: EtlData[] = Object.entries(response)
        .map(([data_etl, qtd_nfse]) => ({
          data_etl: normalizeDate(data_etl),
          qtd_nfse: Number(qtd_nfse),
        }))
        .filter(d => !!d.data_etl && !isNaN(d.qtd_nfse));

      return rows;
    },
    // staleTime configurado globalmente para 1 hora
  });

  const error = queryError
    ? `Erro ao carregar dados ETL: ${queryError.message}`
    : null;

  return { data: data || [], loading, error };
}
