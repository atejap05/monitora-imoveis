import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { GenericBarChart } from "./VolumetriaCharts";
import { TVolumetriaPadraoHorario } from "@/@types";

type Props = {
    padroesHorarios: TVolumetriaPadraoHorario[];
};

export const VolumetriaPadroesHorarios = ({ padroesHorarios }: Props) => {
    if (!padroesHorarios || padroesHorarios.length === 0) {
        return (
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Padrões Horários</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-8">
                        Dados de horário não disponíveis para análise
                    </p>
                </CardContent>
            </Card>
        );
    }

    const dadosBarra = padroesHorarios.map(item => ({
        name: `${item.hora}h`,
        value: Math.round(item.volume_medio),
    }));

    const horaPico = padroesHorarios.reduce((max, item) =>
        item.volume_medio > max.volume_medio ? item : max
    );
    const horaBaixa = padroesHorarios.reduce((min, item) =>
        item.volume_medio < min.volume_medio ? item : min
    );

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Padrões Horários de Processamento</CardTitle>
                <CardDescription>
                    Pico: {horaPico.hora}h (
                    {Math.round(horaPico.volume_medio).toLocaleString("pt-BR")} NFSe) •
                    Baixa: {horaBaixa.hora}h (
                    {Math.round(horaBaixa.volume_medio).toLocaleString("pt-BR")} NFSe)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GenericBarChart
                    data={dadosBarra}
                    xKey="name"
                    dataKey="value"
                    color="#ef4444"
                    height={300}
                />
            </CardContent>
        </Card>
    );
};

