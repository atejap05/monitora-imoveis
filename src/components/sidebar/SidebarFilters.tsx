import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarMenuItems from "./SidebarMenuItems";
import { Separator } from "@/components/ui/separator";
import { FilterIcon } from "lucide-react";

//Visite https://ui.shadcn.com/docs/components/sidebar para mais informações sobre o componente Sidebar.
const SidebarFilters = () => {
  return (
    <Sidebar className="mt-[6.5rem]">
      {/* TODO: Implementar Header */}
      <SidebarHeader className="mt-4">
        <span className="text-lg font-bold flex items-center justify-center gap-2 text-green">
          <FilterIcon />
          Filtros
        </span>
        <Separator
          orientation="horizontal"
          decorative={true}
          className="text-green"
        />
      </SidebarHeader>
      <SidebarContent>
        {/* TODO: Implementar grupo 2 de item aqui */}
        <SidebarMenuItems />
      </SidebarContent>

      {/* TODO: Imoplementar Footer */}
      <SidebarFooter />
    </Sidebar>
  );
};

export default SidebarFilters;
