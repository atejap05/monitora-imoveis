import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
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
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
