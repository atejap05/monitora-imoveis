import { useEffect } from "react";
import VisaoGeralDashboard from "./components/VisaoGeralDashboard";
import { useSyncVisaoGeralData } from "./hooks/useSyncVisaoGeralData";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState";


const VisaoGeral = () => {
  const { submittedFilters, submitFilters, filters } =
    useVisaoGeralFiltersState();

  // Hook para sincronizar os dados do dashboard com o estado de filtros
  useSyncVisaoGeralData();

  useEffect(() => {
    // Se nenhum filtro foi submetido ainda (primeiro carregamento),
    // submete os filtros iniciais para carregar os dados.
    if (!submittedFilters) {
      submitFilters(filters);
    }
  }, [submittedFilters, submitFilters, filters]);

  return <VisaoGeralDashboard />;
};

export default VisaoGeral;
