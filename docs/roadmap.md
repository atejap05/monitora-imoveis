# Roadmap e Backlog (Monitora Imóveis)

Este documento descreve a visão de produto, o estado das fases e o backlog pós-MVP.

---

## Estado das fases (visão geral)

| Fase   | Tema                                                                                        | Estado    |
| ------ | ------------------------------------------------------------------------------------------- | --------- |
| **1**  | Fundação backend (FastAPI, SQLite, Playwright, scraper)                                     | Concluída |
| **2**  | Frontend (Next.js, Dashboard, UI, tema claro/escuro)                                        | Concluída |
| **2b** | Integração API (REST, CORS, painel com dados reais)                                         | Concluída |
| **2c** | Autenticação (Clerk), JWT no FastAPI, multi-tenant por `user_id`                            | Concluída |
| **2d** | CRUD completo (edição manual, favoritos, exclusão na UI)                                    | Concluída |
| **3**  | Jobs em background, re-scrape periódico, histórico de preço evolutivo                       | Concluída |
| **4**  | Busca semântica (IA)                                                                        | Planejada |
| **5**  | Migração para PostgreSQL (produção), Alembic/migrações versionadas, deploy (API + frontend) | Em andamento |

---

**Estado atual (snapshot):** o MVP está funcional em desenvolvimento local: FastAPI com **SQLite** (`database.db`, `migrations_sqlite.py` idempotente) quando `DATABASE_URL` não está definido; com **`DATABASE_URL`** (ex.: **Neon** + `postgresql+psycopg://...`) o backend usa **PostgreSQL** e **Alembic** (`alembic/`, `alembic upgrade head` no arranque). Script opcional `backend/scripts/migrate_data.py` para copiar dados do SQLite para o Neon. Next.js com dados reais via rewrite para a API, Clerk e fluxos das Fases 2c–3 concluídos. **Pendente na Fase 5:** pipeline de deploy (API + frontend) e URL pública da API; o trabalho seguinte concentra-se nisso antes de evoluir a Fase 4 (IA) e o restante do backlog.

---

### Fase 1: Fundação do Sistema (Concluída)

- Repositório com `backend/` e `frontend/`.
- FastAPI, SQLModel/SQLAlchemy, SQLite (`database.db`).
- Playwright (Chromium headless) em `scraper.py`.
- Extração estruturada: **Primeira Porta**; **i9vale.com.br** (Kenlo — rótulos, URL com `-N-quartos-M-m`); **fallback genérico** para outros hosts com regex reforçadas e dicas de URL quando o slug permitir.
- Modelos `Property` e `PropertyHistory`; campos alinhados ao painel (preço, localização, tipo venda/aluguel, etc.).

### Fase 2: Frontend e integração (Concluída)

- Next.js App Router, Tailwind, componentes estilo Shadcn.
- Dashboard com listagem, filtros, cartões e diálogo “Monitorar imóvel”.
- **Dados reais:** o frontend chama `GET /api/properties` via **SWR**; o Next.js faz **rewrite** de `/api/*` para `http://localhost:8000/api/*`.
- **Cadastro:** `POST /api/properties` com `{ "url": "..." }` dispara o scraper, persiste no SQLite e devolve o imóvel em JSON **camelCase** (inclui campo `type` para venda/aluguel).

#### Tema claro/escuro (dark mode) — implementado

- **`next-themes`** com `ThemeProvider` no layout raiz (`attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`).
- **Tokens e estilos** em `globals.css` para modo claro e escuro (variáveis CSS / Tailwind `dark:`).
- **Controle na UI:** componente `ModeToggle` (ícones sol/lua) para alternar entre claro e escuro; preferência persistida pelo `next-themes`.
- **Hidratação:** `suppressHydrationWarning` em `<html>` e `<body>` para evitar avisos quando extensões do navegador alteram atributos do DOM antes da hidratação.

### Fase 2c: Autenticação e multi-tenant (Concluída)

- **Clerk** no frontend (`@clerk/nextjs`): `ClerkProvider`, rotas `/sign-in` e `/sign-up`, `src/proxy.ts` protegendo páginas (exceto auth), `UserButton`, token via `useAuth().getToken()`.
- **FastAPI:** `auth.py` valida JWT (RS256, JWKS do issuer Clerk); todas as rotas `/api/properties` exigem `Authorization: Bearer <token>`.
- **Dados:** `Property.user_id` (ID Clerk); unicidade de URL **por usuário** (`user_id` + `url`); listagem e CRUD filtrados por usuário.
- **Variáveis:** `frontend/.env.local` (chaves Clerk), `backend/.env` (`CLERK_ISSUER` = Frontend API URL / claim `iss`). Ver [README.md](../README.md).

### Fase 2d: CRUD completo (Concluída)

