# Estado do trabalho — gacherubini.dev

Atualizado: 2026-09-05. Este arquivo existe para sobreviver a um `/clear`.
Se você é um agente retomando o trabalho, leia isto primeiro, depois a spec e os
levantamentos.

Repositório: **https://github.com/gacherubini/portfolio** — e ele é **público**.

## O que é

Portfólio pessoal de **Gabriel Cherubini**, domínio **gacherubini.dev**.
Next.js 15 + TypeScript + Tailwind 4, deploy na Vercel. Bilíngue PT/EN.

**As Tasks 1–17 do plano original estão na `main`**, e a branch `v2` acrescenta
as 11 tasks do plano de segunda rodada
(`docs/superpowers/plans/2026-09-05-portfolio-v2.md`), agora todas concluídas.
A v2 não troca a base: acrescenta números reais de vitrine, o selo de IA,
reescreve o Sobre e o bloco do Office Timesheet, e troca a galeria por pranchas
com abertura em prancha de 1320px, na própria página. O resumo, tarefa a tarefa:

- **Contrato** (`content/tipos.ts`): ganhou `numerosHome?` (régua da faixa da
  home, quando difere da régua da página) e `selo?` (pílula de IA ao lado de
  "no ar"/"fechado"); perdeu `destaque.lista`.
- **Revy**: os três números de vitrine confirmados pelo dono em 05/09/2026 — 120
  pessoas atendidas por dia no WhatsApp, ~80% das conversas resolvidas sozinho
  pelo agente, 75 motos no estoque — e o selo `IA · agente no WhatsApp`. **Fecha
  a pendência 7** (abaixo).
- **Office Timesheet**: o bloco do assistente parou de listar as 17 funções e
  passou a descrever *function calling*; o rótulo que antes contava "17 de
  leitura e 15 de escrita" separadas virou um só número, `34` — "funções que o
  assistente pode chamar"; ganhou o selo
  `IA · assistente embutido`; e `numerosHome: []`, **vazio de propósito** — os
  três números de operação (horas apontadas, projetos acompanhados, pessoas
  apontando todo dia) são do escritório real e só o dono os tem. Enquanto
  vazio, a régua some da faixa da home. **É a pendência nova**, ver abaixo.
- **Sobre**: saiu o parágrafo de idade e faculdade; "desde 2023" virou "mais de
  5 anos"; entrou um parágrafo sobre IA (agentes que chamam funções do próprio
  produto, skills, loops de agente) e uma linha na ficha, `IA` →
  `agent loops · skills · function calling`; travessão saiu dos textos em
  primeira pessoa.
- **Pranchas**: todo print do site virou prancha — imagem em tamanho de
  leitura, legenda na margem em corpo de leitura. A galeria deixou de ser grade
  de selos de 357px e virou sequência de pranchas de 880px com o lado
  alternando.
- **Abertura**: clicar numa prancha a leva a 1320px, centrada, por FLIP — só
  quando há resolução a revelar (`arquivo >= exibido × 1,5`); sem isso a
  prancha nem é link. Em tela estreita a abertura é desligada.
- **Movimento** (`components/Movimento.tsx`): brilho seguindo o cursor, botões
  magnéticos, prancha que inclina, entrada na rolagem — o primeiro `'use
  client'` do site, montado uma vez em `app/[lang]/layout.tsx`. O layout é
  compartilhado pela home e pelas páginas de projeto e a navegação entre elas
  é do cliente, então o efeito é escopado a `usePathname()`: ele se remonta a
  cada rota, sobre o DOM da página nova. Ver a revisão ampla, abaixo.
- **Entrada**: um véu cobre a home enquanto a marca se revela e uma régua
  atravessa as quatro cores dos quatro sistemas. CSS puro mais um script inline
  curto; toca uma vez por sessão.
