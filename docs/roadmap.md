# Roadmap e Backlog (Monitora Imóveis)

Este documento dita a visão de produto e mapeia as Sprints / Fases do MVP e Futuro, mantendo um Backlog das features pendentes e aprimoramentos técnicos.

### Fase 1: Fundação do Sistema (Concluído ✅)
- Inicializar repositório e pasta `backend/` e `frontend/`.
- Configurar dependências e ambiente FastAPI.
- Configurar Playwright no backend.
- Definir Banco de Dados `SQLite` e models via `SQLModel`.
- Criar a primeira prova de conceito de extração assíncrona (`scraper.py`) para bypassar o anti-bot da *Primeira Porta*.

### Fase 2: Configuração e Base do Frontend (Concluído ✅)
- Subir boilerplate Next.js App Router.
- Inserir Tailwind CSS.
- Conectar Shadcn UI e construir componentes de interface padrão.
- Desenvolver a página principal de listagem (Dashboard) exibindo os retornos dinâmicos e mockados provisórios.
- Componente visual do Form para adicionar nova URL preparado.

### Fase 3: Comunicação API e Background Jobs (Atual 🚧)
- Acoplar `APScheduler` ao `main.py` de forma consistente (on_startup).
- Ler dados do DB ativos.
- Detectar status (diferença entre o preço do banco de dados e o preço que a página retorna).
- Alertar "Status Inativo" quando o site retornar falha ou não renderizar a casa.

### Fase 4: Inteligência Artificial (Busca Semântica)
- Modelar campo extra JSON de facilidades ou Description na `Property`.
- Integrar `sentence-transformers` ou endpoint LlamaIndex.
- Interface customizada no Next.js do tipo "Search AI".

---

## 📋 Lista de Backlog Futuro (Pós-MVP)
- **Autenticação**: Permitir Multi-tenant (vários usuários), alterando as tabelas e adicionando JWT / Clerk (Next auth).
- **Deploy**: Migrar do SQLite para PostgreSQL hospedado (Supabase/Neon), subir FastAPI via Docker em um VPS de baixo custo, e frontend na Vercel.
- **Notificações**: Disparos de envio via Vercel Webpush ou email com o provider `Resend` avisando que "Seu imóvel baixou de preço!".
- **Integração ZAP/VivaReal**: Aumentar as regras de *scraping* para analisar outros hosts além de provedores focais, desenvolvendo adaptadores de scraping para múltiplas árvores de DOM diferentes.
