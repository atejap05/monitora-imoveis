# Painel NFSe

## 📊 Visão Geral do Projeto

O **Painel NFSe** é um dashboard interativo e moderno para visualização e análise de dados de Notas Fiscais de Serviço Eletrônicas (NFSe). O projeto fornece insights sobre arrecadação, identifica tendências e padrões, e facilita a consulta de dados para municípios conveniados com a Receita Federal do Brasil.

## ✨ Features Implementadas

### 🏠 **Visão Geral**

- **Dashboard Interativo**: Resumo estatístico completo da base de NFSe
- **Filtros Avançados**: Filtragem por ano, UF, município, região, tipo de contribuinte e valor
- **Análise de Distribuição**: Tabela e histograma da distribuição de frequência
- **Métricas Estatísticas**: Média, mediana, moda, desvio padrão com destaque visual
- **Gráficos de Adesão**: Visualização da adesão de municípios ao sistema
- **Volumetria ETL**: Dados de processamento diário com gráficos de tendência
- **Cache Inteligente**: Sistema de cache otimizado com React Query

### 🔍 **Consultas**

- **Busca por CNPJ**: Consulta detalhada de NFSe por contribuinte
- **Tabela Paginada**: Resultados em tabela com paginação e ordenação
- **Exportação**: Exportação para CSV e XLSX
- **Filtros Temporais**: Busca por anos específicos

### 🏢 **Contribuintes**

- **Mapa Interativo**: Visualização geográfica dos contribuintes por UF
- **Tabela de Tipos**: Análise por tipo de contribuinte responsável
- **Filtros Geográficos**: Busca por região, UF e município
- **Dados Agregados**: KPIs e métricas consolidadas

### 📄 **Notas Fiscais**

- **Análise de Cancelamentos**: Motivos, frequência e valores de cancelamento
- **Top 100 Emissores**: Ranking dos maiores contribuintes
- **KPIs de Cancelamento**: Métricas específicas por tipo de evento
- **Filtros Avançados**: Por valor, região e tipo de contribuinte

### 🌍 **Ambiente**

- **Evolução Temporal**: Gráficos de linha mostrando tendências anuais
- **Análise por Processo**: Comparação entre APP, Web, WebService e próprio
- **Mapa de Calor**: Visualização por UF/município
- **KPIs de Adoção**: Métricas de adoção nacional vs municipal

### 🤝 **Convênios**

- **Relatório Completo**: Dados de convênios entre municípios e RFB
- **Status de Adesão**: Informações sobre Ambiente de Dados Nacional
- **Filtros Avançados**: Por UF, região geográfica, fiscal e status
- **Exportação de Dados**: Funcionalidade de exportação completa
- **Tabela Interativa**: Com seleção, paginação e ordenação

## 🚀 Roadmap de Desenvolvimento

### 🔄 **Melhorias em Andamento**

- **Otimização de Performance**: Sistema de cache avançado implementado
- **Queue Management**: Gerenciamento de fila para backend sequencial
- **Error Handling**: Sistema robusto de tratamento de erros
- **Prefetch Inteligente**: Carregamento antecipado de dados relacionados

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **React 18** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática e melhor DX
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis

### **State Management & Data Fetching**

- **React Query (TanStack Query)** - Cache inteligente e sincronização de dados
- **Zustand** - Gerenciamento de estado global
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas

### **UI/UX**

- **Recharts** - Gráficos interativos
- **React Table** - Tabelas avançadas com paginação
- **Leaflet** - Mapas interativos
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações toast

### **Utilitários**

- **React Router** - Roteamento da aplicação
- **Date-fns** - Manipulação de datas
- **React Spinners** - Indicadores de loading
- **XLSX** - Exportação para Excel
- **React Papa Parse** - Parsing de CSV

## 📁 Estrutura do Projeto

