# Office Timesheet — levantamento

Data: 2026-09-04. Matéria-prima para `content/projetos/office-timesheet.ts`.
Sistema fechado: entra no portfólio com prints e texto, **sem link público**.

## O que é, em linguagem de usuário

O sistema interno de um escritório de arquitetura para saber onde o tempo da
equipe foi parar e quanto cada projeto custou. Antes disso, planilha.

Três coisas na prática:

1. **Marcar hora por projeto sem planilha.** Abre o projeto, clica em "Apontar
   horas", o cronômetro roda, pausa no almoço, retoma, encerra. O valor/hora
   congela no momento do apontamento — mudança de salário depois não reescreve
   o custo do que já passou.
2. **Tocar os projetos.** Cada um tem etapas (Levantamento → Estudo Preliminar
   → Anteprojeto → Executivo) e um quadro Kanban de tarefas com responsável,
   prazo e cronômetro por tarefa.
3. **Fechar o mês.** O admin vê quanto a equipe trabalhou e quanto cada projeto
   custou, e aprova numa fila só as três coisas que precisam de gente: correção
   de ponto, reembolso de despesa e pedido de férias.

Mais três que ampliam o escopo além de folha de ponto: cadastro de pessoas
unificado (colaboradores, clientes e fornecedores juntos), agenda que junta
férias, feriados, prazos e o Google Calendar de cada um, e um assistente
conversacional que responde sobre os dados e propõe ações que a pessoa aprova.

Detalhe de produto que vale contar: **o assistente não é um canal
privilegiado.** Cada pessoa alcança por ele exatamente o que alcançaria
navegando o site. A régua de permissão é a mesma.

## Números

| Métrica | Valor |
|---|---|
| Casos de teste | **1.452** (1.119 API + 333 web) |
| Arquivos de teste | 213 |
| Endpoints HTTP | 148 |
| Migrations SQL | 56 |
| Tabelas no banco | 40 |
| Páginas React | 26 (3 públicas + 13 colaborador + 10 admin) |
| Componentes React | 40 |
| Tools do assistente | 34 (17 leitura + 15 escrita + SQL ad-hoc + meta) |

Os 1.452 casos de teste são o número mais forte para o card. Suíte de
integração roda contra Postgres real no CI.

## Stack

**Backend** (ESM, Node 20): Express 5, `pg`, JWT, bcrypt, Multer, AWS SDK S3,
Resend, Pino + Axiom, OpenAI SDK, `node-sql-parser`, ExcelJS/PDFKit. Vitest +
Supertest.

**Frontend**: React 19, Vite 6, React Router 7, Tailwind 3, date-fns,
react-markdown + rehype-sanitize. Vitest + Testing Library.

**Banco**: PostgreSQL 16 local, Fly Postgres Flex 18 em produção.

**Deploy**: 3 apps no Fly.io (região `iad`) — API, frontend estático por Caddy,
cluster Postgres. GitHub Actions num workflow só: matriz de lint/build → testes
de integração contra Postgres de serviço → `flyctl deploy`. Push em `main`
publica.

## Notas de engenharia (candidatas ao bloco técnico)

- **Integridade no banco, não só no código.** Índice único parcial garantindo um
  apontamento aberto por pessoa, `EXCLUDE` barrando férias sobrepostas, um
  pedido pendente por apontamento, `ON DELETE RESTRICT` em
  `time_entries → projects`. A regra de negócio vive onde não dá para burlar.
- **Sessão invalidável sem trocar o segredo global.** JWT HS256 de 7 dias com
  `sessions_valid_after` na tabela `users`: dá para derrubar todas as sessões de
  uma pessoa sem afetar ninguém.
- **Autorização em camadas.** 4 papéis e 6 middlewares dedicados, com a mesma
  régua replicada no `ProtectedRoute` do front.
- **Assistente com trilha de auditoria.** Toda escrita passa por proposta que o
  usuário aprova; cada resposta declara no rodapé quais leituras a produziram;
  custo por chamada logado em USD com teto diário por pessoa; SQL ad-hoc só via
  role Postgres somente-leitura dedicada.
- **Observabilidade com cuidado de percentil.** Log JSON por request com
  `req_id`, enviado ao Axiom. SSE tratado separado — conexão longa vira
  `stream_encerrado` com duração própria, para não dominar o p95 da API.
  Usuário identificado por id numérico, nunca por e-mail.

## Prints

13 arquivos em `public/prints/office-timesheet/`, PNG 3200×2000 (viewport
1600×1000 em DPR 2). Todos conferidos: nenhum nome, e-mail ou empresa real.

`01-dashboard-colaborador` · `02-registro-horas-projetos` · `03-tarefas-kanban`
· `04-projeto-etapas-e-quadro` · `05-historico-apontamentos` ·
`06-performance-colaborador` · `07-agenda-equipe` · `08-dashboard-admin` ·
`09-pessoas` · `10-apontamentos-da-equipe` · `11-aprovacoes` ·
`12-painel-ao-vivo` · `13-relatorio-financeiro`

Falta um print do `/assistente`: sem chamada real ao provedor a tela sai vazia,
e fazer uma pergunta de verdade gasta a chave paga. Se quiser esse print, é
logar, perguntar e capturar.

Os cards de projeto aparecem com miniatura cinza porque o upload de imagem
depende do Tigris/S3, vazio no ambiente local.

## Como reproduzir

```bash
cd ../office-timesheet && docker compose up -d
cd src && npm run migrate
cd ../../portfolio && node scripts/seed-office-timesheet.js
```

O seed é reexecutável: trunca as 39 tabelas de aplicação e reescreve tudo, com
PRNG de semente fixa — rodar de novo dá exatamente os mesmos números.

Volume: 9 usuários, 6 clientes, 6 projetos, 31 etapas, 50 tarefas, 671
apontamentos (mês corrente + 2 anteriores), 87 cronômetros de tarefa, 14
despesas, 6 bônus, 6 pedidos de férias, 4 correções de ponto.

Empresa fictícia **Studio Aurora Arquitetura**, senha de todos `portfolio123`.
Para ver a interface completa entre com `helena.vasconcelos@studioaurora.com.br`
(admin).

## Achado colateral

O `README.md` do office-timesheet está desatualizado: descreve o sistema como
"controle de horas + dashboard" e não menciona Kanban, etapas, pessoas, agenda,
férias, despesas, bônus nem o assistente — que são metade do produto hoje.
