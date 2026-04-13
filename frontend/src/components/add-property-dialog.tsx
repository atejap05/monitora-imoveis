"use client";

import { useState } from "react";
import { Plus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SuccessCheckmark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" className="animate-success-ring" />
      <path d="M6 10.5L9 13.5L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-check-draw" />
    </svg>
  );
}

export function AddPropertyDialog() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);

    // Simulate API call — will connect to FastAPI backend later
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSuccess(true);

    setTimeout(() => {
      setOpen(false);
      setUrl("");
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            id="add-property-button"
            className="gap-2 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02]"
          />
        }
      >
        <Plus className="h-4 w-4" />
        Monitorar Imóvel
      </DialogTrigger>
      <DialogContent className="overflow-hidden border-border/50 bg-card backdrop-blur-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl italic">
            Adicionar Imóvel
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Cole o link do anúncio. Nossos robôs irão extrair os dados
            automaticamente e monitorar as variações de preço.
          </DialogDescription>
        </DialogHeader>

        {/* Loading progress bar */}
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden bg-primary/10">
            <div className="animate-progress h-full w-1/3 rounded-full bg-primary" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="search-glow relative rounded-lg transition-all duration-300">
            <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="property-url-input"
              type="url"
              placeholder="https://www.primeiraporta.com.br/imovel/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 border-border/50 bg-secondary/50 pl-10 font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-transparent"
              disabled={isLoading || isSuccess}
              required
            />
          </div>

          <Button
            id="submit-property-button"
            type="submit"
            disabled={isLoading || isSuccess || !url.trim()}
            className={`w-full gap-2 font-semibold transition-all duration-300 ${
              isSuccess
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {isLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" className="animate-spin" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25" />
                  <path d="M14.5 8a6.5 6.5 0 00-6.5-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
                Extraindo dados...
              </>
            ) : isSuccess ? (
              <>
                <SuccessCheckmark />
                Imóvel adicionado!
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Iniciar Monitoramento
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground/60">
          Portais suportados: Primeira Porta{" "}
          <span className="text-muted-foreground/30">•</span> ZAP Imóveis{" "}
          <span className="text-muted-foreground/30">•</span> VivaReal{" "}
          <span className="text-[10px] italic text-muted-foreground/40">(em breve)</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
