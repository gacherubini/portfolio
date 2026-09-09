# gacherubini.dev — spec de design v3

Data: 2026-09-09
Estado: direção aprovada pelo dono em protótipo interativo; conteúdo dos logos
pendente de arquivo
Antecessoras: `2026-09-04-portfolio-design.md` e `2026-09-05-portfolio-v2-design.md`,
que continuam valendo. Esta spec só descreve o que **muda**.

Protótipo que sustenta as decisões: `app/[lang]/v3/` — rota descartável, cinco
painéis lado a lado com a fonte, o CSS e o conteúdo reais.

**A rota sai quando esta spec estiver implementada — mas não antes de a E ser
copiada para `mockups/`.** É lá que este repo guarda as alternativas
descartadas, justamente "para não refazer a discussão" (`ESTADO.md`), e a E não
é descartada: é adiada. Ver seção 8.

## 0. O que motivou

O dono pediu três coisas juntas: melhorar o desenho, pensar numa identidade
visual, e pôr as marcas da Ambush e da PUCRS na experiência.

A queixa que estava registrada em `ESTADO.md` desde 04/09 — *"o site fica sem
cara própria"* — nunca foi resolvida; a decisão de então foi manter a direção
Camaleão **mesmo assim**, com a crítica de pé. O pedido do dono é o argumento
novo que aquela decisão exigia para ser reaberta.

O que a revisão do site no navegador encontrou, em 1440px:

1. **A primeira dobra não trabalha.** O `h1` tem `max-width: 15ch` e ocupa 43%
   da coluna; o resto da tela é a fita a 13% de opacidade. Nada na primeira
   tela diz o que a pessoa faz.
2. **A fita é a melhor ideia do site e está sussurrando.** Caminhada aleatória
   como dado de mercado — específico do trabalho dele, e ninguém mais tem —
   apagada a ponto de ler como artefato de impressão. E passa por trás do
   *Sobre*, onde só atrapalha a leitura.
3. **A identidade já existia, escondida no loader.** O `@keyframes ent-cor`
   percorre as quatro cores dos quatro sistemas e some em 1,05s.
4. **A escala tipográfica não existe:** 29 tamanhos distintos em
   `app/globals.css`, de 11,5px a 52px, com 12,5/13/13,5/14/14,5/15 vivos ao
   mesmo tempo.
5. **Régua demais.** Fio de 1px em `.secao`, `.ficha-faixa`, `.rail`, `.posto`,
   `.prancha-nota` e `.tecnico`. Acrescentar estrutura aqui vira jornal; o
   caminho é subtrair.

Cinco direções foram montadas em código e comparadas pelo dono. **A escolhida
foi a B.** A E fica guardada — ver seção 8.

## 1. A direção: a fita vira a abertura

A fita sai de decoração de fundo e vira o desenho da primeira tela. A manchete
se assenta **dentro** dela, não acima de um vazio.

| | hoje | v3 |
|---|---|---|
| Âncora | `inset: auto 0 0`, 40vh no pé de um bloco de 105vh | `inset: 0` na abertura inteira |
| Lâminas | 5 | 5 |
| Opacidades | 0,13 · 0,18 · 0,24 · 0,30 · 0,40 | **0,20 · 0,28 · 0,36 · 0,46 · 0,60** |
| Espessuras | 1 · 1 · 1 · 1,1 · 1,3 | **1 · 1 · 1,1 · 1,2 · 1,4** |
| `h1` | 46px, `max-width: 15ch` | **50px, `max-width: 22ch`** |

### As séries ficam mais densas

`lib/fita.ts` gera hoje com `passo` entre 24 e 60. Numa abertura de ~380px de
altura isso lê como onda decorativa, não como dado de mercado. O passo encurta
e o ruído sobe — mais detalhe por tela é o que faz a linha parecer preço:

| lâmina | passo hoje | passo v3 | ruído | salto | inércia | puxão |
|---|---|---|---|---|---|---|
| l5 | 48 | **26** | 8 | 12 | 0,80 | 0,040 |
| l4 | 30 | **16** | 11 | 17 | 0,68 | 0,052 |
| l3 | 60 | **20** | 10 | 15 | 0,72 | 0,046 |
| l2 | 36 | **12** | 13 | 21 | 0,60 | 0,062 |
| l1 | 24 | **14** | 12 | 19 | 0,64 | 0,058 |

