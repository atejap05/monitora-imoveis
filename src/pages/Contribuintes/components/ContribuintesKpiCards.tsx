import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { formatNumber } from "@/lib/utils";
import { useMemo } from "react";
import { Users, Building, UserCheck, GitBranch } from "lucide-react";
import DashCard from "@/components/DashCard";
import { ContribuintesKpiSkeleton } from "./ContribuintesSkeletons";

export const ContribuintesKpiCards = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const kpis = useMemo(() => {
        if (!data || !data.tipo_contribuinte_responsavel || !Array.isArray(data.tipo_contribuinte_responsavel)) {
            return {
                totalTomadores: 0,
                totalPrestadores: 0,
                totalContribuintes: 0,
                totalIntermediarios: 0,
            };
        }

        const totalTomadores = data.tipo_contribuinte_responsavel.reduce((sum, item) => sum + (item.total_tomadores ?? 0), 0);
        const totalPrestadores = data.tipo_contribuinte_responsavel.reduce((sum, item) => sum + (item.total_prestadores ?? 0), 0);
        const totalIntermediarios = data.tipo_contribuinte_responsavel.reduce((sum, item) => sum + (item.total_intermediarios ?? 0), 0);
        const totalContribuintes = totalTomadores + totalPrestadores + totalIntermediarios;

        return {
            totalTomadores,
            totalPrestadores,
            totalContribuintes,
            totalIntermediarios,
        };
    }, [data]);

    if (isLoading) {
        return <ContribuintesKpiSkeleton />;
    }

    return (
        <>
            <DashCard
                title="Total de Contribuintes"
                value={formatNumber(kpis.totalContribuintes)}
                description="Todos os tipos de contribuintes"
                icon={<Users className="text-blue-600" />}
            />
            <DashCard
                title="Tomadores"
                value={formatNumber(kpis.totalTomadores)}
                description="Contratantes de serviços"
                icon={<Building className="text-green-600" />}
            />
            <DashCard
                title="Prestadores"
                value={formatNumber(kpis.totalPrestadores)}
                description="Prestadores de serviços"
                icon={<UserCheck className="text-purple-600" />}
            />
            <DashCard
                title="Intermediários"
                value={formatNumber(kpis.totalIntermediarios)}
                description="Intermediadores de serviços"
                icon={<GitBranch className="text-orange-600" />}
            />
        </>
    );
}; 