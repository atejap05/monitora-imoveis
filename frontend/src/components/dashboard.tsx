"use client";

import {
  useState,
  useMemo,
  useDeferredValue,
  useTransition,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/property-card";
import { StatsBar } from "@/components/stats-bar";
import { fetcher, PROPERTIES_ENDPOINT } from "@/lib/api";
import type { Property, PropertyStatus } from "@/lib/types";

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

type FilterStatus = "all" | PropertyStatus | "favorites";

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "favorites", label: "Favoritos" },
  { value: "active", label: "Ativos" },
  { value: "price_drop", label: "Preço caiu" },
  { value: "price_up", label: "Preço subiu" },
  { value: "inactive", label: "Indisponíveis" },
];

const EMPTY_STATE_ICON = (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    className="mb-5 text-muted-foreground/30"
    aria-hidden="true"
  >
    <rect
      x="8"
      y="16"
      width="20"
      height="28"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="36"
      y="8"
      width="20"
      height="36"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect x="12" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="20" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="12" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="20" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="40" y="14" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="48" y="14" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="40" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="48" y="22" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="40" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="48" y="30" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
    <line x1="0" y1="48" x2="64" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <circle
      cx="50"
      cy="50"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="3 2"
      opacity="0.3"
    />
  </svg>
);

export function Dashboard() {
  const { getToken } = useAuth();

  const swrFetcher = useCallback(
    (url: string) => fetcher<Property[]>(url, getToken),
    [getToken],
  );

  const {
    data: properties = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Property[]>(PROPERTIES_ENDPOINT, swrFetcher, {
    revalidateOnFocus: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [isFilterPending, startFilterTransition] = useTransition();

  const handleFilterChange = (filter: FilterStatus) => {
    startFilterTransition(() => {
      setStatusFilter(filter);
    });
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const q = deferredSearch.toLowerCase();
      const matchesSearch =
        q === "" ||
        property.title.toLowerCase().includes(q) ||
        property.neighborhood.toLowerCase().includes(q) ||
        property.city.toLowerCase().includes(q) ||
        property.comment.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "favorites"
            ? property.favorite
            : property.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [properties, deferredSearch, statusFilter]);

  const handlePropertyAdded = useCallback(
    (newProperty: Property) => {
      void mutate(
        (current) =>
          current ? [...current, newProperty] : [newProperty],
        { revalidate: false },
      );
    },
    [mutate],
  );

  const handleListRefresh = useCallback(() => {
    void mutate();
  }, [mutate]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="animate-fade-up mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="mt-1.5 hidden h-10 w-1 rounded-full bg-gradient-to-b from-primary to-primary/20 sm:block"
              aria-hidden="true"
            />
            <div>
              <h1 className="font-heading text-3xl tracking-tight italic sm:text-4xl">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                  Meus Imóveis
                </span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitore preços, detecte variações e saiba quando um imóvel sai do
                mercado.
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 items-center gap-1 sm:justify-end"
            onMouseEnter={importAddPropertyDialog}
            onFocus={importAddPropertyDialog}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8 ring-1 ring-border/50",
                },
              }}
            />
            <ModeToggle />
            <AddPropertyDialog onPropertyAdded={handlePropertyAdded} />
          </div>
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          Não foi possível carregar os imóveis. Verifique se a API está rodando
          (FastAPI em <code className="rounded bg-muted px-1">localhost:8000</code>).
        </div>
      ) : null}

      <section className="mb-8" aria-label="Resumo do monitoramento">
        <StatsBar properties={isLoading ? [] : properties} />
      </section>

      <Separator className="mb-8 bg-border/30" />

      <div
        className="animate-fade-up mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: "260ms" }}
      >
        <div className="search-glow relative max-w-sm flex-1 rounded-lg transition-all duration-300">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-properties-input"
            type="search"
            placeholder="Buscar por título, bairro, comentário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-border/40 bg-secondary/30 pl-10 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                id={`filter-${filter.value}`}
                type="button"
                onClick={() => handleFilterChange(filter.value)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                {filter.value !== "all" ? (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      filter.value === "favorites"
                        ? "bg-amber-400"
                        : filter.value === "active"
                          ? "bg-emerald-400"
                          : filter.value === "price_drop"
                            ? "bg-emerald-400"
                            : filter.value === "price_up"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                    } ${isActive ? "opacity-100" : "opacity-50"}`}
                  />
                ) : null}
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <section aria-label="Lista de imóveis monitorados">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-border/40 bg-card/20"
              />
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div
            className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${isFilterPending ? "opacity-80" : ""}`}
          >
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                getToken={getToken}
                onListChange={handleListRefresh}
              />
            ))}
          </div>
        ) : (
          <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/30 bg-gradient-to-b from-card/30 to-transparent py-20">
            {EMPTY_STATE_ICON}
            <h3 className="mb-1 font-heading text-lg italic text-foreground/80">
              Nenhum imóvel por aqui
            </h3>
            <p className="max-w-xs text-center text-sm text-muted-foreground/70">
              Ajuste seus filtros ou adicione um novo imóvel para começar a monitorar.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-12 mb-6 text-center text-[11px] text-muted-foreground/40">
        Monitora Imóveis © {new Date().getFullYear()} — Dados extraídos
        automaticamente a cada 12h
      </footer>
    </div>
  );
}
