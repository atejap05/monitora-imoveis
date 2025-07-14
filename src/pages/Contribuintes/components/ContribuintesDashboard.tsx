import { useSyncContribuintesData } from "../hooks/useSyncContribuintesData";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { FiltroHeader } from "@/components/Layout/FiltroHeader";
import { ContribuintesKpiCards } from "./ContribuintesKpiCards";
import { ContribuintesTipoTable } from "./ContribuintesTipoTable";
import { ContribuintesBarChart } from "./ContribuintesBarChart";
import { ContribuintesGroupedBarChart } from "./ContribuintesGroupedBarChart";
import { ContribuintesLineChart } from "./ContribuintesLineChart";
import { ContribuintesPieChart } from "./ContribuintesPieChart";
import { MapSkeleton } from "./MapSkeleton";
import { Suspense, lazy } from "react";

// Lazy loading do componente de mapa
const ContribuintesMapChart = lazy(() =>
    import("./ContribuintesMapChart").then(module => ({
        default: module.ContribuintesMapChart
    }))
);

const ContribuintesDashboard = () => {
    useSyncContribuintesData(); // Sincroniza os dados com base nos filtros
    const { submittedFilters, error, isLoading } = useContribuintesFiltersState();

    // Extract years from filters for FiltroHeader
    const returnedYears = submittedFilters?.anos?.map(String) || [];

    if (error) {
        return (
            <div className="px-4 py-4">
                <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
                    Dashboard de Contribuintes
                </h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-medium">Erro ao carregar dados</h3>
                    <p className="text-red-600 mt-1">{error?.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-4">
            {/* Mostra FiltroHeader apenas se não estiver carregando */}
            {!isLoading && submittedFilters && (
                <FiltroHeader
                    submittedFilters={submittedFilters}
                    returnedYears={returnedYears}
                />
            )}

            {/* Área principal do dashboard */}
            <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    <ContribuintesKpiCards />
                </div>

                {/* Mapa de Distribuição */}
                <div className="w-full">
                    <Suspense fallback={<MapSkeleton />}>
                        <ContribuintesMapChart />
                    </Suspense>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ContribuintesBarChart />
                    <ContribuintesGroupedBarChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ContribuintesLineChart />
                    <ContribuintesPieChart />
                </div>

                {/* Tabela detalhada */}
                <div className="w-full">
                    <ContribuintesTipoTable />
                </div>
            </div>
        </div>
    );
};

export default ContribuintesDashboard; 