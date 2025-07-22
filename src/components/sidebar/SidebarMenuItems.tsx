import { VisaoGeralFilters } from "@/pages/VisaoGeral/components";
import { NotasFiscaisFilters } from "@/pages/NotasFiscais/components/NotasFiscaisFilters";
import { FormConsultas } from "@/pages/Consultas/components/FormConsultas";
import { useConsultasState } from "@/pages/Consultas/hooks/useConsultasState";
import { useLocation } from "react-router-dom";
import { ConveniosFiltersWrapper } from "@/pages/Convenios/components/ConveniosFiltersWrapper";
import { AmbienteFilters } from "@/pages/Ambiente/components/AmbienteFilters";
import { ContribuintesFilters } from "@/pages/Contribuintes/components/ContribuintesFilters";

export const SidebarMenuItems = () => {
  const location = useLocation();
  // Chame todos os hooks no topo, SEM condicional
  const consultasState = useConsultasState();

  switch (location.pathname) {
    case "/visao-geral":
      return <VisaoGeralFilters />;
    case "/consultas": {
      const { isPending, submitConsulta } = consultasState;
      return <FormConsultas onSubmit={submitConsulta} isPending={isPending} />;
    }
    case "/convenios": {
      // Usar wrapper que só carrega o hook quando necessário
      return <ConveniosFiltersWrapper />;
    }
    case "/notas-fiscais":
      return <NotasFiscaisFilters />;
    case "/ambiente":
      return <AmbienteFilters />;
    case "/contribuintes":
      return <ContribuintesFilters />;
    default:
      return null;
  }
};

export default SidebarMenuItems;
