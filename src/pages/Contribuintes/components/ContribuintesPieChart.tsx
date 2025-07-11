import * as React from "react";
import { Label as ChartLabel, Pie, PieChart } from "recharts";
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
import { Label } from "@/components/ui/label";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { PieChartIcon } from "lucide-react";

const chartConfig = {
    MEI: {
        label: "MEI",
        color: "hsl(var(--chart-1))",
    },
    "ME/EPP": {
        label: "ME/EPP",
        color: "hsl(var(--chart-2))",
    },
    "Não Optante": {
        label: "Não Optante",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export const ContribuintesPieChart = () => {
    const { data, isLoading } = useContribuintesFiltersState();
    const [showLabel, setShowLabel] = React.useState(false);

    const chartData = data?.charts?.composicao_por_tipo || [];

    const totalGeral = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.total_contribuintes, 0);
    }, [chartData]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Composição por Tipo</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Distribuição dos contribuintes <PieChartIcon size={14} />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
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
                    <CardTitle>Composição por Tipo</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        Distribuição dos contribuintes <PieChartIcon size={14} />
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

    // Formata dados para o gráfico de pizza
    const pieData = chartData.map(item => ({
        tipo: item.tipo,
        total_contribuintes: item.total_contribuintes,
        percentual: item.percentual,
        fill: chartConfig[item.tipo as keyof typeof chartConfig]?.color || "hsl(var(--chart-4))"
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Composição por Tipo</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    Distribuição dos contribuintes por regime tributário <PieChartIcon size={14} />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-center space-x-2">
                        <Switch onCheckedChange={setShowLabel} id="label" />
                        <Label htmlFor="label">Mostrar valores</Label>
                    </div>
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[300px] w-full"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel={false} />}
                            />
                            <ChartLegend
                                content={<ChartLegendContent nameKey="tipo" />}
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center mt-2"
                            />
                            <Pie
                                data={pieData}
                                dataKey="total_contribuintes"
                                nameKey="tipo"
                                innerRadius={60}
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
                                                fontSize={12}
                                            >
                                                {`${payload.percentual.toFixed(1)}%`}
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
            </CardContent>
        </Card>
    );
}; 