# Arquitetura e fluxo de dados

O **Monitora Imóveis** separa **frontend** (Next.js), **backend** (FastAPI) e **persistência** (SQLite). A autenticação é feita pelo **Clerk** no browser; o **FastAPI** valida o JWT e aplica **multi-tenant** por `user_id` em `Property`. O painel permite **listar, adicionar por URL, editar campos manuais, favoritar e excluir** (Fase 2d). A atualização periódica em massa (**job** interno) ainda não está implementada; o fluxo principal hoje é **cadastro sob demanda** + **leitura** + **edição manual** quando o scrape não preenche tudo.

## Componentes

### 1. Frontend (Next.js — App Router)

- **Autenticação:** **Clerk** (`@clerk/nextjs`) — `ClerkProvider` no layout, `middleware.ts` protege rotas de página (exceto `/sign-in` e `/sign-up`); o proxy `/api/*` **não** passa por `auth.protect()` no middleware (a API valida o Bearer). Chamadas ao backend usam `Authorization: Bearer <JWT>` via `useAuth().getToken()` em `src/lib/api.ts`.
- **Dashboard e formulário** são *Client Components* (`"use client"`): estado de busca/filtros (inclui filtro **Favoritos** e busca por comentário), **SWR** para `GET /api/properties`, `useDeferredValue` / `useTransition` onde aplicável. **Sonner** para *toasts* após ações (edição, favorito, exclusão).
- **CRUD no painel:** cada cartão oferece favoritar, abrir **edição** (`edit-property-dialog.tsx`: bairro, preço, comentário, status persistido) e **excluir** com confirmação; após sucesso chama-se `mutate()` do SWR.
- **Proxy de desenvolvimento:** em `next.config.ts`, requisições a `/api/:path*` são reencaminhadas para `http://localhost:8000/api/:path*`, permitindo chamadas relativas `/api/properties` no browser.
- **Estilo:** Tailwind CSS e componentes no padrão shadcn/base.
- **Tipos:** `src/lib/types.ts` espelha o contrato JSON da API (camelCase).

### 2. Backend (FastAPI)

- **`main.py`:** aplicação FastAPI, CORS, `lifespan` que cria tabelas SQLite, executa **migração idempotente** SQLite ([migrations_sqlite.py](../backend/migrations_sqlite.py)) e dispõe o engine ao encerrar; `load_dotenv()` para `CLERK_ISSUER`.
- **`auth.py`:** validação do JWT do Clerk (JWKS em `{CLERK_ISSUER}/.well-known/jwks.json`, algoritmo RS256); dependência `get_current_user_id` em todas as rotas de imóveis.
- **`routers/properties.py`:** rotas REST sob prefixo `/api/properties`; dados filtrados por `user_id` (multi-tenant); `PATCH` para atualização parcial (campos manuais).
- **`scraper.py`:** `fetch_property_data(url)` assíncrono com Playwright; **Primeira Porta** (`primeiraporta.com.br`) com extração por texto/regex; **i9vale** (`i9vale.com.br`, plataforma Kenlo) com rotina dedicada (rótulos colados ao número, linha “Localização”, slug `...-N-quartos-M-m...` na URL); demais hosts com fallback genérico e os mesmos padrões de URL quando aplicável.
- **`schemas.py`:** modelos Pydantic de resposta com `alias_generator` camelCase; campo interno `property_type` serializado como **`type`** no JSON; **`listingStatus`** expõe o status persistido no banco; **`status`** continua **derivado** para o painel (ativo, indisponível, preço subiu/caiu).

### 3. Persistência (SQLite + SQLModel)

- Arquivo típico: `backend/database.db` (criado na primeira subida da API).
- **`Property`:** `user_id` (string Clerk), URL **única por usuário** (constraint composta `user_id` + `url`), demais dados do anúncio, `comment` e `favorite` (edição manual), `status` de saúde do scrape/listagem (`active` / `inactive` / `error`, conforme modelo).
- **`PropertyHistory`:** histórico de preço por verificação; na prática MVP, entradas adicionais dependem da **Fase 3** (job periódico).

#### Normalização e dados derivados

O modelo segue um relacionamento **1:N** clássico (imóvel → várias linhas de histórico), adequado à **3NF** para a série temporal: não há grupos repetidos nem dependências parciais entre colunas da mesma linha de histórico.

A tabela **`Property`** mantém o **último estado conhecido** do anúncio (preço, status operacional, etc.), enquanto **`PropertyHistory`** guarda a **série** de verificações. Essa duplicação do “preço atual” em relação ao último ponto da série é uma **denormalização leve** voltada ao padrão de leitura do painel (OLTP: listagem e cartões sem agregar histórico em toda requisição). Faz sentido enquanto o volume por usuário for modesto.

Para uma auditoria detalhada frente às boas práticas de schema (FK, índices, tipos monetários, migrações), ver **[database-evaluation.md](database-evaluation.md)**.