- **Modelo:** `Property` com `comment` (até 2000 caracteres) e `favorite` (boolean); migração SQLite idempotente em [migrations_sqlite.py](../backend/migrations_sqlite.py) no arranque da API.
- **API:** `PATCH /api/properties/{id}` com corpo parcial (camelCase via aliases Pydantic): `neighborhood`, `price`, `comment`, `favorite`, `status` (`active` \| `inactive` \| `error`). Alterar `price` aqui **não** grava `PropertyHistory` (histórico evolutivo continua ligado ao scrape / Fase 3).
- **Resposta JSON:** além de `status` (derivado para o painel), expõe **`listingStatus`** com o status persistido no banco (útil para o formulário de edição). Inclui `comment` e `favorite`.
- **Frontend:** `updateProperty` em [api.ts](../frontend/src/lib/api.ts); cartões com favorito (estrela), edição em dialog ([edit-property-dialog.tsx](../frontend/src/components/edit-property-dialog.tsx)), exclusão com confirmação, **Sonner** para _toasts_, `mutate` SWR após ações; filtro **Favoritos** e estatística de favoritos na barra; busca inclui comentário.

**Semântica de status:** o painel continua usando `status` derivado (ex.: `price_drop`). O usuário ajusta o cadastro via `listingStatus` / campo `status` no PATCH; marcar como **indisponível** grava `inactive` no banco e reflete na UI.

### Fase 3: Comunicação avançada e jobs (Concluída)

- **APScheduler** (`AsyncIOScheduler`) no `lifespan` do FastAPI ([`scheduler.py`](../backend/scheduler.py)).
- Job **global** (`rescrape_all_active_global` em [`jobs.py`](../backend/jobs.py)): `SELECT` imóveis `status = active`, re-scrape com Playwright; semáforo `RESCRAPE_MAX_CONCURRENT`; intervalo `RESCRAPE_INTERVAL_HOURS` (default 12h).
- **Histórico evolutivo:** `apply_scrape_to_property` atualiza `previous_price` / `price`, grava `PropertyHistory` em mudança de preço, indisponível (404/410) ou reativação; erros de scrape marcam `status = error` sem poluir histórico.
- **API manual:** `POST /api/properties/rescrape` — batch **por usuário** (fila sequencial de todos os ativos do `user_id`); resposta com resumo e `results` por imóvel.
- **Observabilidade:** `GET /api/jobs/status` — última execução agendada, próxima execução, métricas do último ciclo (requer JWT).
- **Frontend:** toolbar no dashboard ([`dashboard-toolbar.tsx`](../frontend/src/components/dashboard-toolbar.tsx)) com **Atualizar todos** (toast + `mutate` SWR); `rescrapeAll` e `fetchJobStatus` em [`api.ts`](../frontend/src/lib/api.ts).

**Backlog (pós-Fase 3):** notificações por e-mail/Web Push fora do painel; métricas persistidas em banco.

### Fase 4: Inteligência Artificial (Busca Semântica) — Planejada

- Campo extra (JSON) em `Property` para descrição/facilidades.
- Embeddings (`sentence-transformers` ou serviço externo) e endpoint de busca.
- UI de busca em linguagem natural no Next.js.

---

## Backlog futuro (pós-MVP)

Ordem sugerida: **primeiro** estabilizar dados e hospedagem (**Fase 5**); **depois** incrementos de produto e IA (Fase 4 e itens abaixo).

### Prioridade imediata — Fase 5 (migração + deploy)

- **PostgreSQL em produção:** **implementado** — [`database.py`](../backend/database.py) lê **`DATABASE_URL`** (ex.: **Neon** com `postgresql+psycopg://...?sslmode=require`); sem variável, mantém SQLite local. Constraints e unicidade `user_id` + `url` aplicadas no Postgres.
- **Migrações versionadas:** **Alembic** em [`backend/alembic/`](../backend/alembic/); SQLite local continua com `create_all` + [`migrations_sqlite.py`](../backend/migrations_sqlite.py). Ver [backend/README.md](../backend/README.md) e [database-evaluation.md](database-evaluation.md).
- **Dados existentes:** script one-off [`backend/scripts/migrate_data.py`](../backend/scripts/migrate_data.py) (SQLite → Postgres com `TRUNCATE` + `setval` das sequences).
- **Deploy do backend:** [`Dockerfile`](../backend/Dockerfile) com **Playwright/Chromium**; expor HTTPS; `CLERK_ISSUER`, **`CORS_ORIGINS`**, `DATABASE_URL`, `RESCRAPE_*`. CI valida a imagem em [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
- **Deploy do frontend:** **Vercel** (ou similar); **`NEXT_PUBLIC_API_URL`** = URL base da API (o rewrite do Next é só para dev); variáveis **Clerk** de produção.
- **Documentação de deploy:** guia operacional em **[deploy.md](deploy.md)** (matriz de variáveis, ordem de provisionamento, checklist).
