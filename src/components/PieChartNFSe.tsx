import * as React from "react";
import { Label as ChartLabel, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ChartData = Array<{
  nameKey: string;
  total: number;
  fill: string;
}>;

type PieChartNFSeProps = {
  chartData: ChartData;
  chartConfig: ChartConfig;
};

export function PieChartNFSe({ chartData, chartConfig }: PieChartNFSeProps) {
  const [showLabel, setShowLabel] = React.useState(false);
  const totalGeral = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.total, 0);
  }, [chartData]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col items-center space-y-2">
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
            content={<ChartTooltipContent hideLabel={false} />}
          />
          <ChartLegend
            content={<ChartLegendContent nameKey="nameKey" />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center mt-2"
          />
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="nameKey"
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
    </div>
  );
}
