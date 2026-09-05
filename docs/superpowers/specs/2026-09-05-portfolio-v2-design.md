# gacherubini.dev — spec de design v2

Data: 2026-09-05
Estado: aprovado pelo dono, validado em protótipo interativo
Antecessora: `2026-09-04-portfolio-design.md`, que continua valendo. Esta spec
só descreve o que **muda**.

Protótipo que sustenta as decisões: `mockups/v2-home.html` e
`mockups/v2-projeto-office.html` (descartáveis, não são código do site).

## 0. O que motivou

Seis queixas do dono sobre o site pronto, na ordem em que ele as levantou:

1. Falta uma tela de entrada animada.
2. A faixa do Office Timesheet na home despeja dado técnico que não é para
   vitrine.
3. Os prints da galeria são ilegíveis e não abrem.
4. O bloco do assistente lista as 17 funções; devia só dizer o que ele é.
5. A régua da Revy está vazia.
6. Falta dizer que ele trabalha com IA, skills e agent loops.

Mais dois cortes de texto pedidos depois: idade e faculdade saem do Sobre, e o
travessão sai dos textos em primeira pessoa.

## 1. A tela de entrada

Um véu cobre a home enquanto a marca se revela e uma régua atravessa as quatro
cores dos quatro sistemas. Ensina a ideia do site — *não tenho cor, visto a de
cada sistema* — antes de o site aparecer.

| | |
|---|---|
| Véu | `--casca` a 85%, `backdrop-filter: blur(14px) saturate(.5)` |
| Clarão central | radial de 440px a 75% sobre o véu |
| Marca | `clip-path: inset(0 100% 0 0)` → `inset(0)`, 0,62s |
| Régua | 244×3px, preenchimento **linear** de 1,05s |
| Cores | `#7FBFA3` → `#5A21B4` → `#CB6D31` → `#F3B843`, em degrau a cada 25% |
| Saída | opacidade 0 em 0,42s, com atraso de 1,06s |
| **Total** | **1,48s** |

Quatro decisões que não são estéticas:

**O véu vem no HTML do servidor, não de um componente client.** Se fosse React,
o visitante veria a home por um quadro antes de o véu cobrir. Toda a animação é
`@keyframes` com `forwards`: **zero JavaScript no caminho feliz.**

**O preenchimento da régua é linear de propósito.** As trocas de cor são
temporais (25/50/75%); com aceleração, a largura e a cor deixariam de andar
juntas e as duas últimas cores teriam quase nenhum tempo de tela.

**O clarão central existe por contraste, não por estilo.** A marca fica no meio
exato da tela, que é justo onde a abertura clara vira a faixa preta da Revy.
Numa janela mais alta a marca escura cairia sobre o preto e sumiria. O clarão
garante que o load sempre nasce sobre o neutro.

**Toca uma vez por sessão.** Um script inline de ~8 linhas lê e grava
`sessionStorage` e marca `data-entrada` no `<html>`; o CSS pula o véu quando a
marca existe. Ir para uma página de projeto e voltar não repete.

Acessibilidade: `aria-hidden="true"`, nunca prende o foco, e o conteúdo atrás
está no DOM o tempo todo. Sob `prefers-reduced-motion` o véu não existe.

## 2. Pranchas: como um print é mostrado

**Esta é a mudança maior da v2, e a única que altera a estrutura de uma página.**

### O diagnóstico

A galeria era uma grade de três selos de 357px. Um print de 3200×2000 de um app
de 1600px de CSS num quadro de 357px não é uma imagem pequena: é uma imagem
errada. Três tentativas de conserto por hover — crescer no lugar, painel que
sobe, lupa — foram todas rejeitadas, e pelo mesmo motivo: eram efeitos aplicados
a um recipiente errado, e todas eram frágeis, porque exigiam que o visitante
ficasse imóvel no instante em que queria olhar.

### O desenho

A galeria deixa de ser grade e vira **uma sequência de pranchas**:

```
┌─ wrap 1180 ────────────────────────────────────────────────┐
│  ┌──────────┐  ┌────────────────────────────────────────┐  │
│  │ legenda  │  │            print — 880px               │  │
│  │ 196px    │  │                                        │  │
│  └──────────┘  └────────────────────────────────────────┘  │
│                                                            │
│  ┌────────────────────────────────────────┐  ┌──────────┐  │
│  │            print — 880px               │  │ legenda  │  │
│  └────────────────────────────────────────┘  └──────────┘  │
└────────────────────────────────────────────────────────────┘
```

- **880px de largura.** A 880px o print de um app já é legível sem interação
  nenhuma. Esse é o conserto principal; a abertura é refinamento.
- **A legenda vai para a margem, em 14,5px.** Ela sai do papel de rodapé e passa
  a ser texto de leitura. É ela que diz o que a tela significa.
