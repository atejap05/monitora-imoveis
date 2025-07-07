import React from "react";
import { BasicTable } from "@/components/BasicTable";

interface AmbienteDataTableProps {
  data: any[];
}

const columns = [
  { header: "Ano", key: "ano", align: "center" as const },
  {
    header: "Amb. Nacional",
    key: "total_ambiente_nacional",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
  },
  {
    header: "Amb. Município",
    key: "total_ambiente_municipio",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
  },
  {
    header: "Web",
    key: "total_web",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
  },
  {
    header: "Webservice",
    key: "total_webservice",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
  },
  {
    header: "App",
    key: "total_app",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
  },
  {
    header: "Tipo Nacional",
    key: "total_tipo_nacional",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
  },
  {
    header: "Tipo Transcrita",
    key: "total_tipo_transcrita",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
  },
  {
    header: "Total Geral Ano",
    key: "total_geral_ano",
    align: "right" as const,
    format: (v: string | number) => Number(v).toLocaleString("pt-BR"),
    className: "font-bold",
  },
];

export const AmbienteDataTable: React.FC<AmbienteDataTableProps> = ({
  data,
}) => (
  <BasicTable
    title="Ambiente de Emissão"
    subtitle="Dados por ambiente e tipo de emissão"
    data={data}
    columns={columns}
    className="bg-white rounded shadow"
  />
);
