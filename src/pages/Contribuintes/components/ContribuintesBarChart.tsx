import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { Building2 } from "lucide-react";
import { ContribuintesChartSkeleton } from "./ContribuintesSkeletons";

const chartConfig = {
    total_contribuintes: {
        label: "Contribuintes",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export const ContribuintesBarChart = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const chartData = data?.charts?.top_municipios || [];

    if (isLoading) {
        return <ContribuintesChartSkeleton />;
    }

    if (!chartData.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Municípios</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Maiores concentrações de contribuintes <Building2 size={14} />
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

    // Pega apenas os top 10 e formata para exibição
    const top10Data = chartData.slice(0, 10).map(item => ({
        ...item,
        label: `${item.municipio}/${item.uf}`,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 Municípios</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    Maiores concentrações de contribuintes <Building2 size={14} />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={top10Data}
                        margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={12}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="total_contribuintes"
                            fill="var(--color-total_contribuintes)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}; 