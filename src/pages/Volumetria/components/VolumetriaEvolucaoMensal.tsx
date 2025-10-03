import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { GenericLineChart, GenericBarChart } from "./VolumetriaCharts";
import {
    TVolumetriaEvolucaoMensal,
    TVolumetriaSazonalidade,
} from "@/@types";

type Props = {
    evolucaoMensal: TVolumetriaEvolucaoMensal[];
    sazonalidade: TVolumetriaSazonalidade[];
};

export const VolumetriaEvolucaoMensal = ({
    evolucaoMensal,
    sazonalidade,
}: Props) => {
    // Preparar dados para gráfico de linha (evolução temporal)
    const dadosLinha = evolucaoMensal.map(item => ({
        name: item.periodo,
        volumeTotal: item.volume_total,
        volumeMedio: Math.round(item.volume_medio_dia),
    }));

    // Preparar dados para gráfico de barras (sazonalidade)
    const dadosBarraSazonalidade = sazonalidade.map(item => ({
        name: item.mes_nome,
        value: Math.round(item.media),
    }));

    // Identificar picos sazonais
    const mesMaior = sazonalidade.reduce((max, item) =>
        item.media > max.media ? item : max
    );
    const mesMenor = sazonalidade.reduce((min, item) =>
        item.media < min.media ? item : min
    );
    const diferencaSazonal = (
        ((mesMaior.media / mesMenor.media - 1) * 100).toFixed(1)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Evolução Temporal */}
            <Card>
                <CardHeader>
                    <CardTitle>Evolução Temporal</CardTitle>
                    <CardDescription>Volume total e médio diário por mês</CardDescription>
                </CardHeader>
                <CardContent>
                    <GenericLineChart
                        data={dadosLinha}
                        xKey="name"
                        lines={[
                            {
                                dataKey: "volumeTotal",
                                name: "Volume Total",
                                color: "#22c55e",
                            },
                            {
                                dataKey: "volumeMedio",
                                name: "Média Diária",
                                color: "#3b82f6",
                            },
                        ]}
                        height={300}
                    />
                </CardContent>
            </Card>

            {/* Sazonalidade */}
            <Card>
                <CardHeader>
                    <CardTitle>Sazonalidade Mensal</CardTitle>
                    <CardDescription>
                        Maior: {mesMaior.mes_nome} • Menor: {mesMenor.mes_nome} • Variação:{" "}
                        {diferencaSazonal}%
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GenericBarChart
                        data={dadosBarraSazonalidade}
                        xKey="name"
                        dataKey="value"
                        color="#8b5cf6"
                        height={300}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

