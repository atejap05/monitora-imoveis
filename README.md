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

## Dashboard: Visão Geral e Próximas Páginas

O Painel NFSe é um dashboard interativo para visualização e análise de dados de Notas Fiscais de Serviço Eletrônicas (NFSe) em diferentes níveis e recortes. A seguir, as páginas planejadas e os dados/funcionalidades previstos para cada uma:

### Visão Geral

- Resumo estatístico da base de NFSe (total, MEI, ME/EPP, grandes empresas)
- Filtros globais (ano, UF, município, região, tipo de contribuinte, valor)
- Distribuição de frequência (tabela e histograma)
- Métricas estatísticas (média, mediana, moda, desvio padrão)
- Destaques visuais para outliers e modas
- Logs e integração com backend

### Ambiente

- Evolução temporal do volume de NFSe (linha do tempo)
- Mapa de calor por UF/município
- Ranking de municípios/UFs por emissão
- Indicadores de crescimento/queda
- Filtros por período, UF, município, porte

### Consultas

- Listagem detalhada de NFSe (com paginação e busca avançada)
- Exportação de dados (CSV/XLSX)
- Filtros combinados (data, valor, contribuinte, status)
- Visualização de documentos e detalhes
- Integração com APIs externas para validação

### Contribuintes

- Ranking de maiores emissores
- Perfil detalhado de contribuintes (CNPJ, porte, localização)
- Evolução de emissão por contribuinte
- Detecção de padrões atípicos
- Filtros por porte, setor, localização

### Notas Fiscais

- Análise de cancelamentos (motivo, frequência, valor)
- Distribuição por faixa de valor
- Detalhamento de notas por status
- Gráficos de barras/pizza para motivos de cancelamento
- Filtros por status, valor, data

### Convênios

- Informações sobre convênios celebrados entre municípios e a RFB
- Status de adesão dos municípios ao Ambiente de Dados Nacional
- Datas de celebração e vigência dos convênios
- Visualização de municípios conveniados em mapa e lista
- Filtros por UF, município, status do convênio
- Indicadores de cobertura nacional e evolução histórica dos convênios

---

## Tecnologias Utilizadas

- React 18
- TypeScript
- Zustand (state management)
- React Query (data fetching/cache)
- React Router (rotas)
- Tailwind CSS (UI)
- Recharts (gráficos)
- Zod (validação de schemas)
- Vite (build)

---

## Próximas Features

- Implementação das páginas Ambiente, Consultas, Contribuintes e Notas Fiscais
- Integração dos filtros globais em todas as páginas
- Novos tipos de visualização (mapas, heatmaps, gráficos avançados)
- Exportação e compartilhamento de relatórios
- Tooltips, legendas e destaques UX
- Detalhamento e drill-down de dados
- Integração com novas APIs e fontes de dados
- Melhorias de performance e responsividade

---

> Estrutura e README atualizados em junho/2025 para refletir a nova arquitetura baseada em features, filtros globais e roadmap do produto.
