import DashCard from "@/components/DashCard";
import { MunicipioStatus } from "@/@types";
import { Users, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";

interface ConveniosKpiCardsProps {
    data: MunicipioStatus[];
}

export const ConveniosKpiCards: React.FC<ConveniosKpiCardsProps> = ({ data }) => {
    // Cálculos dos KPIs
    const total = data.length;
    const conveniadosAtivos = data.filter(m => m.StatusConvenioSEFIN === "Conveniado Ativo").length;
    const conveniadosNaoAtivos = data.filter(m => m.StatusConvenioSEFIN === "Conveniado - Nao Ativo").length;
    const naoConveniados = data.filter(m => m.StatusConvenioSEFIN === "Nao Conveniado").length;
    const erroConsulta = data.filter(m => m.StatusConvenioSEFIN === "Erro na Consulta").length;
    const ativosUltimoPeriodo = data.filter(m => m.AtivoUltimoPeriodo === "Sim").length;
    const ativosNaBase = data.filter(m => m.AtivoNaBase === "Sim").length;
    const semAtividade = data.filter(m => !m.UltimaAtividade).length;

    return (
        <div className="w-full mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <DashCard
                    title="Total de Municípios"
                    value={total.toLocaleString("pt-BR")}
                    description="Municípios analisados"
                    icon={<Users />}
                />
                <DashCard
                    title="Conveniados Ativos"
                    value={conveniadosAtivos.toLocaleString("pt-BR")}
                    description="Status SEFIN: Ativo"
                    icon={<CheckCircle />}
                />
                <DashCard
                    title="Conveniados Não Ativos"
                    value={conveniadosNaoAtivos.toLocaleString("pt-BR")}
                    description="Status SEFIN: Não Ativo"
                    icon={<XCircle />}
                />
                <DashCard
                    title="Não Conveniados"
                    value={naoConveniados.toLocaleString("pt-BR")}
                    description="Status SEFIN: Não Conveniado"
                    icon={<AlertTriangle />}
                />
                <DashCard
                    title="Com Erro na Consulta"
                    value={erroConsulta.toLocaleString("pt-BR")}
                    description="Erro na consulta SEFIN"
                    icon={<AlertTriangle color='#eab308' />}
                />
                <DashCard
                    title="Ativos no Último Período"
                    value={ativosUltimoPeriodo.toLocaleString("pt-BR")}
                    description="Municípios com atividade recente"
                    icon={<Activity />}
                />
                <DashCard
                    title="Ativos na Base"
                    value={ativosNaBase.toLocaleString("pt-BR")}
                    description="Municípios com NFS-e na base"
                    icon={<CheckCircle color='#22c55e' />}
                />
                <DashCard
                    title="Sem Atividade Registrada"
                    value={semAtividade.toLocaleString("pt-BR")}
                    description="Municípios que nunca enviaram NFS-e"
                    icon={<XCircle color="#ef4444" />}
                />
            </div>
        </div>
    );
}; 