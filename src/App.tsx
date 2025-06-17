import { MainLayout } from "@/components/MainLayout";
import { VisaoGeralFiltersProvider } from "@/features/visao-geral/hooks/useVisaoGeralFilters";
import Dashboard from "./dashboards/Dashboard";
import { useDashboardState } from "./state/dashboardState";

function App() {
  const { tabValue } = useDashboardState();
  return (
    <VisaoGeralFiltersProvider>
      <MainLayout>
        <Dashboard tabValue={tabValue} />
      </MainLayout>
    </VisaoGeralFiltersProvider>
  );
}

export default App;
