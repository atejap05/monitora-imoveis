import { useSidebar } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import SidebarNav from "./Sidebar/SidebarNav";
import React, { useState, useRef } from "react";
import SidebarMenuItems from "./Sidebar/SidebarMenuItems";

const HEADER_HEIGHT = 94; // unificado com Header

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [headerVisible, setHeaderVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const { open } = useSidebar();

  return (
    <div className="flex h-screen w-full overflow-x-hidden">
      <div
        className={`h-screen sticky top-0 left-0 z-30 transition-all duration-300 ${
          open ? "w-64 min-w-[16rem]" : "w-0 min-w-0 overflow-hidden"
        }`}
      >
        <Sidebar>
          <SidebarMenuItems />
        </Sidebar>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <Header
          onVisibilityChange={setHeaderVisible}
          scrollContainerRef={contentRef}
        />
        <div
          className="w-full bg-green z-40"
          style={{
            position: "sticky",
            top: headerVisible ? HEADER_HEIGHT : 0,
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
          }}
        >
          <SidebarNav />
        </div>
        <div className="flex-1 min-h-0">
          <div className="flex w-full h-full relative">
            <div className="flex-1">
              <div className="mx-auto px-4 sm:px-6 md:px-8 py-8 ">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
