import React, { useMemo, useState } from "react";
import { MunicipioStatus } from "@/@types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { TrendingUp } from "lucide-react";

interface EficienciaChartModalProps {
    data: MunicipioStatus[];
}

export const EficienciaChartModal: React.FC<EficienciaChartModalProps> = ({ data }) => {
    const [agrupamento, setAgrupamento] = useState<"regiaoFiscal" | "regiaoGeografica">("regiaoFiscal");

    const eficienciaData = useMemo(() => {
        const map: Record<string, { conveniadoAtivo: number; conveniadoNaoAtivo: number }> = {};

        data.forEach(m => {
            const key = agrupamento === "regiaoFiscal" ? (m.RegiaoFiscal || "Sem Região Fiscal") : (m.Regiao || "Sem Região");
            if (!map[key]) {
                map[key] = { conveniadoAtivo: 0, conveniadoNaoAtivo: 0 };
            }
            if (m.StatusConvenioSEFIN === "Conveniado Ativo") {
                map[key].conveniadoAtivo++;
            }
            if (m.StatusConvenioSEFIN === "Conveniado - Nao Ativo") {
                map[key].conveniadoNaoAtivo++;
            }
        });

        return Object.entries(map)
            .map(([regiao, counts]) => {
                const totalConveniados = counts.conveniadoAtivo + counts.conveniadoNaoAtivo;
                const eficiencia = totalConveniados > 0 ? (counts.conveniadoAtivo / totalConveniados) * 100 : 0;
                return { regiao, eficiencia };
            })
            .sort((a, b) => b.eficiencia - a.eficiencia);

    }, [data, agrupamento]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Ver Eficiência
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Eficiência de Convênios por Região</DialogTitle>
                    <DialogDescription>
                        Este gráfico mostra a taxa de atividade entre os municípios conveniados (Ativos / (Ativos + Não Ativos)), por região.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 my-4">
                    <Button variant={agrupamento === "regiaoFiscal" ? "default" : "outline"} onClick={() => setAgrupamento("regiaoFiscal")}>
                        Região Fiscal
                    </Button>
                    <Button variant={agrupamento === "regiaoGeografica" ? "default" : "outline"} onClick={() => setAgrupamento("regiaoGeografica")}>
                        Região Geográfica
                    </Button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={eficienciaData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" unit="%" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
                        <YAxis dataKey="regiao" type="category" width={120} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        <Bar dataKey="eficiencia" fill="#22c55e" radius={[0, 4, 4, 0]}>
                            <LabelList dataKey="eficiencia" position="right" formatter={(value: number) => `${value.toFixed(1)}%`} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </DialogContent>
        </Dialog>
    );
}; 