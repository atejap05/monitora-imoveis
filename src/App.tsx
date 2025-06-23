import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { VisaoGeralFiltersProvider } from "@/pages/VisaoGeral/hooks/useVisaoGeralFilters";
import VisaoGeral from "./pages/VisaoGeral/VisaoGeral";
import Contribuintes from "./pages/Contribuintes/Contribuintes";
import Ambiente from "./pages/Ambiente/Ambiente";
import Consultas from "./pages/Consultas/Consultas";
import NotasFiscais from "./pages/NotasFiscais/NotasFiscais";
import { SidebarProvider } from "@/components/ui/sidebar";

function App() {
  return (
    <SidebarProvider>
      <Router>
        <VisaoGeralFiltersProvider>
          <MainLayout>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/visao-geral" replace />}
              />
              <Route path="/visao-geral" element={<VisaoGeral />} />
              <Route path="/contribuintes" element={<Contribuintes />} />
              <Route path="/ambiente" element={<Ambiente />} />
              <Route path="/consultas" element={<Consultas />} />
              <Route path="/notas-fiscais" element={<NotasFiscais />} />
            </Routes>
          </MainLayout>
        </VisaoGeralFiltersProvider>
      </Router>
    </SidebarProvider>
  );
}

export default App;
