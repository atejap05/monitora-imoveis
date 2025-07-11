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
import { MapPin } from "lucide-react";

const chartConfig = {
    total_contribuintes: {
        label: "Contribuintes",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export const ContribuintesMapChart = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const chartData = data?.charts?.mapa_uf || [];

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Concentração por UF</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Distribuição de contribuintes <MapPin size={14} />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="animate-pulse text-muted-foreground">
                            Carregando mapa...
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!chartData.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Concentração por UF</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Distribuição de contribuintes <MapPin size={14} />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="text-muted-foreground">Nenhum dado disponível</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Ordena por total de contribuintes em ordem decrescente
    const sortedData = [...chartData]
        .sort((a, b) => b.total_contribuintes - a.total_contribuintes)
        .slice(0, 15); // Top 15 UFs

    return (
        <Card>
            <CardHeader>
                <CardTitle>Concentração por UF</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    Top 15 estados por número de contribuintes <MapPin size={14} />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={sortedData}
                        layout="horizontal"
                        margin={{ left: 40, right: 20 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="uf"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={40}
                        />
                        <XAxis
                            type="number"
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