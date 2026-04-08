import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import {
  importVisaoGeralPage,
  importContribuintesPage,
  importAmbientePage,
  importConsultasPage,
  importNotasFiscaisPage,
  importConveniosPage,
  importVolumetriaPage,
} from "@/routes/pageImports";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { PageRouteFallback } from "@/components/PageRouteFallback";

const VisaoGeral = lazy(importVisaoGeralPage);
const Contribuintes = lazy(importContribuintesPage);
const Ambiente = lazy(importAmbientePage);
const Consultas = lazy(importConsultasPage);
const NotasFiscais = lazy(importNotasFiscaisPage);
const Convenios = lazy(importConveniosPage);
const Volumetria = lazy(importVolumetriaPage);

function App() {
  return (
    <SidebarProvider>
      <HashRouter>
        <MainLayout>
          <Suspense fallback={<PageRouteFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/visao-geral" replace />} />
              <Route path="/visao-geral" element={<VisaoGeral />} />
              <Route path="/contribuintes" element={<Contribuintes />} />
              <Route path="/ambiente" element={<Ambiente />} />
              <Route path="/consultas" element={<Consultas />} />
              <Route path="/notas-fiscais" element={<NotasFiscais />} />
              <Route path="/convenios" element={<Convenios />} />
              <Route path="/volumetria" element={<Volumetria />} />
            </Routes>
          </Suspense>
          <Toaster />
        </MainLayout>
      </HashRouter>
    </SidebarProvider>
  );
}

export default App;
