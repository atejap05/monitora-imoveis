"use client";

import {
  Bed,
  Bath,
  Maximize2,
  Car,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/lib/mock-data";
import {
  formatCurrency,
  getPriceChangePercent,
  getRelativeTime,
  getStatusConfig,
} from "@/lib/format";

interface PropertyCardProps {
  property: Property;
  index: number;
}

function MiniSparkline({ history }: { history: Property["history"] }) {
  if (history.length < 2) return null;

  const prices = history.map((h) => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const width = 80;
  const height = 28;
  const padding = 2;

  const points = prices.map((price, i) => {
    const x = padding + (i / (prices.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const isDown = lastPrice < firstPrice;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id={`gradient-${isDown ? "down" : "up"}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={isDown ? "#34d399" : "#fbbf24"}
            stopOpacity={0.3}
          />
          <stop
            offset="100%"
            stopColor={isDown ? "#34d399" : "#fbbf24"}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <polygon
        points={`${padding},${height} ${points.join(" ")} ${width - padding},${height}`}
        fill={`url(#gradient-${isDown ? "down" : "up"})`}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={isDown ? "#34d399" : "#fbbf24"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PropertyCard({ property, index }: PropertyCardProps) {
  const statusConfig = getStatusConfig(property.status);
  const priceChange = getPriceChangePercent(
    property.price,
    property.previousPrice
  );
  const isInactive = property.status === "inactive";

  return (
    <Card
      id={`property-card-${property.id}`}
      className={`card-glow animate-fade-up group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-card/80 ${isInactive ? "opacity-60" : ""}`}
      style={{ animationDelay: `${300 + index * 80}ms` }}
    >
      <CardContent className="relative z-10 p-5">
        {/* Header: Status + Type + Sparkline */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor} gap-1.5 text-[11px] font-semibold uppercase tracking-wider`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor} ${property.status === "active" || property.status === "price_drop" ? "animate-pulse-ring" : ""}`}
              />
              {statusConfig.label}
            </Badge>
            <Badge
              variant="outline"
              className="border-border/40 bg-secondary/50 text-[11px] font-medium text-muted-foreground"
            >
              {property.type === "sale" ? "Venda" : "Aluguel"}
            </Badge>
          </div>
          <MiniSparkline history={property.history} />
        </div>

        {/* Title */}
        <h3 className="mb-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
          {property.title}
        </h3>

        {/* Address */}
        <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {property.neighborhood}, {property.city}
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {formatCurrency(property.price)}
          </span>
          {priceChange !== null && (
            <span
              className={`flex items-center gap-0.5 text-sm font-semibold tabular-nums ${priceChange < 0 ? "text-emerald-400" : "text-amber-400"}`}
            >
              {priceChange < 0 ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5" />
              )}
              {Math.abs(priceChange).toFixed(1)}%
            </span>
          )}
        </div>

        {/* Specs Grid */}
        <div className="mb-4 grid grid-cols-4 gap-2 rounded-lg bg-secondary/30 p-3">
          <div className="flex flex-col items-center gap-1">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">{property.bedrooms}</span>
            <span className="text-[10px] text-muted-foreground">Quartos</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">{property.suites}</span>
            <span className="text-[10px] text-muted-foreground">Suítes</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">{property.size}</span>
            <span className="text-[10px] text-muted-foreground">Área</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold">
              {property.parkingSpots}
            </span>
            <span className="text-[10px] text-muted-foreground">Vagas</span>
          </div>
        </div>

        {/* Footer: Source + Last Update + Link */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-medium">{property.source}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getRelativeTime(property.updatedAt)}
            </span>
          </div>
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary/70 transition-colors hover:text-primary"
            aria-label={`Ver anúncio original de ${property.title}`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
