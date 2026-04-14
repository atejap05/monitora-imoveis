# Avaliação: skill database-schema-designer vs schema atual

Este documento aplica a *Verification Checklist* e os princípios da skill [.agents/skills/database-schema-designer/SKILL.md](../.agents/skills/database-schema-designer/SKILL.md) ao modelo em [backend/models.py](../backend/models.py) e à persistência em [backend/database.py](../backend/database.py).

**Evidência de runtime:** desenvolvimento local com **SQLite** (`PRAGMA foreign_keys` agora **ligado** por evento em [`database.py`](../backend/database.py)); produção com **PostgreSQL** (ex.: Neon) via **`DATABASE_URL`**, **FKs aplicadas**, **Alembic** para DDL versionada. Ver também [`backend/alembic/`](../backend/alembic/).

---

## 1. Matriz checklist (skill § Verification Checklist)

| Diretriz da skill | Aderência | Evidência no projeto |
|-------------------|-----------|----------------------|
| Toda tabela com PK | **Alta** | `id` INTEGER PK em `property` e `propertyhistory`. |
| Relacionamentos com FK | **Alta** | `PropertyHistory.property_id` → `property.id` com `ON DELETE CASCADE` no modelo ([`models.py`](../backend/models.py)); Alembic baseline no Postgres. |
| Enforcement de FK em runtime | **Alta (SQLite dev)** / **Alta (Postgres)** | SQLite: evento `connect` em [`database.py`](../backend/database.py) executa `PRAGMA foreign_keys=ON`. PostgreSQL: enforcement nativo. |
| ON DELETE definido por FK | **Alta** | **`ON DELETE CASCADE`** em `propertyhistory`; `DELETE` em [routers/properties.py](../backend/routers/properties.py) remove só `Property`. |
| Índice em colunas FK | **Alta** | `propertyhistory.property_id` com **índice** explícito no modelo ([`models.py`](../backend/models.py)); migração Alembic baseline cria o índice no Postgres. |
| Tipos monetários (DECIMAL, não FLOAT) | **Alta** | Colunas monetárias mapeiam para **`Numeric(12, 2)`** / `Decimal` no modelo; API continua a expor **float** no JSON ([`schemas.py`](../backend/schemas.py)). |
| UNIQUE onde necessário | **Alta** | Unicidade de **URL por usuário:** `UniqueConstraint("user_id", "url")` (`uq_property_user_url`); não há mais índice único global só em `url`. |
| CHECK / validação no BD | **Baixa** | `status`, `property_type` são VARCHAR sem constraint CHECK; validação na aplicação/Pydantic. |
| Timestamps | **Alta** | `Property`: `created_at`, `updated_at`; `PropertyHistory`: `checked_at`. |
| Migrações reversíveis | **Média (Postgres)** | **Alembic** em [`backend/alembic/`](../backend/alembic/) para PostgreSQL; SQLite local mantém `create_all` + [migrations_sqlite.py](../backend/migrations_sqlite.py) idempotente (sem DOWN). |

**Síntese de risco:** no **PostgreSQL**, FKs e tipos monetários estão alinhados à skill; no **SQLite** dev, FKs estão ativas via pragma. Evolução de schema em produção passa pelo **Alembic**.

---

## 2. Verificação SQLite (complemento)

| Verificação | Resultado |
|-------------|-----------|
| `PRAGMA foreign_keys` (SQLite, engine em `database.py`) | **1** (on) |
| Índices explícitos | `property.user_id`, `property.url`; UNIQUE `(user_id, url)`; índice em `propertyhistory.property_id` |
| DDL FK | SQLite: `ON DELETE` herdado do modelo no `create_all`. Postgres: `ON DELETE CASCADE` em `propertyhistory.property_id` (Alembic baseline). |

**Comportamento de DELETE:** `DELETE /api/properties/{id}` remove o imóvel; em **PostgreSQL** o **CASCADE** apaga `PropertyHistory`. Em **SQLite** com FKs ativas, o mesmo (CASCADE no DDL).

