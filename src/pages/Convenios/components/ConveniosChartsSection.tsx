import React, { useMemo, useState } from "react";
import { PieChartNFSe } from "@/components/PieChartNFSe";
import DashBarChart from "@/components/DashBarChart";
import { MunicipioStatus } from "@/@types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EficienciaChartModal } from "./EficienciaChartModal";
import { ChartConfig } from "@/components/ui/chart";

interface ConveniosChartsSectionProps {
    data: MunicipioStatus[];
}

const statusColors = [
    "#22c55e", // Conveniado Ativo
    "#f59e42", // Conveniado - Não Ativo
    "#64748b", // Não Conveniado
    "#ef4444", // Erro na Consulta
];

export const ConveniosChartsSection: React.FC<ConveniosChartsSectionProps> = ({ data }) => {
    // Pie chart data (Status de Convênio)
    const pieData = useMemo(() => {
        const statusMap: Record<string, number> = {};
        data.forEach(m => {
            statusMap[m.StatusConvenioSEFIN] = (statusMap[m.StatusConvenioSEFIN] || 0) + 1;
        });
        return Object.entries(statusMap).map(([status, total], idx) => ({
            nameKey: status,
            total,
            fill: statusColors[idx % statusColors.length],
        }));
    }, [data]);

    const pieChartConfig = useMemo(() => {
        const config: ChartConfig = {};
        pieData.forEach(item => {
            config[item.nameKey] = {
                label: item.nameKey,
                color: item.fill,
            };
        });
        return config;
    }, [pieData]);

    // Toggle entre Região Fiscal e Região Geográfica
    const [agrupamento, setAgrupamento] = useState<"regiaoFiscal" | "regiaoGeografica">("regiaoFiscal");

    const regioesMap: { [key: string]: string } = {
        "Norte": "N",
        "Nordeste": "NE",
        "Sul": "S",
        "Sudeste": "SE",
        "Centro-Oeste": "CO"
    };

    const { barData, chartConfig } = useMemo(() => {
        const map: Record<string, { [key: string]: number; total: number }> = {};
        const statusKeys = ["Conveniado Ativo", "Conveniado - Nao Ativo", "Nao Conveniado"];

        data.forEach(m => {
            if (statusKeys.includes(m.StatusConvenioSEFIN)) {
                const key = agrupamento === "regiaoFiscal"
                    ? (m.RegiaoFiscal || "Sem Região Fiscal")
                    : (m.Regiao ? regioesMap[m.Regiao] : "Sem Região");
                if (!map[key]) {
                    map[key] = { total: 0, "Conveniado Ativo": 0, "Conveniado - Nao Ativo": 0, "Nao Conveniado": 0 };
                }
                map[key][m.StatusConvenioSEFIN]++;
                map[key].total++;
            }
        });

        const finalBarData = Object.entries(map).map(([regiao, counts]) => ({
            regiao,
            "Conveniado Ativo": counts.total > 0 ? (counts["Conveniado Ativo"] / counts.total) * 100 : 0,
            "Conveniado - Nao Ativo": counts.total > 0 ? (counts["Conveniado - Nao Ativo"] / counts.total) * 100 : 0,
            "Nao Conveniado": counts.total > 0 ? (counts["Nao Conveniado"] / counts.total) * 100 : 0,
        }));

        const finalChartConfig = {
            "Conveniado Ativo": { label: "Ativo", color: "#22c55e" },
            "Conveniado - Nao Ativo": { label: "Não Ativo", color: "#f59e42" },
            "Nao Conveniado": { label: "Não Conveniado", color: "#64748b" },
        };

        return { barData: finalBarData, chartConfig: finalChartConfig };
    }, [data, agrupamento]);

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="min-w-0">
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle>Distribuição por Status de Convênio</CardTitle>
                        <CardDescription>
                            Este gráfico mostra a quantidade de municípios em cada status de convênio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex justify-center items-center">
                        <PieChartNFSe chartData={pieData} chartConfig={pieChartConfig} />
                    </CardContent>
                </Card>
            </div>
            <div className="min-w-0">
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 min-w-0">
                            <div className="min-w-0">
                                <CardTitle>Distribuição por {agrupamento === "regiaoFiscal" ? "Região Fiscal" : "Região Geográfica"}</CardTitle>
                                <CardDescription>
                                    Percentual de municípios por status de convênio, agrupados por região.
                                </CardDescription>
                            </div>
                            <EficienciaChartModal data={data} />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Button
                                variant={agrupamento === "regiaoFiscal" ? "default" : "outline"}
                                onClick={() => setAgrupamento("regiaoFiscal")}
                            >
                                Região Fiscal
                            </Button>
                            <Button
                                variant={agrupamento === "regiaoGeografica" ? "default" : "outline"}
                                onClick={() => setAgrupamento("regiaoGeografica")}
                            >
                                Região Geográfica
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex justify-center items-center">
                        <DashBarChart
                            chartData={barData}
                            chartConfig={chartConfig}
                            dataKeyX="regiao"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; 