- **Fechamento (Task 11)**: o portão de acessibilidade da prancha — nenhuma tem
  `aria-hidden`, todo print continua com `alt` — e a atualização deste arquivo.
- **Conserto da revisão ampla (depois das 11 tasks)**: o efeito do movimento
  escopado à rota, o alinhamento da pílula de situação nas faixas sem selo, a
  prancha de volta a `<figure>`/`<figcaption>`, e três reparos de uma linha.
  Detalhado logo abaixo.

Último estado completo:

| Item | Estado |
|---|---|
| Commit HEAD | `a69edc6` — fix: o que a revisão ampla da branch encontrou; este arquivo entra no commit de docs logo em seguida |
| Tasks concluídas | 1–17 (`main`) + 1–11 da v2 (`v2`), mais a onda de conserto da revisão ampla da v2 |
| Testes | 214/214 em 21 arquivos |
| Build | aprovada; único aviso é o do currículo ausente, que é esperado; nenhum aviso de tradução |
| Working tree | limpa |
| Próxima task | nenhuma — a v2 está completa; falta o merge em `main` e a Task 18 (deploy), que continua do dono |

Cada task foi implementada por um subagente e revisada por outro antes de
fechar. No fim, uma revisão ampla da branch inteira (26 commits) rodou em Opus e
encontrou três defeitos que as revisões por task não tinham como ver; todos
foram corrigidos e verificados em build de produção servida. O relato completo,
com todas as decisões tomadas, está em
`.superpowers/sdd/2026-09-04-portfolio-implementacao/progress.md`.

### O que a revisão final encontrou, e que vale lembrar

1. **O 404 estava em branco para todo mundo.** `app/[lang]/not-found.tsx` nunca
   entrava no manifesto de rotas da produção. Corrigido com um `app/not-found.tsx`
   na raiz, bilíngue. Resíduo aberto: ver a pendência 1.
2. **O texto do BDDente nomeava a dentista real.** O nome saiu de `content/`,
   `docs/levantamentos/`, `mockups/` e do plano. **O histórico do git ainda o
   carrega** — ver a pendência 2.
3. **O botão primário das faixas da Revy e do Autotune tinha anel de foco
   invisível** (`currentColor` dentro de `.cta` é `--ctaTexto`, que é igual ao
   fundo da faixa: 1,00:1). Corrigido com `.faixa a:focus-visible` em
   `var(--destaque)`, com regressão em `test/folha.test.ts`.
4. **Os números saíam em formato pt-BR no inglês.** `44.812` lê como quarenta e
   quatro vírgula oito para um leitor de inglês. `numeros[].valor` e
   `Print.valor` viraram `Texto`; `/en` agora serve `44,812` e `61.72 ms`, e o
   português segue igual.

### O que a revisão ampla da v2 encontrou

Mesmo desenho: cada uma das 11 tasks foi implementada e revisada em separado, e
depois uma revisão ampla olhou a costura entre elas. Achou um defeito Critical e
três Important; todos foram consertados na onda única de conserto, com testes.

1. **A segunda página ficava em branco.** `components/Movimento.tsx` montava o
   efeito com `[]`, e `app/[lang]/layout.tsx` é compartilhado pela home e pelas
   páginas de projeto — a navegação entre elas é `next/link`, então o layout
   nunca era desmontado e o efeito nunca rodava de novo. Depois do primeiro
   clique, `html[data-anima]` continuava posto sobre `.revela` que ninguém
   observava (o `<h1>`, a ficha, a régua, a prosa, a galeria inteira em
   `opacity: 0`), e a lista de pranchas era o retrato da primeira página —
   clicar num print saía do site para o PNG cru. O efeito agora depende de
   `usePathname()`. Coberto por `test/componentes/movimento.test.tsx`.