---

## 3. Normalização (3NF vs denormalização)

- **1NF / 2NF:** Histórico em tabela separada (`PropertyHistory`) evita repetir séries de preços em colunas da `Property` — adequado.
- **3NF:** Atributos do anúncio ficam em `Property`; não há dependência transitiva óbvia entre colunas não-chave no modelo atual.
- **Denormalização intencional:** `Property` guarda “último estado” (preço, status, etc.) enquanto `PropertyHistory` guarda série temporal — duplicação leve para leitura rápida e API; aceitável para padrão de acesso OLTP do painel (skill: denormalizar para leitura quando o padrão justifica).

Tabela `Portal` separada para `source` só faria sentido com metadados ricos por domínio — **fora do escopo do MVP**.

**Multi-tenant:** `user_id` em `property` isola dados por conta Clerk; a API aplica o filtro em todas as queries.

*(Texto resumido também em [arquitetura.md](arquitetura.md).)*

---

## 4. Backlog priorizado (alinhamento à skill)

| Prioridade | Item | Esforço | Notas |
|------------|------|---------|--------|
| P0 | Ativar `PRAGMA foreign_keys=ON` na conexão SQLite | **Feito** | Evento `connect` em [`database.py`](../backend/database.py). |
| P0 | Índice em `propertyhistory.property_id` | **Feito** | Campo com `index=True` + migração Alembic no Postgres. |
| P1 | `ON DELETE CASCADE` na FK + DELETE sem loop manual | **Feito** | [`models.py`](../backend/models.py), [`routers/properties.py`](../backend/routers/properties.py). |
| P1 | `Numeric`/`Decimal` + serialização API | **Feito** | Modelo + [`schemas.py`](../backend/schemas.py) (JSON como float). |
| P2 | `CHECK` ou `Enum` SQLAlchemy para `status` / `property_type` | **M** | Reforço no BD; SQLite 3.37+ suporta CHECK. |
| P2 | Índice composto `(status, updated_at)` em `property` se filtros do dashboard crescerem | **S** | Só após evidência de query lenta (`EXPLAIN`). |
| P3 | **Alembic** | **Feito (Postgres)** | [`backend/alembic/`](../backend/alembic/); SQLite local mantém `migrations_sqlite.py`. |
| — | Particionamento, réplicas, OLAP | **—** | Postergado (roadmap pós-MVP). |

---

## 5. Go / no-go por tema

| Tema | Recomendação | Motivo |
|------|--------------|--------|
| Habilitar FK + índice em `property_id` | **Go** | Baixo custo; alto alinhamento à skill. |
| DECIMAL/Numeric para preços | **Feito** | Modelo + API testada com `pytest`. |
| CHECK no BD | **Go condicional** | Útil após estabilizar enum de status no produto. |
| Alembic | **Feito (Postgres)** | Evolução de schema em Neon via `alembic upgrade head`. |
| Tabela `Portal` / normalizar `source` | **No-go** no MVP | Complexidade > benefício atual. |
| Índice composto status/data | **No-go** até métrica ou EXPLAIN | Evitar índice não usado. |

**Próximo passo sugerido:** reforços opcionais (CHECK/`Enum` no BD, índice composto) após métricas ou `EXPLAIN` em produção.

---

## 6. Limites conscientes da skill neste repositório

- **Zero-downtime migration:** relevante após deploy com dados reais; SQLite local tolera reset.
- **NoSQL / sharding:** não aplicável ao stack atual.
- **FLOAT como anti-pattern:** endereçado no modelo com **`Numeric`**/`Decimal`; JSON da API continua como número para o frontend.

---

## Referências

- Skill: `.agents/skills/database-schema-designer/SKILL.md`
- Modelos: `backend/models.py`, `backend/database.py`
- Rotas: `backend/routers/properties.py`
