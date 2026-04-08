# Painel NFSe — Instruções para Copilot e assistentes de código

Estas instruções são a **mesma base** que [.cursor/rules/painelnfse-rules.mdc](../.cursor/rules/painelnfse-rules.mdc). Mantê-las alinhadas ao alterar regras do projeto.

**Contexto:** aplicação **React 18 + TypeScript + Vite** (SPA com `HashRouter`) para visualização e análise de dados de NFSe; integração com **backend Python** exposto ao cliente (ex.: funções em `window`). Para performance React detalhada, ver a skill **vercel-react-best-practices** em `.agents/skills/vercel-react-best-practices/` (`SKILL.md` e pasta `rules/`) e [docs/VERCEL_REACT_SKILL_MAPPING.md](../docs/VERCEL_REACT_SKILL_MAPPING.md).

---

## 1. Tecnologias principais

- **App**: React 18, **Vite**, TypeScript, **React Router** (`HashRouter`).
- **Code splitting**: rotas de página com `React.lazy` + `Suspense`; factories de import em `src/routes/pageImports.ts` (reutilizar para prefetch na navegação quando fizer sentido).
- **Estilização**: Tailwind CSS e componentes **shadcn/ui** (`src/components/ui`).
- **Estado de UI / filtros**: Zustand em `src/state` (por feature).
- **Dados remotos**: TanStack Query — preferir `useQuery` / `useMutation`; **não** usar `useEffect` + `fetch` para carregar dados de API.
- **Formulários**: React Hook Form + Zod.
- **Gráficos / mapas**: Recharts; Leaflet onde aplicável.
- **Tabelas**: TanStack Table.
- **Qualidade**: ESLint; seguir convenções já usadas no repositório.

---

## 2. Backend e fila (`src/lib/backendQueue.ts`)

- O backend Python é atendido por uma **fila sequencial** (`maxConcurrent = 1`). Várias chamadas `queuedBackendCall` **não** executam em paralelo no servidor: `Promise.all` no cliente raramente reduz tempo total se tudo passa pela mesma fila.
- Prefira **early return** e **não await** em ramos que não precisam de dados remotos (`async-defer-await`).
- Documente exceções quando houver chamadas a origens que **não** usam a fila.

---

## 3. Estrutura de pastas

- **Componentes genéricos**: `src/components` (UI reutilizável, layout).
- **Features**: `src/pages/[Feature]/components` e `src/pages/[Feature]/hooks`.
- **API**: `src/service` — funções por domínio (`visao-geral.ts`, `notas-fiscais.ts`, etc.). **Não** chamar `fetch` diretamente em componentes de página; encapsular em `src/service` e consumir via hooks + TanStack Query.
- **Estado global de filtros**: `src/state`.
- **Tipos**: `src/@types`.
- **Filtros reutilizáveis**: `src/filters/`.
- **Shell de página**: container raiz das páginas com `PAGE_SHELL_CLASSES` em `src/lib/constants.ts` (equivalente a `CONTAINER_MAX_WIDTH` + `RESPONSIVE_PADDING` + `py-6`). Evitar `max-w-*` hardcoded na raiz salvo requisito explícito.

---

## 4. Imports e bundle

- Use alias **`@/`** (ver `tsconfig` / Vite).
- **Evite barrel** `import { x } from "@/service"` quando puder importar do módulo concreto: `import { x } from "@/service/visao-geral"` (melhor tree-shaking; alinhado às boas práticas Vercel de bundle).
- **Lucide**: imports nomeados por ícone a partir de `lucide-react` (evitar import gigante único).

---

## 5. TanStack Query

- Centralizar **`queryKey`** em `src/lib/queryKeys.ts` e incluir filtros relevantes nas chaves.
- Onde fizer sentido, usar configurações por criticidade em `src/lib/queryConfig.ts`.
- Respeitar `staleTime` / `gcTime` globais em `main.tsx` salvo necessidade explícita de override por query.
- **React Query Devtools**: apenas em desenvolvimento (já condicionado no app); não adicionar dependências de dev ao bundle de produção sem lazy/condicional.

---

## 6. Performance e React (resumo prático)

- **Não definir componentes** dentro do corpo de outro componente (extrair para o mesmo arquivo ou pasta).
- **Listeners globais** (`scroll`, `resize`, etc.): preferir dependências estáveis, **refs** para valores mutáveis frequentes e `{ passive: true }` em `scroll` quando não houver `preventDefault`.
- **Render condicional**: com valores numéricos, evitar `{n && <Comp />}` (risco de renderizar `0`); preferir `n > 0 ? <Comp /> : null` ou `Boolean(n) ? …`.
- **`useMemo` / `memo`**: só para trabalho custoso ou estabilização de props; não memorizar expressões triviais.
- Onde a UI puder ler direto do **resultado do `useQuery`**, evitar espelhar em Zustand com vários `useEffect` sem necessidade; ao sincronizar store + query, preferir **um efeito consolidado** ou derivar na leitura.

---

## 7. Padrões de código existentes

1. **Componentes**: funcionais; priorizar primitivos `src/components/ui`.
2. **Dados**: hooks por feature (`useXxxData`, `useSyncXxxData` onde já existir o padrão) + `useQuery`; usar `queuedBackendCall` quando a regra do projeto for passar pela fila.
3. **Filtros compartilhados**: hooks Zustand da feature, não `useState` solto para o mesmo propósito.
4. **Estilo**: Tailwind; evitar `style={{}}` salvo integração com libs ou casos pontuais já aceitos no projeto.

### Fluxo típico de dados

Interação → formulário → store Zustand (`submittedFilters`) → hook da feature (`useQuery` + `queuedBackendCall`) → `src/service` → backend. **Prefetch** relacionado: `src/hooks/usePrefetch.ts` quando aplicável.

---

## 8. Tarefa exemplo: novo filtro em uma página

1. Estado em `src/state/...FiltersState.ts`.
2. UI do filtro em `src/pages/[Feature]/components/...Filters.tsx`.
3. Hook de dados: atualizar `queryKey` (e `queryKeys.ts` se necessário) e parâmetros do serviço.
4. Serviço em `src/service/[feature].ts` — assinatura e query string / body alinhados ao backend.
5. Rota: páginas novas em `App.tsx` via lazy (seguir padrão de `src/routes/pageImports.ts`) e entrada na navegação em `src/components/Sidebar/SidebarNav.tsx` (ou equivalente usado no projeto).

---

## Arquivos-chave

| Área | Caminho |
|------|---------|
| Chaves de cache | `src/lib/queryKeys.ts` |
| Configs de query | `src/lib/queryConfig.ts` |
| Fila do backend | `src/lib/backendQueue.ts` |
| Prefetch | `src/hooks/usePrefetch.ts` |
| Imports lazy de rotas | `src/routes/pageImports.ts` |
| App / rotas | `src/App.tsx`, `src/main.tsx` |

---

## Páginas principais (referência)

Visão Geral, Contribuintes, Consultas, Notas Fiscais, Ambiente, Convênios, Volumetria — cada uma com store de filtros em `src/state` e serviços em `src/service` quando existir.
