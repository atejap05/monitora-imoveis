"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/property-card";
import { StatsBar } from "@/components/stats-bar";
import { MOCK_PROPERTIES, type Property, type PropertyStatus } from "@/lib/mock-data";

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
  }
);

type FilterStatus = "all" | PropertyStatus;

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "price_drop", label: "Preço caiu" },
  { value: "price_up", label: "Preço subiu" },
  { value: "inactive", label: "Indisponíveis" },
];

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((property) => {
      const matchesSearch =
        searchQuery === "" ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.neighborhood
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || property.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="animate-fade-up mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="mt-1.5 hidden h-10 w-1 rounded-full bg-gradient-to-b from-primary to-primary/20 sm:block" aria-hidden="true" />
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
            onMouseEnter={importAddPropertyDialog}
            onFocus={importAddPropertyDialog}
          >
            <AddPropertyDialog />
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="mb-8" aria-label="Resumo do monitoramento">
        <StatsBar properties={MOCK_PROPERTIES} />
      </section>

      <Separator className="mb-8 bg-border/30" />

      {/* Search + Filters */}
      <div
        className="animate-fade-up mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: "260ms" }}
      >
        {/* Search */}
        <div className="search-glow relative max-w-sm flex-1 rounded-lg transition-all duration-300">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-properties-input"
            type="search"
            placeholder="Buscar por título, bairro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-border/40 bg-secondary/30 pl-10 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                id={`filter-${filter.value}`}
                onClick={() => setStatusFilter(filter.value)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                {filter.value !== "all" && (
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    filter.value === "active" ? "bg-emerald-400" :
                    filter.value === "price_drop" ? "bg-emerald-400" :
                    filter.value === "price_up" ? "bg-amber-400" :
                    "bg-rose-400"
                  } ${isActive ? "opacity-100" : "opacity-50"}`} />
                )}
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Grid */}
      <section aria-label="Lista de imóveis monitorados">
        {filteredProperties.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/30 bg-gradient-to-b from-card/30 to-transparent py-20">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-5 text-muted-foreground/30" aria-hidden="true">
              <rect x="8" y="16" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="36" y="8" width="20" height="36" rx="2" stroke="currentColor" strokeWidth="1.5" />
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
              <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.3" />
            </svg>
            <h3 className="mb-1 font-heading text-lg italic text-foreground/80">
              Nenhum imóvel por aqui
            </h3>
            <p className="max-w-xs text-center text-sm text-muted-foreground/70">
              Ajuste seus filtros ou adicione um novo imóvel para começar a monitorar.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-12 mb-6 text-center text-[11px] text-muted-foreground/40">
        Monitora Imóveis © {new Date().getFullYear()} — Dados extraídos
        automaticamente a cada 12h
      </footer>
    </div>
  );
}
