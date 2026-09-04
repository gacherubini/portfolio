# BDDente — levantamento

Data: 2026-09-04. Matéria-prima para `content/projetos/bddente.ts`.
Em produção em `bddente.fly.dev`, com uma clínica real usando.

> **Os prints ainda não existem.** Os que o dono mandou vieram da produção, com
> nome de paciente, histórico de tratamento e a agenda inteira com telefones.
> A pasta `public/prints/bddente/` fica vazia até existir instância local com
> pacientes inventados. Ver `public/prints/README.md`.

## A história

Substituiu um FoxPro de 1996. Esse é o gancho mais forte do projeto: a clínica
rodava num sistema de trinta anos atrás, e a migração é o que justifica cada
decisão de produto — a interface tinha que ser reconhecível para quem passou a
carreira inteira no outro, e nenhum dado histórico podia se perder (o histórico
de atendimentos mostra tratamentos de 2012).

## A feature de destaque: lembrete automático

**O sistema manda mensagem no WhatsApp do paciente um dia antes da consulta,
sozinho.**

Falta é o custo invisível de consultório: horário reservado que não gera receita
e não dá para revender em cima da hora. O lembrete ataca isso sem ninguém na
clínica precisar lembrar de mandar.

A feature aparece na própria tela da agenda, e é o que dá para fotografar dela:
cada consulta mostra o telefone do paciente, ou a marca **"sem lembrete"**
quando não há telefone cadastrado. O sistema diz que não vai conseguir avisar,
em vez de falhar calado — vale como nota de produto, porque a alternativa
(silêncio) é o que a maioria dos sistemas faz.

## Telas (do menu lateral)

Agenda · Pacientes · **Odontograma** · Atendimentos · Tratamentos · Financeiro ·
Recebimentos

### Odontograma

É a tela que carrega o produto e a que melhor se explica por imagem.

Arcada completa em numeração FDI (18–28 e 48–38), cada dente desenhado com as
faces separadas. Clica num dente e o painel da direita abre o lançamento:

- **Categoria** e **tratamento** (o segundo depende do primeiro)
- **Onde**: boca toda · dente inteiro · regiões
- **Regiões da coroa**: mesial, distal, vestibular, lingual, oclusal — clicar em
  mais de uma face soma, e o valor multiplica; clicar de novo desmarca
- **Raiz**: canal mesial, central, distal
- **Situação**: planejado ou realizado
- Data, valor, observação
- **"Repetir em outro dente"** — o mesmo lançamento em outro dente sem redigitar

Legenda de cor no próprio desenho: vermelho planejado, verde realizado, azul já
existente, vazio sem nada. Dá para ler a boca inteira de relance.

### Histórico de atendimentos

Abaixo do odontograma, agrupado por data, com contagem e total por dia
("4 tratamentos · R$ 180,00"). Cada linha tem tratamento, dente, situação, valor,
e editar/excluir. Cabeçalho da ficha: **anamnese**, **registrar recebimento**,
**prontuário em PDF**, editar cadastro.

### Agenda

Semana ou mês. Grade por hora, consultas de 30 min. Cada card traz nome do
paciente, faixa de horário, duração, e telefone ou "sem lembrete". Consulta
cancelada aparece riscada.

## A confirmar com o dono

1. Números para a régua: quantos pacientes, quantos atendimentos registrados,
   desde quando está no ar, quantos anos de histórico vieram do FoxPro.
2. Stack e hospedagem (o domínio é Fly.io; falta linguagem e banco).

## Situação no site

**Sem link.** Decisão do dono em 04/09/2026: prontuário é sistema de clínica, e
visitante não deve alcançar nem a tela de entrada. Entra como o Office
Timesheet — prints e texto, `links: []`, e o componente mostra "sistema
fechado" no lugar do botão.

## Paleta (da spec)

| | |
|---|---|
| Fundo | `#5B21A8` |
| Texto | `#F4EEFC` |
| Destaque | `#D9C4F5` |

Origem: o menu lateral roxo do sistema.
