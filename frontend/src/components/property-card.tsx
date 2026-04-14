"use client";

import { memo, useCallback, useState } from "react";
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
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditPropertyDialog } from "@/components/edit-property-dialog";
import type { GetTokenFn } from "@/lib/api";
import { deleteProperty, updateProperty } from "@/lib/api";
import type { Property } from "@/lib/types";
import {
  formatCurrency,
  getPriceChangePercent,
  getRelativeTime,
  getStatusConfig,
} from "@/lib/format";

interface PropertyCardProps {
  property: Property;
  index: number;
  getToken: GetTokenFn;
  onListChange: () => void;
}

function MiniSparkline({
  history,
  propertyId,
}: {
  history: Property["history"];
  propertyId: number;
}) {
  const width = 80;
  const height = 28;
  const padding = 2;
  const len = history.length;

  if (len < 2) {
    return null;
  }

  let min = history[0].price;
  let max = min;
  for (let i = 1; i < len; i++) {
    const p = history[i].price;
    if (p < min) min = p;
    if (p > max) max = p;
  }
  const range = max - min || 1;

  const points = new Array<string>(len);
  for (let i = 0; i < len; i++) {
    const price = history[i].price;
    const x = padding + (i / (len - 1)) * (width - padding * 2);
    const y =
      height - padding - ((price - min) / range) * (height - padding * 2);
    points[i] = `${x},${y}`;
  }

  const isDown = history[len - 1].price < history[0].price;
  const gradId = `spark-${propertyId}-${isDown ? "down" : "up"}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
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
        fill={`url(#${gradId})`}
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

export const PropertyCard = memo(function PropertyCard({
  property,
  index,
  getToken,
  onListChange,
}: PropertyCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [favPending, setFavPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const statusConfig = getStatusConfig(property.status);
  const priceChange = getPriceChangePercent(
    property.price,
    property.previousPrice
  );
  const isInactive = property.status === "inactive";

  const handleToggleFavorite = useCallback(async () => {
    setFavPending(true);
    try {
      await updateProperty(
        property.id,
        { favorite: !property.favorite },
        getToken,
      );
      toast.success(
        property.favorite ? "Removido dos favoritos." : "Marcado como favorito.",
      );
      onListChange();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível atualizar o favorito.",
      );
    } finally {
      setFavPending(false);
    }
  }, [getToken, onListChange, property.favorite, property.id]);

  const handleDelete = useCallback(async () => {
    setDeletePending(true);
    try {
      await deleteProperty(property.id, getToken);
      toast.success("Imóvel removido do monitoramento.");
      setDeleteOpen(false);
      onListChange();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível excluir o imóvel.",
      );
    } finally {
      setDeletePending(false);
    }
  }, [getToken, onListChange, property.id]);

  return (
    <Card
      id={`property-card-${property.id}`}
      className={`status-border-left card-glow animate-fade-up group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/80 ${isInactive ? "opacity-60 grayscale-[20%]" : ""}`}
      style={{
        animationDelay: `${300 + index * 80}ms`,
        "--status-color": statusConfig.rawColor,
        contentVisibility: "auto",
        containIntrinsicSize: "0 320px",
      } as React.CSSProperties}
    >
      <CardContent className="relative z-10 p-5">
        <div className="absolute right-3 top-3 z-20 flex items-center gap-0.5 sm:right-4 sm:top-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className={
              property.favorite
                ? "text-amber-400 hover:text-amber-300"
                : "text-muted-foreground hover:text-foreground"
            }
            disabled={favPending}
            onClick={() => void handleToggleFavorite()}
            aria-label={
              property.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            title={property.favorite ? "Remover dos favoritos" : "Favoritar"}
          >
            <Star
              className={`size-3.5 ${property.favorite ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setEditOpen(true)}
            aria-label="Editar imóvel"
            title="Editar"
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
            aria-label="Excluir imóvel"
            title="Excluir"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <EditPropertyDialog
          property={property}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSaved={() => onListChange()}
        />

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent showCloseButton className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading italic">
                Excluir imóvel?
              </DialogTitle>
              <DialogDescription>
                Esta ação remove o imóvel{" "}
                <span className="font-medium text-foreground">{property.title}</span>{" "}
                do monitoramento. Não é possível desfazer.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deletePending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={deletePending}
              >
                {deletePending ? "Excluindo…" : "Excluir"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header: Status + Type + Sparkline */}
        <div className="mb-4 flex items-start justify-between gap-3 pr-16 sm:pr-20">
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
          <MiniSparkline history={property.history} propertyId={property.id} />
        </div>

        {/* Title */}
        <h3 className="mb-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
          {property.title}
        </h3>

        {property.comment ? (
          <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {property.comment}
          </p>
        ) : null}

        {/* Address */}
        <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {property.neighborhood}, {property.city}
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex items-baseline gap-3">
          <span className="font-heading text-2xl tabular-nums tracking-tight text-foreground italic">
            {formatCurrency(property.price)}
          </span>
          {priceChange !== null ? (
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
          ) : null}
        </div>

        {/* Specs Grid */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-secondary/30 p-3">
          <div className="flex flex-1 flex-col items-center gap-1">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold tabular-nums">{property.bedrooms}</span>
            <span className="text-[10px] text-muted-foreground">Quartos</span>
          </div>
          <div className="h-8 w-px bg-border/30" aria-hidden="true" />
          <div className="flex flex-1 flex-col items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold tabular-nums">{property.suites}</span>
            <span className="text-[10px] text-muted-foreground">Suítes</span>
          </div>
          <div className="h-8 w-px bg-border/30" aria-hidden="true" />
          <div className="flex flex-1 flex-col items-center gap-1">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold tabular-nums">{property.size}</span>
            <span className="text-[10px] text-muted-foreground">Área</span>
          </div>
          <div className="h-8 w-px bg-border/30" aria-hidden="true" />
          <div className="flex flex-1 flex-col items-center gap-1">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold tabular-nums">
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
            className="flex items-center gap-1 text-muted-foreground/50 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5"
            aria-label={`Ver anúncio original de ${property.title}`}
          >
            <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-[10px] font-medium">Ver anúncio</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
});
