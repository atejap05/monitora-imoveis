import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ITEMS } from "./menu_items";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormContribuintes, FormConsultas, FormNotasFiscais } from "@/forms";
import { VisaoGeralFilters } from "@/features/visao-geral/components";
import { useDashboardState } from "@/state/dashboardState";

export const SidebarMenuItems = () => {
  const { tabValue } = useDashboardState();

  const renderForm = () => {
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
        return ITEMS.map(item => (
          <SidebarMenuItem key={item.label} className="mb-4">
            <Label className="text-green font-bold">{item.label}</Label>
            <Input className="bg-white" placeholder={item.placeholder} />
          </SidebarMenuItem>
        ));
    }
  };

  return <SidebarMenu className="px-4 ">{renderForm()}</SidebarMenu>;
};

export default SidebarMenuItems;
