"use client";

import { useState } from "react";
import {
  Building2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import type { Property } from "@/lib/mock-data";

interface StatsBarProps {
  properties: Property[];
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
  delay: number;
}

function StatCard({ icon, label, value, accent, delay }: StatCardProps) {
  return (
    <div
      className="animate-fade-up flex items-center gap-4 rounded-xl border border-border/60 bg-card/50 px-5 py-4 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent ?? "bg-primary/10 text-primary"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export function StatsBar({ properties }: StatsBarProps) {
  const total = properties.length;
  const active = properties.filter((p) => p.status !== "inactive").length;
  const priceDrops = properties.filter((p) => p.status === "price_drop").length;
  const priceUps = properties.filter((p) => p.status === "price_up").length;
  const inactive = properties.filter((p) => p.status === "inactive").length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <StatCard
        icon={<Building2 className="h-5 w-5" />}
        label="Monitorados"
        value={total}
        delay={0}
      />
      <StatCard
        icon={<Activity className="h-5 w-5" />}
        label="Ativos"
        value={active}
        accent="bg-emerald-500/10 text-emerald-400"
        delay={60}
      />
      <StatCard
        icon={<TrendingDown className="h-5 w-5" />}
        label="Preço caiu"
        value={priceDrops}
        accent="bg-emerald-500/10 text-emerald-400"
        delay={120}
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Preço subiu"
        value={priceUps}
        accent="bg-amber-500/10 text-amber-400"
        delay={180}
      />
      <StatCard
        icon={<AlertTriangle className="h-5 w-5" />}
        label="Indisponíveis"
        value={inactive}
        accent="bg-rose-500/10 text-rose-400"
        delay={240}
      />
    </div>
  );
}
