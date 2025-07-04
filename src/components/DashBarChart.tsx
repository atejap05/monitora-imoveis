import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,

} from "@/components/ui/chart";

type ChartData = Record<string, number | string>;

const CustomTooltipContent = ({ active, payload, label, config }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-xs bg-background border rounded-lg shadow-sm">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <p>{config[p.dataKey]?.label || p.dataKey}:</p>
            <p className="font-medium ml-auto">{`${Number(p.value).toFixed(1)}%`}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DashBarChart = ({
  chartData,
  chartConfig,
  dataKeyX,
}: {
  chartData: ChartData[];
  chartConfig: ChartConfig;
  dataKeyX: string;
}) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey={dataKeyX}
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={120}
        />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${(Number(value)).toFixed(0)}%`} />
        <ChartTooltip
          cursor={false}
          content={<CustomTooltipContent config={chartConfig} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartConfig).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={chartConfig[key].color}
            stackId="a"
            radius={0}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default DashBarChart;
