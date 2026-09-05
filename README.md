# gacherubini.dev

Portfólio pessoal de Gabriel Cherubini. Os sistemas que eu construí, cada um com
prints, explicação em português comum e — quando o sistema é público — link para
entrar e clicar.

**Estado: pronto, não publicado.** As Tasks 1–17 do plano de implementação estão
na `main` — conteúdo dos quatro projetos, home em PT e EN com as quatro faixas,
as oito páginas de projeto com os sete blocos, Sobre e fechamento, tradução
inglesa inteira, metadata, sitemap, robots, ícone e página 404. A branch `v2`
acrescenta as 11 tasks de uma segunda rodada — números reais de vitrine da
Revy, o selo de IA, o Sobre reescrito, e a galeria de prints virando pranchas
com abertura em tela cheia — e está completa. Falta só o merge em `main` e o
deploy, a Task 18, deixados para o dono executar.

Verificação do último estado completo: `npm test` com 207 testes em 21
arquivos, `npm run build` verde e `git diff --check` limpo. O PDF do currículo
continua deliberadamente ausente; a build avisa e o botão não aparece.

Duas coisas para saber antes de publicar, detalhadas em
[`ESTADO.md`](ESTADO.md): `sitemap.ts` e `robots.ts` já apontam para
`gacherubini.dev`, um domínio que ainda não foi comprado; e o 404 renderiza
bilíngue em qualquer navegador com JavaScript, mas sai com corpo vazio no HTML
cru para três das quatro formas de URL inválida — fechar isso exige uma decisão
que troca o `lang` correto de `/en` pelo corpo do 404.

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
- [`docs/superpowers/plans/`](docs/superpowers/plans/) — plano e ordem de implementação
- `.superpowers/sdd/2026-09-04-portfolio-implementacao/progress.md` — ledger local das tasks e revisões