2. **A pílula "no ar"/"fechado" perdia o alinhamento à direita** nas duas faixas
   sem selo (BDDente e Autotune): `.ficha-faixa .situacao { margin-left: 0 }`,
   (0,2,0), vencia a `margin: 0 0 0 auto` de (0,1,0) mesmo sem selo nenhum para
   fazer o empurrão. Virou `.ficha-faixa .selo ~ .situacao`.
3. **A legenda da prancha tinha perdido a ligação com a imagem.** A v1
   desenhava `<figure>`/`<figcaption>`; a reescrita em pranchas trocou por dois
   `<div>` irmãos, que não dão nada à tecnologia assistiva. O elemento voltou, e
   com ele saíram as ~14 linhas de regra de `figure` da v1 que estavam mortas na
   folha e voltariam a competir com as regras de prancha.
4. **Este arquivo e o `README.md` estavam velhos** — contagem de testes e HEAD
   defasados, e os dois chamavam a abertura da prancha de "abertura em tela
   cheia", que é justamente o desenho **construído, testado e rejeitado**
   (spec §2 e §8).

Mais três reparos de uma linha que entraram junto: `altKey` no desvio de
modificadores do clique (alt-clique é "baixar o link" no Chrome e no Firefox),
um `background` de fallback antes do `color-mix` do véu da entrada (sem ele a
declaração inteira é inválida e o véu vira uma camada transparente e clicável
por 1,48s), e dois testes que prometiam no nome mais do que afirmavam no corpo.

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
| `content/sobre.ts` | conteúdo PT e EN do Sobre |
| `content/projetos/*.ts` | conteúdo PT/EN de Revy, BDDente, Office Timesheet e Autotune |
| `app/`, `components/`, `lib/`, `test/` | implementação das Tasks 1–17 (`main`) e das Tasks 1–11 da v2 (`v2`), suíte de 214 testes em 21 arquivos |
| `docs/superpowers/plans/2026-09-04-portfolio-implementacao.md` | plano executável de 18 tasks da v1 |
| `docs/superpowers/plans/2026-09-05-portfolio-v2.md` | plano executável de 11 tasks da v2, **esta task fecha ele** |
| `docs/superpowers/specs/2026-09-05-portfolio-v2-design.md` | a spec de design da v2 |
| `scripts/seed-*.{py,js}` | os três seeds de dados fictícios |
| `public/prints/<slug>/` | 32 prints |
| `mockups/` | os comps das decisões de 04/09 e o protótipo da v2 — **ver abaixo** |

### Os mockups aprovados

`mockups/` é HTML descartável, não é código do site. Existe porque a primeira
rodada de seis mockups se perdeu e a decisão teve que ser refeita do zero.
Rode `python -m http.server 4321` na raiz e abra `/mockups/`.

| Arquivo | O que é |
|---|---|
| `a3-autotune-ambar.html` | **a home aprovada da v1** — quatro faixas, paletas corrigidas, Autotune em âmbar |
| `s3-sobre-na-home.html` | **o Sobre aprovado da v1** — bloco no fim + fechamento azul com contato e currículo |
| `p1-projeto-revy.html` | **a página de projeto da v1** — os sete blocos da seção 8, o caso completo |
| `p2-projeto-bddente.html` | idem, o caso **sem link** |
| `p3-projeto-office-timesheet.html` | idem, o caso **sem link e sem destaque**, e a única página clara |
| `p4-projeto-autotune.html` | idem, o caso **sem galeria** |
| `camaleao.css` | a casca compartilhada da v1; a folha real do site nasce daqui |
| `v2-home.html`, `v2-projeto-office.html` | **o protótipo da v2** — pranchas, abertura por FLIP, tela de entrada, `numerosHome` e selo, montado sobre o `app/globals.css` real |
| `v2-proto.css`, `v2-proto.js` | camada só do protótipo da v2, por cima da folha real; não é código do site |
| `index.html`, `autotune.html`, `sobre.html` | comparadores das três rodadas de decisão |
| os outros | as alternativas descartadas, guardadas para não refazer a discussão |

