import { ColumnDef } from "@tanstack/react-table";
import { TTop100NFSe } from "@/@types";
import BasicTooltip from "@/components/BasicTooltip";
import { formataCNPJ } from "@/lib/utils";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { Button } from "@/components/ui/button";

const formataHeader = (text: string) => (
  <span className="text-base text-nowrap text-green py-2">{text}</span>
);

const formataValorReal = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const top100NFSeColumns: ColumnDef<TTop100NFSe[number]>[] = [
  {
    header: () => formataHeader("Chave Acesso"),
    accessorKey: "chaveacesso",
    cell: ({ row }) => {
      const chave = row.original.chaveacesso;
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <a
            href="https://www.nfse.gov.br/consultapublica"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900"
            title="Consultar chave de acesso na NFSe.gov.br"
          >
            <BasicTooltip content={chave}>
              <span className="truncate max-w-[150px] inline-block">
                {chave}
              </span>
            </BasicTooltip>
          </a>
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
    accessorKey: "cnpjcpf_prestador",
    cell: ({ row }) => (
      <span className="truncate max-w-[140px] inline-block">
        {formataCNPJ(row.original.cnpjcpf_prestador)}
      </span>
    ),
  },
  {
    header: () => formataHeader("Razão Social Prestador"),
    accessorKey: "nome_prestador",
    cell: ({ row }) => (
      <BasicTooltip content={row.original.nome_prestador}>
        <span className="truncate max-w-[200px] inline-block">
          {row.original.nome_prestador}
        </span>
      </BasicTooltip>
    ),
  },
  {
    header: () => formataHeader("CNPJ Tomador"),
    accessorKey: "cnpjcpf_tomador",
    cell: ({ row }) => (
      <span className="truncate max-w-[140px] inline-block">
        {formataCNPJ(row.original.cnpjcpf_tomador)}
      </span>
    ),
  },
  {
    header: () => formataHeader("Razão Social Tomador"),
    accessorKey: "nome_tomador",
    cell: ({ row }) => (
      <BasicTooltip content={row.original.nome_tomador}>
        <span className="truncate max-w-[200px] inline-block">
          {row.original.nome_tomador}
        </span>
      </BasicTooltip>
    ),
  },
  {
    header: () => formataHeader("Valor Serviço"),
    accessorKey: "valordoservico",
    cell: ({ row }) => formataValorReal(row.original.valordoservico),
  },
  {
    header: () => formataHeader("Emissão"),
    accessorKey: "dataemissao",
    cell: ({ row }) =>
      new Date(row.original.dataemissao).toLocaleDateString("pt-BR"),
  },
  {
    header: () => formataHeader("Status"),
    accessorKey: "statusnota",
  },
  {
    header: () => formataHeader("UF Prestador"),
    accessorKey: "uf_prestador",
  },
  {
    header: () => formataHeader("Município Prestador"),
    accessorKey: "municipio_prestador",
  },
  {
    header: () => formataHeader("Descrição Serviço"),
    accessorKey: "descricao_servico",
    cell: ({ row }) => (
      <BasicTooltip content={row.original.descricao_servico}>
        <span className="truncate max-w-[200px] inline-block">
          {row.original.descricao_servico}
        </span>
      </BasicTooltip>
    ),
  },
];
