# Avaliação: skill database-schema-designer vs schema atual

Este documento aplica a *Verification Checklist* e os princípios da skill [.agents/skills/database-schema-designer/SKILL.md](../.agents/skills/database-schema-designer/SKILL.md) ao modelo em [backend/models.py](../backend/models.py) e à persistência em [backend/database.py](../backend/database.py).

**Evidência de runtime (SQLite):** inspeção com `PRAGMA foreign_keys`, `sqlite_master` e engine SQLAlchemy em `backend/database.db` após `create_all` (revisão em ambiente de desenvolvimento).

---

## 1. Matriz checklist (skill § Verification Checklist)

| Diretriz da skill | Aderência | Evidência no projeto |
|-------------------|-----------|----------------------|
| Toda tabela com PK | **Alta** | `id` INTEGER PK em `property` e `propertyhistory`. |
| Relacionamentos com FK | **Média** | `PropertyHistory.property_id` → `property.id` declarado em SQLModel; DDL SQLite contém `FOREIGN KEY(property_id) REFERENCES property (id)`. |
| Enforcement de FK em runtime | **Baixa** | `PRAGMA foreign_keys` retorna **0** na conexão do engine atual — integridade referencial **não** é aplicada pelo SQLite até ativar o pragma por conexão. |
| ON DELETE definido por FK | **Baixa** | DDL sem `ON DELETE CASCADE/RESTRICT`. Exclusão em [routers/properties.py](../backend/routers/properties.py): aplicação remove `PropertyHistory` antes de `Property` (cascade manual). |
| Índice em colunas FK | **Baixa** | Não há índice dedicado a `propertyhistory.property_id`; em `property` há índice em `user_id` e em `url`, e constraint única composta `uq_property_user_url` (`user_id` + `url`). JOINs/filtros por `property_id` no histórico podem usar scan sem índice auxiliar em volume alto. |
| Tipos monetários (DECIMAL, não FLOAT) | **Baixa** | Colunas `price` / `previous_price` mapeiam para **FLOAT** / SQLite **REAL**; a skill recomenda DECIMAL para dinheiro. |
| UNIQUE onde necessário | **Alta** | Unicidade de **URL por usuário:** `UniqueConstraint("user_id", "url")` (`uq_property_user_url`); não há mais índice único global só em `url`. |
| CHECK / validação no BD | **Baixa** | `status`, `property_type` são VARCHAR sem constraint CHECK; validação na aplicação/Pydantic. |
| Timestamps | **Alta** | `Property`: `created_at`, `updated_at`; `PropertyHistory`: `checked_at`. |
| Migrações reversíveis | **Baixa** | `create_all` na subida; colunas aditivas em DBs existentes via [migrations_sqlite.py](../backend/migrations_sqlite.py) (sem DOWN). **Alembic** ainda recomendado antes de PostgreSQL em produção. |

**Síntese de risco:** principal lacuna vs skill é **PRAGMA foreign_keys desligado** + **REAL para dinheiro** + **ausência de migrações versionadas**; integridade de exclusão depende do código da API, não do motor.

---

## 2. Verificação SQLite (complemento)

| Verificação | Resultado |
|-------------|-----------|
| `PRAGMA foreign_keys` (conexão SQLAlchemy `engine`) | **0** (off) |
| Índices explícitos | `property.user_id`, `property.url`; UNIQUE composto `(user_id, url)`. Nenhum em `propertyhistory.property_id` além do uso em FK |
| DDL FK | Presente; sem `ON DELETE` |

**Comportamento de DELETE:** o endpoint `DELETE /api/properties/{id}` remove históricos em loop e depois o imóvel — consistente mesmo com FKs não aplicadas pelo SQLite.

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
| P0 | Ativar `PRAGMA foreign_keys=ON` na conexão SQLite (evento `connect` no `create_engine`) | **S** | Alinha à skill (integridade no BD); testar DELETE/INSERT inválidos. |
| P0 | Índice em `propertyhistory.property_id` | **S** | Skill: indexar FKs; melhora `WHERE property_id = ?`. |
| P1 | `ondelete="CASCADE"` no `Field(foreign_key=...)` + opcional remoção do loop manual no DELETE | **S/M** | Documentar semântica; SQLite com FKs ligadas passa a cascatear se configurado. |
| P1 | `Numeric`/`Decimal` para valores monetários no modelo + serialização API | **M** | Reduz divergência com anti-pattern FLOAT; tocar `schemas.py` e frontend se necessário. |
| P2 | `CHECK` ou `Enum` SQLAlchemy para `status` / `property_type` | **M** | Reforço no BD; SQLite 3.37+ suporta CHECK. |
| P2 | Índice composto `(status, updated_at)` em `property` se filtros do dashboard crescerem | **S** | Só após evidência de query lenta (`EXPLAIN`). |
| P3 | Introduzir **Alembic** (primeira revisão ao mudar schema) | **L** | Migrações reversíveis; prepara PostgreSQL futuro. |
| — | Particionamento, réplicas, OLAP | **—** | Postergado (roadmap pós-MVP). |

---

## 5. Go / no-go por tema

| Tema | Recomendação | Motivo |
|------|--------------|--------|
| Habilitar FK + índice em `property_id` | **Go** | Baixo custo; alto alinhamento à skill. |
| DECIMAL/Numeric para preços | **Go** (quando houver sprint de dados) | Correção conceitual; requer reteste da API. |
| CHECK no BD | **Go condicional** | Útil após estabilizar enum de status no produto. |
| Alembic | **Go** na primeira alteração de schema que não seja “apagar DB dev” | Evita drift sem `create_all` from scratch. |
| Tabela `Portal` / normalizar `source` | **No-go** no MVP | Complexidade > benefício atual. |
| Índice composto status/data | **No-go** até métrica ou EXPLAIN | Evitar índice não usado. |

**Próximo passo único sugerido:** `PRAGMA foreign_keys=ON` no engine + índice explícito em `property_history.property_id`, depois teste de integridade (inserção órfã inválida e DELETE em cascata se adotar CASCADE).

---

## 6. Limites conscientes da skill neste repositório

- **Zero-downtime migration:** relevante após deploy com dados reais; SQLite local tolera reset.
- **NoSQL / sharding:** não aplicável ao stack atual.
- **FLOAT como anti-pattern:** reconhecido; migração para DECIMAL é melhoria incremental, não bloqueante para protótipo local.

---

## Referências

- Skill: `.agents/skills/database-schema-designer/SKILL.md`
- Modelos: `backend/models.py`, `backend/database.py`
- Rotas: `backend/routers/properties.py`
