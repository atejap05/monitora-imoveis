# Painel NFSe

## Visão Geral do Projeto

O Painel NFSe é um dashboard interativo para visualização e análise de dados de Notas Fiscais de Serviço Eletrônicas (NFSe). O projeto visa fornecer insights sobre a arrecadação, identificar tendências e padrões, e facilitar a consulta de dados para os municípios conveniados.

## Features Implementadas

Atualmente, as seguintes features estão implementadas e funcionais:

### Visão Geral

- **Dashboard Interativo**: Apresenta um resumo estatístico da base de NFSe.
- **Filtros Globais**: Permite a filtragem dos dados por ano, UF, município, região, tipo de contribuinte e valor.
- **Análise de Distribuição**: Exibe a distribuição de frequência dos dados em formato de tabela e histograma.
- **Métricas Estatísticas**: Calcula e exibe métricas como média, mediana, moda e desvio padrão.
- **Destaques Visuais**: Facilita a identificação de outliers e modas.

### Consultas

- **Busca Detalhada**: Permite a consulta detalhada de NFSe por contribuinte.
- **Tabela de Dados**: Exibe os resultados da consulta em uma tabela paginada.
- **Exportação de Dados**: Permite a exportação dos dados da consulta para os formatos CSV e XLSX.

## Roadmap de Desenvolvimento

As seguintes páginas e funcionalidades estão planejadas para futuras versões:

### Ambiente

- Evolução temporal do volume de NFSe (linha do tempo)
- Mapa de calor por UF/município
- Ranking de municípios/UFs por emissão
- Indicadores de crescimento/queda
- Filtros por período, UF, município, porte

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

## Estrutura do Projeto

A estrutura do projeto foi organizada para maior escalabilidade, reutilização e clareza. Agora, cada grande funcionalidade (feature) possui seu próprio diretório em `src/pages`, e os filtros globais ficam em `src/filters`, podendo ser reutilizados em qualquer página.

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
    Ambiente/
      Ambiente.tsx
    Consultas/
      Consultas.tsx
      components/
      hooks/
    Contribuintes/
      Contribuintes.tsx
    Convenios/
      Convenios.tsx
    NotasFiscais/
      NotasFiscais.tsx
    VisaoGeral/
      VisaoGeral.tsx
      components/        # Componentes específicos da Visão Geral
      hooks/             # Hooks específicos da Visão Geral
  service/               # Serviços de API
  state/                 # Zustand stores (em revisão)
```

### Padrão de Organização

- **src/pages/Feature/**: Cada página/feature principal da aplicação reside em seu próprio diretório, contendo seus componentes, hooks e lógica específica.
- **src/filters/**: Componentes de filtro globais que podem ser reutilizados em múltiplas páginas.
- **src/components/**: Componentes de UI genéricos e reutilizáveis em toda a aplicação.

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

> README atualizado para refletir o estado atual do desenvolvimento do projeto.
