import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarFilters from "./sidebar/SidebarFilters";
import Header from "@/components/Header";
import TabsNav from "@/components/tabs-navigation/TabsNav";
import React from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider className="flex flex-col h-screen w-full">
    <Header />
    <div className="flex h-screen w-full">
      <SidebarFilters />
      <div className="flex w-full">
        <TabsNav>
          <SidebarTrigger className="absolute top-1 left-1 text-white font-semibold" />
          {children}
        </TabsNav>
      </div>
    </div>
  </SidebarProvider>
);

export default MainLayout;
