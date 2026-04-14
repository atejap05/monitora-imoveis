"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { rescrapeAll } from "@/lib/api";
import type { GetTokenFn } from "@/lib/api";
import type { Property } from "@/lib/types";

const importAddPropertyDialog = () =>
  import("@/components/add-property-dialog");

const AddPropertyDialog = dynamic(
  () =>
    importAddPropertyDialog().then((mod) => ({
      default: mod.AddPropertyDialog,
    })),
  {
    ssr: false,
    loading: () => (
      <Button className="gap-2 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 opacity-80">
        <Plus className="h-4 w-4" />
        Monitorar Imóvel
      </Button>
    ),
  },
);

const ModeToggle = dynamic(
  () =>
    import("@/components/mode-toggle").then((mod) => ({
      default: mod.ModeToggle,
    })),
  {
    ssr: false,
    loading: () => <div className="size-8 shrink-0" aria-hidden />,
  },
);

type DashboardToolbarProps = {
  getToken: GetTokenFn;
  onListRefresh: () => void;
  onPropertyAdded: (newProperty: Property) => void;
};

export function DashboardToolbar({
  getToken,
  onListRefresh,
  onPropertyAdded,
}: DashboardToolbarProps) {
  const [rescrapePending, setRescrapePending] = useState(false);

  const handleRescrapeAll = useCallback(async () => {
    setRescrapePending(true);
    try {
      const r = await rescrapeAll(getToken);
      const parts = [
        `${r.total} imóvel(is) verificado(s)`,
        `${r.priceChanges} alteração(ões) de preço`,
      ];
      if (r.errors > 0) parts.push(`${r.errors} erro(s)`);
      if (r.inactiveListings > 0) {
        parts.push(`${r.inactiveListings} indisponível(eis)`);
      }
      toast.success(parts.join(" · "));
      onListRefresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Falha ao atualizar imóveis.",
      );
    } finally {
      setRescrapePending(false);
    }
  }, [getToken, onListRefresh]);

  return (
    <div
      className="flex shrink-0 flex-wrap items-center justify-end gap-2"
      onMouseEnter={importAddPropertyDialog}
      onFocus={importAddPropertyDialog}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 border-border/60 bg-secondary/30"
        disabled={rescrapePending}
        onClick={() => void handleRescrapeAll()}
        title="Re-scrapear todos os imóveis ativos (em fila)"
      >
        <RefreshCw
          className={`h-4 w-4 ${rescrapePending ? "animate-spin" : ""}`}
          aria-hidden
        />
        {rescrapePending ? "Atualizando…" : "Atualizar todos"}
      </Button>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "size-8 ring-1 ring-border/50",
          },
        }}
      />
      <ModeToggle />
      <AddPropertyDialog onPropertyAdded={onPropertyAdded} />
    </div>
  );
}
