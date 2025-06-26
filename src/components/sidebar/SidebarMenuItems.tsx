import { VisaoGeralFilters } from "@/pages/VisaoGeral/components";
import { FormConsultas } from "@/pages/Consultas/components/FormConsultas";
import { useConsultasState } from "@/pages/Consultas/hooks/useConsultasState";
import { useLocation } from "react-router-dom";

export const SidebarMenuItems = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/visao-geral":
      return <VisaoGeralFilters />;
    case "/consultas": {
      const { isPending, submitConsulta } = useConsultasState();
      return <FormConsultas onSubmit={submitConsulta} isPending={isPending} />;
    }
    default:
      return null;
  }
};

export default SidebarMenuItems;
