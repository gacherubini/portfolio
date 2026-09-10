# Portfólio v3 — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar cara própria ao site sem derrubar o Camaleão — a fita vira a abertura, o azul da casa ganha superfície, a escala tipográfica passa a existir, doze ícones entram onde nomeiam alguma coisa, e as marcas da Ambush e da PUCRS entram na experiência.

**Architecture:** Nenhum componente client novo. A fita já é server component com o `d` gerado na build; a v3 só muda os parâmetros das séries e o enquadramento. Os ícones são SVG inline em server components. As duas marcas viram PNG de alfa tratado no build, pintadas por `mask-image` + `currentColor` — sem `next/image`, que para duas imagens de 2,5KB é maquinário demais.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 (só o reset) · Vitest + Testing Library · sharp 0.34.5 (já no projeto, usado por `scripts/otimizar-prints.mjs`).

**Spec:** `docs/superpowers/specs/2026-09-09-portfolio-v3-design.md`
Specs antecessoras, ainda em vigor: `2026-09-04-portfolio-design.md`, `2026-09-05-portfolio-v2-design.md`
Protótipo validado com o dono: `app/[lang]/v3/` (descartável — ver Task 8)

## Global Constraints

- **`npm test` são 234 testes em 22 arquivos e todos passam hoje. Nenhum pode
  quebrar.** `npm run build` roda `npm run prints && vitest run && next build`:
  teste vermelho derruba a build, e isso é o desenho.
- **`test/folha.test.ts` varre `opacity:` em `app/globals.css` e exige que todo
  valor esteja em `OPACIDADES_DE_TEXTO` = `[0.72, 0.85, 0.88, 0.9, 0.92]`.** As
  opacidades novas da fita são atributo `strokeOpacity` do SVG, em JSX, e por
  isso passam longe dessa regra. **Se alguma migrar para a folha, a build cai.**
- **Nada pintado com `var(--calmo)` pode receber `opacity` < 1.**
- **`CICLO` (1440) e `VOLTAS` (4) de `lib/fita.ts` não mudam.** Uma volta da
  pista tem de ser exatamente um ciclo do desenho — é isso que faz o laço
  fechar sem emenda contra o `translateX(-100%)`. Mexer neles sem refazer a
  conta do `svg { width: 400% }` põe emenda visível.
- **Todo texto novo nasce em PT e EN, lado a lado.** `test/traducao.test.ts`
  varre o conteúdo e falha se um `en` faltar.
- **Toda animação desligada por `prefers-reduced-motion: reduce`**, e todo
  efeito de cursor também por `@media (hover: none)`.
- **Nada nasce escondido no HTML.** Sem JavaScript o site aparece inteiro.
- **As marcas da Ambush e da PUCRS são de terceiros.** Entram monocromáticas
  para conviver na mesma coluna, e não recebem nenhum outro tratamento —
  distorção, corte criativo, cor inventada, nada.
- Idioma do código: identificadores e comentários em **português**.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade | Task |
|---|---|---|
| `mockups/v3-e-terminal.html` | a E guardada, HTML autocontido | 1 |
| `assets-marcas/` | os JPEG de origem, fora de `~/Downloads` | 1 |
| `app/globals.css` | escala, azul da casa, abertura, ícones, marcas | 2, 3, 4, 5, 6 |
| `lib/fita.ts` | séries densas | 3 |
| `components/Fita.tsx` | opacidades e espessuras novas | 3 |
| `app/[lang]/page.tsx` | a abertura passa a envolver a fita | 3 |
| `components/Icone.tsx` | as doze formas | 5 |
| `components/Sobre.tsx` | ícones na ficha, perfis | 5 |
| `components/Experiencia.tsx` | ícones nos blocos, marca na coluna da data | 5, 6 |
| `content/experiencia.ts` | `marca?` no tipo `Cargo` | 6 |
| `scripts/tratar-marcas.mjs` | JPEG → PNG de alfa | 6 |
| `public/marcas/*.png` | as duas marcas tratadas | 6 |
| `test/folha.test.ts` | conserta o teste vazio do 820px | 7 |
| `app/[lang]/v3/`, `app/[lang]/v3/icones.tsx` | **apagados** | 8 |

---

### Task 1: Guardar o que não pode se perder

Nada de desenho acontece aqui. Esta task existe porque duas coisas do protótipo
moram em lugar frágil, e as duas somem se a ordem for outra.

