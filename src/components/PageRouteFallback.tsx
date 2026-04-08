import { Loader2 } from "lucide-react";

/** Fallback leve para Suspense das rotas lazy em App. */
export function PageRouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] w-full items-center justify-center gap-2 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-green" aria-hidden />
      <span className="text-sm">Carregando página…</span>
    </div>
  );
}
