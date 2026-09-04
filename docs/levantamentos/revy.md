# Revy — levantamento

Data: 2026-09-04. Matéria-prima para `content/projetos/revy.ts`.
No ar em `revyapp.com.br`, com revenda real usando.

## O que é

Plataforma comercial para revendas de veículos. Não é um CRM: é o conjunto do
que uma loja precisa para vender moto financiada, do primeiro "oi" no WhatsApp
até a venda fechada no relatório.

## A feature de destaque: o agente de atendimento no WhatsApp

**Quem responde o cliente no WhatsApp é o sistema.** Ele puxa a moto do estoque,
responde preço e condição, e passa para uma pessoa quando o assunto sai do
roteiro.

É o que a página tem que abrir, e tem print: a aba **Agente** mostra quantas
conversas entraram no mês, quantas o agente resolveu e quantas ele transferiu
para gente. A tela de conversa mostra o diálogo real, com a resposta do agente
ao lado da do cliente.

O ponto de produto: o valor não é "tem um bot". É que o dono da loja **vê** o
que o bot está fazendo, e o handoff é explícito em vez de o cliente ficar preso
falando com uma máquina.

## Arquitetura: sete produtos, não um sistema

O monorepo tem sete produtos que **só conversam por HTTP**. Sem import de Python
entre eles, cada um com banco e migrations próprios. Isso é a decisão de
engenharia mais forte do projeto, e é o que sustenta o resto.

| Produto | O que faz |
|---|---|
| **Chatbot API** | O agente de WhatsApp: conversas, leads, mensagens, handoff |
| **Motor de simulação** | Simula financiamento nos bancos com Playwright (Santander, Fontecred, Bradesco, Pan) |
| **Estoque API** | Motos, preço, custo, publicação, reserva, venda |
| **Revy Loja** (`portal-gestao`) | O painel do lojista: visão geral, agente, atendimento, estoque, resultado |
| **Revy Control** (`revy-trafego`) | Campanhas, gasto, leads por campanha, ROAS |
| **Catálogo público** | A vitrine que o cliente final vê |
| **Site** | `revyapp.com.br`, estático no Cloudflare Pages |

O **Motor de simulação** merece nota própria: em vez de integrar por API com
banco que não oferece API, ele dirige o site do banco por Playwright. É a
solução feia que funciona, e vale contar como tal.

## Telas capturadas

6 prints em `public/prints/revy/`, de instância local com a loja fictícia
"Garagem Vale Motos":

| Arquivo | Tela |
|---|---|
| `01-visao-geral.png` | Painel do lojista: KPIs de estoque e de tráfego |
| `02-agente-whatsapp.png` | **A aba Agente** — conversas do mês, resolvidas, transferidas |
| `03-atendimento-lista.jpg` | Lista de atendimentos com nome, interesse e situação |
| `04-conversa-agente.jpg` | Uma conversa: o diálogo do agente com o cliente |
| `05-estoque.jpg` | Estoque de motos com preço e situação |
| `06-resultado.jpg` | Vendas confirmadas, receita e margem do mês |

De onde vem cada número do painel, para o texto não errar: os KPIs de estoque
vêm da estoque-api por HTTP; GASTO/LEADS/MOTOS/ROAS vêm do revy-trafego; a aba
Agente vem do chatbot-api (`/v1/atendimento/resumo`, contando `Conversa` do mês
e `status == "handoff"` como transferência); o Resultado vem da tabela `Venda`
do próprio portal.

## Links no site

- **Primário**: `revyapp.com.br`
- **Secundário**: o catálogo público *(a confirmar com o dono)*

## Como reproduzir os prints

Receita completa em `../ESTADO.md`. Resumo: subir a stack local sem o serviço
`site` (ele quebra o build — ver o achado abaixo), rodar o bootstrap dos quatro
produtos, e rodar `scripts/seed-revy-demo.py` em cada contêiner com o modo
correspondente.

O seed deixa: 26 motos (21 publicadas, 2 reservadas, 3 vendidas), 96 leads, 96
conversas no mês com 24 handoffs, 1 canal de WhatsApp conectado, 3 campanhas
com R$ 1.318,80 de gasto, 6 vendas, R$ 119.700 de faturamento.

## A confirmar com o dono

1. Números reais para a régua da página. Os do seed são inventados e **não
   podem** virar número de vitrine.
2. Desde quando está no ar, e quantas lojas usam.
3. O botão secundário aponta para o catálogo público? Qual URL?

## Achado que vale corrigir no repo da Revy

`compose.local.yml` declara o serviço `site` com `build: context: ./site`, mas
`./site` não tem Dockerfile — é estático e vive no Cloudflare Pages. `./local.sh
up` falha numa máquina limpa com `failed to read dockerfile`.

## Paleta (da spec)

| | |
|---|---|
| Fundo | `#0C0D0C` |
| Texto | `#EAF0EA` |
| Destaque | `#7CE0A8` |

Origem: o painel da Revy Loja.