**`CICLO` (1440) e `VOLTAS` (4) não mudam, e não podem.** É deles que depende o
laço fechar sem emenda contra o `translateX(-100%)` da animação: uma volta da
pista tem de ser exatamente um ciclo do desenho. Mexer em qualquer um dos dois
sem refazer a conta do `svg { width: 400% }` põe emenda visível no laço.

### A máscara é escada, não rampa

```css
mask-image: linear-gradient(to top,
  #000 14%, rgba(0,0,0,.55) 46%, rgba(0,0,0,.3) 74%, transparent 100%);
```

Cheia embaixo; meia força na faixa do parágrafo de apoio, que é o primeiro
texto a sofrer com linha cruzando; dissolvendo no alto, onde a fita encostaria
no topo grudado. Rampa linear ou deixa a fita fraca demais no pé, ou deixa o
parágrafo ilegível — a escada resolve os dois com um gradiente só.

## 2. O azul da casa

`#2A4FD7` sai de "a cor do `.dev`" e vira a cor da casca. **Nenhum hex novo
entra no site**: a identidade vem de distribuição, não de adição.

| Onde | Hoje | v3 |
|---|---|---|
| `.marca-dev` | `--dev` | igual |
| `nav a[aria-current]` borda | `--dev` | igual |
| Fio de `.secao > h2::after` | `--regua`, 1px | **`--dev`, 2px** |
| Régua da ficha (`.rail`) | `--tinta`, 2px | **`--dev`, 2px** |
| Marcador de `.blocos dt::before` | `--dev` | vira ícone — ver seção 4 |
| Fita | `--dev` a 13–40% | `--dev` a 20–60% |

**O azul passa em AA sem ajuste: 6,28:1 contra `--casca` (`#FAFAF7`).** Isso é
o que dispensa um segundo token de cor, e é a diferença de manutenção que
decidiu contra a E — ver seção 8.

## 3. A escala tipográfica

Vinte e nove tamanhos viram sete, em razão ~1,25. É a mudança de maior alcance
desta spec: mexe na home, nas páginas de projeto e em todos os blocos.

| token | px | papel |
|---|---|---|
| `--t1` | 13 | rótulo, data, ficha, chip |
| `--t2` | 16 | corpo |
| `--t3` | 20 | subtítulo, apoio da abertura |
| `--t4` | 25 | lede |
| `--t5` | 32 | nome de projeto |
| `--t6` | 40 | número de régua |
| `--t7` | 50 | manchete |

O corpo sobe de 15px para 16px. `font-variant-numeric: tabular-nums` entra em
tudo que é número: `.num b`, `.regua .num b`, `.lat`, `.quando`, e as `dd` da
ficha do Sobre — que carregam GMT−3 e a pilha.

## 4. Os ícones

Doze formas em SVG monolinha, desenhadas à mão em `app/[lang]/v3/icones.tsx`,
traço 1,6 e cantos redondos. **Sem biblioteca**: uma dependência inteira para
doze formas pesaria mais que o site todo de tipografia.

**`aria-hidden` em todas, sem exceção.** Nenhuma carrega informação que o texto
ao lado já não diga.

**A regra que decide se um ícone entra: ele tem de nomear alguma coisa que já
está escrita no conteúdo.** Nenhum entra por ser bonito.

| Onde | Ícones |
|---|---|
| Pilha, abaixo da abertura | servidor · banco · chaves · docker · nuvem |
| Ficha do Sobre | pino (Onde) · servidor (Trabalho) · chaves (Stack) |
| Blocos da experiência | banco · chaves · nuvem · git, na ordem dos blocos |
| Perfis | github · linkedin · email |

**Sem moldura, sem cartão.** Uma fileira de ícones em caixas iguais é o kit de
cartões que aparece em todo portfólio gerado. Aqui é ícone, rótulo e ar.

**O traço de `.blocos dt::before` sai onde entra ícone.** Dois marcadores na
mesma linha seria um a mais. Sai por `:has(.v3-icone)`, não por classe nova.