Nada em `docs/` aparece no site. O texto que o visitante lê mora em
`content/projetos/*.ts`; os relatórios e o ledger de execução ficam em
`.superpowers/sdd/`, fora do índice do Git.

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
| Office Timesheet | assistente sobre DeepSeek, descrito por *function calling* — não é mais "a lista dos 17 tools" | **não** |
| Autotune | os dois motores: 61,72 ms vs 0,18 ms | sim, o par completo |

## Pendências

Em ordem de quem decide e de quanto custa.

### 1. Decisões que só o dono pode tomar

1. **O 404 sem JavaScript.** Hoje `/pt/nao-existe`, `/en/nao-existe` e `/es`
   devolvem 404 com o `<title>` certo mas **corpo vazio no HTML cru**. Num
   navegador real com JS a página bilíngue renderiza inteira — o que quebra é
   leitor sem JS, crawler que não executa JS e bot de preview de link
   (Slack, Twitter). `/a/b/c` já sai completo. Fechar o resíduo exige criar um
   `app/layout.tsx` na raiz, e o preço é `/en` passar a servir `lang="pt-BR"`.
   **A troca é: o `lang` correto de `/en`, que vale para o site inteiro, contra
   o corpo do 404 no HTML cru, que vale para uma página que nem deveria ser
   indexada.** Deixado sem decidir de propósito.
2. **O nome da dentista no histórico do git.** O nome saiu de todos os arquivos
   rastreados, mas continua nos commits antigos, e o repo é público. Tirar de
   verdade exige reescrever o histórico e um force-push. Não foi feito — é
   decisão do dono, e tem custo (quebra clones e forks existentes).
3. **O domínio.** `sitemap.ts`, `robots.ts` e o `metadataBase` do layout apontam
   para `https://gacherubini.dev`, que ainda não foi comprado. Se o primeiro
   deploy sair numa URL `*.vercel.app`, toda página vai com `canonical` e
   `hreflang` apontando para um domínio que não resolve, e o `robots.txt`
   anuncia um sitemap que ninguém busca. **Comprar o domínio antes do primeiro
   deploy público resolve sem tocar em código.**
4. **O PDF do currículo.** Não existe. O fechamento esconde o botão e a build
   avisa; nunca vira link morto. Jogar o PDF em
   `public/curriculo-gabriel-cherubini.pdf` e conferir a versão em inglês.
5. **O app de finanças ("Gastos do mês") volta?** O motivo da remoção — a regra
   que proibia cor atribuída — não existe mais.
6. **Os gráficos `03`/`04` do Autotune entram?** São matplotlib no default e não
   separam nada. Recomendação de quem escreveu o plano: deixar de fora.
7. ~~**Números de vitrine da Revy.**~~ **Fechada na v2, em 05/09/2026.** O
   dono confirmou os três números — 120 pessoas atendidas por dia no WhatsApp,
   ~80% das conversas resolvidas sozinho pelo agente, 75 motos no estoque — e
   `content/projetos/revy.ts` os carrega em `numeros`. A régua aparece na home
   e na página.
8. **Botão secundário da Revy** aponta para o catálogo público?
9. **As quatro etapas de arquitetura em inglês** saíram como
   `Survey / Preliminary Study / Schematic Design / Executive Design`, sem mapear
   para as fases da AIA americana — mapear alegaria uma equivalência que não
   existe, e os prints mostram os nomes em português. Confirmar se está bom.
10. **Os três números de operação do Office Timesheet (nova na v2).** Horas
    apontadas no sistema, projetos acompanhados, e pessoas apontando hora todo
    dia. `content/projetos/office-timesheet.ts` já declara `numerosHome: []`
    de propósito — enquanto vazio, a régua da faixa da home some sozinha, que é
    o comportamento certo, e a página do projeto continua com os quatro
    números de tech lead que já existiam. Os valores são do escritório real do
    dono e ninguém mais os tem; os do seed são inventados e não servem.
    **Não inventar.**

