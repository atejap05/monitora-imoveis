import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GenericBarChart } from "./VolumetriaCharts";
import { TVolumetriaSazonalidade } from "@/@types";

type Props = {
  sazonalidade: TVolumetriaSazonalidade[];
};

export const VolumetriaSazonalidade = ({ sazonalidade }: Props) => {
  // Preparar dados para gráfico de barras (sazonalidade)
  const dadosBarraSazonalidade = sazonalidade.map(item => ({
    name: item.mes_nome,
    value: Math.round(item.media),
  }));

  // Identificar picos sazonais
  const mesMaior = sazonalidade.reduce((max, item) =>
    item.media > max.media ? item : max
  );
  const mesMenor = sazonalidade.reduce((min, item) =>
    item.media < min.media ? item : min
  );
  const diferencaSazonal = (
    (mesMaior.media / mesMenor.media - 1) *
    100
  ).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sazonalidade Mensal</CardTitle>
        <CardDescription>
          Maior: {mesMaior.mes_nome} • Menor: {mesMenor.mes_nome} • Variação:{" "}
          {diferencaSazonal}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenericBarChart
          data={dadosBarraSazonalidade}
          xKey="name"
          dataKey="value"
          color="#8b5cf6"
          height={300}
        />
      </CardContent>
    </Card>
  );
};