### A armadilha de especificidade, três vezes

A pilha de ícones é um `<p>` dentro da abertura, e `.abertura-home p` é
`(0,2,0)`. Presa numa classe própria, `(0,1,0)`, ela herda `--calmo` e fica
espremida no `max-width` do parágrafo de apoio. **Toda regra nova que pinte ou
meça um `<p>` dentro de uma seção precisa nascer com o seletor da seção na
frente.** No protótipo isso mordeu três vezes.

## 5. As duas marcas — Ambush e PUCRS

Entram na coluna de 138px da experiência, que hoje só tem a data e passa a ter
marca **e** data.

| | |
|---|---|
| Altura ótica | ~20px |
| Cor | `--tinta`, monocromático |
| Alinhamento | pela base da data |

**Monocromático não é preciosismo.** O brasão colorido da PUCRS ao lado do
wordmark branco-sobre-chumbo da Ambush, em cor cheia e a 20px, lê como faixa de
patrocinador. E a 20px o brasão vira lama: a PUCRS entra pelo wordmark.

**Destravado.** As origens que o dono mandou são JPEG de 399×300 (PUCRS) e
200×200 (Ambush) — baixas, mas suficientes, porque só o **wordmark** é usado e
ele sobra em pixel para 40px de altura. O recorte, o nivelamento e a saída
estão medidos e conferidos na Task 6 do plano.

| | PUCRS | Ambush |
|---|---|---|
| Recorte | `left:141 top:100 width:240 height:61` | `left:24 top:74 width:150 height:33` |
| O que sai fora | o brasão (`x 19–113`) | a assinatura (`y 116–125`) |
| Saída | 157×40 | 182×40 |

**A marca é pintada por `mask-image` + `currentColor`, não por `<img>`.** Só o
canal alfa vai para `public/marcas/`; a cor vem do texto em volta, e a marca
nunca fica presa num hex. A folha já usa `mask-image` em três lugares.

**Nivelar, e não inverter.** Os dois JPEG têm fundo sujo. No Ambush o `#2E2E2E`
do fundo viraria alfa de 18% e desenharia um retângulo cinza em volta do
wordmark. Na PUCRS o "PUC" é azul escuro (cinza médio 110) e o "RS" é azul
claro (187): numa inversão crua o "RS" sai semitransparente, e num
monocromático isso lê como defeito de renderização, não como as duas cores do
original.

**Casar a altura ótica, não a da caixa.** "PUCRS" é caixa-alta e ocupa o
recorte inteiro; "ambush" é minúsculo e gasta parte da caixa com as ascendentes
do `b` e do `h`. Nos mesmos 20px a PUCRS parece maior — começar em 17px e 20px
e ajustar a olho.

## 6. A ficha do cartão quebra em duas linhas

Nos cartões que declaram selo — Revy e Office Timesheet — a pílula de situação
cai para a segunda linha. `.ficha-faixa` mora dentro de `.col-texto`, que numa
grade `1fr 1.08fr` de uma coluna de 1000px tem ~385px; nome + para-quem + selo
+ situação não cabem, e `flex-wrap: wrap` faz o resto.

**Não é regressão:** a margem automática está correta e é testada
(`test/folha.test.ts:131`). É consequência da largura, e o conserto é decisão de
desenho — encolher a pílula, mover o selo para baixo do nome, ou aceitar as
duas linhas. **Em aberto, ver seção 10.**

## 7. O que os testes exigem

- **234 testes em 22 arquivos passam hoje. Nenhum pode quebrar.**
  `npm run build` roda `vitest run && next build`.
- **`test/folha.test.ts:8` varre `opacity:` em `app/globals.css` e exige que
  todo valor esteja em `OPACIDADES_DE_TEXTO`.** As opacidades novas da fita
  **não** passam por essa regra: elas são atributo `strokeOpacity` do SVG, em
  JSX, não `opacity:` em CSS. Se alguma delas migrar para a folha, o teste
  fecha a build — e com razão.
