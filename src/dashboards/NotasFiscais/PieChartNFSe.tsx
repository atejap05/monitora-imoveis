import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label as ChartLabel, Pie, PieChart } from "recharts";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";

const chartConfig = {
  total: {
    label: "Total",
  },
  nao_optante: {
    label: "Não Optante",
    color: "hsl(var(--chart-1))",
  },
  mei: {
    label: "MEI",
    color: "hsl(var(--chart-2))",
  },
  me_epp: {
    label: "ME/EPP",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type ChartData = Array<{
  emitente: string;
  total: number;
  fill: string;
}>;

type PieChartNFSeProps = {
  chartData: ChartData;
  ano: string;
};

export function PieChartNFSe({ chartData, ano }: PieChartNFSeProps) {
  const [showLabel, setShowLabel] = React.useState(false);
  const totalGeral = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.total, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col gap-3 w-2/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total de NFSe</CardTitle>
        <CardDescription className="flex items-center gap-1 text-muted-foreground">
          <p>NFSe disponíveis no RD para o ano de {ano}</p>
          <TrendingUp className="h-4 w-4" />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 my-3 pb-0 ">
        <div className="flex items-center space-x-2">
          <Switch onCheckedChange={setShowLabel} id="label" />
          <Label htmlFor="label">Label</Label>
        </div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={true} />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="emitente" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center mt-2"
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="emitente"
              innerRadius={80}
              strokeWidth={0}
              label={
                showLabel
                  ? ({ payload, ...props }) => (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="hsla(var(--foreground))"
                      >
                        {payload.total.toLocaleString()}
                      </text>
                    )
                  : undefined
              }
            >
              <ChartLabel
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalGeral.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
