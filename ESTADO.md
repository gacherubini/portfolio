# Estado do trabalho — gacherubini.dev

Atualizado: 2026-09-04. Este arquivo existe para sobreviver a um `/compact`.
Se você é um agente retomando o trabalho, leia isto primeiro, depois
`docs/superpowers/specs/2026-09-04-portfolio-design.md`.

## O que é

Portfólio pessoal de **Gabriel Cherubini**, domínio **gacherubini.dev**.
Next.js 15 + TypeScript + Tailwind 4, deploy na Vercel. Bilíngue PT/EN.

## Decisões já fechadas (não reabrir)

- **Direção visual: "Camaleão".** O site veste a cor de cada sistema. Escolhida
  depois de seis alternativas — três descartadas (Registro, Sinal, Mapa) e mais
  três apresentadas (Vitrine, Blocos, Camaleão).
- Tipografia: **Archivo** sozinha, variável.
- Stack: **Next.js + Tailwind**. O dono descartou Astro explicitamente ("react").
- Idioma: **PT e EN com alternador**, `/pt` e `/en`, `/` redireciona pra `/pt`.
- **Nenhum print pode ter dado real de cliente.** Sistema em produção é
  fotografado a partir de instância local com dados inventados.
- Projetos: Revy, BDDente, Office Timesheet, Autotune, Gastos do mês (em
  construção) + assistente-virtual como cartão menor. **Scraping Maps está fora.**

## Mockups publicados

| O que | Link |
|---|---|
| Direção F com prints reais (o aprovado) | https://claude.ai/code/artifact/c5d2c1b9-9485-4411-9a8a-57fe3497c187 |
| D, E, F lado a lado | https://claude.ai/code/artifact/433ae1bb-4ab0-4a5c-b475-c78a4cd7fca4 |
| A, B, C (descartados) | https://claude.ai/code/artifact/bc0e7387-9fa9-4ac9-be34-f3d1286cc48b |

Os fontes dos mockups estão no scratchpad da sessão, não no repo. O que importa
está na spec.

## Prints

`public/prints/<slug>/`

- **revy/** — 6 prints prontos: `01-visao-geral.png`, `02-agente-whatsapp.png`,
  `03-atendimento-lista.jpg`, `04-conversa-agente.jpg`, `05-estoque.jpg`,
  `06-resultado.jpg`
- **bddente/** — vazio. O dono vai mandar os arquivos.
- **office-timesheet/** — um agente estava subindo o projeto local e capturando.
  Ver `scripts/seed-office-timesheet.js` se ele chegou a criar.
- **autotune/** — usar os gráficos de `../TCC_autotune/results/figures/`
  (`synthetic_rpa.png`, `vocadito_gpe.png`, etc). Falta o dono confirmar.
- **gastos/** — não existem, o app está em construção.

## Como reproduzir os prints do Revy

O que foi feito, para poder repetir:

```bash
cd ../revy-agente-card1

# .env.local foi alterado para uma loja fictícia:
#   LOCAL_STORE_NAME=Garagem Vale Motos
#   LOCAL_STORE_SLUG=vale-motos
#   LOCAL_ADMIN_EMAIL=gabriel@valemotos.demo
#   LOCAL_ADMIN_NAME=Gabriel Cherubini

# ATENÇÃO: ./local.sh up NÃO funciona — o serviço `site` do compose.local.yml
# aponta build para ./site, que não tem Dockerfile, e isso derruba o build todo.
# Suba sem ele:
docker compose --project-name revy-local --env-file .env.local \
  --file compose.local.yml up --detach --build --wait \
  postgres redis estoque-api estoque-outbox motor-api chatbot-api \
  revy-trafego portal catalogo

# Bootstrap (MSYS_NO_PATHCONV=1 é obrigatório no Git Bash, senão o /opt vira
# caminho Windows):
export MSYS_NO_PATHCONV=1
for p in "estoque:estoque-api" "chatbot:chatbot-api" "motor:motor-api" "portal:portal"; do
  docker compose --project-name revy-local --env-file .env.local \
    --file compose.local.yml exec -T "${p##*:}" \
    python /opt/revy-local/bootstrap.py "${p%%:*}"
done

# Seed (o script está em ../portfolio/scripts/seed-revy-demo.py):
# copiar para cada contêiner e rodar com o modo correspondente.
# estoque-api → estoque | chatbot-api → chatbot
# revy-trafego → trafego | portal → portal
# revy-trafego e portal precisam de --env LOCAL_STORE_SLUG=vale-motos
#   e --env LOCAL_ADMIN_EMAIL=gabriel@valemotos.demo
```

Revy Loja em **http://localhost:9000**, login `gabriel@valemotos.demo`, senha em
`../revy-agente-card1/.env.local` (`LOCAL_ADMIN_PASSWORD`).

O seed deixa: 26 motos (21 publicadas, 2 reservadas, 3 vendidas), 96 leads,
96 conversas no mês com 24 handoffs, 1 canal WhatsApp conectado, 3 campanhas
com R$ 1.318,80 de gasto, 6 vendas, R$ 119.700 de faturamento, ROAS 90,76.

Os contêineres podem estar de pé ainda. Derrubar com
`docker compose --project-name revy-local --env-file .env.local --file compose.local.yml down`.

## Pendências

1. **Prints do BDDente** — o dono vai mandar.
2. **Office Timesheet** — agente estava levantando docs e prints.
3. **Confirmar com o dono:**
   - Autotune usa os gráficos de `results/figures/` como print?
   - Botão do Revy aponta pro `revyapp.com.br` e um segundo pro catálogo público?
   - Autotune e Gastos entram como faixa cheia na home ou em seção menor?
   - `gacherubini.dev` já está comprado? Onde está o DNS?
4. **Escrever o plano de implementação** (o passo depois desta spec).
5. Nada de código do site foi escrito ainda. O repo tem só docs, scripts e prints.

## Achado que vale reportar no repo do Revy

`compose.local.yml` declara o serviço `site` com `build: context: ./site`, mas
`./site` não tem Dockerfile — é conteúdo estático que vive no Cloudflare Pages.
Resultado: `./local.sh up` falha numa máquina limpa com
`failed to read dockerfile: open Dockerfile: no such file or directory`.
