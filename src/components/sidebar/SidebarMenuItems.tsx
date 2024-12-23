import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ITEMS } from "./menu_items";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormContribuintes } from "@/forms/form-contribuintes/FormContribuintes";
import { useDashboardState } from "@/state/dashboardState";

export const SidebarMenuItems = () => {
  const { tabValue } = useDashboardState();
  return (
    <SidebarMenu className="px-4 ">
      {tabValue === "contribuintes" ? (
        <FormContribuintes />
      ) : (
        ITEMS.map(item => (
          <SidebarMenuItem key={item.label} className="mb-4">
            <Label className="text-green font-bold">{item.label}</Label>
            <Input className="bg-white" placeholder={item.placeholder} />
          </SidebarMenuItem>
        ))
      )}
    </SidebarMenu>
  );
};

export default SidebarMenuItems;
