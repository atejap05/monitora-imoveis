import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import type { TConsultaNFSeTotaisMeiAmbiente } from "@/@types"; // Import the type

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

// Define props for the component
interface VisaoGeralLineChartProps {
  chartData?: TConsultaNFSeTotaisMeiAmbiente;
}

const chartConfig = {
  app: {
    label: "App",
    color: "hsl(var(--chart-1))",
  },
  web: {
    label: "Web",
    color: "hsl(var(--chart-2))",
  },
  webservice: {
    label: "Webservice",
    color: "hsl(var(--chart-3))",
  },
  proprio: {
    label: "Próprio",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function VisaoGeralLineChart({ chartData }: VisaoGeralLineChartProps) {
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="container mx-auto">
        <CardHeader>
          <CardTitle>Emissões por Ambiente</CardTitle>
          <CardDescription>
            Dados de emissões por ambiente ao longo dos anos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Não há dados disponíveis para exibir o gráfico.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="container mx-auto flex-1">
      {" "}
      {/* Added flex-1 for better layout if needed */}
      <CardHeader>
        <CardTitle>Emissões por Ambiente</CardTitle>
        <CardDescription>
          Quantidade de emissões por ambiente ao longo dos anos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year" // Use 'year' for X-axis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={true} // Enable cursor for better UX
              content={<ChartTooltipContent />} // Use default content or customize as needed
            />
            <Legend />
            <Line
              dataKey="app"
              type="monotone" // Changed type for potentially smoother lines
              stroke={chartConfig.app.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="web"
              type="monotone"
              stroke={chartConfig.web.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="webservice"
              type="monotone"
              stroke={chartConfig.webservice.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="proprio"
              type="monotone"
              stroke={chartConfig.proprio.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
