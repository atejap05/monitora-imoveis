import { useDashboardState } from "@/state/dashboardState";
import { VisaoGeralFilters } from "@/pages/VisaoGeral/components";

export const SidebarMenuItems = () => {
  const { tabValue } = useDashboardState();

  switch (tabValue) {
    case "visao-geral":
      return <VisaoGeralFilters />;
    default:
      return null;
  }
};

export default SidebarMenuItems;
