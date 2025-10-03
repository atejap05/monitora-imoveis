import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { GenericBarChart, GenericPieChart } from "./VolumetriaCharts";
import { TVolumetriaPadraoSemanal } from "@/@types";
import { prepararDadosPieChart } from "./utils";

type Props = {
    padroesSemanais: TVolumetriaPadraoSemanal[];
};

export const VolumetriaPadroesSemanais = ({ padroesSemanais }: Props) => {
    // Dados para gráfico de barras
    const dadosBarra = padroesSemanais.map(item => ({
        name: item.dia_nome,
        value: Math.round(item.volume_medio),
    }));

    // Dados para gráfico de pizza
    const dadosPizza = prepararDadosPieChart(padroesSemanais);

    // Identificar dia de pico e baixa
    const diaPico = padroesSemanais.reduce((max, item) =>
        item.volume_medio > max.volume_medio ? item : max
    );
    const diaBaixo = padroesSemanais.reduce((min, item) =>
        item.volume_medio < min.volume_medio ? item : min
    );
    const diferencaCarga = (
        ((diaPico.volume_medio / diaBaixo.volume_medio - 1) * 100).toFixed(1)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Volume por Dia da Semana */}
            <Card>
                <CardHeader>
                    <CardTitle>Volume por Dia da Semana</CardTitle>
                    <CardDescription>
                        Pico: {diaPico.dia_nome} • Baixa: {diaBaixo.dia_nome} • Diferença:{" "}
                        {diferencaCarga}%
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GenericBarChart
                        data={dadosBarra}
                        xKey="name"
                        dataKey="value"
                        color="#f59e0b"
                        height={300}
                    />
                </CardContent>
            </Card>

            {/* Distribuição Semanal */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribuição Semanal</CardTitle>
                    <CardDescription>
                        Proporção do volume por dia da semana
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GenericPieChart data={dadosPizza} height={300} />
                </CardContent>
            </Card>
        </div>
    );
};

