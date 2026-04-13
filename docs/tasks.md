# Task List — Monitora Imóveis MVP

Última revisão alinhada ao código em `backend/` e `frontend/`.

## Fase 1: Setup da fundação (Backend)

- [x] Pasta `backend` e dependências (FastAPI, Uvicorn, SQLModel/SQLAlchemy, SQLite, Playwright)
- [x] `main.py` com lifespan, CORS para `localhost:3000` / `127.0.0.1:3000`
- [x] `database.py` (engine SQLite, `get_session`)
- [x] Modelos `Property` e `PropertyHistory` com campos usados pelo painel
- [x] `schemas.py` — respostas Pydantic com nomes JSON em camelCase (ex.: `previousPrice`, campo `type` para venda/aluguel)
- [x] `routers/properties.py` — `GET /api/properties`, `GET /api/properties/{id}`, `POST /api/properties`, `DELETE /api/properties/{id}`
- [x] `scraper.py` — Playwright assíncrono; extração estruturada (Primeira Porta + fallback)

## Fase 2: Frontend (painel)

- [x] Next.js (App Router, TypeScript, Tailwind)
- [x] UI (lucide-react, componentes base estilo shadcn)
- [x] Dashboard: lista, busca, filtros por status, barra de estatísticas
- [x] Diálogo para colar URL e adicionar imóvel
- [x] Integração com API: **SWR** + `fetch` em `src/lib/api.ts`; tipos em `src/lib/types.ts`
- [x] Proxy Next.js (`next.config.ts`): `/api/*` → `http://localhost:8000/api/*`
- [x] Dados mock opcionais em `src/lib/mock-data.ts` (não usados pelo fluxo principal)

## Fase 3: Background jobs e regras de negócio

- [ ] Integrar **APScheduler** no FastAPI (`lifespan` / startup)
- [ ] Job periódico: listar `Property` ativos, reexecutar scraper por URL
- [ ] Atualizar `previous_price`, `price`, status e inserir novas entradas em `PropertyHistory` quando o preço ou disponibilidade mudar
- [ ] Tratamento consistente de anúncio indisponível (404/410/erro) no job (não só no POST inicial)

## Fase 4: Refinamento e busca semântica

- [ ] Bibliotecas de IA (ex.: `sentence-transformers` ou LlamaIndex)
- [ ] Vetorizar descrições na ingestão
- [ ] Endpoint de busca semântica
- [ ] Campo de busca avançada no frontend
