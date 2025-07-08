import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import VisaoGeral from "./pages/VisaoGeral/VisaoGeral";
import Contribuintes from "./pages/Contribuintes/Contribuintes";
import Ambiente from "./pages/Ambiente/Ambiente";
import Consultas from "./pages/Consultas/Consultas";
import NotasFiscais from "./pages/NotasFiscais/NotasFiscais";
import Convenios from "./pages/Convenios/Convenios";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <SidebarProvider>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/visao-geral" replace />} />
            <Route path="/visao-geral" element={<VisaoGeral />} />
            <Route path="/contribuintes" element={<Contribuintes />} />
            <Route path="/ambiente" element={<Ambiente />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/notas-fiscais" element={<NotasFiscais />} />
            <Route path="/convenios" element={<Convenios />} />
          </Routes>
          <Toaster />
        </MainLayout>
      </HashRouter>
    </SidebarProvider>
  );
}

export default App;
