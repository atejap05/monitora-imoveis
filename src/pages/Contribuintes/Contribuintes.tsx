import ContribuintesDashboard from "./components/ContribuintesDashboard";
import { useSyncContribuintesData } from "./hooks/useSyncContribuintesData";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { ContribuintesWelcome } from "./components/ContribuintesWelcome";

const Contribuintes: React.FC = () => {
  const { submittedFilters, data, isLoading } = useContribuintesFiltersState();

  // Hook para sincronizar os dados do dashboard com o estado de filtros
  useSyncContribuintesData();

  // A consulta é considerada iniciada se os filtros foram submetidos
  // ou se, por algum motivo (ex: cache), já temos dados.
  const consultaIniciada = !!(submittedFilters || data);

  if (!consultaIniciada && !isLoading) {
    return <ContribuintesWelcome />;
  }

  return <ContribuintesDashboard />;
};

export default Contribuintes;
