# Painel NFSe

Dashboard frontend para análise de dados de NFSe, com foco em indicadores, consultas detalhadas e monitoramento operacional.

## Estado atual

- Ambiente: frontend React + Vite em produção via artefato `FRONTEND.zip`.
- Rotas principais implementadas: `visao-geral`, `contribuintes`, `ambiente`, `consultas`, `notas-fiscais`, `convenios`, `volumetria`.
- Exportações existentes: CSV, XLSX, DANFSe (PDF por chave) e relatórios PDF por página.
- Status: em desenvolvimento ativo, com operação de produção estabelecida.

## Stack

- React 18 + TypeScript
- Vite 6
- TanStack Query + Zustand
- Tailwind + Radix UI
- Recharts + Leaflet
- `@react-pdf/renderer` para relatórios

## Execução local

```bash
npm install
npm run dev
```

## Build e produção

```bash
npm run build
npm run deploy
```

- `npm run deploy` gera `FRONTEND.zip` a partir de `dist/`.

## Documentação

- [Estrutura do projeto](docs/ESTRUTURA.md)
- [Features implementadas](docs/FEATURES.md)
- [Fluxo de dados](docs/FLUXO_DE_DADOS.md)
- [Tecnologias utilizadas](docs/TECNOLOGIAS.md)
- [Relatórios PDF](docs/RELATORIOS_PDF.md)
- [Operação e produção](docs/OPERACAO_PRODUCAO.md)
