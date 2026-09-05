# BDDente — levantamento

Data: 2026-09-04. Matéria-prima para `content/projetos/bddente.ts`.
Em produção em `bddente.fly.dev`, com uma clínica real usando.
Código em `../dentalis`.

## A história

Substituiu o **Dentalis**, sistema em FoxPro que rodou no consultório
**de 1996 a 2024** e hoje é inutilizável.

Esse é o gancho do projeto, e os números sustentam:

| | |
|---|---|
| Pacientes no cadastro histórico | **5.559** |
| Lançamentos clínicos migrados | **44.812** |
| Condições pré-existentes preservadas | **9.629** |
| Linhas de faturamento migradas | 28.244 |
| Anos de histórico | **~30** |
| Testes passando | **914** |

Uma dentista, um consultório, trinta anos de prontuário. **Migração, LGPD e
backup foram escopo do MVP, não fase 2** — porque o sistema entrou em uso real
no primeiro dia, e não existe "depois a gente arruma" quando o prontuário de
alguém está lá dentro.

## Situação de cada parte

| Parte | Estado |
|---|---|
| Prontuário: pacientes, odontograma, lançamentos, anamnese, PDF | no ar |
| Migração do histórico clínico e financeiro | executada |
| Financeiro: produção, a receber, recebimentos | no ar |
| Agenda: semana, mês, marcar, atender | no ar |
| **Lembrete por WhatsApp** | **código pronto, desligado** |
| Deploy, backup e restauração | no ar, restauração testada |

## O lembrete de WhatsApp

**Cuidado, e isso é importante para o texto do site não mentir.** O lembrete de
véspera está **construído e desligado**. Ele não manda mensagem para ninguém
hoje.

São duas travas independentes, e as duas precisam cair para uma mensagem sair:

1. `configuracao_clinica.lembrete_ativo` nasce `false` — "deploy que já sai
   mandando mensagem para paciente é a definição de acidente"
2. quem "envia" é um provedor de mentira que registra o que enviaria

Falta subir a Evolution API no Fly, ler o QR na tela de Configurações e ligar a
chave. O código do envio de verdade está pronto.

**Como escrever isso no site:** "o lembrete de véspera está construído, com a
chave desligada até a clínica conectar o WhatsApp" é verdade e é uma frase
melhor que a alternativa. Dizer "manda mensagem automática" seria falso hoje.

### O que a tela mostra, e por que isso é o destaque

O print da agenda documenta a decisão inteira sem precisar de legenda:

- Uma tarja no topo: **"Os lembretes de WhatsApp desligados — ninguém está sendo
  avisado da consulta"**, com um link para ligar. O sistema não finge que está
  funcionando.
- Cards com **"sem lembrete"** — paciente sem telefone cadastrado. Não dá para
  avisar, e a tela diz isso em vez de falhar calado.
- Cards com **"sem permissão de WhatsApp"** e um botão **"perguntar"**.

Esse terceiro é o melhor detalhe do projeto. `aceita_whatsapp` tem **três**
estados, e o do meio é o que importa: `NULL` significa *nunca perguntamos*, e
`NULL` não recebe mensagem. Os 5.559 pacientes migrados entraram assim, porque
o Dentalis nunca perguntou — e presumir autorização de 5.559 pessoas é
exatamente o que a lei não permite. O botão "perguntar" é como isso vira `true`
ou `false`, uma pessoa por vez, com ela na cadeira.

Um sistema que herda 5.559 cadastros e escolhe não mandar mensagem para nenhum
deles até perguntar. É a coisa mais difícil de fazer e a mais fácil de explicar.

## Telas

Menu: Agenda · Pacientes · **Odontograma** · Atendimentos · Tratamentos ·
Financeiro · Recebimentos

### Odontograma

A tela que carrega o produto. Arcada completa em numeração FDI (18–28, 48–38),
cada dente desenhado com as faces separadas. Clica num dente e o painel abre:

- **Categoria** e **tratamento** (o segundo depende do primeiro)
- **Onde**: boca toda · dente inteiro · regiões
- **Coroa**: mesial, distal, vestibular, lingual, oclusal — clicar em mais de uma
  face soma e o valor multiplica; clicar de novo desmarca
- **Raiz**: canal mesial, central, distal
- **Situação**: planejado ou realizado, data, valor, observação
- **"Repetir em outro dente"**

Três camadas de cor no desenho: **vermelho** planejado, **verde** realizado,
**azul** já existente. A camada azul é uma tabela separada (`condicao`) — estado
que já estava lá quando o prontuário começou, sem preço e sem status, porque não
foi a atual responsável que fez.

### Histórico de atendimentos

Abaixo do odontograma, agrupado por data com contagem e total do dia. No print
o histórico vai de 2021 a 2026 na mesma tela.

### Agenda