- [ ] Copiar o painel `v3-e` para `mockups/v3-e-terminal.html`, como **HTML
      autocontido**: CSS embutido no `<style>`, os `d` das cinco séries
      colados como literais, os SVG dos ícones inline, e a Plex Mono vinda do
      Google Fonts por `<link>`.
- [ ] Conferir que o arquivo abre sozinho, com `python -m http.server 4321` na
      raiz, sem depender de nada de `lib/`, `content/` ou `next/font`.
- [ ] Criar `assets-marcas/` e copiar para lá `~/Downloads/images.jpeg`
      (PUCRS, 399×300) e `~/Downloads/ambush_logo.jpeg` (Ambush, 200×200),
      renomeando para `pucrs-origem.jpeg` e `ambush-origem.jpeg`.
- [ ] Acrescentar `assets-marcas/LEIA-ME.md` dizendo de onde vieram, em que
      data, e que são **de baixa resolução** — se o dono conseguir os SVG
      oficiais, é para trocar e refazer a Task 6.

**Por que HTML e não a rota Next:** a rota depende de `lib/fita.ts`, de
`content/` e de um `next/font`. Qualquer uma das três mudando em seis meses
quebra o protótipo em silêncio, e ninguém descobre até querer reabrir a
discussão. HTML com CSS embutido abre daqui a dois anos.

**Por que tirar os JPEG de `~/Downloads`:** é pasta de passagem. A Task 6 gera
os PNG a partir deles, e um `npm run marcas` que falha porque o dono limpou a
pasta de downloads é uma bomba-relógio boba.

**Verificar:** `mockups/v3-e-terminal.html` abre no navegador com a fita
correndo, o cursor piscando e os treze ícones no lugar; `assets-marcas/` tem os
dois JPEG e o LEIA-ME.

---

### Task 2: A escala tipográfica

A mudança de maior alcance do plano, e a que mais quebra coisa em silêncio. Vai
primeiro para que todas as outras já nasçam na escala certa.

- [ ] Declarar os sete degraus em `:root`, em `app/globals.css`:
      `--t1: 13px` · `--t2: 16px` · `--t3: 20px` · `--t4: 25px` · `--t5: 32px`
      · `--t6: 40px` · `--t7: 50px`.
- [ ] Varrer os 29 `font-size` da folha e mapear cada um para o degrau mais
      próximo. Os fora-de-escala conhecidos: 11,5 · 12 · 12,5 · 13,5 · 14 ·
      14,5 · 15 · 16,5 · 17 · 18 · 19 · 21 · 22 · 23 · 25 · 26 · 27 · 28 · 30 ·
      31 · 32 · 33 · 36 · 38 · 40 · 46 · 52.
- [ ] O corpo do `body` sobe de 15px para 16px.
- [ ] `font-variant-numeric: tabular-nums` em `.num b`, `.regua .num b`,
      `.lat`, `.quando` e nas `dd` da ficha do Sobre.
- [ ] Conferir a olho as **páginas de projeto**, não só a home: `.abertura-projeto h1`
      (52px), `.chamada` (22px) e `.regua .num b` (40px) todos mudam.

**Cuidado com o mobile:** os `font-size` dentro de `@media (max-width: 900px)`
e `(max-width: 560px)` também estão na conta dos 29. Reduzir a escala ali é
outra decisão — os degraus são os mesmos, mas qual degrau cada elemento pega no
telefone tem de ser olhado separado.

**Verificar:** `npm test` verde; a home e as quatro páginas de projeto abertas
em 1440px e em 390px, sem nada estourando a coluna.

---

### Task 3: A fita vira a abertura

- [ ] Em `lib/fita.ts`, trocar os cinco perfis de `LAMINAS` pelos densos:

      | lâmina | passo | inércia | ruído | salto | puxão |
      |---|---|---|---|---|---|
      | l5 | 26 | 0,80 | 8 | 12 | 0,040 |
      | l4 | 16 | 0,68 | 11 | 17 | 0,052 |
      | l3 | 20 | 0,72 | 10 | 15 | 0,046 |
      | l2 | 12 | 0,60 | 13 | 21 | 0,062 |
      | l1 | 14 | 0,64 | 12 | 19 | 0,058 |

      As sementes não mudam. `CICLO` e `VOLTAS` **não mudam** — ver Global
      Constraints.
- [ ] Subir opacidades e espessuras: `0,20 · 0,28 · 0,36 · 0,46 · 0,60` e
      `1 · 1 · 1,1 · 1,2 · 1,4`, na ordem l5→l1.
