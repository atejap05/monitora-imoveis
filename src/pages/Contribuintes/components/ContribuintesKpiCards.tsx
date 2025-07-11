import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";
import { Users, Building, UserCheck, GitBranch } from "lucide-react";
import DashCard from "@/components/DashCard";

export const ContribuintesKpiCards = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const kpis = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            return {
                totalTomadores: 0,
                totalPrestadores: 0,
                totalContribuintes: 0,
                totalIntermediarios: 0,
            };
        }

        const totalTomadores = data.reduce((sum, item) => sum + item.total_tomadores, 0);
        const totalPrestadores = data.reduce((sum, item) => sum + item.total_prestadores, 0);
        const totalIntermediarios = data.reduce((sum, item) => sum + item.total_intermediarios, 0);
        const totalContribuintes = totalTomadores + totalPrestadores + totalIntermediarios;

        return {
            totalTomadores,
            totalPrestadores,
            totalContribuintes,
            totalIntermediarios,
        };
    }, [data]);

    if (isLoading) {
        return (
            <>
                <DashCard isPending title="" value="" description="" />
                <DashCard isPending title="" value="" description="" />
                <DashCard isPending title="" value="" description="" />
                <DashCard isPending title="" value="" description="" />
            </>
        );
    }

    return (
        <>
            <DashCard
                title="Total de Tomadores"
                description="Número de tomadores de serviço"
                value={formatNumber(kpis.totalTomadores)}
                icon={<Users size={18} />}
            />
            <DashCard
                title="Total de Prestadores"
                description="Número de prestadores de serviço"
                value={formatNumber(kpis.totalPrestadores)}
                icon={<Building size={18} />}
            />
            <DashCard
                title="Total de Intermediários"
                description="Número de intermediários de serviço"
                value={formatNumber(kpis.totalIntermediarios)}
                icon={<GitBranch size={18} />}
            />
            <DashCard
                title="Total de Contribuintes"
                description="Soma de tomadores e prestadores"
                value={formatNumber(kpis.totalContribuintes)}
                icon={<UserCheck size={18} />}
            />

        </>
    );
}; 