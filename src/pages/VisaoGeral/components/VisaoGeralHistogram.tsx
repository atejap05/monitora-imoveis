import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumber } from "@/lib/utils";

// Estrutura de dados para a distribuição de frequência
interface DistribuicaoFrequencia {
  faixa: string;
  frequencia: number;
}

// Mock data para o histograma
const mockData: DistribuicaoFrequencia[] = [
  { faixa: "0-1k", frequencia: 120 },
  { faixa: "1k-2k", frequencia: 250 },
  { faixa: "2k-3k", frequencia: 380 },
  { faixa: "3k-4k", frequencia: 210 },
  { faixa: "4k-5k", frequencia: 150 },
  { faixa: "5k+", frequencia: 80 },
];

// Props do componente
interface VisaoGeralHistogramProps {
  data?: DistribuicaoFrequencia[];
}

const chartConfig = {
  frequencia: {
    label: "Frequência",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function VisaoGeralHistogram({ data }: VisaoGeralHistogramProps) {
  const chartData = data && data.length > 0 ? data : mockData;

  return (
    <Card className="container mx-auto flex-1">
      <CardHeader>
        <CardTitle>Distribuição de Frequência por Valor da Nota</CardTitle>
        <CardDescription>
          Histograma da quantidade de notas fiscais por faixa de valor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={40}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="faixa"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => formatNumber(value as number)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="frequencia"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