Semana ou mês, grade por hora. Card com nome, horário, duração, telefone, e o
estado do lembrete. Cancelado aparece riscado.

## Notas de engenharia (candidatas ao bloco técnico)

- **Consentimento de três estados.** Ver acima. É a decisão que define o projeto.
- **Idempotência no banco, não em `if`.** `UniqueConstraint(agendamento_id, tipo)`
  na tabela `lembrete`: o banco recusa a segunda linha. Vale se o cron disparar
  duas vezes, se houver duas máquinas durante um deploy, e se alguém clicar em
  "enviar agora" enquanto o cron roda.
- **O que não saiu é informação.** As situações `DESCARTADO` e `EXPIRADO`
  existem porque saber **quem não vai receber** é sobre o que a clínica consegue
  agir hoje, com a paciente na cadeira. Lembrete que simplesmente não é criado
  não aparece em tela nenhuma.
- **Auditoria obrigatória.** Toda escrita deixa linha em `auditoria`, com
  `dados_antes` e `dados_depois` em JSONB. É exigência de LGPD e a única forma de
  responder "quem mudou este prontuário e quando".
- **Sessão em cookie assinado, sem tabela.** O cookie carrega o id e uma
  *impressão* do hash da senha. Trocar a senha muda a impressão e derruba toda
  sessão emitida antes, inclusive a de quem estava com a senha vazada.
- **Dado suspeito é marcado, nunca corrigido no chute.** `revisar_motivo` é um
  array de texto no paciente e no lançamento. Trinta anos de FoxPro produzem
  registro ambíguo, e a escolha foi preservar e sinalizar em vez de adivinhar.
- **Telefone trocado não é apagado.** Sai da ficha, fica no banco. Mesma
  filosofia do prontuário: guarda o que aconteceu, não o estado de agora.

## Stack

Python com **FastAPI**, SQLAlchemy 2, Alembic, PostgreSQL 16, templates
server-side. Senha com **argon2**. Sessão em cookie assinado (itsdangerous).
Deploy no **Fly.io** com deploy automático a cada push na `main`. Backup e
restauração testados. Evolution API para o WhatsApp (ainda não conectada).

## Prints

8 telas em `public/prints/bddente/`, PNG 3200×2000 (viewport 1600×1000, DPR 2),
capturadas de instância local:

`01-agenda-semana` · `02-odontograma` · `03-pacientes` · `04-atendimentos` ·
`05-financeiro` · `06-recebimentos` · `07-tratamentos` · `08-anamnese`

**Nenhum paciente real aparece.** Clínica, dentista, pacientes, telefones e
tratamentos são inventados por `scripts/seed-bddente.py`. Os prints de produção
que existiam não entraram, e não devem entrar: prontuário odontológico é dado
de saúde, o repositório é público, e uma vez no histórico do git é permanente.

O par mais forte para a página: `01-agenda-semana` abrindo (a tarja do lembrete
e os três estados de consentimento) e `02-odontograma` como a imagem grande.

## Como reproduzir

```bash
cd ../dentalis
DB_PORT=5434 docker compose up -d db
DATABASE_URL="postgresql+psycopg://bddente:bddente@localhost:5434/bddente" \
  ./.venv/Scripts/alembic.exe upgrade head
DATABASE_URL="postgresql+psycopg://bddente:bddente@localhost:5434/bddente" \
  ./.venv/Scripts/python.exe ../portfolio/scripts/seed-bddente.py
DATABASE_URL="postgresql+psycopg://bddente:bddente@localhost:5434/bddente" \
  COOKIE_SEGURO=false ./.venv/Scripts/python.exe -m uvicorn app.main:app --port 8077
```

Login `renata@belavista.demo`, senha `portfolio-bddente-2026`.

Para capturar sem digitar senha, o cookie de sessão pode ser assinado pelo
próprio app (`app.auth.sessao.assinar`) e injetado por CDP — foi assim que os 8
prints saíram.

Volume do seed: 24 pacientes, 103 lançamentos, 40 agendamentos, 39 parcelas,
anamnese preenchida para a paciente em destaque. PRNG de semente fixa: rodar de
novo dá os mesmos números.

Derrubar: `docker compose down` em `../dentalis`.

## Situação no site

**Sem link.** Decisão do dono em 04/09/2026: prontuário é sistema de clínica, e
visitante não deve alcançar nem a tela de entrada. Entra como o Office
Timesheet — prints e texto, `links: []`, e o componente mostra "sistema fechado".

## Paleta (da spec)

| | |
|---|---|
| Fundo | `#5B21A8` |
| Texto | `#F4EEFC` |
| Destaque | `#D9C4F5` |

Origem: o menu lateral roxo do sistema. Confirmado nos prints novos.

## A confirmar com o dono

1. Desde quando está no ar.
2. Se os 914 testes e os 44.812 lançamentos migrados podem virar número de
   vitrine (são do README do projeto, então presumo que sim).
