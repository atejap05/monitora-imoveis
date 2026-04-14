"use client";

import { memo } from "react";
import {
  Building2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Activity,
  Star,
} from "lucide-react";
import type { Property } from "@/lib/types";

interface StatsBarProps {
  properties: Property[];
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
  glowColor?: string;
  delay: number;
}

const StatCard = memo(function StatCard({ icon, label, value, accent, glowColor, delay }: StatCardProps) {
  return (
    <div
      className="stat-card-glow animate-fade-up flex items-center gap-4 rounded-xl border border-border/60 bg-card/50 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-card/70"
      style={{
        animationDelay: `${delay}ms`,
        "--stat-accent": glowColor,
      } as React.CSSProperties}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${accent ?? "bg-primary/10 text-primary"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        <p className="font-heading text-2xl tabular-nums italic">{value}</p>
      </div>
    </div>
  );
});

export function StatsBar({ properties }: StatsBarProps) {
  const total = properties.length;
  let priceDrops = 0;
  let priceUps = 0;
  let inactive = 0;
  let favorites = 0;
  for (const p of properties) {
    if (p.favorite) favorites++;
    if (p.status === "price_drop") priceDrops++;
    else if (p.status === "price_up") priceUps++;
    else if (p.status === "inactive") inactive++;
  }
  const active = total - inactive;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
      <StatCard
        icon={<Building2 className="h-5 w-5" />}
        label="Monitorados"
        value={total}
        glowColor="oklch(0.696 0.17 162.48 / 25%)"
        delay={0}
      />
      <StatCard
        icon={<Star className="h-5 w-5" />}
        label="Favoritos"
        value={favorites}
        accent="bg-amber-500/10 text-amber-400"
        glowColor="oklch(0.769 0.188 70.08 / 25%)"
        delay={30}
      />
      <StatCard
        icon={<Activity className="h-5 w-5" />}
        label="Ativos"
        value={active}
        accent="bg-emerald-500/10 text-emerald-400"
        glowColor="oklch(0.696 0.17 162.48 / 25%)"
        delay={60}
      />
      <StatCard
        icon={<TrendingDown className="h-5 w-5" />}
        label="Preço caiu"
        value={priceDrops}
        accent="bg-emerald-500/10 text-emerald-400"
        glowColor="oklch(0.696 0.17 162.48 / 25%)"
        delay={120}
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Preço subiu"
        value={priceUps}
        accent="bg-amber-500/10 text-amber-400"
        glowColor="oklch(0.769 0.188 70.08 / 25%)"
        delay={180}
      />
      <StatCard
        icon={<AlertTriangle className="h-5 w-5" />}
        label="Indisponíveis"
        value={inactive}
        accent="bg-rose-500/10 text-rose-400"
        glowColor="oklch(0.645 0.246 16.439 / 25%)"
        delay={240}
      />
    </div>
  );
}