### 4. Jobs em background (planejado)

- **APScheduler** (dependência já no `requirements.txt`) ainda **não** está ligado ao `main.py`.
- Objetivo futuro: rodar o scraper em intervalos fixos, atualizar preços e status sem ação do usuário (respeitando `user_id` por imóvel).

---

## Fluxo de dados

### A. Incluir imóvel (fluxo implementado)

```mermaid
sequenceDiagram
    participant Browser as Navegador
    participant Clerk as Clerk
    participant Next as Next.js
    participant API as FastAPI
    participant PW as Playwright
    participant DB as SQLite

    Browser->>Clerk: Sessão ativa
    Browser->>Next: Cola URL e envia formulário
    Next->>Next: getToken()
    Next->>API: POST /api/properties + Bearer JWT
    API->>API: Valida JWT e extrai user_id
    API->>PW: fetch_property_data(url)
    PW-->>API: dados estruturados ou erro
    API->>DB: INSERT Property user_id + PropertyHistory
    API-->>Next: 201 + JSON camelCase
    Next->>Next: SWR mutate atualiza lista
```

### B. Listar imóveis (fluxo implementado)

```mermaid
sequenceDiagram
    participant Browser as Navegador
    participant Next as Next.js dev server
    participant API as FastAPI
    participant DB as SQLite

    Browser->>Next: GET /api/properties + Bearer JWT
    Next->>API: rewrite para localhost:8000
    API->>API: Valida JWT e extrai user_id
    API->>DB: SELECT Property WHERE user_id = ...
    API-->>Browser: JSON lista
```

### C. Atualização periódica (não implementado)

```mermaid
sequenceDiagram
    participant Cron as APScheduler
    participant DB as SQLite
    participant PW as Playwright

    Note over Cron,PW: Planejado na Fase 3
    Cron->>DB: SELECT propriedades ativas
    loop Cada URL
        Cron->>PW: Re-scrape
        PW-->>Cron: Novo preço ou indisponível
        Cron->>DB: UPDATE Property e INSERT PropertyHistory
    end
```

### D. Editar ou excluir imóvel (fluxo implementado)

```mermaid
sequenceDiagram
    participant Browser as Navegador
    participant Next as Next.js
    participant API as FastAPI
    participant DB as SQLite

    Browser->>Next: PATCH ou DELETE /api/properties/id + Bearer JWT
    Next->>API: rewrite para localhost:8000
    API->>API: Valida JWT e user_id do imóvel
    API->>DB: UPDATE Property ou DELETE + históricos
    API-->>Next: 200 JSON (PATCH) ou 204 (DELETE)
    Next->>Next: SWR mutate / toast
```

---

## Contrato da API (resumo)

Todas as rotas abaixo exigem cabeçalho **`Authorization: Bearer <JWT>`** (sessão Clerk). Respostas **401** se o token estiver ausente ou inválido. Detalhe/get/delete de outro usuário → **404**.

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/api/properties` | Lista imóveis do usuário com histórico agregado na resposta |
| `GET` | `/api/properties/{id}` | Detalhe de um imóvel (se pertencer ao usuário) |
| `POST` | `/api/properties` | Corpo `{"url": "https://..."}` — scrape + persistência com `user_id` |
| `PATCH` | `/api/properties/{id}` | Atualização parcial (camelCase): `neighborhood`, `price`, `comment`, `favorite`, `status` (`active` \| `inactive` \| `error`). Alterar `price` aqui **não** insere linha em `PropertyHistory`. |
| `DELETE` | `/api/properties/{id}` | Remove monitoramento (se pertencer ao usuário) |

Health check: `GET /` na raiz do FastAPI.

---

## Referências no repositório

| Pasta / arquivo | Papel |
|-----------------|--------|
| `backend/main.py` | App, CORS, lifespan, migração SQLite no startup |
| `backend/migrations_sqlite.py` | Colunas novas em DBs antigos (`ALTER` idempotente) |
| `backend/auth.py` | Validação JWT Clerk |
| `backend/database.py` | Engine e sessão |
| `backend/models.py` | Entidades SQLModel |
| `backend/schemas.py` | Serialização da API |
| `backend/routers/properties.py` | Rotas REST |
| `backend/scraper.py` | Playwright |
| `frontend/src/middleware.ts` | Clerk: proteção de rotas de página |
| `frontend/src/app/sign-in/[[...sign-in]]/page.tsx` | UI de login |
| `frontend/src/app/sign-up/[[...sign-up]]/page.tsx` | UI de cadastro |
| `frontend/src/lib/api.ts` | Chamadas HTTP com Bearer (`fetchProperties`, `addProperty`, `updateProperty`, `deleteProperty`) |
| `frontend/src/components/edit-property-dialog.tsx` | Formulário de edição manual |
| `frontend/next.config.ts` | Rewrite `/api` → backend |
| `docs/database-evaluation.md` | Aderência à skill database-schema-designer (checklist, backlog, go/no-go) |
