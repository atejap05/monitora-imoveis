import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/chart";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
    faturamento_total: {
        label: "Faturamento",
        color: "hsl(var(--chart-3))",
    },
    percentual_faturamento: {
        label: "Percentual",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

export const ContribuintesGroupedBarChart = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const chartData = data?.charts?.faturamento_por_tipo || [];

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Faturamento por Tipo</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Comparação de faturamento por regime tributário <TrendingUp size={14} />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="animate-pulse text-muted-foreground">
                            Carregando gráfico...
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
                    <CardTitle>Faturamento por Tipo</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Comparação de faturamento por regime tributário <TrendingUp size={14} />
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
                <CardTitle>Faturamento por Tipo</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    Comparação de faturamento por regime tributário <TrendingUp size={14} />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tipo"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                if (value >= 1000000000) {
                                    return `R$ ${(value / 1000000000).toFixed(1)}B`;
                                } else if (value >= 1000000) {
                                    return `R$ ${(value / 1000000).toFixed(1)}M`;
                                } else if (value >= 1000) {
                                    return `R$ ${(value / 1000).toFixed(1)}K`;
                                }
                                return `R$ ${value}`;
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                                            <p className="font-medium">{label}</p>
                                            <p className="text-sm">
                                                <span className="font-medium">Faturamento:</span>{" "}
                                                {formatCurrency(payload[0].value as number)}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Participação:</span>{" "}
                                                {chartData.find(item => item.tipo === label)?.percentual_faturamento.toFixed(1)}%
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="faturamento_total"
                            fill="var(--color-faturamento_total)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}; 