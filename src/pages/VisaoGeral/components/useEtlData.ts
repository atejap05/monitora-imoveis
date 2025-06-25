import { useEffect, useState } from "react";

export type EtlData = {
  data_etl: string; // yyyy-mm-dd
  qtd_nfse: number;
};

export function useEtlData() {
  const [data, setData] = useState<EtlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/mock_data/dados-etl.csv")
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split("\n");
        const rows = lines.slice(1).map(line => {
          const [data_etl, qtd_nfse] = line.split(",");
          return { data_etl, qtd_nfse: Number(qtd_nfse) };
        });
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
