import { ColumnDef } from "@tanstack/react-table";

const formataHeader = (text: string) => (
  <span className="text-base text-nowrap text-green py-2">{text}</span>
);

type DistFreqData = {
  faixa: string;
  frequencia: number;
  frequencia_acumulada: number;
  frequencia_acumulada_percentual: string;
  frequencia_relativa_percentual: string;
};

export const distFreqColumns: ColumnDef<DistFreqData, any>[] = [
  {
    header: () => formataHeader("Valores (R$)"),
    accessorKey: "faixa",
  },
  {
    header: () => formataHeader("Frequência"),
    accessorKey: "frequencia",
  },
  {
    header: () => formataHeader("Freq Acumulada"),
    accessorKey: "frequencia_acumulada",
  },
  {
    header: () => formataHeader("Freq Acumulada (%)"),
    accessorKey: "frequencia_acumulada_percentual",
  },
  {
    header: () => formataHeader("Freq Relativa (%)"),
    accessorKey: "frequencia_relativa_percentual",
  },
];
