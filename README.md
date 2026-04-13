# Monitora Imóveis 🏠📊

Bem-vindo ao **Monitora Imóveis**, uma plataforma inteligente projetada para o acompanhamento e monitoramento de imóveis para aluguel ou venda. 

## 🎯 Objetivos do Projeto

A busca por um imóvel é muitas vezes um processo exaustivo. Os valores flutuam, bons negócios desaparecem rapidamente, e acompanhar múltiplos anúncios em diferentes imobiliárias manualmente é quase impossível.

O **Monitora Imóveis** nasce com a missão de automatizar esse processo. A plataforma permite que o usuário acompanhe anúncios de seu interesse e receba inteligência sobre eles. 

**O que resolvemos:**
- **Rastreabilidade de Preços:** Monitora a queda ou o aumento do valor do imóvel (ex: identificando rapidamente quando o proprietário dá um desconto no aluguel).
- **Disponibilidade Imediata:** Avisa quando o anúncio saiu do ar ou retornou erro `410/404`, indicando fortemente que o imóvel foi locado ou vendido, poupando o tempo do usuário em contatar corretoras sobre imóveis indisponíveis.
- **Busca Semântica:** Extrapola o filtro clássico (preço e quartos). Usa Inteligência Artificial para permitir buscas como *"apartamentos que aceitam pet, tenham varanda e sejam silenciosos"*.

## 🚀 Como Funciona?

O usuário acessa o Painel através de uma interface muito intuitiva, cola o link de um anúncio de imobiliária (ex: *Primeira Porta*) e clica em Monitorar.
Em background, nosso sistema adota robôs autônomos (Headless Browsers via Playwright) que navegam ativamente na página, processam os dados (mesmo lidando com javascript e proteções anti-bot), extraem Preço, Quartos, Título e adicionam esse registro em nosso banco de dados.
Diariamente (ou em outra frequência), os *cron jobs* revisitam essas páginas para averiguar se houve alteração nos cenários registrados anteriormente.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js (App Router), React, Tailwind CSS e componentes Shadcn UI para garantia de uma interface moderna e Premium.
- **Backend:** Python e FastAPI para garantir execuções assíncronas ágeis. 
- **Web Scraping:** Playwright para Python (lidando eficientemente com SPAs e SSR de imobiliárias).
- **Banco de Dados:** SQLite (SQLModel) durante a fase de prototipação/Single-User, escalável para PostgreSQL + pgvector (Supabase/Neon).
- **IA e Buscas Avançadas:** NLP e vetores a serem definidos usando bibliotecas de embeddings do ecossistema RAG.

## 📂 Estrutura do Repositório

\`\`\`bash
monitora-imoveis/
├── backend/          # API FastAPI, Robôs de Scraping, e DB
├── frontend/         # App Next.js + React (Dashboard do Usuário)
├── docs/             # Documentação do projeto (Arquitetura, Roadmap, Tasks)
└── README.md
\`\`\`

Consulte a pasta \`/docs\` para visões aprofundadas sobre o Fluxo de Dados e o Backlog das próximas Sprints.