- [ ] `.fita-fundo` deixa de ser `height: 105vh` ancorada no documento e passa
      a preencher a abertura: a `.abertura-home` vira `position: relative;
      overflow: hidden` e recebe a fita como filha em `inset: 0`.
- [ ] Trocar a máscara pela escada:
      `linear-gradient(to top, #000 14%, rgba(0,0,0,.55) 46%, rgba(0,0,0,.3) 74%, transparent 100%)`,
      com o par `-webkit-`.
- [ ] `.abertura-home h1`: `max-width` de `15ch` para `22ch`, tamanho para
      `--t7`.
- [ ] O parágrafo de apoio vai para `--t3`.
- [ ] Conferir que `.brilho` continua **fora** da `.fita-fundo` e continua
      `position: fixed` — ele vale para a página inteira, e dentro da fita
      herdaria a máscara e morreria na primeira dobra.

**Verificar:** `test/folha.test.ts` tem dois testes presos à fita — *"a fita
para sob movimento reduzido, mas continua desenhada"* e *"a fita mora atrás do
conteúdo, e o conteúdo declara isso"*. Os dois têm de continuar verdes. A olho:
o laço tem de fechar sem emenda visível — deixar a página aberta um minuto e
olhar o ponto de repetição.

---

### Task 4: O azul da casa

- [ ] `.secao > h2::after`: de `--regua` 1px para `--dev` 2px.
- [ ] `.rail`: `border-top` de `--tinta` para `--dev`.
- [ ] Rever quais `border-top: 1px solid var(--regua)` de `.secao` caem — a
      spec aponta o excesso de fio mas deixa a conta em aberto (seção 10.3).
      **Montar as duas versões e comparar antes de escolher.**
- [ ] Conferir que nenhum hex novo entrou na folha.

**O azul passa em AA sem ajuste: 6,28:1 contra `--casca`.** Nenhum token novo
de cor, e nenhuma regra nova em `lib/contraste.ts`.

**Verificar:** `npm test` verde, incluindo `test/contraste.test.ts`.

---

### Task 5: Os ícones

- [ ] Criar `components/Icone.tsx` a partir de `app/[lang]/v3/icones.tsx`, sem
      mudar as formas: doze desenhos, traço 1,6, cantos redondos,
      `currentColor`, `aria-hidden="true"` e `focusable="false"` em todos.
- [ ] A pilha entra em `app/[lang]/page.tsx`, logo abaixo do parágrafo de
      apoio: servidor · banco · chaves · docker · nuvem. Rótulos em PT e EN.
- [ ] `components/Sobre.tsx`: um ícone por linha da ficha — pino (Onde),
      servidor (Trabalho), chaves (Stack) —, e os perfis (github, linkedin,
      email) no pé do `.rail`.
- [ ] `components/Experiencia.tsx`: um ícone por bloco, na ordem dos blocos.
      **O `::before` de `.blocos dt` sai onde entra ícone**, por
      `:has(.icone)` — dois marcadores na mesma linha seria um a mais.
- [ ] Sem moldura e sem cartão em lugar nenhum: ícone, rótulo e ar.

**A armadilha de especificidade, que no protótipo mordeu três vezes:** a pilha
é um `<p>` dentro da abertura, e `.abertura p` é `(0,2,0)`. Presa numa classe
própria, `(0,1,0)`, ela herda `--calmo` e fica espremida no `max-width` do
parágrafo de apoio. **Toda regra nova que pinte ou meça um `<p>` dentro de uma
seção nasce com o seletor da seção na frente.**

**A regra que decide se um ícone entra:** ele tem de nomear alguma coisa que já
está escrita no conteúdo. Nenhum entra por ser bonito.

**Verificar:** `npm test` verde; `test/acessibilidade.test.tsx` não pode achar
nenhum SVG sem `aria-hidden`.

---

### Task 6: As duas marcas

Origem, medida no protótipo com sharp — estes números estão conferidos, não
estimados:

| | PUCRS | Ambush |
|---|---|---|
| Origem | `assets-marcas/pucrs-origem.jpeg`, 399×300 | `assets-marcas/ambush-origem.jpeg`, 200×200 |
| Recorte | `left:141 top:100 width:240 height:61` | `left:24 top:74 width:150 height:33` |
| O que é o recorte | só o wordmark — o brasão fica em `x 19–113` e sai | só o wordmark — a assinatura fica em `y 116–125` e sai |
| Fundo → traço | `245 → 200` | `60 → 235` |
| Saída | 157×40 | 182×40 |

