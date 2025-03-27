import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
const chartData = [
  { faixa: "0-500", frequencia: 5000, mobile: 80 },
  { faixa: "501-1000", frequencia: 305, mobile: 200 },
  { faixa: "1001-1500", frequencia: 237, mobile: 120 },
  { faixa: "1501-2000", frequencia: 73, mobile: 190 },
  { faixa: "2001-2500", frequencia: 209, mobile: 130 },
  { faixa: "2501-3000", frequencia: 214, mobile: 140 },
];

const chartConfig = {
  frequencia: {
    label: "Frequência",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BasicLineChart() {
  return (
    <Card className="container mx-auto">
      <CardHeader>
        <CardTitle>Histograma</CardTitle>
        <CardDescription>
          Histograma de distribuição de frequência
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="faixa"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="frequencia"
              type="natural"
              stroke="#709f77"
              strokeWidth={2}
              dot={{
                fill: "#709f77",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
