# Task List - Monitora Imóveis MVP

## Fase 1: Setup da Fundação (Backend)
- [x] Criar pasta `backend`
- [x] Configurar ambiente virtual Python e dependências (FastAPI, Uvicorn, SQLModel/SQLAlchemy, SQLite, Playwright)
- [x] Criar estrutura base do FastAPI (`main.py`, routers, models)
- [x] Configurar Banco de Dados SQLite em memória ou arquivo local e gerar schema inicial (`Property`, `PropertyHistory`)
- [x] Implementar Script de Scraping Base usando Playwright Headless para extrair dados da *Primeira Porta*

## Fase 2: Configuração do Frontend (Painel do Usuário)
- [x] Criar pasta `frontend` e inicializar projeto Next.js (App Router, TS, Tailwind)
- [x] Instalar dependências visuais (lucide-react, UI components - prever uso de *shadcn ui*)
- [x] Criar Dashboard Principal (listagem de imóveis cadastrados)
- [x] Criar componente de Inserção de Nova URL para monitorar
- [x] Conectar Frontend com API FastAPI (CORS, fetch/axios)

## Fase 3: Background Jobs e Regras de Negócio
- [ ] Integrar APScheduler no FastAPI
- [ ] Criar job recorrente que busca URLs do DB e roda o Scraper
- [ ] Implementar detecção de quedas de preço e registrar histórico
- [ ] Implementar tratamento para imóveis "Vendidos/Alugados" (Status 410 / Não Encontrado)

## Fase 4: Refinamento e Busca Semântica
- [ ] Instalar libs de IA (`sentence-transformers` ou LlamaIndex)
- [ ] Vetorizar descrições de novos imóveis e inseridos
- [ ] Expor endpoint de busca semântica livre
- [ ] Criar input de busca avançada ("imóveis até 1.500 que aceitam pets") no Frontend
