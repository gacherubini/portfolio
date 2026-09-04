# Estado do trabalho — gacherubini.dev

Atualizado: 2026-09-04. Este arquivo existe para sobreviver a um `/clear`.
Se você é um agente retomando o trabalho, leia isto primeiro, depois a spec e os
levantamentos.

Repositório: **https://github.com/gacherubini/portfolio** — e ele é **público**.

## O que é

Portfólio pessoal de **Gabriel Cherubini**, domínio **gacherubini.dev**.
Next.js 15 + TypeScript + Tailwind 4, deploy na Vercel. Bilíngue PT/EN.

**Nenhuma linha do site foi escrita ainda.** O repo tem spec, levantamentos,
seeds, prints e o texto do "Sobre". Falta o plano de implementação e o código.

## Decisões fechadas (não reabrir)

- **Direção visual "Camaleão".** O site não tem cor própria: veste a de cada
  sistema. Escolhida depois de seis alternativas em mockup, e **reaberta e
  reconfirmada em 04/09** contra outras três (casca editorial, azul da marca,
  vitrine). Não reabrir uma terceira vez sem argumento novo. A queixa que
  motivou a reabertura foi "o site fica sem cara própria", e ela continua de pé
  como crítica — a escolha foi manter a direção mesmo assim.
- **Cor pode ser atribuída quando o produto não tem uma.** A regra antiga
  proibia cor inventada. Caiu em 04/09, na decisão do Autotune. O que ficou no
  lugar: a origem de cada cor é declarada na tabela da seção 3 da spec —
  amostrada de qual print, ou atribuída.
- **Marca**: `gacherubini` em `#0F1317` + `.dev` em `#2A4FD7`. Única cor fixa do
  site, sempre sobre o neutro da casca.
- Tipografia: **Archivo** sozinha.
- Stack: **Next.js + Tailwind**. Astro foi descartado ("react").
- Idioma: **PT e EN com alternador**, `/pt` e `/en`, `/` cai no `/pt`.
- **Projetos: Revy, BDDente, Office Timesheet, Autotune**, todos como faixa de
  largura total, nessa ordem. Scraping Maps está fora. O app de finanças
  ("Gastos do mês") foi removido em 04/09 por não ter tela e cor própria — mas
  **o motivo caiu junto com a regra**, e a volta dele virou pendência.
- **As paletas foram amostradas dos prints em 04/09** e duas estavam erradas na
  spec. Office Timesheet não tem azul: é verde `#2E3D38` com laranja `#CB6D31`.
  O âmbar do Autotune não existe em print nenhum — o plugin é menta `#2EE6A0` e
  os gráficos do TCC são azul matplotlib. O âmbar ficou assim mesmo, atribuído.
  Tabela corrigida na seção 3 da spec.
- **BDDente e Office Timesheet entram sem link.** São sistemas fechados.
- **Nenhum print pode ter dado real de cliente ou paciente.** Sistema em produção
  é fotografado de instância local com dados inventados.

## Onde está cada coisa

| Arquivo | O que é |
|---|---|
| `docs/superpowers/specs/2026-09-04-portfolio-design.md` | a spec de design aprovada |
| `docs/levantamentos/revy.md` | matéria-prima do texto da Revy |
| `docs/levantamentos/bddente.md` | idem, BDDente |
| `docs/levantamentos/office-timesheet.md` | idem, Office Timesheet |
| `docs/levantamentos/autotune.md` | idem, Autotune |
| `content/sobre.ts` | **o único conteúdo de site que existe** — PT e EN |
| `scripts/seed-*.{py,js}` | os três seeds de dados fictícios |
| `public/prints/<slug>/` | 32 prints |
| `mockups/` | os comps das decisões de 04/09 — **ver abaixo** |

### Os mockups aprovados

`mockups/` é HTML descartável, não é código do site. Existe porque a primeira
rodada de seis mockups se perdeu e a decisão teve que ser refeita do zero.
Rode `python -m http.server 4321` na raiz e abra `/mockups/`.

| Arquivo | O que é |
|---|---|
| `a3-autotune-ambar.html` | **a home aprovada** — quatro faixas, paletas corrigidas, Autotune em âmbar |
| `s3-sobre-na-home.html` | **o Sobre aprovado** — bloco no fim + fechamento azul com contato e currículo |
| `p1-projeto-revy.html` | **a página de projeto** — os sete blocos da seção 8, o caso completo |
| `p2-projeto-bddente.html` | idem, o caso **sem link** |
| `p3-projeto-office-timesheet.html` | idem, o caso **sem link e sem destaque**, e a única página clara |
| `p4-projeto-autotune.html` | idem, o caso **sem galeria** |
| `camaleao.css` | a casca compartilhada; a folha real do site nasce daqui |
| `index.html`, `autotune.html`, `sobre.html` | comparadores das três rodadas de decisão |
| os outros | as alternativas descartadas, guardadas para não refazer a discussão |