- **Nada pintado com `var(--calmo)` pode receber `opacity` < 1.**
- **`test/folha.test.ts:109` está passando contra string vazia.** Ele procura
  `'@media (max-width: 820px) {\n  .faixa .grade'`; a folha usa `900px` desde
  a v2. Os dois `indexOf` devolvem `-1`, `slice(-1,-1)` é `''`, e o
  `expect('').not.toMatch(...)` passa sem verificar nada. **Consertar o
  literal para `900px` faz parte desta v3** — senão a v3 mexe no
  empilhamento móvel da faixa com uma rede que não está armada.
- **Todo texto novo nasce em PT e EN.** `test/traducao.test.ts` varre o
  conteúdo e falha se um `en` faltar.
- **Toda animação desligada por `prefers-reduced-motion: reduce`.**
- Idioma do código: identificadores e comentários em **português**.

## 8. E — guardada, não descartada

A **E** é a identidade do manual de marca do dono aplicada inteira: `#FF5A00`,
IBM Plex Mono, o `>_` como marca, e a abertura virando janela de terminal com
os ícones em volta. Ela está montada e funcionando em `app/[lang]/v3/`, painel
`v3-e`.

**Onde ela fica guardada.** A primeira task da implementação copia o painel
`v3-e` para `mockups/v3-e-terminal.html` — HTML autocontido, no mesmo formato
dos comps de 04/09 e do protótipo da v2 —, e só então a rota `app/[lang]/v3/`
pode ser apagada. Guardar HTML e não a rota Next é de propósito: a rota depende
de `lib/fita.ts`, de `content/` e de um `next/font`, e qualquer uma dessas três
mudando em seis meses quebra o protótipo em silêncio. HTML com o CSS embutido
abre daqui a dois anos.

**Por que não agora, e o que ela custa quando voltar:**

| | B (escolhida) | E (guardada) |
|---|---|---|
| Tokens de cor | 1 — `#2A4FD7` a 6,28:1, passa em AA | **2** — `#FF5A00` a 2,99:1 só em decoração, `#C24300` a 4,90:1 em tudo que é letra |
| Fonte | Archivo, já baixada | **+ IBM Plex Mono**, 3 pesos |
| Componentes novos | nenhum | janela de terminal, com cursor animado |
| Contraste | resolvido sozinho | `lib/contraste.ts` derruba a build se o token errado encostar em texto |

**Os dois laranjas são a razão principal.** Ícone ao lado de texto conta como
texto, então o laranja do manual não pode pintar ícone nenhum; toda regra nova
passa a exigir a pergunta *"isto aqui é letra ou é enfeite?"*, e errar não
aparece na tela — aparece na build, meses depois.

**Se a E voltar, o que já está resolvido:** as doze formas de ícone
(`icones.tsx` é agnóstico de cor, usa `currentColor` e um `--cor-icone` por
painel), a calibragem da fita laranja (opacidades 0,24–0,70, mais altas que as
do azul porque o laranja é claro e contrasta menos), e o desenho da janela.
**O que fica em aberto:** o fundo — o manual pede `#FFFFFF` e o site usa
`#FAFAF7` —, e a marca, que o manual quer como "Gabriel Cherubini / BACKEND
DEVELOPER" e o site tem como `gacherubini.dev`.

## 9. Fora de escopo

- **Os quatro cartões de projeto ficam como estão.** Pedido explícito do dono.
  A direção Camaleão continua valendo: a casca tem cor, e ela se cala dentro de
  cada cartão.
- **As páginas de projeto não mudam de desenho**, só herdam a escala
  tipográfica da seção 3.
- **A marca continua `gacherubini.dev`.** Trocar por nome próprio é decisão
  maior que identidade visual.
- O texto da abertura não muda nesta spec.

## 10. Em aberto

1. **Os SVG oficiais da Ambush e da PUCRS.** Não bloqueiam nada — os JPEG dão
   conta a 20px. Mas um SVG oficial é melhor em qualquer tela e dispensa
   `scripts/tratar-marcas.mjs` inteiro. Vale pedir.
2. **A ficha do cartão em duas linhas** (seção 6): encolher a pílula, mover o
   selo, ou aceitar. Decisão do dono.
3. **Quantos fios de 1px caem.** A seção 0 aponta o excesso; quais `border-top`
   somem é uma decisão que só se avalia vendo, e vale montar as duas versões.
