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
| `schemas.py` | Respostas Pydantic (camelCase para o frontend) |
| `routers/properties.py` | REST `/api/properties` |
| `scraper.py` | Extração assíncrona com Playwright |
| `tests/` | Smoke tests de auth (`pytest`) |

O ficheiro `database.db` é criado na primeira subida (ignorado pelo Git). Schema antigo sem `user_id`: apague `database.db` e suba a API de novo.

## Documentação

- [docs/arquitetura.md](../docs/arquitetura.md) — fluxos e contrato da API (Bearer obrigatório)
- [docs/database-evaluation.md](../docs/database-evaluation.md) — notas sobre o schema SQLite

## Testes

Com o venv ativo e `CLERK_ISSUER` definido (pode ser um valor de teste coerente com os testes):

```bash
python -m pytest tests/ -v
```
