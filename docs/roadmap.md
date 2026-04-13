# Roadmap e Backlog (Monitora Imóveis)

Este documento descreve a visão de produto, o estado das fases e o backlog pós-MVP.

---

## Estado das fases (visão geral)

| Fase | Tema | Estado |
|------|------|--------|
| **1** | Fundação backend (FastAPI, SQLite, Playwright, scraper) | Concluída |
| **2** | Frontend (Next.js, Dashboard, UI) | Concluída |
| **2b** | Integração API (REST, CORS, painel com dados reais) | Concluída |
| **3** | Jobs em background, re-scrape periódico, histórico de preço evolutivo | Em andamento / pendente |
| **4** | Busca semântica (IA) | Planejada |

---

### Fase 1: Fundação do Sistema (Concluída)

- Repositório com `backend/` e `frontend/`.
- FastAPI, SQLModel/SQLAlchemy, SQLite (`database.db`).
- Playwright (Chromium headless) em `scraper.py`.
- Extração estruturada com foco em **Primeira Porta** (regex e texto da página; fallback genérico para outros hosts).
- Modelos `Property` e `PropertyHistory`; campos alinhados ao painel (preço, localização, tipo venda/aluguel, etc.).

### Fase 2: Frontend e integração (Concluída)

- Next.js App Router, Tailwind, componentes estilo Shadcn.
- Dashboard com listagem, filtros, cartões e diálogo “Monitorar imóvel”.
- **Dados reais:** o frontend chama `GET /api/properties` via **SWR**; o Next.js faz **rewrite** de `/api/*` para `http://localhost:8000/api/*`.
- **Cadastro:** `POST /api/properties` com `{ "url": "..." }` dispara o scraper, persiste no SQLite e devolve o imóvel em JSON **camelCase** (inclui campo `type` para venda/aluguel).

### Fase 3: Comunicação avançada e jobs (Pendente)

O que **já existe** hoje:

- API REST: listar, obter por id, criar (com scrape) e excluir imóveis.
- Primeiro registro em `PropertyHistory` na criação.
- Scraper trata HTTP 404/410 como indisponível; falhas de execução retornam erro ao cliente.

O que **ainda não** está implementado:

- **APScheduler** acoplado ao `lifespan` do FastAPI.
- Job recorrente que relê todas as URLs ativas, compara preço, grava novas linhas em `PropertyHistory` e atualiza `previous_price` / status derivado no painel.
- Notificações ou alertas fora do próprio refresh da página.

### Fase 4: Inteligência Artificial (Busca Semântica) — Planejada

- Campo extra (JSON) em `Property` para descrição/facilidades.
- Embeddings (`sentence-transformers` ou serviço externo) e endpoint de busca.
- UI de busca em linguagem natural no Next.js.

---

## Backlog futuro (pós-MVP)

- **Autenticação:** multi-tenant, JWT ou Clerk no Next.js.
- **Deploy:** PostgreSQL (Supabase/Neon), FastAPI em Docker/VPS, frontend na Vercel.
- **Notificações:** e-mail (ex.: Resend) ou Web Push quando o preço mudar ou o anúncio sumir.
- **Scraping multi-portal:** adaptadores para ZAP, VivaReal, etc., além da Primeira Porta.