- [ ] Escrever `scripts/tratar-marcas.mjs`: recorta, converte para cinza,
      aplica o nivelamento linear `(v − fundo) / (traço − fundo)` com corte em
      0 e 255, redimensiona para 40px de altura em `lanczos3`, e grava **só o
      canal alfa** como PNG em `public/marcas/`.
- [ ] Acrescentar `"marcas": "node scripts/tratar-marcas.mjs"` ao `package.json`
      e encadear em `build`, junto de `prints`.
- [ ] A marca é pintada por `mask-image` + `background-color: currentColor`,
      não por `<img>`. Assim ela herda a cor do texto em volta e nunca fica
      presa num hex — a folha já usa `mask-image` em três lugares (a fita, a
      `.fita-fundo` e o `.brilho`), então a técnica não é nova aqui.
- [ ] `content/tipos.ts` / `content/experiencia.ts`: `Cargo` ganha
      `marca?: { arquivo: string; largura: number; altura: number; alt: string }`.
      O `alt` é o nome da instituição e **não** muda de idioma.
- [ ] `components/Experiencia.tsx`: a marca entra acima da data, na coluna de
      138px, alinhada pela base.
- [ ] **Casar a altura ÓTICA, não a da caixa.** "PUCRS" é caixa-alta e ocupa a
      altura inteira do recorte; "ambush" é minúsculo e gasta parte da caixa
      com as ascendentes do `b` e do `h`. Nos mesmos 20px a PUCRS parece maior.
      Ponto de partida: PUCRS a 17px, ambush a 20px, e ajustar a olho.

**Nivelamento explícito, e não uma inversão crua:** os dois JPEG têm fundo
sujo. No Ambush, o `#2E2E2E` do fundo vira alfa 18% e desenha um retângulo
cinza em volta do wordmark. Na PUCRS, "PUC" é azul escuro (cinza médio 110) e
"RS" é azul claro (187) — numa inversão crua o "RS" sai semitransparente e o
monocromático lê como defeito de renderização, não como as duas cores do
original. O corte em 200 achata os dois para a mesma tinta.

**Verificar:** os dois PNG abertos por cima de `--casca` e por cima de branco,
sem halo e sem retângulo de fundo; a coluna da experiência com as duas marcas
lado a lado, em 1440px e em 390px.

---

### Task 7: A rede

- [ ] **Consertar `test/folha.test.ts:109`.** Ele procura o literal
      `'@media (max-width: 820px) {\n  .faixa .grade'`; a folha usa `900px`
      desde a v2. Os dois `indexOf` devolvem `-1`, `folha.slice(-1,-1)` é
      `''`, e o `expect('').not.toMatch(...)` passa sem verificar nada.
      Trocar o literal para `900px` e **confirmar que o teste ainda passa** —
      se ficar vermelho, ele achou uma regressão real que estava escondida.
- [ ] Rodar `verificarCasca()` e `verificarTema()` sobre tudo que mudou de cor.
- [ ] Passar a home inteira no teclado: foco visível em todo link novo, incluindo
      os três perfis da Task 5.
- [ ] `prefers-reduced-motion: reduce` — conferir que a fita continua desenhada
      e parada, e que nada novo se move.
- [ ] `npm run build` inteiro, do zero.

---

### Task 8: Apagar o protótipo

**Só depois da Task 1 ter guardado a E.**

- [ ] Apagar `app/[lang]/v3/` inteiro — `page.tsx`, `v3.css`, `icones.tsx`.
- [ ] Reverter o `export` que a `serie` de `lib/fita.ts` ganhou para o
      protótipo, **se nada mais estiver usando**.
- [ ] Atualizar `ESTADO.md`: a direção visual passa a ser "a fita é a
      abertura, o azul é a cor da casa"; a queixa *"o site fica sem cara
      própria"*, aberta desde 04/09, sai como resolvida; a E entra como
      adiada, com ponteiro para `mockups/v3-e-terminal.html` e para a seção 8
      da spec.

---

## Depende do dono, não do código

1. **Os SVG oficiais da Ambush e da PUCRS.** A Task 6 funciona sem eles — os
   JPEG de baixa resolução dão conta a 20px —, mas um SVG oficial é melhor em
   qualquer tela e dispensa `scripts/tratar-marcas.mjs` inteiro.
2. **A ficha do cartão em duas linhas** (spec, seção 6): encolher a pílula,
   mover o selo para baixo do nome, ou aceitar as duas linhas.
3. **Quantos fios de 1px caem** (Task 4). Só se avalia vendo.
