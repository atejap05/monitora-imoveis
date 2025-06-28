import { type MunicipioStatus } from "@/@types";
import { Badge } from "@/components/ui/badge";
import BasicTooltip from "@/components/BasicTooltip";
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { corrigeCodificacao } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const formataHeader = (text: string) => (
    <span className="text-base text-nowrap text-green py-2">{text}</span>
);

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Conveniado Ativo":
            return "default";
        case "Conveniado - Nao Ativo":
            return "secondary";
        case "Nao Conveniado":
        case "Erro na Consulta":
            return "destructive";
        case "Sim":
            return "default";
        case "Não":
            return "secondary";
        default:
            return "outline";
    }
};

export const conveniosColumns: ColumnDef<MunicipioStatus>[] = [
    {
        accessorKey: "Regiao",
        header: () => formataHeader("Região"),
    },
    {
        accessorKey: "RegiaoFiscal",
        header: () => formataHeader("Região Fiscal"),
    },
    {
        accessorKey: "UF",
        header: () => formataHeader("UF"),
    },
    {
        accessorKey: "CodigoMunicipio",
        header: () => formataHeader("Cód. Município"),
    },
    {
        accessorKey: "NomeMunicipio",
        header: () => formataHeader("Município"),
    },
    {
        accessorKey: "StatusConvenioSEFIN",
        header: () => formataHeader("Status SEFIN"),
        cell: ({ row }) => {
            const statusCorrigido = corrigeCodificacao(row.original.StatusConvenioSEFIN);
            return (
                <Badge variant={getStatusVariant(statusCorrigido)}>
                    {statusCorrigido}
                </Badge>
            );
        },
    },
    {
        accessorKey: "AtivoNaBase",
        header: () => formataHeader("Ativo na Base"),
        cell: ({ row }) => {
            const statusCorrigido = corrigeCodificacao(row.original.AtivoNaBase);
            return (
                <Badge variant={getStatusVariant(statusCorrigido)}>
                    {statusCorrigido}
                </Badge>
            );
        },
    },
    {
        accessorKey: "AtivoUltimoPeriodo",
        header: () => formataHeader("Ativo no Período"),
        cell: ({ row }) => {
            const statusCorrigido = corrigeCodificacao(
                row.original.AtivoUltimoPeriodo
            );
            return (
                <Badge variant={getStatusVariant(statusCorrigido)}>
                    {statusCorrigido}
                </Badge>
            );
        },
    },
    {
        accessorKey: "UltimaAtividade",
        header: () => formataHeader("Última Atividade"),
        cell: ({ row }) =>
            row.original.UltimaAtividade
                ? new Date(row.original.UltimaAtividade).toLocaleDateString("pt-BR")
                : "-",
    },
    {
        accessorKey: "ChaveUltimaAtividade",
        header: () => formataHeader("Chave Última Atividade"),
        cell: ({ row }) => {
            const chave = row.original.ChaveUltimaAtividade;
            if (!chave) return "-";
            return (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <a
                        href="https://www.nfse.gov.br/consultapublica"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900"
                        title="Consultar chave de acesso na NFSe.gov.br"
                    >
                        <BasicTooltip label={chave} content={chave} />
                    </a>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.preventDefault();
                            copyToClipboard(chave);
                        }}
                        className="ml-1 p-1 rounded hover:bg-gray-100"
                        aria-label="Copiar chave de acesso"
                        title="Copiar chave de acesso"
                    >
                        <Copy size={16} className="text-primary hover:text-primary/90" />
                    </Button>
                </div>
            );
        },
    },
]; 