# Arquitetura e Fluxo de Dados

A arquitetura do **Monitora Imóveis** é baseada na separação de responsabilidades (Frontend e Backend) com uma camada de Background Jobs atuando de forma invisível.

## 🧱 Componentes da Arquitetura

### 1. Frontend (Next.js App Router)
O Frontend atua como a interface de consumo e input de dados. Ele realiza chamadas à API via REST (`fetch` / Axios).
- **Client Components**: Gerenciam estado local (como o formulário de colar o URL, modais e feedback de erro da UI).
- **Server Components**: Para listagem imedata (SSR/SSG) das propriedades já cacheadas do usuário no painel central, permitindo carregamento veloz.
- **Styling**: Tailwind CSS garantindo layout responsivo de imediato, acoplado à paleta de cores unificada do Shadcn UI.

### 2. Backend (FastAPI + Python)
Core responsável por toda a ingestão e provimento dos dados.
- **API Routers**: Endpoints `/api/properties` (CRUD do usuário na plataforma), e no futuro roteadores `/api/search` para RAG.
- **Orquestrador de Scraper**: O FastAPI delega o trabalho pesado de web scraping para execuções assíncronas usando a biblioteca `Playwright`. Isso impede que o servidor bloqueie enquanto espera a imobiliária carregar os scripts no navegador *headless*.
- **Task Scheduler (APScheduler)**: Serviço embutido no processo do Uvicorn que dispara de tempos em tempos (ex: de 12 em 12 horas) a releitura dos links do Banco de Dados para detectar mudanças ativas.

### 3. Persistência (SQLite / SQLModel)
Para agilidade do MVP, o SQLite salva em um arquivo plano toda a arquitetura de tabelas:
- Tabela de Propriedades (`Property`)
- Tabela de Histórico (`PropertyHistory`) para criar os gráficos de variação de preço.

---

## 🔄 Fluxo de Dados (Data Flow)

### A. Fluxo de Inserção de Novo Monitoramento
\`\`\`mermaid
sequenceDiagram
    participant User as Usuário (Next.js)
    participant API as FastAPI Backend
    participant Scraper as Playwright / Robô
    participant DB as SQLite

    User->>API: POST /api/properties (URL do Anúncio)
    API->>Scraper: parse_url(URL)
    Scraper-->>API: Extracted JSON (title, price, sqft)
    API->>DB: INSERT into Property (data)
    API->>DB: INSERT into PropertyHistory (initial price)
    API-->>User: 201 Created (Success)
\`\`\`

### B. Fluxo Job de Atualização em Background
\`\`\`mermaid
sequenceDiagram
    participant Job as APScheduler Cron
    participant DB as SQLite
    participant Scraper as Playwright / Robô

    Job->>DB: SELECT url FROM Property where status='active'
    loop Para cada URL
        Job->>Scraper: parse_url(URL)
        alt 410 Gone / 404
            Scraper-->>Job: Status Unavailable
            Job->>DB: UPDATE Property SET status='inactive'
        else 200 OK
            Scraper-->>Job: Novo Preço
            Job->>DB: INSERT into PropertyHistory (novo preço)
        end
    end
\`\`\`
