import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  FileBarChart2,
  Settings,
  Menu,
  X,
  Handshake,
  Activity,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import BasicTooltip from "../BasicTooltip";
import {
  importVisaoGeralPage,
  importContribuintesPage,
  importConsultasPage,
  importNotasFiscaisPage,
  importAmbientePage,
  importConveniosPage,
  importVolumetriaPage,
} from "@/routes/pageImports";

const routePrefetchByPath: Record<string, () => Promise<unknown>> = {
  "/visao-geral": importVisaoGeralPage,
  "/contribuintes": importContribuintesPage,
  "/consultas": importConsultasPage,
  "/notas-fiscais": importNotasFiscaisPage,
  "/ambiente": importAmbientePage,
  "/convenios": importConveniosPage,
  "/volumetria": importVolumetriaPage,
};

const navItems = [
  { label: "Visão Geral", to: "/visao-geral", icon: <LayoutDashboard /> },
  { label: "Contribuintes", to: "/contribuintes", icon: <Users /> },
  { label: "Consultas", to: "/consultas", icon: <FileText /> },
  { label: "Notas Fiscais", to: "/notas-fiscais", icon: <FileBarChart2 /> },
  { label: "Ambiente", to: "/ambiente", icon: <Settings /> },
  { label: "Convênios", to: "/convenios", icon: <Handshake /> },
  { label: "Volumetria", to: "/volumetria", icon: <Activity /> },
];

const SidebarNav: React.FC = () => {
  const { open, toggleSidebar } = useSidebar();
  return (
    <nav className="relative flex w-full min-w-0 flex-row items-center border-b border-t border-green-100 bg-green px-2 py-2 shadow-md sm:px-4">
      <div>
        <Button
          onClick={toggleSidebar}
          className="text-white hover:text-green p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-green"
          variant="ghost"
          aria-label={open ? "Fechar menu lateral" : "Abrir menu lateral"}
        >
          <BasicTooltip
            asChild
            content={open ? "Fechar menu lateral" : "Abrir menu lateral"}
          >
            <span>{open ? <X size={22} /> : <Menu size={22} />}</span>
          </BasicTooltip>
        </Button>
      </div>
      <div className="flex min-w-0 flex-1 flex-row justify-center gap-1 overflow-x-auto sm:gap-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onMouseEnter={() => {
              const load = routePrefetchByPath[item.to];
              if (load) void load();
            }}
            className={({ isActive }) =>
              `flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md font-medium transition-colors text-white hover:bg-green-700 hover:text-white border-b-4 text-xs md:text-sm lg:text-base ${isActive
                ? "bg-green-900 text-yellow-300 border-yellow-300 shadow-lg"
                : "border-transparent"
              }`
            }
          >
            {item.icon}
            <span className="hidden sm:inline md:inline lg:inline xl:inline 2xl:inline md:text-sm lg:text-base xl:text-lg">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default SidebarNav;
