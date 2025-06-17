import { useDashboardState } from "@/state/dashboardState";
import { VisaoGeralFilters } from "@/features/visao-geral/components";
import { FormContribuintes, FormConsultas, FormNotasFiscais } from "@/forms";

export const SidebarMenuItems = () => {
  const { tabValue } = useDashboardState();

  switch (tabValue) {
    case "contribuintes":
      return <FormContribuintes />;
    case "consultas":
      return <FormConsultas />;
    case "nfse":
      return <FormNotasFiscais />;
    case "visao-geral":
      return <VisaoGeralFilters />;
    default:
      return null;
  }
};

export default SidebarMenuItems;
