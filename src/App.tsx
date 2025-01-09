import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarFilters from "./components/sidebar/SidebarFilters";
import Header from "./components/Header";
import TabsNav from "./components/tabs-navigation/TabsNav";
import Dashboard from "./dashboards/Dashboard";
import { useDashboardState } from "./state/dashboardState";

function App() {
  const { tabValue } = useDashboardState();
  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <SidebarFilters />
          <div className="flex w-full">
            <SidebarTrigger className="mx-1" />
            <TabsNav>
              <Dashboard tabValue={tabValue} />
            </TabsNav>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default App;