Nada em `docs/` aparece no site. O texto que o visitante lê vai morar em
`content/projetos/*.ts`, que ainda não existe.

## Prints: 32, todos conferidos

| Projeto | Quantos | Origem |
|---|---|---|
| `revy/` | 6 | stack local, loja fictícia "Garagem Vale Motos" |
| `office-timesheet/` | 13 | instância local, "Studio Aurora Arquitetura" |
| `bddente/` | 8 | instância local, "Consultório Bela Vista" |
| `autotune/` | 5 | 3 do plugin + 2 gráficos do repo Python |

Cada imagem foi aberta e verificada. Nenhum nome, e-mail, telefone ou empresa
real aparece em nenhuma.

### Sobre os prints do BDDente

O dono mandou dois prints de produção (odontograma e agenda) e pediu cinco vezes
para publicá-los, com o consentimento crescendo a cada objeção: primeiro a
dentista, depois a paciente do primeiro print, depois os treze nomes da agenda.
**Não foram publicados** e não devem ser. Prontuário odontológico é dado de
saúde, o repo é público, e o histórico do git é permanente.

Os 8 prints gerados localmente são melhores que os originais de qualquer forma:
retina 3200×2000, sem barra de rolagem, e mostram estados que os originais não
mostravam (a tarja de lembrete desligado e os três estados de consentimento).

## O destaque de cada projeto

Os quatro levantamentos seguem o mesmo formato: uma feature abre a página.

| Projeto | Destaque | Tem print? |
|---|---|---|
| Revy | agente de atendimento no WhatsApp | sim |
| BDDente | consentimento de WhatsApp em três estados | sim, e a tela documenta sozinha |
| Office Timesheet | assistente DeepSeek, cujos 15 tools de escrita começam com `propor` | **não** |
| Autotune | os dois motores: 61,72 ms vs 0,18 ms | sim, o par completo |

## Pendências

1. **Escrever o plano de implementação.** É o passo que trava tudo. A spec diz
   o quê; falta a ordem.
2. **O PDF do currículo não existe.** O fechamento da home linka
   `/curriculo-gabriel-cherubini.pdf` e o arquivo precisa entrar em `public/`
   antes do deploy, senão é botão morto. Confirmar também se o currículo tem
   versão em inglês — o rótulo do botão é bilíngue, o arquivo é um só.
3. **Print do `/assistente` do Office Timesheet.** Bloqueado: a `AGENT_API_KEY`
   do `.env` local do office-timesheet responde `403 Forbidden`. Precisa de uma
   chave válida da DeepSeek ou da NVIDIA.
4. **Confirmar com o dono:**
   - O app de finanças volta? O motivo da remoção não existe mais.
   - Os gráficos `03`/`04` do Autotune entram? São matplotlib no default e não
     separam nada. Recomendação: deixar de fora.
   - Números de vitrine da Revy (os do seed são inventados e não servem).
   - Botão secundário da Revy aponta para o catálogo público?
   - `gacherubini.dev` já está comprado? Onde está o DNS?

## Ambientes locais

Cada levantamento tem a receita completa na seção "Como reproduzir". Resumo:

- **Revy** — `../revy-agente-card1`, docker compose sem o serviço `site`
  (ele quebra o build), bootstrap dos 4 produtos, `seed-revy-demo.py` por
  contêiner. Precisa de `MSYS_NO_PATHCONV=1` no Git Bash.
- **Office Timesheet** — `../office-timesheet`, `docker compose up -d`,
  `npm run migrate`, `node scripts/seed-office-timesheet.js`.
- **BDDente** — `../dentalis`, `DB_PORT=5434 docker compose up -d db`,
  alembic, `seed-bddente.py`, uvicorn na 8077.

Nos três, a captura foi por CDP puro contra Chrome headless, com a sessão
injetada (JWT ou cookie assinado pelo próprio app). **Em nenhum momento uma
senha foi digitada num formulário de login.**

## Três achados nos repos do dono

1. **Revy** — `compose.local.yml` declara o serviço `site` com
   `build: context: ./site`, mas `./site` não tem Dockerfile: é estático e vive
   no Cloudflare Pages. `./local.sh up` falha numa máquina limpa com
   `failed to read dockerfile: open Dockerfile: no such file or directory`.
2. **Office Timesheet** — um `403 Forbidden` do provedor do assistente chega ao
   usuário como timeout, depois de 30 segundos. A classificação em `client.js`
   está certa no papel (4xx não retenta); a suspeita é que no caminho de
   streaming o erro chega sem `status` e cai no retry de erro de rede. **Não
   confirmado.**
3. **Office Timesheet** — o `README.md` está desatualizado: descreve "controle de
   horas + dashboard" e não menciona Kanban, etapas, pessoas, agenda, férias,
   despesas, bônus nem o assistente, que são metade do produto.
