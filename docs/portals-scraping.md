# Portais suportados e scraping

Este documento descreve os **adaptadores** do backend ([`backend/adapters/`](../backend/adapters/)), padrões de URL e limitações conhecidas.

## Visão geral

| Portal | `source` na API | Estratégia principal |
|--------|-----------------|----------------------|
| Primeira Porta | `Primeira Porta` | Texto do `body`, `og:title`, regex BRL |
| GI Intervale / Trilar / Wilson | `GI Intervale`, `Trilar Imóveis`, `Wilson Imóveis` | Plataforma **Univen/Agiliza Union**: regex em texto SSR + URL (`/alugar/`, `/comprar/`) |
| Nova Freitas | `Nova Freitas` | Portal Kurole: regex + detalhe do anúncio |
| ZAP Imóveis | `ZAP Imóveis` | `__NEXT_DATA__` (Next.js) + fallback no texto |
| VivaReal | `VivaReal` | Idem ZAP |
| ImovelWeb | `ImovelWeb` | Idem ZAP, `wait` maior (anti-bot) |
| Quinto Andar | `Quinto Andar` | `__NEXT_DATA__` / scripts + texto |
| OLX Imóveis | `OLX Imóveis` | `__NEXT_DATA__` + texto (apenas paths `/imoveis`) |
| Outros | hostname | **GenericAdapter**: `og:*`, JSON-LD, regex |

## Padrões de URL (exemplos)

- **Univen:** `/{alugar\|comprar}/sp/{cidade}/{bairro}/{tipo}/{id}`
- **Nova Freitas:** `/{alugar\|vender}/{Cidade}/.../{codigo}`
- **ZAP/VivaReal:** `/imovel/...-id-{id}/` ou buscas com query
- **Quinto Andar:** `/alugar/imovel/...` ou `/imovel/{id}/...`
- **OLX:** `https://www.olx.com.br/imoveis/...`

## Campos extras (API)

Além dos campos já existentes, o scraper pode preencher (quando o portal expõe):

- `condoFee` — condomínio
- `iptu` — IPTU
- `description` — descrição longa
- `referenceCode` — código de referência do anúncio

## Limitações e riscos

- **Termos de uso:** o uso deve ser **pessoal/reasonable** (monitorar URLs que o usuário informa), sem crawling massivo.
- **Anti-bot:** ZAP, VivaReal, ImovelWeb e OLX podem bloquear IPs datacenter; em produção pode ser necessário proxy residencial BR ou ajuste de frequência.
- **SPAs:** Quinto Andar e OLX podem mudar o formato interno; o fallback usa texto visível e metadados.
- **Créditos Firecrawl / ferramentas externas:** não são obrigatórios para o scraper em produção (Playwright local).

## Testes

Testes unitários sem rede: `backend/tests/test_adapters.py`.

```bash
cd backend && source venv/bin/activate && python -m pytest tests/test_adapters.py -v
```
