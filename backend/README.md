# Backend — Monitora Imóveis

API **FastAPI** com **SQLModel** / **SQLAlchemy**, validação de **JWT do Clerk** (`auth.py`), scraping com **Playwright** (`scraper.py`).

## Próximo passo: deploy em produção

Guia completo (CORS, `NEXT_PUBLIC_API_URL`, Docker, Neon, Clerk, checklist): **[docs/deploy.md](../docs/deploy.md)**. CI no repositório: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Persistência

| Modo | Quando | Comportamento |
|------|--------|----------------|
| **SQLite** | `DATABASE_URL` **não** definido | Ficheiro `database.db`, `create_all` + [`migrations_sqlite.py`](migrations_sqlite.py) idempotente, `PRAGMA foreign_keys=ON` em [`database.py`](database.py). |
| **PostgreSQL** | `DATABASE_URL` definido (ex.: **Neon**) | [`alembic upgrade head`](alembic/) no arranque da API; use **`postgresql+psycopg://`** (psycopg 3). Ex.: `postgresql+psycopg://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`. |

Variáveis: ver [`.env.example`](.env.example).

### Migração de dados (SQLite → Neon)

Com o destino vazio (ou aceitando `TRUNCATE`):

```bash
cd backend
DATABASE_URL='postgresql+psycopg://...' python scripts/migrate_data.py
```

Opcional: `--sqlite /caminho/para/database.db`.

## Configuração e execução

O guia completo (venv, Playwright, variável `CLERK_ISSUER`, CORS e fluxo com o frontend) está no **[README da raiz do repositório](../README.md)** — secção *Backend* e *Autenticação (Clerk)*.

### Resumo rápido

1. `python3 -m venv venv` e ative o venv (`source venv/bin/activate` no macOS/Linux ou `.\venv\Scripts\activate` no Windows).
2. `pip install -r requirements.txt` e `playwright install chromium`.
3. Copie `.env.example` para `.env` e defina `CLERK_ISSUER` (Frontend API URL do Clerk). Para Postgres/Neon, defina também `DATABASE_URL`.
4. Na pasta `backend`: `fastapi dev main.py` — API em [http://127.0.0.1:8000](http://127.0.0.1:8000) (health: `GET /`).

Após `git pull`, rode de novo `pip install -r requirements.txt` para pegar dependências novas (ex.: PyJWT, psycopg, Alembic).

## Estrutura relevante

| Arquivo / pasta | Função |
|-----------------|--------|
| `main.py` | App FastAPI, CORS, `load_dotenv()`, lifespan (schema + scheduler) |
| `auth.py` | Validação JWT (JWKS do issuer Clerk) |
| `database.py` | Engine SQLite ou Postgres (`DATABASE_URL`), `get_session` |
| `models.py` | `Property`, `PropertyHistory` (multi-tenant: `user_id`; preços `Numeric`/`Decimal`) |
| `migrations_sqlite.py` | `ALTER TABLE` idempotente só para SQLite (DBs antigos) |
| `alembic/` | Migrações versionadas para **PostgreSQL** |
| `schemas.py` | Respostas Pydantic (camelCase; valores monetários como float no JSON) |
| `routers/properties.py` | REST `/api/properties` |
| `scraper.py` | Extração assíncrona com Playwright (Primeira Porta, i9vale/Kenlo, fallback) |
| `adapters/` | (opcional/WIP) adaptadores por portal; o scraper principal usa rotinas dedicadas acima |
| `scripts/migrate_data.py` | Cópia one-off SQLite → Postgres |
| `tests/` | Auth e rotas (`pytest`); `test_adapters.py` para adaptadores quando em uso |

O ficheiro `database.db` é criado na primeira subida em modo SQLite (ignorado pelo Git). Schema antigo sem `user_id`: apague `database.db` e suba a API de novo.

## Documentação

- [docs/arquitetura.md](../docs/arquitetura.md) — fluxos e contrato da API (Bearer obrigatório)
- [docs/database-evaluation.md](../docs/database-evaluation.md) — notas sobre o schema e alinhamento com boas práticas
- [docs/portals-scraping.md](../docs/portals-scraping.md) — portais suportados e limitações de scraping

## Testes

Com o venv ativo e `CLERK_ISSUER` definido (pode ser um valor de teste coerente com os testes):

```bash
python -m pytest tests/ -v
```

`TESTING=1` é definido em `tests/conftest.py` para o lifespan usar `create_all` + SQLite (e não Alembic), mesmo que exista `DATABASE_URL` no `.env`.

### Exemplo: PATCH de imóvel (Bearer obrigatório)

Atualização parcial; envie apenas os campos a alterar (camelCase). Exemplo — favorito e comentário:

```bash
curl -sS -X PATCH "http://127.0.0.1:8000/api/properties/1" \
  -H "Authorization: Bearer SEU_JWT" \
  -H "Content-Type: application/json" \
  -d "{\"favorite\":true,\"comment\":\"Visita sexta 15h\"}"
```

Campos opcionais: `neighborhood`, `price`, `comment`, `favorite`, `status`. Alterar `price` no PATCH **não** cria linha em `PropertyHistory` (o histórico evolutivo fica para o job de re-scrape / Fase 3).

### Scraper e portais

- **primeiraporta.com.br:** extração por regex no texto da página.
- **i9vale.com.br** (Kenlo): rotina dedicada; uso de rótulos (“Quartos”, “Área útil”, “Localização”), detecção de venda/aluguel via `?from=sale` / `?from=rent` e fallback pelo slug da URL (`...-N-quartos-M-m...`).
- **Demais domínios:** fallback genérico; resultados podem ser incompletos — o usuário pode corrigir no painel (`PATCH`) ou ao adicionar de novo o anúncio após melhorias no scraper.
