import { ColumnDef } from "@tanstack/react-table";

const formataHeader = (text: string) => (
  <span className="text-base text-nowrap text-green py-2">{text}</span>
);

export interface TabelaFrequenciaItem {
  faixa: string;
  frequencia: number;
  frequencia_acumulada: number;
  frequencia_acumulada_percentual: number;
  frequencia_relativa_percentual: number;
}

export interface MetricasEstatisticas {
  media: number;
  mediana: number | string;
  moda: string;
  desvio_padrao: number | string;
}

export interface RespostaEstatistica {
  metodo_calculo: "Exato" | "Estimado (devido ao grande volume de dados)";
  estatisticas: MetricasEstatisticas;
  tabela_frequencias: TabelaFrequenciaItem[];
}

// Função utilitária para formatar números com separador de milhar
const formatNumber = (n: number) => n.toLocaleString("pt-BR");

// Atualize o tipo da coluna para usar TabelaFrequenciaItem
export const distFreqColumns: ColumnDef<TabelaFrequenciaItem, any>[] = [
  {
    header: () => formataHeader("Valores (R$)"),
    accessorKey: "faixa",
  },
  {
    header: () => formataHeader("Frequência"),
    accessorKey: "frequencia",
    cell: info => formatNumber(info.getValue()),
  },
  {
    header: () => formataHeader("Freq Acumulada"),
    accessorKey: "frequencia_acumulada",
    cell: info => formatNumber(info.getValue()),
  },
  {
    header: () => formataHeader("Freq Acumulada (%)"),
    accessorKey: "frequencia_acumulada_percentual",
    cell: info => `${info.getValue()}%`,
  },
  {
    header: () => formataHeader("Freq Relativa (%)"),
    accessorKey: "frequencia_relativa_percentual",
    cell: info => `${info.getValue()}%`,
  },
];
