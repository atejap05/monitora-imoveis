/**
 * Factories de import dinâmico por rota (Vercel: bundle-dynamic-imports / bundle-preload).
 * Reutilizadas em App (React.lazy) e na sidebar (prefetch no hover).
 */
export const importVisaoGeralPage = () =>
  import("@/pages/VisaoGeral/VisaoGeral");
export const importContribuintesPage = () =>
  import("@/pages/Contribuintes/Contribuintes");
export const importAmbientePage = () => import("@/pages/Ambiente/Ambiente");
export const importConsultasPage = () =>
  import("@/pages/Consultas/Consultas");
export const importNotasFiscaisPage = () =>
  import("@/pages/NotasFiscais/NotasFiscais");
export const importConveniosPage = () => import("@/pages/Convenios/Convenios");
export const importVolumetriaPage = () =>
  import("@/pages/Volumetria/Volumetria");
