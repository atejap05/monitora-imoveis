import { CellContext, ColumnDef } from "@tanstack/react-table";
import { type NfseData } from "../@types";
import BasicTooltip from "@/components/BasicTooltip";
import { formataCNPJ } from "@/lib/utils";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { Button } from "@/components/ui/button";
import { useDanfseBase64 } from "@/hooks/useDanfseBase64";
import { useState } from "react";
import { toast } from "sonner";

const formataTextoLongo = (info: CellContext<NfseData, unknown>) => {
  const text = String(info.getValue() ?? "");
  return <BasicTooltip content={text}>{text}</BasicTooltip>;
};

const formataHeader = (text: string) => (
  <span className="text-base text-nowrap text-green py-2">{text}</span>
);

const formataValorReal = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const nfseColumns: ColumnDef<NfseData, any>[] = [
  {
    header: () => formataHeader("Chave Acesso"),
    accessorKey: "chave_acesso",
    cell: info => {
      const chave = String(info.getValue() ?? "");
      const { mutate: fetchPdf, isPending } = useDanfseBase64();
      const [loading, setLoading] = useState(false);

      const handleClick = () => {
        setLoading(true);
        fetchPdf(chave, {
          onSuccess: (blob) => {
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            setLoading(false);
          },
          onError: () => {
            toast.error("Erro ao baixar DANFSe. Tente novamente.");
            setLoading(false);
          },
        });
      };

      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <button
            type="button"
            className="text-blue-700 hover:text-blue-900 underline"
            onClick={handleClick}
            disabled={isPending || loading}
            aria-label="Visualizar DANFSe em PDF"
            title="Visualizar DANFSe em PDF"
          >
            {isPending || loading ? "Carregando..." : chave}
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.preventDefault();
              copyToClipboard(chave);
            }}
            className="ml-1 p-1 rounded hover:bg-gray-100"
            aria-label="Copiar chave de acesso"
            title="Copiar chave de acesso"
          >
            <Copy size={16} className="text-primary hover:text-primary/90" />
          </Button>
        </div>
      );
    },
  },
  {
    header: () => formataHeader("CNPJ Prestador"),
    accessorKey: "ni_prestador",
    cell: info => (
      <span className="truncate max-w-[140px] inline-block">
        {formataCNPJ(info.getValue())}
      </span>
    ),
  },
  {
    header: () => formataHeader("CNPJ Tomador"),
    accessorKey: "ni_tomador",
    cell: info => (
      <span className="truncate max-w-[140px] inline-block">
        {formataCNPJ(info.getValue())}
      </span>
    ),
  },
  {
    header: () => formataHeader("Valor Servico"),
    accessorKey: "valor_servico",
    cell: info => formataValorReal(info.getValue() as number),
  },
  {
    header: () => formataHeader("Valor Liq"),
    accessorKey: "valor_liq",
    filterFn: "includesString",
    cell: info => formataValorReal(info.getValue() as number),
  },
  {
    header: () => formataHeader("Municipio"),
    accessorKey: "municipio",
  },
  {
    header: () => formataHeader("Loc Prestacao"),
    accessorKey: "loc_prestacao",
    filterFn: "includesString",
  },
  {
    header: () => formataHeader("Local Emissao"),
    accessorKey: "local_emissao",
  },
  {
    header: () => formataHeader("Tomador"),
    accessorKey: "tomador",
    cell: info => {
      const text = String(info.getValue());
      return (
        <div className="text-nowrap">
          <BasicTooltip content={text}>{text}</BasicTooltip>
        </div>
      );
    },
  },
  {
    header: () => formataHeader("Servico Nacional"),
    accessorKey: "servico_nacional",
    cell: info => (
      <div className="truncate max-w-[120px]">{formataTextoLongo(info)}</div>
    ),
  },
  {
    header: () => formataHeader("NBS"),
    accessorKey: "nbs",
    cell: info => (
      <div className="truncate max-w-[100px]">{formataTextoLongo(info)}</div>
    ),
  },
  {
    header: () => formataHeader("Descricao Servico"),
    accessorKey: "descricao_servico",
    cell: info => (
      <div className="truncate max-w-[220px]">{formataTextoLongo(info)}</div>
    ),
  },
  {
    header: () => formataHeader("Municipio Tomador"),
    accessorKey: "municipio_tomador",
  },
  {
    header: () => formataHeader("Ano"),
    accessorKey: "ano",
    cell: info => info.getValue().toString(),
    meta: {
      filterVariant: "text",
    },
  },
  {
    header: () => formataHeader("Mes"),
    accessorKey: "mes",
    meta: {
      filterVariant: "number",
    },
  },
];
