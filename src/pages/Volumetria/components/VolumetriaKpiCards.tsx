import { CardValor } from "@/components/CardValor";
import { TVolumetriaKpis } from "@/@types";
import { FileText, Calendar, Building2, TrendingUp } from "lucide-react";

type Props = {
    kpis: TVolumetriaKpis;
};

export const VolumetriaKpiCards = ({ kpis }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <CardValor
                icon={<FileText className="w-6 h-6" />}
                title="Total Processadas"
                value={kpis.total_nfse_processadas.toLocaleString("pt-BR")}
                description="NFSe no período"
            />
            <CardValor
                icon={<TrendingUp className="w-6 h-6" />}
                title="Média Diária"
                value={Math.round(kpis.volume_medio_diario).toLocaleString("pt-BR")}
                description="NFSe por dia"
            />
            <CardValor
                icon={<Building2 className="w-6 h-6" />}
                title="Municípios Ativos"
                value={kpis.municipios_unicos.toLocaleString("pt-BR")}
                description="Diferentes municípios"
            />
            <CardValor
                icon={<Calendar className="w-6 h-6" />}
                title="Período Analisado"
                value={`${kpis.total_registros} dias`}
                description={`${kpis.periodo_inicial} - ${kpis.periodo_final}`}
            />
        </div>
    );
};