- **O lado alterna a cada prancha.** Não é enfeite: é a mesma língua que as
  faixas da home já falam com `espelho`. Nenhum dispositivo novo foi inventado.
- **O print da faixa da home também é uma prancha**, com a mesma marcação e o
  mesmo comportamento. Uma interação para o site inteiro.

Preço aceito: a página do Office Timesheet fica bem mais longa. Seis selos
ilegíveis não mostravam nada, então o comprimento anterior era falso.

### A abertura

Um clique e a prancha vai para **1320px**, centrada na viewport, com margem dos
dois lados. `Esc` ou um segundo clique fecham.

Ela **não flutua por cima da página**: a página abre espaço, a legenda desce
para baixo da imagem, e o topo da prancha vai para o topo da tela. Não é modal.
O modal em tela cheia foi construído, testado e **rejeitado**; não volta.

Três larguras de abertura foram prototipadas — 1180, 1320 e 100vw. **1320
venceu.** A 100vw a prancha deixa de ser prancha e vira tomada de tela.

### A regra que decide se abre

**Uma prancha só abre quando existe resolução a revelar.** O critério é
`Print.largura >= largura exibida × 1,5`.

| Print | arquivo | exibido | ganho | abre? |
|---|---|---|---|---|
| Revy `02-agente-whatsapp` | 1896 | 567 | 3,3× | sim |
| BDDente `01-agenda-semana` | 3200 | 567 | 5,6× | sim |
| Office Timesheet, todos | 3200 | 567 / 880 / 1116 | 2,9–5,6× | sim |
| **Autotune, os dois** | **639** | **520** | **1,2×** | **não** |

Os prints do Autotune são capturas nativas de uma janela de plugin, não capturas
retina de um app. A folha já sabia disso e os limita a 520px, com um comentário
que diz por quê: *esticar borra*. Esta spec estende a mesma regra à abertura.

Quando não abre, **o elemento não recebe `href`**: sem cursor de mão, sem "ver
maior", sem clique morto. Convite que não cumpre é pior que convite ausente.

E a largura de abertura é sempre `min(1320px, Print.largura)`: **nenhum print no
site pode ser esticado além de onde foi capturado.**

O critério tem dois lados, e cada um vem de um lugar:

- **A largura do arquivo** é `Print.largura`, do conteúdo, renderizada no
  servidor como `--nat` no elemento. Determinística, não espera `load`.
- **A largura exibida** só existe em tempo de execução: ela muda com o
  breakpoint. É medida no cliente e reavaliada no `resize`. Numa tela estreita a
  prancha já ocupa quase tudo e a abertura não acrescenta, então lá ela é
  desligada junto com o resto do movimento.

> **A largura do arquivo vem de `Print.largura` — nunca de `img.naturalWidth`.**
> Com `next/image` o `naturalWidth` é a largura da *variante servida*, não a do
> arquivo original, e a regra do 1,5× erraria. `Print.largura` é determinístico,
> renderiza no servidor e dispensa esperar o `load`. O protótipo usa
> `naturalWidth` e está errado nesse ponto.

### Como a abertura é animada

**FLIP, e só transform.** Mede a caixa, muda o layout de uma vez, mede de novo,
devolve a imagem ao lugar antigo com um `transform`, e anima esse transform até
zero. 460ms, `cubic-bezier(.22,.72,.24,1)`.

Cinco armadilhas encontradas no protótipo, todas verificadas com medição de
quadro. **A implementação precisa evitar as cinco:**

1. **Não animar `width`, `margin` nem `grid-template-columns`.** São propriedades
   de layout: o navegador refaz o layout da página e reescala o bitmap a cada
   quadro. Foi a causa principal do engasgo.
2. **A rolagem entra dentro do FLIP**, entre as duas medições, com
   `behavior: 'auto'`. Rodar `scrollIntoView` suave em paralelo põe duas
   animações competindo e a página desliza por baixo de uma imagem que cresce.
3. **A `transition: transform` da inclinação do mouse precisa ser desligada
   durante a abertura.** Na cascata do CSS, **transições vencem animações de
   script**: sem isso ela sequestra o FLIP e a imagem chega ao destino pelo
   caminho errado.
4. **As colunas da faixa da home precisam de `minmax(0, …)` enquanto há prancha
   aberta.** Uma coluna `1fr` tem piso de `min-content`; com o print a 1320px a
   coluna estoura e arrasta a faixa 102px de lado, e o centramento erra por
   exatamente isso.
5. **Dentro da faixa, o centramento não pode usar `50%`**, que resolve contra a
   coluna do print e não contra a página. A conta é
   `50vw − larga/2 − esq`, com `esq` medido no momento de abrir.

A legenda **apaga e volta** em vez de interpolar posição: ela salta de uma caixa
de 196px para uma de 64ch centrada, e interpolar isso nunca fica bom.

