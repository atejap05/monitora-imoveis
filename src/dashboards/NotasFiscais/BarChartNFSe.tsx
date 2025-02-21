import { BarChart4Icon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartData = Array<{
  year: string;
  app: number;
  web: number;
  webservice: number;
  proprio: number;
}>;

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
    label: "Proprio",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type BarChartNFSeProps = {
  chartData: ChartData;
};

export function BarChartNFSe({ chartData }: BarChartNFSeProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-0">
        <CardTitle>Ambiente de Emissão</CardTitle>
        <CardDescription className="flex items-center gap-2">
          NFS-e MEI <BarChart4Icon size={14} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              className="flex justify-center sm:gap-4 md:gap-8"
            />

            <Bar dataKey="app" fill="var(--color-app)" radius={4} />
            <Bar dataKey="web" fill="var(--color-web)" radius={4} />
            <Bar
              dataKey="webservice"
              fill="var(--color-webservice)"
              radius={4}
            />
            <Bar dataKey="proprio" fill="var(--color-proprio)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
