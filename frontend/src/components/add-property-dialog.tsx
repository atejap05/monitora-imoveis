"use client";

import { useState } from "react";
import { Plus, Link2, Loader2, CheckCircle2 } from "lucide-react";
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
      <DialogTrigger asChild>
        <Button
          id="add-property-button"
          className="gap-2 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Monitorar Imóvel
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/50 bg-card backdrop-blur-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Adicionar Imóvel para Monitoramento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Cole o link do anúncio. Nossos robôs irão extrair os dados
            automaticamente e monitorar as variações de preço.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="relative">
            <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="property-url-input"
              type="url"
              placeholder="https://www.primeiraporta.com.br/imovel/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 border-border/50 bg-secondary/50 pl-10 font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
              disabled={isLoading || isSuccess}
              required
            />
          </div>

          <Button
            id="submit-property-button"
            type="submit"
            disabled={isLoading || isSuccess || !url.trim()}
            className="w-full gap-2 bg-primary text-primary-foreground font-semibold transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extraindo dados...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
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
          Portais suportados: Primeira Porta • ZAP Imóveis • VivaReal (em
          breve)
        </p>
      </DialogContent>
    </Dialog>
  );
}
