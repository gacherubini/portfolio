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

Mais duas que ampliam o escopo além de folha de ponto: cadastro de pessoas
unificado (colaboradores, clientes e fornecedores juntos) e uma agenda que junta
férias, feriados, prazos e o Google Calendar de cada um.

E o assistente, que ganhou seção própria abaixo.

## A feature de destaque: o assistente

**Um chatbot construído com DeepSeek para resolver as tarefas do dia a dia do
escritório.** Em vez de navegar sete telas para montar a resposta, a pessoa
pergunta.

Os 17 tools de leitura dizem para que ele serve melhor que qualquer descrição.
São as perguntas chatas de segunda-feira, cada uma virada função:

`quemNaoApontou` · `tasksTravadas` · `cargaEquipe` · `feriasEConflitos` ·
`custoPorProjeto` · `aprovacoesPendentes` · `apontamentosAbertos` ·
`andamentoDeProjeto` · `despesasDoPeriodo` · `agendaDoPeriodo` ·
`simulacaoPerformance` · `gerarRelatorio` · `statusProjeto` · `listarEquipe` ·
`bonusDoPeriodo` · `meusBonus` · `aniversariantes`

### O detalhe que vale contar

São 15 tools de escrita, e **todos os quinze começam com `propor`**:

```
proporCriarTask        proporAprovarDespesa    proporLancarBonus
proporPedirFerias      proporEncerrarApontamento  proporMoverTask
proporRejeitarFerias   proporEditarTask        proporComentarTask
proporCriarApontamento proporLancarDespesa     proporEditarBonus
proporAprovarFerias    proporRejeitarDespesa   proporApagarBonus
```

Nenhum se chama `criar` ou `aprovar`. O assistente não escreve no sistema — ele
propõe, e a pessoa aprova. A regra não está num comentário nem numa checagem
solta: está no nome de cada função que o modelo pode chamar. Escrever direto é
uma coisa que não existe para ele.

### As outras três amarras

- **Não é um canal privilegiado.** Cada pessoa alcança pelo assistente
  exatamente o que alcançaria navegando o site. A mesma régua de permissão dos
  4 papéis vale nos dois caminhos.
- **Cada resposta declara suas fontes.** No rodapé vai a lista de quais leituras
  produziram aquela resposta. Dá para conferir em vez de acreditar.
- **Teto de gasto por pessoa.** O custo de cada chamada é logado em USD, com
  limite diário por usuário (US$ 1 no default) e uma tela de admin mostrando
  gasto por dia, pedidos que ele não atendeu e avaliação por polegar. SQL ad-hoc
  só roda por uma role Postgres somente-leitura dedicada.

### Stack do assistente

Modelo **DeepSeek V4 Flash**, falado por SDK OpenAI-compatible
(`AGENT_PROVIDER_BASE_URL` + `AGENT_MODEL`, default `api.deepseek.com`), com
resposta em streaming. Preço por 1M de tokens vem de env e alimenta o custo na
tela do admin — sem esses valores o custo sai `null`, não zero, para não mentir
que foi de graça.

Tem suíte de evals própria (`src/lib/agent/evals/`) e um cuidado explícito com
**prompt injection** vindo de anexo: PDF que a pessoa sobe entra no contexto do
modelo, e o código trata isso como superfície de ataque, não como texto de
confiança.

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

**Falta o print do `/assistente`, e agora ele é obrigatório** — o destaque da
página precisa de imagem. Sem uma pergunta real a tela sai vazia ("Conversas
0"), o que não demonstra nada. O agente parou aí para não gastar a chave paga,
mas o modelo é DeepSeek V4 Flash: uma pergunta custa fração de centavo, não a
conta do mês. Basta logar, fazer duas ou três perguntas boas (uma de leitura,
uma que gere proposta de escrita para o print mostrar o botão de aprovar) e
capturar.

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