```
src/
├── @types/                    # Definições de tipos TypeScript
│   ├── ambiente.types.ts
│   ├── contribuintes.types.ts
│   ├── convenios.types.ts
│   ├── notasFiscais.types.ts
│   ├── shared.types.ts
│   └── visaoGeral.types.ts
├── assets/                    # Recursos estáticos
│   ├── csv.png
│   ├── logo-nfse-*.png
│   └── xlsx.png
├── components/                # Componentes reutilizáveis
│   ├── ui/                    # Componentes base (Button, Card, etc.)
│   ├── Header/                # Cabeçalho da aplicação
│   ├── Layout/                # Componentes de layout
│   ├── Sidebar/               # Barra lateral de navegação
│   ├── BarChartNFSe.tsx
│   ├── BasicTable.tsx
│   ├── CardValor.tsx
│   ├── DataTable.tsx
│   ├── MainLayout.tsx
│   └── Pagination.tsx
├── filters/                   # Filtros globais reutilizáveis
│   ├── FormAno.tsx
│   ├── FormCNPJ.tsx
│   ├── FormMunicipio.tsx
│   ├── FormOptions.tsx
│   ├── FormRegiao.tsx
│   ├── FormUf.tsx
│   └── index.ts
├── hooks/                     # Hooks customizados
│   ├── useDebounce.ts
│   ├── useDanfseBase64.ts
│   ├── useGeoJson.ts
│   ├── use-mobile.tsx
│   ├── usePrefetch.ts         # Sistema de prefetch inteligente
│   └── index.ts
├── lib/                       # Utilitários e configurações
│   ├── backendQueue.ts        # Queue manager para backend
│   ├── queryConfig.ts         # Configurações do React Query
│   ├── queryKeys.ts           # Query keys hierárquicas
│   ├── copyToClipboard.ts
│   └── utils.ts
├── pages/                     # Páginas da aplicação
│   ├── Ambiente/
│   │   ├── Ambiente.tsx
│   │   ├── components/        # Componentes específicos
│   │   └── hooks/
│   │       └── useAmbienteEmissao.ts
│   ├── Consultas/
│   │   ├── Consultas.tsx
│   │   ├── components/
│   │   └── hooks/
│   ├── Contribuintes/
│   │   ├── Contribuintes.tsx
│   │   ├── components/
│   │   └── hooks/
│   │       └── useSyncContribuintesData.tsx
│   ├── Convenios/
│   │   ├── Convenios.tsx
│   │   ├── components/
│   │   │   └── ConveniosFiltersWrapper.tsx
│   │   └── hooks/
│   │       └── useConveniosData.ts
│   ├── NotasFiscais/
│   │   ├── NotasFiscais.tsx
│   │   ├── components/
│   │   └── hooks/
│   │       ├── useNotasFiscaisCanceladas.ts
│   │       └── useTop100NotasFiscais.ts
│   └── VisaoGeral/
│       ├── VisaoGeral.tsx
│       ├── components/
│       └── hooks/
│           ├── useEtlData.ts
│           └── useSyncVisaoGeralData.tsx
├── service/                   # Serviços de API
│   ├── ambiente.ts
│   ├── consultas.ts
│   ├── contribuintes.ts
│   ├── convenios.ts
│   ├── ibge.ts
│   ├── notas-fiscais.ts
│   ├── user.ts
│   ├── visao-geral.ts
│   └── index.ts
├── state/                     # Stores Zustand
│   ├── ambienteFiltersSate.ts
│   ├── consultasState.ts
│   ├── contribuintesFiltersState.ts
│   ├── conveniosFiltersState.ts
│   ├── notasFiscaisFiltersSate.ts
│   └── visaoGeralFiltersState.ts
├── App.tsx                    # Componente principal
├── main.tsx                   # Entry point com React Query configurado
└── index.css                  # Estilos globais
```

## 🎯 Detalhes das Páginas

### **🏠 Visão Geral** (`/visao-geral`)

**Dashboard principal** com visão consolidada dos dados de NFSe

- **KPIs Principais**: Totais por ano, MEI, ME/EPP, Não Optante
- **Gráficos de Adesão**: Evolução da adesão de municípios
- **Distribuição de Frequência**: Análise estatística detalhada
- **Volumetria ETL**: Dados de processamento diário
- **Filtros Globais**: Aplicáveis a todos os componentes

### **🔍 Consultas** (`/consultas`)

**Sistema de busca** por CNPJ específico

- **Formulário de Busca**: CNPJ + anos de interesse
- **Tabela de Resultados**: Paginada e ordenável
- **Exportação**: CSV e XLSX
- **Filtros Avançados**: Por período e contribuinte

### **🏢 Contribuintes** (`/contribuintes`)

**Análise geográfica** e perfil dos contribuintes

- **Mapa Interativo**: Visualização por UF com Leaflet
- **Tabela de Tipos**: Análise por responsabilidade
- **KPIs Geográficos**: Métricas por região
- **Filtros Espaciais**: UF, município, região

### **📄 Notas Fiscais** (`/notas-fiscais`)

**Análise detalhada** de notas fiscais e cancelamentos

- **KPIs de Cancelamento**: Por tipo de evento
- **Top 100 Emissores**: Ranking dos maiores contribuintes
- **Análise de Eventos**: Substituição, deferimento, ofício
- **Filtros Específicos**: Por valor e tipo de contribuinte

### **🌍 Ambiente** (`/ambiente`)

**Evolução temporal** e adoção de ambientes de emissão

- **Gráficos de Linha**: Tendências anuais por processo
- **Gráficos de Barras**: Comparação entre ambientes
- **KPIs de Adoção**: Nacional vs Municipal
- **Análise por Processo**: APP, Web, WebService, Próprio

### **🤝 Convênios** (`/convenios`)

**Relatório completo** de convênios municipais

- **Tabela Completa**: Todos os municípios conveniados
- **Filtros Avançados**: Região, UF, status
- **Exportação**: Dados selecionados ou completos
- **KPIs de Cobertura**: Métricas de adesão nacional

## ⚡ Otimizações Implementadas

### **React Query Avançado**

- **Cache Inteligente**: staleTime de 1 hora para dados estáticos
- **Query Keys Hierárquicas**: Organização estruturada do cache
- **Queue Manager**: Gerenciamento de fila para backend sequencial
- **Prefetch Inteligente**: Carregamento antecipado de dados relacionados
- **Error Handling**: Retry inteligente baseado no tipo de erro

### **Performance**

- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: Uso de useMemo e useCallback
- **Bundle Splitting**: Código dividido por rotas
- **Image Optimization**: Otimização de assets

### **UX/UI**

- **Loading States**: Skeletons e spinners consistentes
- **Error Boundaries**: Tratamento elegante de erros
- **Responsive Design**: Adaptação para todos os dispositivos
- **Accessibility**: Componentes acessíveis com Radix UI

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📊 Monitoramento

- **React Query DevTools**: Monitoramento de cache e queries
- **Console Logs**: Logs estruturados para debugging
- **Performance Metrics**: Métricas de carregamento e renderização

---

> **Status**: 🎉 **Projeto em desenvolvimento ativo com todas as páginas principais implementadas e otimizadas**
