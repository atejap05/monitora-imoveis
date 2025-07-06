import { VisaoGeralFilters } from "@/pages/VisaoGeral/components";
import { NotasFiscaisFilters } from "@/pages/NotasFiscais/components/NotasFiscaisFilters";
import { FormConsultas } from "@/pages/Consultas/components/FormConsultas";
import { useConsultasState } from "@/pages/Consultas/hooks/useConsultasState";
import { useLocation } from "react-router-dom";
import { ConveniosFilters } from "@/pages/Convenios/components/ConveniosFilters";
import { useConveniosData } from "@/pages/Convenios/hooks/useConveniosData";

export const SidebarMenuItems = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/visao-geral":
      return <VisaoGeralFilters />;
    case "/consultas": {
      const { isPending, submitConsulta } = useConsultasState();
      return <FormConsultas onSubmit={submitConsulta} isPending={isPending} />;
    }
    case "/convenios": {
      const { status } = useConveniosData();
      const isLoading = status !== "success";
      return <ConveniosFilters isLoading={isLoading} />;
    }
    case "/notas-fiscais":
      return <NotasFiscaisFilters />;
    default:
      return null;
  }
};

export default SidebarMenuItems;