### 2. Task 18 — o deploy, não executado

O brief está em `docs/superpowers/plans/…` §Tarefa 18. **Um detalhe dele está
errado:** ele assume que o trabalho vive numa branch `site` a ser mesclada na
`main`. Não existe branch `site` — tudo foi commitado direto na `main`, que está
26 commits à frente de `origin/main`. Então o Passo 2 vira, na prática:

```bash
git push origin main
```

e depois, na Vercel: **Add New → Project**, importar `gacherubini/portfolio`,
framework Next.js, nenhuma variável de ambiente. O `vercel.json` já fixa o
`buildCommand`, e `npm run build` é `vitest run && next build` — se o teste
falhar, a build falha, que é o desenho.

No log da build, conferir: o Vitest rodou antes do `next build`; apareceu o aviso
do currículo ausente; **não** apareceu aviso de tradução.

### 3. Bloqueado por falta de credencial

- **Print do `/assistente` do Office Timesheet.** A `AGENT_API_KEY` do `.env`
  local responde `403 Forbidden`. Precisa de uma chave válida da DeepSeek ou da
  NVIDIA. Enquanto isso, `destaque.prints: []` e o bloco é carregado pelo texto
  do *function calling* (v2) — o slot existe e o bloco funciona sem ele; não é
  um buraco.

### 4. Cosmético, se algum dia incomodar

- Os quatro arquivos de conteúdo foram traduzidos por quatro agentes em
  paralelo, e ficou deriva de **formatação**: `office-timesheet.ts` manteve
  `ficha` em uma linha (até 155 caracteres) enquanto os outros expandiram para
  multilinha; `bddente.ts` manteve `numeros` em uma linha. Não há prettier no
  repo e nada quebra.
- `app/globals.css` tem 14 media blocks em 4 breakpoints, sendo três
  `max-width: 820px` e cinco `max-width: 900px` separados — a costura visível de
  seis tasks acrescentando na mesma folha. **Cuidado ao consolidar:**
  `test/folha.test.ts` acha o reset móvel por
  `indexOf('@media (max-width: 820px) {\n  .faixa .grade')`, então juntar blocos
  quebra um teste verde.
- 14 dos 32 prints em `public/prints/` não são referenciados por nenhum conteúdo.
  Todos foram conferidos um a um, então é peso, não risco.
- Todos os links externos abrem na mesma aba. Um recrutador que clica em "Entrar
  no sistema" sai do portfólio.

### 5. Precisa do olho humano num navegador de verdade

Nenhum agente tem como fechar isto sozinho: a Task 11 verificou tudo por
teste, pela build e pelo protótipo estático, mas nunca havia um servidor
próprio de pé (`npm start` de outra pessoa ocupava a porta 3000) para olhar a
página servida de verdade.

1. **A animação da tela de entrada.** O véu, a revelação da marca e a régua
   de quatro cores (`components/Entrada.tsx` + a folha) passam nos testes e no
   protótipo (`mockups/v2-home.html`), mas ninguém viu o timing rodar num
   navegador real, com a rede e o CSS de produção.
2. **A suavidade da abertura de prancha.** O FLIP (`components/Movimento.tsx`)
   tem a lógica do 1,5×, o desligamento em tela estreita e o foco visível
   cobertos por teste — mas a sensação do movimento em si, se ele fica solto
   ou trava, só um navegador real mostra.
3. **A navegação interna, depois do conserto da revisão ampla.** O efeito do
   movimento agora se remonta a cada rota, e o teste prova que os `.revela` da
   página nova são revelados e que as pranchas dela são avaliadas. O que o
   teste não vê é a costura visual: clicar em "Ver o projeto", voltar para a
   home, trocar de idioma — e conferir que nada pisca escondido no meio do
   caminho. Vale um passeio de três cliques na página servida.

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
