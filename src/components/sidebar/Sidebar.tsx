import React from "react";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { FilterIcon } from "lucide-react";
import logonfse from "../../assets/logo-nfse-horizontal-removebg.png";

const Sidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { open } = useSidebar();
  return (
    <ShadcnSidebar
      className={`h-screen transition-all duration-300 ${
        !open ? "w-0 min-w-0 overflow-hidden" : ""
      }`}
      style={{
        width: open ? undefined : 0,
        minWidth: open ? undefined : 0,
        overflowY: open ? "auto" : "hidden",
      }}
    >
      {open && (
        <>
          <SidebarHeader>
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <img
                className="w-36 h-8 pb-2 sm:w-40 sm:h-10 md:w-44 md:h-12 lg:w-56 lg:h-14"
                src={logonfse}
                alt="Logo NFSe"
              />
              <Separator className="bg-green" />
            </div>
            <span className="text-lg font-bold flex items-center justify-center gap-2 text-green mt-2">
              <FilterIcon />
              Filtros
            </span>
            <Separator
              orientation="horizontal"
              decorative={true}
              className="text-green"
            />
          </SidebarHeader>
          <SidebarContent className="px-4">{children}</SidebarContent>
          <SidebarFooter />
        </>
      )}
    </ShadcnSidebar>
  );
};

export default Sidebar;
