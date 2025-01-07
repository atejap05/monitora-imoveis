import { ColumnDef } from "@tanstack/react-table";
import { type NfseData } from "./@types";

export const nfseColumns: ColumnDef<NfseData>[] = [
  {
    header: "Nro NFSe",
    accessorKey: "nro_nfse",
  },
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
  },
  {
    header: "Servico Nacional",
    accessorKey: "servico_nacional",
  },

  {
    header: "NBS",
    accessorKey: "nbs",
  },
  {
    header: "Descricao Servico",
    accessorKey: "descricao_servico",
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

// export const consultasColumns: ColumnDef<TFunprespColumns>[] = [
//   {
//     header: "ID",
//     accessorKey: "id",
//   },
//   {
//     header: "Taxa Acumulada",
//     accessorKey: "taxaAcumulada",
//   },
//   {
//     header: "Taxa Mensal",
//     accessorKey: "taxaMensal",
//   },
//   {
//     header: "Total Investido",
//     accessorKey: "totalInvestido",
//   },
//   {
//     header: "Rendimento Até Aposentadoria",
//     accessorKey: "rendimentoAteAposentadoria",
//   },
//   {
//     header: "Valor Acumulado",
//     accessorKey: "valorAcumulado",
//   },
//   {
//     header: "Renda Mensal Bruta",
//     accessorKey: "rendaMensalBruta",
//   },
//   {
//     header: "Renda Líquida Funpresp",
//     accessorKey: "rendaLiquidaFunpresp",
//   },
// ];
