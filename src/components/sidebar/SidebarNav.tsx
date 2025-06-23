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
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import BasicTooltip from "../BasicTooltip";

const navItems = [
  { label: "Visão Geral", to: "/visao-geral", icon: <LayoutDashboard /> },
  { label: "Contribuintes", to: "/contribuintes", icon: <Users /> },
  { label: "Consultas", to: "/consultas", icon: <FileText /> },
  { label: "Notas Fiscais", to: "/notas-fiscais", icon: <FileBarChart2 /> },
  { label: "Ambiente", to: "/ambiente", icon: <Settings /> },
];

const SidebarNav: React.FC = () => {
  const { open, toggleSidebar } = useSidebar();
  return (
    <nav className="flex flex-row w-full px-2 sm:px-4 py-2 border-t border-b border-green-100 bg-green items-center relative shadow-md">
      <div className="flex flex-1">
        <Button
          onClick={toggleSidebar}
          className="text-white hover:text-green p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-green"
          variant="ghost"
          aria-label={open ? "Fechar menu lateral" : "Abrir menu lateral"}
        >
          <BasicTooltip
            label={open ? <X size={22} /> : <Menu size={22} />}
            content={open ? "Fechar menu lateral" : "Abrir menu lateral"}
          />
        </Button>
      </div>
      <div className="flex flex-row gap-1 sm:gap-2 flex-[5] justify-center">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md font-medium transition-colors text-white hover:bg-green-700 hover:text-white border-b-4 text-xs md:text-sm lg:text-base ${
                isActive
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
