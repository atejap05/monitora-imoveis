import { CellContext, ColumnDef } from "@tanstack/react-table";
import { type NfseData } from "./@types";
import BasicTooltip from "@/components/BasicTooltip";
import { formataCNPJ } from "@/lib/utils";

const formataTextoLongo = (info: CellContext<NfseData, unknown>) => {
  const text = String(info.getValue());

  return (
    <div className="truncate">
      <BasicTooltip
        label={text.slice(0, 10) + (text ? "..." : "")}
        content={text}
      />
    </div>
  );
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
  },
  {
    header: () => formataHeader("CNPJ Prestador"),
    accessorKey: "ni_prestador",
    cell: info => formataCNPJ(info.getValue()),
  },
  {
    header: () => formataHeader("CNPJ Tomador"),
    accessorKey: "ni_tomador",
    cell: info => formataCNPJ(info.getValue()),
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
          <BasicTooltip label={text} content={text} />
        </div>
      );
    },
  },
  {
    header: () => formataHeader("Servico Nacional"),
    accessorKey: "servico_nacional",
    cell: formataTextoLongo,
  },
  {
    header: () => formataHeader("NBS"),
    accessorKey: "nbs",
    cell: formataTextoLongo,
  },
  {
    header: () => formataHeader("Descricao Servico"),
    accessorKey: "descricao_servico",
    cell: formataTextoLongo,
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
