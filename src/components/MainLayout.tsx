import { useSidebar } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import SidebarNav from "./Sidebar/SidebarNav";
import React, { useState, useRef } from "react";
import SidebarMenuItems from "./Sidebar/SidebarMenuItems";
import { HEADER_HEIGHT_PX } from "@/lib/constants";

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

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header
          onVisibilityChange={setHeaderVisible}
          scrollContainerRef={contentRef}
        />
        <div
          className="w-full bg-green z-40"
          style={{
            position: "sticky",
            top: headerVisible ? HEADER_HEIGHT_PX : "0",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
          }}
        >
          <SidebarNav />
        </div>
        <div
          ref={contentRef}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className="relative flex h-full w-full min-w-0">
            <div className="flex min-w-0 flex-1 justify-center">
              <div className="w-full min-w-0 max-w-full px-4 py-8 sm:px-6 md:px-8">
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
