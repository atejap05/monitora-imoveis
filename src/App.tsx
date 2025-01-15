import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarFilters from "./components/sidebar/SidebarFilters";
import Header from "./components/Header";
import TabsNav from "./components/tabs-navigation/TabsNav";
import Dashboard from "./dashboards/Dashboard";
import { useDashboardState } from "./state/dashboardState";
import { useSidebarState } from "./state/sidebarState";

function App() {
  const { tabValue } = useDashboardState();
  const { setSidebarState } = useSidebarState();
  return (
    <SidebarProvider className="flex flex-col h-screen w-full">
      <Header />
      <div className="flex h-screen w-full">
        <SidebarFilters />
        <div className="flex w-full">
          <TabsNav>
            <SidebarTrigger
              onClick={setSidebarState}
              className="absolute top-1 left-1 text-white font-semibold"
            />
            <Dashboard tabValue={tabValue} />
          </TabsNav>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;
