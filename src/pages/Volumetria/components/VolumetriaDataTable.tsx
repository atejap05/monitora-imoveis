import { BasicTable } from "@/components/BasicTable";
import { TVolumetriaRaw } from "@/@types";

type Props = {
  data: TVolumetriaRaw[];
};

export const VolumetriaDataTable = ({ data }: Props) => {
  // Transformar dados para remover null e adequar ao tipo esperado
  const dataFormatted = data.map(row => ({
    data_processamento: row.data_processamento,
    total_nfse_processadas: row.total_nfse_processadas,
    municipios_diferentes: row.municipios_diferentes,
    prestadores_diferentes: row.prestadores_diferentes,
    dia_semana_nome: row.dia_semana_nome,
    hora_media_processamento: row.hora_media_processamento ?? 0,
  }));

  const columns = [
    {
      key: "data_processamento",
      header: "Data",
      format: (value: string | number) =>
        new Date(Number(value)).toLocaleDateString("pt-BR"),
    },
    {
      key: "total_nfse_processadas",
      header: "NFSe Processadas",
      format: (value: string | number) => Number(value).toLocaleString("pt-BR"),
    },
    { key: "municipios_diferentes", header: "Municípios" },
    { key: "prestadores_diferentes", header: "Prestadores" },
    { key: "dia_semana_nome", header: "Dia da Semana" },
    {
      key: "hora_media_processamento",
      header: "Hora Média",
      format: (value: string | number) =>
        Number(value) > 0 ? `${value}h` : "-",
    },
  ];

  const dataWithDefaults = dataFormatted.map(row => ({
    ...row,
    municipios_diferentes: row.municipios_diferentes ?? 0,
    prestadores_diferentes: row.prestadores_diferentes ?? 0,
  }));

  return (
    <BasicTable
      data={dataWithDefaults}
      columns={columns}
      title="Dados de Volumetria"
      subtitle="Histórico completo de processamento de NFSe"
    />
  );
};
