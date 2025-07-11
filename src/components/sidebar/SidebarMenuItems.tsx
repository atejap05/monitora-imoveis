import { VisaoGeralFilters } from "@/pages/VisaoGeral/components";
import { NotasFiscaisFilters } from "@/pages/NotasFiscais/components/NotasFiscaisFilters";
import { FormConsultas } from "@/pages/Consultas/components/FormConsultas";
import { useConsultasState } from "@/pages/Consultas/hooks/useConsultasState";
import { useLocation } from "react-router-dom";
import { ConveniosFilters } from "@/pages/Convenios/components/ConveniosFilters";
import { useConveniosData } from "@/pages/Convenios/hooks/useConveniosData";
import { AmbienteFilters } from "@/pages/Ambiente/components/AmbienteFilters";
import { ContribuintesFilters } from "@/pages/Contribuintes/components/ContribuintesFilters";

export const SidebarMenuItems = () => {
  const location = useLocation();
  // Chame todos os hooks no topo, SEM condicional
  const consultasState = useConsultasState();
  const conveniosData = useConveniosData();

  switch (location.pathname) {
    case "/visao-geral":
      return <VisaoGeralFilters />;
    case "/consultas": {
      const { isPending, submitConsulta } = consultasState;
      return <FormConsultas onSubmit={submitConsulta} isPending={isPending} />;
    }
    case "/convenios": {
      const { status } = conveniosData;
      const isLoading = status !== "success";
      return <ConveniosFilters isLoading={isLoading} />;
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
