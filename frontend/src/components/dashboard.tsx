"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/property-card";
import { StatsBar } from "@/components/stats-bar";
import { AddPropertyDialog } from "@/components/add-property-dialog";
import { MOCK_PROPERTIES, type Property, type PropertyStatus } from "@/lib/mock-data";

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
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
                Meus Imóveis
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitore preços, detecte variações e saiba quando um imóvel sai do
              mercado.
            </p>
          </div>
          <AddPropertyDialog />
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
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-properties-input"
            type="search"
            placeholder="Buscar por título, bairro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-border/40 bg-secondary/30 pl-10 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/40"
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
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
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
          <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 bg-card/20 py-20">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-base font-semibold">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Ajuste seus filtros ou adicione um novo imóvel para monitorar.
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
