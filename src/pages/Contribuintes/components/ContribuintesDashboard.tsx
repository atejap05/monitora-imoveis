import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { FiltroHeader } from "@/components/Layout/FiltroHeader";
import { ContribuintesKpiCards } from "./ContribuintesKpiCards";
import { ContribuintesTipoTable } from "./ContribuintesTipoTable";

const ContribuintesDashboard = () => {
    const { submittedFilters, error } = useContribuintesFiltersState();

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

    // A partir daqui, `submittedFilters` existe.
    return (
        <div className="px-4 py-4">
            <FiltroHeader
                submittedFilters={submittedFilters}
                returnedYears={returnedYears}
            />

            {/* Área principal do dashboard */}
            <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    <ContribuintesKpiCards />
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