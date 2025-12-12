import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GenericLineChart } from "./VolumetriaCharts";
import { TVolumetriaEvolucaoMensal } from "@/@types";

type Props = {
  evolucaoMensal: TVolumetriaEvolucaoMensal[];
};

export const VolumetriaEvolucaoMensal = ({ evolucaoMensal }: Props) => {
  // Preparar dados para gráfico de linha (evolução temporal)
  const dadosLinha = evolucaoMensal.map(item => ({
    name: item.periodo,
    volumeTotal: item.volume_total,
    volumeMedio: Math.round(item.volume_medio_dia),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Temporal</CardTitle>
        <CardDescription>Volume total e médio diário por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <GenericLineChart
          data={dadosLinha}
          xKey="name"
          lines={[
            {
              dataKey: "volumeTotal",
              name: "Volume Total",
              color: "#22c55e",
            },
            {
              dataKey: "volumeMedio",
              name: "Média Diária",
              color: "#3b82f6",
            },
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
};
