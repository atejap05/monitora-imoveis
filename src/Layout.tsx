import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarFilters from "./components/sidebar/SidebarFilters";
import Header from "./components/Header";
import TabsNav from "./components/tabs-navigation/TabsNav";
import Dashboard from "./dashboards/Dashboard";
import { useDashboardState } from "./state/dashboardState";

const Layout = () => {
  const { tabValue } = useDashboardState();
  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <SidebarFilters />
          <div className="flex w-full">
            <SidebarTrigger />
            <TabsNav>
              <Dashboard tabValue={tabValue} />
            </TabsNav>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Layout;
