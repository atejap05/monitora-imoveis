# Painel NFSe

## Estrutura Atualizada do Projeto

A estrutura do projeto foi reorganizada para maior escalabilidade, reutilização e clareza. Agora, cada grande funcionalidade (feature) possui seu próprio diretório em `src/pages`, e os filtros globais ficam em `src/filters`, podendo ser reutilizados em qualquer página.

### Estrutura de Diretórios

```
src/
  assets/                # Imagens e arquivos estáticos
  components/            # Componentes de UI reutilizáveis (Header, Sidebar, etc)
  dashboards/            # Dashboards antigos (em migração)
  filters/               # Filtros globais reutilizáveis (FormAno, FormUf, etc)
  hooks/                 # Hooks genéricos
  lib/                   # Utilitários e helpers
  pages/
    Ambiente.tsx
    Consultas.tsx
    Contribuintes.tsx
    NotasFiscais.tsx
    VisaoGeral/
      VisaoGeral.tsx
      components/        # Componentes específicos da Visão Geral
      hooks/             # Hooks específicos da Visão Geral
      index.ts
  service/               # Serviços de API
  state/                 # Zustand stores (em revisão)
```

### Padrão de Organização

- **src/pages/VisaoGeral/**: Contém toda a lógica, componentes e hooks específicos da feature Visão Geral.
- **src/filters/**: Todos os componentes de filtro (ex: `FormAno`, `FormUf`, `FormContribuinteValor`) são globais e podem ser usados em qualquer página, evitando duplicidade de código.
- **src/components/**: Apenas componentes de UI realmente genéricos e reutilizáveis.
- **src/dashboards/**: Estrutura antiga, em processo de migração para o padrão por feature em `pages/`.

### Benefícios

- **Reutilização**: Filtros globais podem ser usados em qualquer dashboard/página.
- **Escalabilidade**: Novas features podem ser criadas facilmente em `pages/`, cada uma com sua própria estrutura interna.
- **Manutenção**: Código de cada feature fica isolado, facilitando evolução e correção de bugs.
- **Clareza**: Fica fácil localizar onde está cada parte da aplicação.

---

> Estrutura e README atualizados em junho/2025 para refletir a nova arquitetura baseada em features e filtros globais.
