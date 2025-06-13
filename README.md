# Painel NFSe Frontend

Este projeto é o frontend para o Painel NFSe, uma aplicação web desenvolvida para visualização, consulta e gerenciamento de dados relacionados a Notas Fiscais de Serviço eletrônicas (NFSe).

## Objetivos Principais

- **Visualização Centralizada:** Oferecer um dashboard centralizado para monitorar e analisar dados de NFSe.
- **Análise Detalhada:** Permitir a exploração de dados através de diferentes seções como Visão Geral, Contribuintes, Notas Fiscais e Consultas específicas.
- **Interface Intuitiva:** Prover uma interface de usuário clara e intuitiva para facilitar a navegação e o entendimento dos dados.
- **Suporte à Decisão:** Auxiliar na tomada de decisões ao apresentar informações consolidadas e visualizações gráficas (barras, pizza, linhas) sobre as NFSe.
- **Filtragem e Consultas:** Capacitar os usuários a realizar consultas e aplicar filtros para encontrar informações específicas de forma eficiente.

## MVP (Produto Mínimo Viável) Sugerido: O Dashboard de "Visão Geral" Interativo

O objetivo principal do MVP é consolidar e dar vida à aba **`VisaoGeral`**, tornando-a o centro da experiência inicial. Ele responderá à pergunta fundamental: "Qual é o panorama da arrecadação de serviços na minha região de interesse?".

### 1. Funcionalidades Essenciais do MVP

**a) KPIs (Indicadores-Chave de Performance) Principais**  
No topo da `VisaoGeral.tsx`, exibir 3 a 4 `DashCard.tsx` com as métricas mais críticas, que são calculadas no backend e atualizadas com base nos filtros.

- **Valor Total dos Serviços:** Soma de `fl010_vservdouble`.
- **Total de Notas Emitidas:** Contagem de `fa001_numeronfse`.
- **Ticket Médio de Serviço:** (Valor Total / Total de Notas).
- **Total de Contribuintes Ativos:** Contagem distinta de `fc001_ni`.

**b) Visualização de Tendência Temporal**  
Logo abaixo dos KPIs, um gráfico de linha (`BasicLineChart.tsx`) para mostrar a evolução ao longo do tempo.

- **Gráfico Principal:** "Valor dos Serviços por Mês" para o ano selecionado.
  - **Eixo X:** Meses do ano.
  - **Eixo Y:** Soma do valor dos serviços.

**c) Ranking Principal**  
Uma tabela simples (`BasicTable.tsx`) mostrando um "Top 10".

- **Tabela Principal:** "Top 10 Municípios por Valor de Serviço" dentro da UF/Região selecionada.
  - Colunas: Posição, Município (`fa001_codmunicipio_descricaostring`), Valor Total.

**d) Filtros Essenciais e Interativos**  
A funcionalidade de filtro (`SidebarFilters.tsx`) é o coração da interatividade do MVP.

- **Filtro de Período:**
  - **Ano:** Um `select` para escolher o ano (`anosmallint`).
  - **Mês:** (Opcional no MVP, mas útil) Um `select` para escolher o mês (`mestinyint`).
- **Filtro de Localização (em cascata):**
  - **UF:** Um `select` para o estado (`fc010_uf_descricaostring`).
  - **Município:** Um `select` que é populado com os municípios (`fa001_codmunicipio_descricaostring`) **depois** que a UF é selecionada.

### 2. O Que Fica de Fora do MVP (Escopo para o Futuro)

- **Outros Dashboards:** As abas `Contribuintes`, `Notas Fiscais` e `Consultas` ficam desativadas ou com uma mensagem de "Em breve".
- **Tabela de Dados Brutos:** A `data-table.tsx` completa com 262 colunas, paginação complexa, virtualização e seleção de colunas **não faz parte do MVP**.
- **Filtros Avançados:** Filtros por CNAE, status da nota, tipo de contribuinte, etc.
- **Exportação de Dados:** Funcionalidade de exportar para CSV/Excel.
- **Análise Geográfica (Mapas).**

### 3. Escopo Técnico do MVP

