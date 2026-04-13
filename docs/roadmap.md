# Roadmap e Backlog (Monitora Imóveis)

Este documento descreve a visão de produto, o estado das fases e o backlog pós-MVP.

---

## Estado das fases (visão geral)

| Fase | Tema | Estado |
|------|------|--------|
| **1** | Fundação backend (FastAPI, SQLite, Playwright, scraper) | Concluída |
| **2** | Frontend (Next.js, Dashboard, UI, tema claro/escuro) | Concluída |
| **2b** | Integração API (REST, CORS, painel com dados reais) | Concluída |
| **2c** | Autenticação (Clerk), JWT no FastAPI, multi-tenant por `user_id` | Concluída |
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

#### Tema claro/escuro (dark mode) — implementado

- **`next-themes`** com `ThemeProvider` no layout raiz (`attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`).
- **Tokens e estilos** em `globals.css` para modo claro e escuro (variáveis CSS / Tailwind `dark:`).
- **Controle na UI:** componente `ModeToggle` (ícones sol/lua) para alternar entre claro e escuro; preferência persistida pelo `next-themes`.
- **Hidratação:** `suppressHydrationWarning` em `<html>` e `<body>` para evitar avisos quando extensões do navegador alteram atributos do DOM antes da hidratação.

### Fase 2c: Autenticação e multi-tenant (Concluída)

- **Clerk** no frontend (`@clerk/nextjs`): `ClerkProvider`, rotas `/sign-in` e `/sign-up`, `middleware.ts` protegendo páginas (exceto auth), `UserButton`, token via `useAuth().getToken()`.
- **FastAPI:** `auth.py` valida JWT (RS256, JWKS do issuer Clerk); todas as rotas `/api/properties` exigem `Authorization: Bearer <token>`.
- **Dados:** `Property.user_id` (ID Clerk); unicidade de URL **por usuário** (`user_id` + `url`); listagem e CRUD filtrados por usuário.
- **Variáveis:** `frontend/.env.local` (chaves Clerk), `backend/.env` (`CLERK_ISSUER` = Frontend API URL / claim `iss`). Ver [README.md](../README.md).

### Fase 3: Comunicação avançada e jobs (Pendente)

O que **já existe** hoje:

- API REST: listar, obter por id, criar (com scrape) e excluir imóveis — **com autenticação** e escopo por `user_id`.
- Primeiro registro em `PropertyHistory` na criação.
- Scraper trata HTTP 404/410 como indisponível; falhas de execução retornam erro ao cliente.

O que **ainda não** está implementado:

- **APScheduler** acoplado ao `lifespan` do FastAPI.
- Job recorrente que relê URLs ativas **por usuário** (ou global com filtro `user_id`), compara preço, grava novas linhas em `PropertyHistory` e atualiza `previous_price` / status derivado no painel.
- Notificações ou alertas fora do próprio refresh da página.

### Fase 4: Inteligência Artificial (Busca Semântica) — Planejada

- Campo extra (JSON) em `Property` para descrição/facilidades.
- Embeddings (`sentence-transformers` ou serviço externo) e endpoint de busca.
- UI de busca em linguagem natural no Next.js.

---

## Backlog futuro (pós-MVP)

- **Tempo de anúncio ativo:** monitorar e exibir há quanto tempo cada anúncio está publicado.
- **Testes automatizados:** ampliar cobertura além dos smoke tests de auth em `backend/tests/` (integração, frontend).
- **Job de scraping:** implementação completa e testes do job recorrente de re-scrape.
- **Deploy:** PostgreSQL (Supabase/Neon), FastAPI em Docker/VPS, frontend na Vercel; variáveis Clerk e CORS de produção.
- **Notificações:** e-mail (ex.: Resend) ou Web Push quando o preço mudar ou o anúncio sumir.
- **Scraping multi-portal:** adaptadores para ZAP, VivaReal, etc., além da Primeira Porta.
- **Ampliar tipos de plataformas com segurança (pesquisa regional):** antes de generalizar scrapers, fazer um levantamento sistemático de **portais relevantes**, com ênfase na **região do Vale do Paraíba** (e outros grandes hubs nacionais quando fizer sentido). Objetivos: mapear **padrões de página e estrutura de dados** (HTML, JSON embutido, APIs públicas), **termos de uso e riscos legais/técnicos**, e definir **quais domínios e fluxos** podem ser suportados de forma responsável. Com isso, evoluir o scraper com **adaptadores explícitos por portal**, testes e limites claros — em vez de heurísticas frágeis em massa.
