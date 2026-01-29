import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Copy, Download } from "lucide-react";
import { formataCNPJ } from "@/lib/utils";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { useDanfseBase64 } from "@/hooks/useDanfseBase64";
import { useState } from "react";
import { toast } from "sonner";
import type { NfseData } from "./@types";

interface NfseDetalhadaProps {
  nfse: NfseData | null;
  isLoading?: boolean;
}

const formataValorReal = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function NfseDetalhada({ nfse, isLoading }: NfseDetalhadaProps) {
  const { mutate: fetchPdf, isPending: isDownloading } = useDanfseBase64();
  const [loading, setLoading] = useState(false);

  const handleDownloadDanfse = () => {
    if (!nfse?.chave_acesso) return;

    setLoading(true);
    fetchPdf(nfse.chave_acesso, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        setLoading(false);
        toast.success("DANFSe baixado com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao baixar DANFSe. Tente novamente.");
        setLoading(false);
      },
    });
  };

  const handleCopyChave = () => {
    if (nfse?.chave_acesso) {
      copyToClipboard(nfse.chave_acesso);
      toast.success("Chave de acesso copiada!");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-7xl shadow-md">
        <CardContent className="flex items-center justify-center h-80">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
            <span className="text-green text-lg font-semibold">
              Carregando dados da NFSe...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nfse) {
    return (
      <Card className="w-full max-w-7xl shadow-md">
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              Nenhuma NFSe encontrada para a chave informada.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-7xl shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-2">Detalhes da NFSe</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-sm">
                {formataCNPJ(nfse.ni_prestador)}
              </Badge>
              <Separator orientation="vertical" className="h-5" />
              <Badge>{nfse.ano}</Badge>
              <Badge variant="secondary">
                Mês {nfse.mes.toString().padStart(2, "0")}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyChave}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar Chave
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDanfse}
              disabled={isDownloading || loading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading || loading ? "Baixando..." : "Baixar DANFSe"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados Gerais */}
        <div>
          <h3 className="text-lg font-semibold text-green mb-3">
            Dados Gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Chave de Acesso
              </p>
              <p className="text-sm font-mono break-all">{nfse.chave_acesso}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Número NFSe
              </p>
              <p className="text-sm">{nfse.nro_nfse}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Município
              </p>
              <p className="text-sm">{nfse.municipio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Ano/Mês
              </p>
              <p className="text-sm">
                {nfse.ano}/{nfse.mes.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Prestador */}
        <div>
          <h3 className="text-lg font-semibold text-green mb-3">Prestador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                CNPJ Prestador
              </p>
              <p className="text-sm">{formataCNPJ(nfse.ni_prestador)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Raiz CNPJ Prestador
              </p>
              <p className="text-sm">{nfse.ni_raiz_pretador}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Local de Emissão
              </p>
              <p className="text-sm">{nfse.local_emissao}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tomador */}
        <div>
          <h3 className="text-lg font-semibold text-green mb-3">Tomador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                CNPJ Tomador
              </p>
              <p className="text-sm">{formataCNPJ(nfse.ni_tomador)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Raiz CNPJ Tomador
              </p>
              <p className="text-sm">{nfse.ni_raiz_tomador}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nome Tomador
              </p>
              <p className="text-sm">{nfse.tomador}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Município Tomador
              </p>
              <p className="text-sm">{nfse.municipio_tomador}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Serviço */}
        <div>
          <h3 className="text-lg font-semibold text-green mb-3">Serviço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Descrição do Serviço
              </p>
              <p className="text-sm">{nfse.descricao_servico}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">NBS</p>
              <p className="text-sm">{nfse.nbs}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Serviço Nacional
              </p>
              <p className="text-sm">{nfse.servico_nacional}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Local de Prestação
              </p>
              <p className="text-sm">{nfse.loc_prestacao}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Valores */}
        <div>
          <h3 className="text-lg font-semibold text-green mb-3">Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Valor do Serviço
              </p>
              <p className="text-lg font-bold text-green">
                {formataValorReal(nfse.valor_servico)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Valor Líquido
              </p>
              <p className="text-lg font-bold text-green">
                {formataValorReal(nfse.valor_liq)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