- **Frontend:**
  - Focar o desenvolvimento em `dashboards/VisaoGeral/VisaoGeral.tsx`.
  - Configurar os componentes `DashCard`, `BasicLineChart` e uma versão simplificada de `BasicTable`.
  - Implementar a lógica de filtros em cascata no `components/sidebar/SidebarFilters.tsx`.
  - Utilizar o `state/dashboardState.tsx` (Zustand) para gerenciar o estado dos filtros (ano, UF, município selecionados) e os dados recebidos da API.
  - Garantir que os estados de _loading_ (`BasicLoading.tsx`) sejam exibidos enquanto os dados são buscados após a aplicação de um filtro.
- **Backend / API (Pressuposto Crítico):**
  - O MVP exige um backend que faça o trabalho pesado. O frontend **não deve** receber dados brutos para agregar.
  - Criar endpoints de API que recebam os filtros como parâmetros e retornem os dados já agregados.
    - `GET /api/kpis?ano=2024&uf=SP`: Retorna um JSON com os 4 KPIs principais.
    - `GET /api/servicos-por-mes?ano=2024&uf=SP`: Retorna um JSON pronto para o gráfico de linha.
    - `GET /api/top-10-municipios?ano=2024&uf=SP`: Retorna um JSON com o ranking para a tabela.

### Por que este MVP é uma boa escolha?

- **Entrega de Valor Imediata:** Responde às perguntas mais críticas de negócio sem sobrecarregar o usuário.
- **Validação da Hipótese Central:** Prova que é possível transformar a base de dados complexa em insights visuais e acionáveis.
- **Coleta de Feedback Direcionado:** Os usuários usarão os filtros e o dashboard, e o feedback será sobre a principal funcionalidade, guiando os próximos passos.
- **Risco Técnico Reduzido:** Evita os desafios de performance de tabelas massivas e a complexidade de funcionalidades avançadas.

## Tecnologias Utilizadas

### Core

- **React 19:** Biblioteca JavaScript para construção da interface de usuário.
- **Vite:** Ferramenta de build e desenvolvimento frontend de alta performance.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.

### UI & Styling

- **Tailwind CSS:** Framework CSS utility-first para estilização rápida e customizável.
- **shadcn/ui & Radix UI:** Coleção de componentes de UI acessíveis e customizáveis.
- **Lucide React:** Biblioteca de ícones.

### Gerenciamento de Estado

- **Zustand:** Solução leve e flexível para gerenciamento de estado global.

### Formulários

- **React Hook Form:** Biblioteca para gerenciamento de formulários.
- **Zod:** Biblioteca para validação de schemas e tipos.

### Visualização de Dados

- **Recharts:** Biblioteca para criação de gráficos.
- **TanStack Table (React Table):** Biblioteca para construção de tabelas e data grids complexos.

### Data Fetching & Cache

- **TanStack Query (React Query):** Biblioteca para data fetching, caching, e sincronização de estado do servidor.

### Utilitários

- **clsx & tailwind-merge:** Utilitários para mesclar classes CSS de forma condicional.
- **react-papaparse:** Para parsing de arquivos CSV.
- **xlsx:** Para manipulação de arquivos Excel.

### Linting & Formatação

- **ESLint:** Ferramenta para identificar e corrigir problemas no código JavaScript/TypeScript.

## Estrutura do Projeto (Frontend)

O frontend está organizado da seguinte forma:

- **`public/`**: Contém os assets estáticos da aplicação.
- **`src/`**: Código fonte da aplicação.
  - **`@types/`**: Definições de tipos TypeScript globais ou específicos.
  - **`assets/`**: Imagens e outros arquivos de mídia.
  - **`components/`**: Componentes React reutilizáveis.
    - **`ui/`**: Componentes de UI básicos (provavelmente de shadcn/ui).
    - **`sidebar/`**: Componentes relacionados à barra lateral de navegação/filtros.
    - **`tabs-navigation/`**: Componentes para navegação por abas.
  - **`dashboards/`**: Componentes que representam as diferentes seções/dashboards da aplicação.
  - **`forms/`**: Componentes de formulário e seus schemas de validação (Zod).
  - **`hooks/`**: Hooks customizados do React.
  - **`lib/`**: Funções utilitárias.
  - **`service/`**: Lógica de chamada a APIs e serviços externos.
  - **`state/`**: Configuração e lógica do gerenciador de estado (Zustand).
  - **`App.tsx`**: Componente raiz da aplicação.
  - **`main.tsx`**: Ponto de entrada da aplicação React.
  - **`index.css`**: Estilos globais ou base.
