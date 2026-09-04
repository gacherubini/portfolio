# gacherubini.dev

Portfólio pessoal de Gabriel Cherubini. Os sistemas que eu construí, cada um com
prints, explicação em português comum e — quando o sistema é público — link para
entrar e clicar.

**Estado: em construção.** Design aprovado e especificado; o código do site ainda
não foi escrito. O que existe aqui hoje é a spec, os scripts que geram os dados
de demonstração e os prints já capturados.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Vercel. Bilíngue PT/EN.

## Projetos no site

| Projeto | O que é | Situação |
|---|---|---|
| Revy | Plataforma comercial para revendas de veículos, com agente de atendimento no WhatsApp | no ar |
| BDDente | Prontuário odontológico que substituiu um FoxPro de 1996 | no ar |
| Office Timesheet | Controle de horas e projetos para escritório de arquitetura | sistema fechado |
| Autotune | TCC sobre algoritmos de detecção de pitch | publicado |

## A regra dos prints

**Nenhuma imagem no site pode conter dado real de cliente, de paciente ou de
empresa.** Sistema em produção é fotografado a partir de uma instância local
populada com dados inventados.

Os scripts que fazem isso vivem em [`scripts/`](scripts/) e são reexecutáveis:

- `seed-revy-demo.py` — popula os quatro serviços da Revy com uma loja fictícia
  ("Garagem Vale Motos"): 26 motos, 96 leads, 96 conversas, 3 campanhas.
- `seed-office-timesheet.js` — popula o Office Timesheet com um escritório de
  arquitetura fictício: 8 pessoas, 6 projetos, tarefas e apontamentos de hora.

## Onde está o resto

- [`ESTADO.md`](ESTADO.md) — estado corrente do trabalho e como reproduzir os prints
- [`docs/superpowers/specs/`](docs/superpowers/specs/) — a spec de design
