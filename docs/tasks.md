# Task List — Monitora Imóveis MVP

Última revisão alinhada ao código em `backend/` e `frontend/` (painel com CRUD, scraper multi-domínio).

## Fase 1: Setup da fundação (Backend)

- [x] Pasta `backend` e dependências (FastAPI, Uvicorn, SQLModel/SQLAlchemy, SQLite, Playwright)
- [x] `main.py` com lifespan, CORS para `localhost:3000` / `127.0.0.1:3000`
- [x] `database.py` (engine SQLite, `get_session`)
- [x] Modelos `Property` e `PropertyHistory` com campos usados pelo painel
- [x] `schemas.py` — respostas Pydantic com nomes JSON em camelCase (ex.: `previousPrice`, campo `type` para venda/aluguel)
- [x] `routers/properties.py` — `GET /api/properties`, `GET /api/properties/{id}`, `POST /api/properties`, `DELETE /api/properties/{id}`
- [x] `scraper.py` — Playwright assíncrono; Primeira Porta; **i9vale.com.br** (Kenlo); fallback genérico com padrões de URL `...-N-quartos-M-m...` quando existir

## Fase 2: Frontend (painel)

- [x] Next.js (App Router, TypeScript, Tailwind)
- [x] UI (lucide-react, componentes base estilo shadcn)
- [x] Dashboard: lista, busca, filtros por status, barra de estatísticas
- [x] Diálogo para colar URL e adicionar imóvel
- [x] Integração com API: **SWR** + `fetch` em `src/lib/api.ts` (com token Clerk); tipos em `src/lib/types.ts`
- [x] Proxy Next.js (`next.config.ts`): `/api/*` → `http://localhost:8000/api/*`
- [x] Dados mock opcionais em `src/lib/mock-data.ts` (não usados pelo fluxo principal)

## Fase 2c: Autenticação e multi-tenant

- [x] Clerk (`@clerk/nextjs`): `ClerkProvider`, páginas `/sign-in` e `/sign-up`, `src/proxy.ts` (Next.js 16+)
- [x] `Property.user_id` + constraint única (`user_id`, `url`); rotas filtradas por usuário
- [x] `backend/auth.py` — JWT Clerk (JWKS), `get_current_user_id`
- [x] Dependências: `PyJWT`, `cryptography`; `backend/.env.example` com `CLERK_ISSUER`
- [x] Smoke tests: `backend/tests/test_auth_properties.py` (401 sem token / token inválido; inclui `PATCH` sem auth)

## Fase 2d: CRUD completo (painel + API)

- [x] Modelo `Property`: `comment`, `favorite`; migração SQLite idempotente (`migrations_sqlite.py` no startup)
- [x] `PATCH /api/properties/{id}` — corpo parcial; resposta com `listingStatus`, `comment`, `favorite`
- [x] Frontend: `updateProperty`, `deleteProperty` na UI; `EditPropertyDialog`; favorito e exclusão com confirmação; **Sonner**; filtro e estatística de favoritos; busca por comentário

## Fase 3: Background jobs e regras de negócio

- [x] Integrar **APScheduler** no FastAPI (`lifespan` / startup) — [`scheduler.py`](../backend/scheduler.py), `DISABLE_SCHEDULER` para testes
- [x] Job periódico global: `Property` com `status=active`, re-scrape com semáforo; batch manual `POST /api/properties/rescrape` por `user_id`
- [x] Atualizar `previous_price`, `price`, status e `PropertyHistory` em mudança de preço, indisponível ou reativação — [`jobs.py`](../backend/jobs.py)
- [x] Tratamento de indisponível (404/410), erro de scrape e reativação; `GET /api/jobs/status`
- [x] Frontend: toolbar **Atualizar todos** — [`dashboard-toolbar.tsx`](../frontend/src/components/dashboard-toolbar.tsx)

## Fase 4: Refinamento e busca semântica

- [ ] Bibliotecas de IA (ex.: `sentence-transformers` ou LlamaIndex)
- [ ] Vetorizar descrições na ingestão
- [ ] Endpoint de busca semântica
- [ ] Campo de busca avançada no frontend
