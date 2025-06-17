import { MainLayout } from "@/components/MainLayout";
import { VisaoGeralFiltersProvider } from "@/features/visao-geral/hooks/useVisaoGeralFilters";
import Dashboard from "./dashboards/Dashboard";
import { useDashboardState } from "./state/dashboardState";
import { useSidebarState } from "./state/sidebarState";

function App() {
  const { tabValue } = useDashboardState();
  const { setSidebarState } = useSidebarState();
  return (
    <VisaoGeralFiltersProvider>
      <MainLayout>
        <Dashboard tabValue={tabValue} />
      </MainLayout>
    </VisaoGeralFiltersProvider>
  );
}

export default App;
