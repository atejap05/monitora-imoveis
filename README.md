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

## 💻 Configurando e Executando (Multiplataforma)

Você precisa de **dois terminais**: um para o backend (API na porta **8000**) e outro para o frontend (Next.js na porta **3000**). O frontend encaminha chamadas `/api/*` para o FastAPI via rewrite em `frontend/next.config.ts`.

### Pré-requisitos

| Ferramenta | Observação |
|------------|------------|
| **Node.js** | 18 ou superior (recomendado LTS). [nodejs.org](https://nodejs.org/) ou, no Windows, `winget install OpenJS.NodeJS.LTS`. |
| **Python** | 3.11 ou superior, com suporte a **SSL** (instalação oficial em [python.org](https://www.python.org/downloads/windows/) no Windows; marque *“Add python.exe to PATH”* no instalador). |
| **npm** | Vem com o Node. |

---

### 1. Backend (FastAPI + Playwright)

Entre na pasta `backend`, crie o ambiente virtual, instale dependências e os binários do Playwright (Chromium).

#### Windows (PowerShell ou CMD)

Use barras invertidas no `activate` no CMD; no PowerShell o comando é o mesmo com `.\`.

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
python -m pip install -U pip
pip install -r requirements.txt
playwright install chromium
```

Se `python` não for encontrado, tente `py -3.11 -m venv venv` e depois ative o `venv` como acima.

Para subir a API:

```powershell
fastapi dev main.py
```

A API ficará em `http://127.0.0.1:8000` (health: `http://127.0.0.1:8000/`).

**Dicas Windows**

- **Firewall:** na primeira execução, autorize o Python se o Windows perguntar sobre rede local.
- **Antivírus:** em raros casos, escaneamento em tempo real pode atrasar o Playwright; adicione exceção para a pasta do projeto se necessário.
- **CORS:** o backend aceita origem `http://localhost:3000`; use esse endereço no navegador para o painel.

#### macOS / Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install -U pip
pip install -r requirements.txt
playwright install chromium
fastapi dev main.py
```

**macOS (pyenv / OpenSSL):** se `pip install` falhar com erro de SSL ou `_ssl` apontando para OpenSSL 1.1 inexistente, reinstale o Python com OpenSSL 3 (Homebrew `openssl@3` + `pyenv install 3.11.x` com `LDFLAGS`/`CPPFLAGS` apontando para o `openssl@3`). O repositório pode incluir um arquivo `backend/.python-version` para fixar a versão do pyenv.

---

### 2. Frontend (Next.js)

Em **outro terminal**, na raiz do repositório:

```bash
cd frontend
npm install
npm run dev
```

Abra o painel em **http://localhost:3000**. As requisições a `/api/properties` são enviadas ao FastAPI em `http://localhost:8000` pelo proxy do Next.js.

**Variável opcional:** se precisar apontar para outra URL da API, defina `NEXT_PUBLIC_API_URL` (caso contrário, use caminhos relativos `/api/...` com o dev server).

---

### Resumo rápido

| Ambiente | Ativar venv | Backend |
|----------|-------------|---------|
| **Windows** | `venv\Scripts\activate` | `fastapi dev main.py` |
| **macOS / Linux** | `source venv/bin/activate` | `fastapi dev main.py` |

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API FastAPI | http://localhost:8000 |

## 📂 Estrutura do Repositório

```text
monitora-imoveis/
├── backend/          # API FastAPI, scraping (Playwright), SQLite
├── frontend/         # App Next.js (Dashboard)
├── docs/             # Roadmap, tasks, documentação
└── README.md
```

Consulte a pasta `/docs` para visões aprofundadas sobre o fluxo de dados e o backlog das próximas sprints.
