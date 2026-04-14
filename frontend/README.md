# Frontend — Monitora Imóveis

App **Next.js 16** (App Router) com **Clerk** para autenticação, **SWR** para dados, **Sonner** para notificações e proxy de `/api/*` para o FastAPI.

## Configuração e execução

Instruções completas (variáveis `.env.local`, Clerk, Node e comando `npm run dev`) estão no **[README da raiz do repositório](../README.md)**.

Resumo:

1. `cp .env.example .env.local` e preencha as chaves do Clerk.
2. `npm install` e `npm run dev` — painel em [http://localhost:3000](http://localhost:3000).

## Estrutura relevante

- `src/app/` — rotas (`/`, `/sign-in`, `/sign-up`)
- `src/proxy.ts` — proteção de páginas com Clerk (convenção Next.js 16+)
- `src/lib/api.ts` — chamadas à API com `Authorization: Bearer` (`fetchProperties`, `addProperty`, `updateProperty`, `deleteProperty`)
- `src/components/property-card.tsx`, `edit-property-dialog.tsx` — ações de favorito, edição e exclusão
- `next.config.ts` — rewrite `/api/*` → backend em desenvolvimento