Medido no protótipo, tela de 120Hz (orçamento de 8,3ms): 11 pranchas, pior
quadro 15ms, **zero quadros perdidos**. A primeira abertura de cada imagem pode
bater ~25ms porque o navegador rasteriza o arquivo no tamanho novo — no site
real o `next/image` entrega um AVIF do tamanho certo e esse custo cai.

## 3. Movimento com o mouse

Quatro efeitos, todos discretos:

| | |
|---|---|
| Brilho seguindo o cursor | radial na cor `--destaque` da faixa, 13% de alfa |
| Botões magnéticos | `.cta` puxa no máximo 5px, só a menos de 110px do cursor |
| Prancha inclina | até 2,5°, com elevação de 4px |
| Entrada na rolagem | 18px de subida + opacidade, via `IntersectionObserver` |

**Um componente client, um listener de `pointermove`, limitado a
`requestAnimationFrame`.** Nada de biblioteca de animação.

Duas exigências de desempenho, ambas aprendidas no protótipo:

- **As caixas dos elementos ficam em cache**, invalidado só por rolagem e
  redimensionamento. Medir `.cta` a cada quadro força recálculo de layout a cada
  movimento do cursor, e engasga a página inteira, não só a imagem. Medido
  depois do conserto: 346 movimentos em 1,4s, pior quadro 9,2ms, zero perdidos.
- **Prancha aberta não inclina.** Ela já é o assunto da tela, e um segundo
  `transform` brigaria com o da abertura.

Os elementos **nascem visíveis no HTML**; só são escondidos depois que o JS
confirma que sabe animá-los. Sem JavaScript o site aparece inteiro, nunca em
branco.

Desligado por `prefers-reduced-motion` e por `@media (hover: none)`.

## 4. Mudanças no contrato de conteúdo

Três campos entram, um sai. `content/tipos.ts` e `validarProjeto`.

### `numerosHome?: { valor: Texto; rotulo: Texto }[]`

Hoje `numeros` alimenta **os dois lugares**: a faixa da home e a régua da página
do projeto. É por isso que "1.452 casos de teste, contra Postgres real no CI"
aparece na vitrine.

`FaixaProjeto` passa a usar `numerosHome ?? numeros`. Só o Office Timesheet
declara o campo; os outros três continuam iguais. Mesma cardinalidade de
`numeros`: 0, 3 ou 4.

### `selo?: Texto`

Uma pílula ao lado de "no ar"/"fechado" na faixa da home, marcando os projetos
que têm IA por dentro. Revy: `IA · agente no WhatsApp`. Office Timesheet:
`IA · assistente embutido`.

**O texto herda `--texto`; quem carrega a cor do projeto é um ponto de 7px em
`--destaque`.** Pintar a letra de `--destaque` reprovaria no portão de
contraste — no Office Timesheet ele dá 3,08:1.

### `destaque.lista` **sai** do contrato

Só o Office Timesheet usava, e é justamente a lista das 17 funções que o dono
mandou tirar. Sai do tipo, de `Destaque.tsx` e do CSS (`.tools`, `.rotulo`).

## 5. Conteúdo

### Office Timesheet

**A faixa da home** troca os quatro números técnicos por três de operação:

| | |
|---|---|
| ? | horas apontadas no sistema |
| ? | projetos acompanhados |
| ? | pessoas apontando hora todo dia |

> **PENDENTE E BLOQUEANTE.** Os três valores não existem ainda. Só o dono os
> tem, e são do escritório real, não do seed. Enquanto não vierem, `numerosHome`
> fica `[]` e a faixa sai sem régua — que é o comportamento que o componente já
> tem. **Não inventar valor:** número de vitrine é fato conferido, e essa regra
> é do próprio projeto.

**A régua da página** mantém os quatro técnicos. O rótulo do `34` encurta de
"tools no assistente, dos quais 17 de leitura e 15 de escrita — o resto é SQL
avulso e meta" para **"funções que o assistente pode chamar"**. Era esse rótulo
comprido que quebrava a régua em duas linhas.

**O bloco do assistente** perde as 17 funções e vira:

> ### O assistente que vive dentro do sistema
>
> Um chat dentro do próprio sistema, construído sobre um modelo de linguagem, a
> DeepSeek. Em vez de abrir sete telas para montar a resposta, a pessoa pergunta
> em português.
>
> Ele não adivinha: responde **chamando funções do sistema**, o *function
> calling*. Cada pergunta vira uma ou mais chamadas, ele decide quais precisa,
> junta o que voltou e escreve a resposta. É o mesmo dado que a pessoa veria
> navegando, só que sem navegar.

As três amarras — "Ele propõe, não executa", "Não é um canal privilegiado",
"Cada resposta declara suas fontes" — **continuam**. São o que o bloco tem de
melhor e não são lista de função.

