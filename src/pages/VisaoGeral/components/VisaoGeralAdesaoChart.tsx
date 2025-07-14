import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { TAdesaoMunicipios } from "@/@types";

interface VisaoGeralAdesaoChartProps {
    data: TAdesaoMunicipios | undefined;
}

export const VisaoGeralAdesaoChart = ({
    data,
}: VisaoGeralAdesaoChartProps) => {
    if (!data) {
        return null;
    }
    const formattedData = data.map(item => ({
        mes_referencia: format(new Date(item.mes_referencia), "MMM/yy", {
            locale: ptBR,
        }),
        "Total Acumulado": item.total_acumulado_municipios,
    }));

    return (
        <Card className="col-span-12">
            <CardHeader>
                <CardTitle >Adesão de Municípios</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>
                        Para melhor compreensão desse gráfico, desmarque a opção <span className="font-bold">MEI</span> e aplique o filtro.
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                        data={formattedData}
                        margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes_referencia" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Total Acumulado"
                            name="Total Acumulado de Municípios"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}; 