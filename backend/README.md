# Backend — Monitora Imóveis

API **FastAPI** com **SQLModel** (SQLite), validação de **JWT do Clerk** (`auth.py`), scraping com **Playwright** (`scraper.py`).

## Configuração e execução

O guia completo (venv, Playwright, variável `CLERK_ISSUER`, CORS e fluxo com o frontend) está no **[README da raiz do repositório](../README.md)** — secção *Backend* e *Autenticação (Clerk)*.

### Resumo rápido

1. `python3 -m venv venv` e ative o venv (`source venv/bin/activate` no macOS/Linux ou `.\venv\Scripts\activate` no Windows).
2. `pip install -r requirements.txt` e `playwright install chromium`.
3. Copie `.env.example` para `.env` e defina `CLERK_ISSUER` (Frontend API URL do Clerk).
4. Na pasta `backend`: `fastapi dev main.py` — API em [http://127.0.0.1:8000](http://127.0.0.1:8000) (health: `GET /`).

Após `git pull`, rode de novo `pip install -r requirements.txt` para pegar dependências novas (ex.: PyJWT).

## Estrutura relevante

| Arquivo / pasta | Função |
|-----------------|--------|
| `main.py` | App FastAPI, CORS, `load_dotenv()`, lifespan |
| `auth.py` | Validação JWT (JWKS do issuer Clerk) |
| `database.py` | Engine SQLite e `get_session` |
| `models.py` | `Property`, `PropertyHistory` (multi-tenant: `user_id`) |
| `migrations_sqlite.py` | `ALTER TABLE` idempotente para colunas novas em DBs antigos |
| `schemas.py` | Respostas Pydantic (camelCase para o frontend) |
| `routers/properties.py` | REST `/api/properties` |
| `scraper.py` | Extração assíncrona com Playwright (Primeira Porta, i9vale/Kenlo, fallback) |
| `tests/` | Smoke tests de auth e rotas protegidas (`pytest`) |

O ficheiro `database.db` é criado na primeira subida (ignorado pelo Git). Schema antigo sem `user_id`: apague `database.db` e suba a API de novo.

### Migrações SQLite (colunas novas)

O projeto não usa Alembic. Em cada arranque da API, após `create_db_and_tables()`, corre-se [migrations_sqlite.py](migrations_sqlite.py) de forma **idempotente** (`PRAGMA table_info` + `ALTER TABLE ... ADD COLUMN` só quando falta a coluna). Isto permite evoluir o schema local (ex. `favorite`, `comment`) sem apagar o `database.db` dos developers. Em produção com **PostgreSQL** (planeado), convém migrar para **Alembic** ou migrações geridas pela plataforma.

## Documentação

- [docs/arquitetura.md](../docs/arquitetura.md) — fluxos e contrato da API (Bearer obrigatório)
- [docs/database-evaluation.md](../docs/database-evaluation.md) — notas sobre o schema SQLite

## Testes

Com o venv ativo e `CLERK_ISSUER` definido (pode ser um valor de teste coerente com os testes):

```bash
python -m pytest tests/ -v
```

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
