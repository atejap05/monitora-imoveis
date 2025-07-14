import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { TrendingUp } from "lucide-react";
import { ContribuintesLineChartSkeleton } from "./ContribuintesSkeletons";

const chartConfig = {
    total_contribuintes: {
        label: "Contribuintes",
        color: "hsl(var(--chart-1))",
    },
    novos_contribuintes: {
        label: "Novos Contribuintes",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export const ContribuintesLineChart = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const chartData = data?.charts?.crescimento_anual || [];

    if (isLoading) {
        return <ContribuintesLineChartSkeleton />;
    }

    if (!chartData.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Crescimento Anual</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Evolução da base de contribuintes <TrendingUp size={14} />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="text-muted-foreground">Nenhum dado disponível</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crescimento Anual</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    Evolução da base de contribuintes ao longo dos anos <TrendingUp size={14} />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="ano"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <ChartLegend
                            content={<ChartLegendContent />}
                            className="flex justify-center gap-8 mt-4"
                        />
                        <Line
                            type="monotone"
                            dataKey="total_contribuintes"
                            stroke="var(--color-total_contribuintes)"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="novos_contribuintes"
                            stroke="var(--color-novos_contribuintes)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}; 