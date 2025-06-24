import React from "react";
import SidebarNav from "./SidebarNav";

const TopNavBar: React.FC = () => (
  <div className="fixed top-0 left-0 w-full z-50">
    <SidebarNav />
  </div>
);

export default TopNavBar;