Consequência conhecida: sem a lista, o bloco fica com um vazio à direita. É
exatamente onde caberia o print da tela `/assistente`, hoje bloqueado pela
`AGENT_API_KEY` que responde 403. O slot `destaque.prints: []` já existe.

### Revy

`numeros` deixa de ser `[]`:

| | |
|---|---|
| 120 | pessoas atendidas por dia no WhatsApp |
| ~80% | das conversas o agente resolve sozinho |
| 75 | motos no estoque da loja |

Confirmados pelo dono em 05/09/2026. Fecha a pendência 7 do `ESTADO.md`.

### Sobre

Sai o parágrafo da idade e da faculdade, inteiro. A frase do trabalho perde a
data e condensa:

> Programo há mais de 5 anos. Moro em Porto Alegre e trabalho remoto para a
> Ambush, em Austin, no Texas. Comecei em Go e hoje trabalho no backend da
> Binance, em Java.

"desde 2023" sai de propósito: **o "5+ anos" não envelhece, a data envelhece.**

Entra um parágrafo no fim:

> IA é onde minha atenção está hoje, e não como quem usa chat. Construo por
> dentro: agentes que chamam funções do próprio produto, skills, loops de agente
> que tocam a tarefa inteira e param exatamente onde precisam de uma pessoa. O
> assistente do Office Timesheet e o agente de WhatsApp da Revy saíram daí. Este
> site também.

E uma linha na ficha lateral: **IA** — `agent loops · skills · function calling`.

### O travessão

**Fora dos textos em primeira pessoa**: `content/sobre.ts` e o fechamento, em PT
e EN. Reescrever com vírgula, ponto ou dois-pontos. Os textos dos projetos
mantêm os deles — decisão explícita do dono.

## 6. Arquivos que mudam

| Arquivo | O quê |
|---|---|
| `content/tipos.ts` | `+numerosHome`, `+selo`, `−destaque.lista`, validação dos dois novos |
| `content/projetos/office-timesheet.ts` | destaque reescrito, `numerosHome`, `selo`, rótulo do 34 |
| `content/projetos/revy.ts` | `numeros`, `selo` |
| `content/sobre.ts` | cortes, parágrafo de IA, linha da ficha, sem travessão |
| `components/FaixaProjeto.tsx` | `numerosHome ?? numeros`, selo, print vira prancha |
| `components/Galeria.tsx` | grade → pranchas alternadas |
| `components/PrintFigura.tsx` | marcação de prancha, `--nat` de `Print.largura` |
| `components/Destaque.tsx` | remove `lista` |
| `app/[lang]/layout.tsx` | véu, script de sessão, `<Movimento>` |
| `app/globals.css` | véu, pranchas, selo, movimento |
| **novo** `components/Entrada.tsx` | o véu (server component) |
| **novo** `components/Movimento.tsx` | client: mouse + abertura de prancha |

Dois componentes client no site inteiro. Hoje são zero.

## 7. O que os testes exigem

Os 163 testes atuais têm de continuar verdes.

| Arquivo | Por quê |
|---|---|
| `contrato.test.ts` | `numerosHome` e `selo` entram na validação |
| `traducao.test.ts` | todo texto novo nasce em PT **e** EN |
| `conteudo.test.ts` | números da Revy e do OT |
| `componentes/destaque.test.tsx` | a lista dos 17 sumiu |
| `componentes/galeria.test.tsx` | pranchas no lugar da grade |
| `componentes/faixa.test.tsx` | selo e `numerosHome` |
| `acessibilidade.test.tsx` | véu e pranchas passam pelo portão |
| `folha.test.ts` | regressão das regras novas |

Testes novos: a prancha que não abre não tem `href`; a largura de abertura
respeita `Print.largura`; o véu toca uma vez por sessão; o caminho de movimento
reduzido.

**Cuidado com `folha.test.ts`:** ele acha o CSS móvel por uma string literal
exata — `'@media (max-width: 820px) {\n  .faixa .grade'`. Acrescentar CSS é
seguro; consolidar aquele bloco quebra um teste verde.

## 8. Fora de escopo

- O modal em tela cheia. Construído, testado, rejeitado.
- Hover que aumenta print. Três variantes, todas rejeitadas.
- Qualquer mudança de paleta, tipografia ou direção visual. A v1 continua.
- Travessão nos textos dos projetos.
- As pendências abertas do `ESTADO.md`: domínio, currículo, 404 sem JS, nome no
  histórico do git, app de finanças.

## 9. Em aberto

1. **Os três números do Office Timesheet.** Bloqueia a seção 5. Enquanto não
   vierem, `numerosHome: []`.
2. **O print da tela `/assistente`.** Bloqueado por credencial. O slot existe e
   o bloco funciona sem ele.
