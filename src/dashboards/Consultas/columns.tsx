import { CellContext, ColumnDef } from "@tanstack/react-table";
import { type NfseData } from "./@types";
import BasicTooltip from "@/components/BasicTooltip";

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

export const nfseColumns: ColumnDef<NfseData>[] = [
  {
    header: "Chave Acesso",
    accessorKey: "chave_acesso",
  },
  {
    header: "NI Prestador",
    accessorKey: "ni_prestador",
  },

  {
    header: "NI Tomador",
    accessorKey: "ni_tomador",
  },
  {
    header: "Valor Servico",
    accessorKey: "valor_servico",
  },
  {
    header: "Valor Liq",
    accessorKey: "valor_liq",
  },

  {
    header: "Municipio",
    accessorKey: "municipio",
  },

  {
    header: "Loc Prestacao",
    accessorKey: "loc_prestacao",
  },

  {
    header: "Local Emissao",
    accessorKey: "local_emissao",
  },

  {
    header: "Tomador",
    accessorKey: "tomador",
    size: 200,
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
    header: "Servico Nacional",
    accessorKey: "servico_nacional",
    cell: formataTextoLongo,
  },

  {
    header: "NBS",
    accessorKey: "nbs",
    cell: formataTextoLongo,
  },
  {
    header: "Descricao Servico",
    accessorKey: "descricao_servico",
    cell: formataTextoLongo,
  },
  {
    header: "Municipio Tomador",
    accessorKey: "municipio_tomador",
  },
  {
    header: "Ano",
    accessorKey: "ano",
  },
  {
    header: "Mes",
    accessorKey: "mes",
  },
];
