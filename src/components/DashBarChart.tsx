import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartData = Record<string, number | string>;

const DashBarChart = ({
  chartData,
  chartConfig,
  barDataKey,
  dataKeyX,
}: {
  chartData: ChartData[];
  chartConfig: ChartConfig;
  barDataKey: string;
  dataKeyX: string;
}) => {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={dataKeyX}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          // tickFormatter={value => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={barDataKey} fill={"#709f77"} radius={4}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: number) => value.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default DashBarChart;
