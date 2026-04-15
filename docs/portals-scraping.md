# Portais suportados e scraping

Este documento descreve os **adaptadores** do backend ([`backend/adapters/`](../backend/adapters/)), padrões de URL e limitações conhecidas.

**Produção:** o scrape em tempo real usa Playwright **sync** em [`backend/scraper.py`](../backend/scraper.py). Os adaptadores (`PrimeiraPortaAdapter`, `CidImoveisAdapter`, etc.) **espelham** a mesma heurística para testes assíncronos e descoberta via `AdapterRegistry`; o fallback genérico para outros hosts continua sendo regex + metadados no `scraper.py` (não é o `GenericAdapter` isolado).

## Visão geral

| Portal | `source` na API | Estratégia principal |
|--------|-----------------|----------------------|
| Primeira Porta | `Primeira Porta` | Ficha `#desc_tags` (`<p>Rótulo: valor</p>`) para bairro, endereço, código, áreas; `og:title` / `og:image`; condomínio via texto `Condomínio R$ …`; demais campos com regex no `body` |
| CID Imóveis | `cidimoveis.com.br` | Barra `.property-amenities`: `#amenity-vagas span` (vagas), `#amenity-dormitorios`, `#amenity-suites`, `#amenity-banheiros`, `#amenity-area-privativa` / `#amenity-area-total`; primeiro `span` da barra como código numérico; `Condomínio` / `IPTU` no texto |
| GI Intervale / Trilar / Wilson | `GI Intervale`, `Trilar Imóveis`, `Wilson Imóveis` | Plataforma **Univen/Agiliza Union**: regex em texto SSR + URL (`/alugar/`, `/comprar/`) |
| Nova Freitas | `Nova Freitas` | Portal Kurole: regex + detalhe do anúncio |
| ZAP Imóveis | `ZAP Imóveis` | `__NEXT_DATA__` (Next.js) + fallback no texto |
| VivaReal | `VivaReal` | Idem ZAP |
| ImovelWeb | `ImovelWeb` | Idem ZAP, `wait` maior (anti-bot) |
| Quinto Andar | `Quinto Andar` | `__NEXT_DATA__` / scripts + texto |
| OLX Imóveis | `OLX Imóveis` | `__NEXT_DATA__` + texto (apenas paths `/imoveis`) |
| Outros | hostname (sem `www.`) | Regex no `body`, `og:*`, dicas de URL quando o slug permitir |

## Padrões de URL (exemplos)

- **Univen:** `/{alugar\|comprar}/sp/{cidade}/{bairro}/{tipo}/{id}`
- **Nova Freitas:** `/{alugar\|vender}/{Cidade}/.../{codigo}`
- **ZAP/VivaReal:** `/imovel/...-id-{id}/` ou buscas com query
- **Quinto Andar:** `/alugar/imovel/...` ou `/imovel/{id}/...`
- **OLX:** `https://www.olx.com.br/imoveis/...`
- **CID Imóveis:** `/imovel/{id}/...`
- **Primeira Porta:** `/imovel/{id}/...`

## Seletores estáveis (referência)

- **Primeira Porta:** `#desc_tags` — evita capturar “bairro” do menu (ex.: item “Bairro da Floresta”) antes da ficha do imóvel.
- **CID Imóveis:** `#amenity-vagas`, `#amenity-dormitorios`, … — evita divergência entre resumo no topo da página e a barra de ícones (ex.: vagas).

Após `domcontentloaded`, o scraper espera até ~4s por `#desc_tags` ou `.property-amenities` quando o host corresponde, além de `wait_for_timeout(2500)`.

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
