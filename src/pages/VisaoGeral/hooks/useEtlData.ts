import { useEffect, useState } from "react";
import { fetchDadosETL } from "@/service";

export type EtlData = {
  data_etl: string; // yyyy-mm-dd
  qtd_nfse: number;
};

function normalizeDate(dateStr: string): string {
  // Aceita tanto yyyy-mm-dd quanto ISO, retorna yyyy-mm-dd
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toISOString().slice(0, 10);
}

export function useEtlData() {
  const [data, setData] = useState<EtlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDadosETL()
      .then(response => {
        // response: { "2025-05-03": 762084, ... }
        if (!response || typeof response !== "object") {
          setError("Dados ETL inválidos");
          setLoading(false);
          return;
        }
        const rows: EtlData[] = Object.entries(response)
          .map(([data_etl, qtd_nfse]) => ({
            data_etl: normalizeDate(data_etl),
            qtd_nfse: Number(qtd_nfse),
          }))
          .filter(d => !!d.data_etl && !isNaN(d.qtd_nfse));
        // eslint-disable-next-line no-console
        console.log(
          "[ETL DEBUG] Dados recebidos do backend:",
          rows.slice(0, 5),
          rows.length
        );
        setData(rows);
        setLoading(false);
      })
      .catch(err => {
        setError("Erro ao carregar dados ETL: " + err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
