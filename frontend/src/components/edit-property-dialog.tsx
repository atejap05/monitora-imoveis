"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProperty } from "@/lib/api";
import type { ListingStatus, Property } from "@/lib/types";

const LISTING_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: "active", label: "Ativo (anúncio ok)" },
  { value: "inactive", label: "Indisponível" },
  { value: "error", label: "Erro na extração" },
];

export interface EditPropertyDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (updated: Property) => void;
}

export function EditPropertyDialog({
  property,
  open,
  onOpenChange,
  onSaved,
}: EditPropertyDialogProps) {
  const { getToken } = useAuth();
  const [neighborhood, setNeighborhood] = useState(property.neighborhood);
  const [priceStr, setPriceStr] = useState(String(property.price));
  const [comment, setComment] = useState(property.comment);
  const [listingStatus, setListingStatus] = useState<ListingStatus>(
    property.listingStatus,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNeighborhood(property.neighborhood);
    setPriceStr(String(property.price));
    setComment(property.comment);
    setListingStatus(property.listingStatus);
    setError(null);
  }, [open, property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = Number(priceStr.replace(/\s/g, "").replace(",", "."));
    if (Number.isNaN(parsed) || parsed < 0) {
      setError("Informe um preço válido (número ≥ 0).");
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateProperty(
        property.id,
        {
          neighborhood,
          price: parsed,
          comment: comment.trim() ? comment.trim() : null,
          status: listingStatus,
        },
        getToken,
      );
      toast.success("Imóvel atualizado.");
      onSaved(updated);
      onOpenChange(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível salvar as alterações.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border/50 bg-card backdrop-blur-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl italic">
            Editar imóvel
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajuste bairro, valor, comentário e status. O histórico de preços do
            scraping não é alterado aqui.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor={`edit-neighborhood-${property.id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Bairro
            </label>
            <Input
              id={`edit-neighborhood-${property.id}`}
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              disabled={isSubmitting}
              className="border-border/50 bg-secondary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`edit-price-${property.id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Valor (R$)
            </label>
            <Input
              id={`edit-price-${property.id}`}
              inputMode="decimal"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              disabled={isSubmitting}
              className="border-border/50 bg-secondary/30 tabular-nums"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`edit-comment-${property.id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Comentário
            </label>
            <textarea
              id={`edit-comment-${property.id}`}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              maxLength={2000}
              className="field-sizing-content flex min-h-16 w-full rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="Notas pessoais sobre visitas, prós/contras…"
            />
            <p className="text-[10px] text-muted-foreground/70">
              {comment.length}/2000
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`edit-status-${property.id}`}
              className="text-xs font-medium text-muted-foreground"
            >
              Status no cadastro
            </label>
            <select
              id={`edit-status-${property.id}`}
              value={listingStatus}
              onChange={(e) =>
                setListingStatus(e.target.value as ListingStatus)
              }
              disabled={isSubmitting}
              className="flex h-9 w-full rounded-lg border border-border/50 bg-secondary/30 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {LISTING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