- **`vite.config.ts`**: Configuração do Vite.
- **`tailwind.config.js`**: Configuração do Tailwind CSS.
- **`tsconfig.json`**: Configuração do TypeScript.
- **`package.json`**: Define os metadados do projeto, scripts e dependências.

## Recomendações de Evolução do Projeto

Com base na análise detalhada, as seguintes recomendações visam fortalecer a base do projeto, otimizar a performance e enriquecer a experiência do usuário final.

### 1. Arquitetura e Estrutura do Código

- **Centralização da Lógica de Negócio em Hooks:** Extrair a lógica de busca, filtragem e transformação de dados da NFSe para hooks customizados (ex: `useNFSeData(filters)`). Isso encapsularia a chamada ao serviço, gerenciamento de estado de loading/erro e transformação dos dados, tornando os componentes de dashboard mais limpos.
- **Camada de Serviço (API Layer) mais Robusta:** Expandir `src/service/index.ts` para lidar com a construção de queries dinâmicas, traduzindo filtros do Zustand em parâmetros de consulta para a API de backend.
- **Otimização do Gerenciamento de Estado (Zustand):**
  - **Modularização dos Stores:** Manter a granularidade atual (`dashboardState`, `consultasState`, `notasFiscaisState`) e considerar novas divisões conforme a complexidade aumenta.
  - **Seletores Otimizados:** Utilizar seletores para componentes que consomem pequenas partes de um store, evitando re-renderizações desnecessárias. Exemplo: `const totalNotas = useDashboardStore(state => state.summary.totalNotas);`
- **Escalabilidade dos Dashboards:** Garantir que cada nova pasta de dashboard (e.g., `src/dashboards/NovaAnalise/`) seja autocontida, com seus próprios sub-componentes, types e hooks específicos.

### 2. Usabilidade e Experiência do Usuário (UX)

- **Filtros Inteligentes e Interativos:**
  - **Contextualização (Filtros em Cascata):** Implementar filtros dependentes (ex: selecionar UF "SP" popula o seletor de "Município" apenas com cidades de São Paulo).
  - **Filtro Global vs. Filtro de Dashboard:** Considerar a possibilidade de filtros globais e filtros específicos por dashboard.
- **Feedback Visual Imediato:** Utilizar `BasicLoading.tsx` e outros indicadores visuais para confirmar ações do usuário e durante o carregamento de dados.
- **Visualização de Dados Aprimorada:**
  - **Hierarquia da Informação:** Apresentar KPIs mais importantes no topo, seguidos por gráficos de tendência.
  - **Gráficos Interativos (Drill-Down):** Permitir que o usuário clique em elementos do gráfico (barras, fatias) para explorar dados mais detalhados.
  - **Contexto é Rei:** Sempre exibir os filtros ativos que governam a visualização atual e fornecer títulos descritivos para gráficos e tabelas.
- **Tabelas de Dados Brutos (`BasicTable.tsx`):**
  - **Performance com Virtualização:** Para tabelas com grande volume de dados (como a de 262 colunas), utilizar virtualização (e.g., TanStack Table com modo virtual).
  - **Seleção e Customização de Colunas:** Permitir que o usuário escolha quais colunas exibir e salve suas preferências.
  - **Exportação de Dados:** Implementar funcionalidade de exportar dados filtrados para CSV/Excel.

### 3. Novos Insights e Implementações (Pós-MVP)

- **Dashboard de Análise Geográfica:** Utilizar campos como `fc010_cmun_codigo`, `fc010_uf_descricaostring` para criar mapas interativos (Leaflet, Mapbox) que visualizem dados por estado/município.
- **Análise de Atividades (CNAE/NBS):** Criar dashboards para analisar os serviços mais prestados, valor movimentado por setor (usando `fb001_xnbs`, `fh001_cnaonif_descricaostring`).
- **Análise de Retenções e Tributos:** Desenvolver visualizações focadas em tributação, utilizando campos do bloco `fl` (ex: `fl060_vretcp`, `fl060_vretirrf`).
- **Feature de "Saúde do Contribuinte":** Analisar `fb001_cstat_descricaostring` e `fg001_xmotivostring` para identificar principais motivos de cancelamento e contribuintes com alto índice de notas canceladas.
