# gacherubini.dev — spec de design

Data: 2026-09-04
Estado: aprovado pelo dono (direção F, "Camaleão", escolhida em 04/09/2026)

## 1. O que é e para quem

Portfólio pessoal de Gabriel Cherubini. Um site com os sistemas que ele
construiu, cada um com prints, explicação e — quando existe — link para entrar
e clicar.

Duas plateias, nessa ordem:

1. **Quem não é técnico** — dono de empresa, recrutador, cliente em potencial.
   Precisa entender o que cada sistema resolve olhando, sem ler parágrafo e sem
   encontrar jargão. Essa plateia manda no texto de abertura de cada página.
2. **Quem é técnico** — tech lead, outro dev. Quer stack e decisão de
   engenharia. Recebe isso num bloco no fim de cada página do projeto, marcado
   como pulável.

O portfólio não é um blog nem um currículo. O trabalho é a prova.

## 2. A direção visual: Camaleão

O site não tem cor própria. **Ele veste a cor de cada sistema.**

A faixa do Revy na home é preta e verde-menta porque a tela do Revy é preta e
verde-menta. A do BDDente é roxa porque o menu do BDDente é roxo. A página
inteira de um projeto assume a paleta dele — cabeçalho, números, botões.

Isso funciona porque as cores não são inventadas: são as dos produtos reais.
A faixa deixa de parecer um cartão sobre o produto e passa a parecer um pedaço
dele.

Consequência de manutenção: **projeto sem identidade visual própria recebe uma
paleta atribuída.** A regra original era mais dura — cor inventada estava
proibida, e foi o que derrubou o app de finanças em 04/09. Ela caiu em 04/09,
na decisão do Autotune (seção 3).

A regra que ficou no lugar: **a origem de cada cor é declarada.** Cor amostrada
do produto diz de qual tela saiu; cor atribuída diz que foi atribuída. A coluna
"Origem" da tabela da seção 3 não é documentação, é o contrato.

Pendência que isso reabre: o app de finanças ("Gastos do mês") saiu do site por
essa regra. Com a regra relaxada, o motivo da remoção não existe mais. Ele volta
ou fica fora por outro motivo — decisão do dono, ainda não tomada.

### Tipografia

Uma família só: **Archivo** (variável, eixos de largura e peso). A decisão é
deliberada — quem fala no site é a cor, então o tipo se mantém neutro e
consistente entre faixas de paletas muito diferentes. Pesos em uso: 400, 500,
600, 700, 800.

Escala: 44px (h1 da home) · 52px (h1 da página do projeto) · 34px (nome do
sistema na faixa) · 24px (destaque) · 16.5px (lede) · 15px (corpo) ·
13.5px (rótulo) · 12px (legenda).

Texto corrido não passa de ~50 caracteres por linha (`max-width` em `ch`).

**A exceção, aberta em 04/09: código e saída de terminal usam monoespaçada.**
Nome de função (`quemNaoApontou`), nome de arquivo (`dr_wav`) e saída de CLI
alinhada por coluna param de funcionar em fonte proporcional — a saída perde o
alinhamento, e o identificador lê como prosa. A exceção é estreita e tem duas
condições:

- **Nenhuma fonte a mais é baixada.** A pilha é a do sistema
  (`ui-monospace, SFMono-Regular, Menlo, monospace`). "Uma família só" continua
  verdadeiro no que importa: o site carrega Archivo e nada além.
- **Só onde o conteúdo é literalmente código.** Nome de produto, nome de motor
  e rótulo de interface são Archivo. Mono como enfeite — etiqueta em caixa alta
  espaçada, rótulo de dado pequeno — está fora.

Três mockups de página de projeto chegaram nessa necessidade de forma
independente, o que é o argumento a favor de escrever a regra em vez de deixar
cada página resolver sozinha.

### A marca

O logotipo é a palavra inteira: **gacherubini.dev**, com o domínio em duas
cores — `gacherubini` na tinta da casca e `.dev` em azul.

| | |
|---|---|
| `gacherubini` | `#0F1317` |
| `.dev` | `#2A4FD7` |

Amostradas do arquivo que o dono mandou em 04/09/2026.

**Ela é a única cor fixa do site**, e isso é coerente com a direção em vez de
brigar com ela: tudo muda de cor faixa a faixa, e a assinatura é o que não muda.
A marca fica sempre sobre o neutro da casca, nunca dentro de uma faixa colorida
— sobre o roxo do BDDente ou o preto da Revy o azul some ou vibra.

Um conflito a resolver na implementação: `#2A4FD7` é vizinho do azul do Office
Timesheet (`#2563EB`). Como a marca nunca aparece dentro de uma faixa, os dois
não se encostam — mas se algum dia a marca precisar entrar numa faixa, é a faixa
do Timesheet que vai exigir uma variante.

### Neutros da casca

Fora das faixas o site é claro e quieto: fundo `#FAFAF7`, tinta `#15171A`,
régua `#E4E4DE`, texto secundário `#585D62`. Neutros com viés levemente quente,
para não brigar com nenhuma das paletas de projeto.

## 3. Cor por projeto

O que faz a direção funcionar é a paleta viver **no dado**, não no CSS. Cada
projeto declara:

```ts
tema: {
  fundo: '#5B21A8',
  texto: '#F4EEFC',
  borda: '#7E4EC0',
  destaque: '#D9C4F5',
  ctaFundo: '#FFFFFF',
  ctaTexto: '#4A1A8C',
}
```

A faixa e a página do projeto recebem isso como custom properties inline
(`style={{'--fundo': tema.fundo, ...}}`), e uma única folha de estilo serve
todas as paletas. Cor de projeto novo = seis hex num arquivo.

| Projeto | Fundo | Texto | Destaque | Origem da cor |
|---|---|---|---|---|
| Revy | `#111111` | `#EAF0EA` | `#7FBFA3` | amostrada: menu lateral e barra do agente, `02-agente-whatsapp.png` |
| BDDente | `#5A21B4` | `#F4EEFC` | `#D9C4F5` | amostrada: item ativo do menu, `01-agenda-semana.png` |
| Office Timesheet | `#ECECEC` | `#1D2724` | `#CB6D31` | amostrada: fundo e marcador de tarefa, `03-tarefas-kanban.png` |
| Autotune | `#10312F` | `#E4F2F0` | `#F3B843` | **atribuída** — ver abaixo |

Os três primeiros vieram de amostragem de pixel nos próprios prints, em
04/09/2026. A tabela anterior errava dois:

- **Office Timesheet não tem azul.** O `#2563EB` da versão anterior não existe
  no produto. O sistema é verde-escuro `#2E3D38` no topo (usado aqui no botão
  primário) com laranja queimado `#CB6D31` nos marcadores de tarefa. Efeito
  colateral: some o conflito com o `#2A4FD7` da marca que a seção 2 listava.
- **O âmbar do Autotune não existe em lugar nenhum.** A versão anterior dizia
  "âmbar da curva de pitch". O plugin é menta `#2EE6A0` sobre `#0D1512`, e os
  dois gráficos comparativos do TCC são `#1F77B4` puro, o azul default do
  matplotlib. Não há âmbar em nenhum dos quatro prints.

**A decisão sobre o Autotune, tomada em 04/09/2026 depois de três mockups:** a
cor real do plugin repete a dupla da Revy (preto + menta), então o Autotune fica
com faixa de largura total e paleta atribuída, o âmbar `#F3B843` sobre
`#10312F`. É a primeira cor do site que não sai de um produto, e a seção 2 foi
reescrita para permitir isso.

Os quatro temas foram medidos em 04/09 e passam. Um deles passa raspando:
o laranja do Office Timesheet dá **3,08:1** sobre `#ECECEC`, com 0,08 de folga
para um mínimo de 3. Qualquer ajuste no fundo ou no laranja derruba o build.
Se isso incomodar, `#B85F27` é o mesmo laranja um passo mais escuro e sobe para
3,78:1.

**Requisito de acessibilidade:** todo par texto/fundo passa 4.5:1, e todo par
destaque/fundo passa 3:1. Um teste automatizado calcula o contraste de cada
tema declarado e falha o build se algum par não passar. Isso não é opcional: a
direção depende de paletas fortes, e paleta forte erra contraste com facilidade.

## 4. Arquitetura

**Next.js 15 (App Router) + TypeScript + Tailwind CSS 4**, deploy na Vercel.

`next/image` é a razão de ser do Next aqui: os prints são o conteúdo mais
pesado do site e precisam de resize, formato moderno e lazy loading sem
trabalho manual.

```
portfolio/
├── app/
│   ├── [lang]/page.tsx              # home: faixas coloridas
│   ├── [lang]/[slug]/page.tsx       # página do projeto
│   ├── [lang]/layout.tsx            # casca, nav, alternador PT/EN
│   └── globals.css                  # tokens da casca + regras das faixas
├── components/
│   ├── FaixaProjeto.tsx             # a faixa da home, tematizada
│   ├── PaginaProjeto.tsx            # o corpo da página, tematizada
│   ├── Destaque.tsx                 # o bloco "o principal" com 1-2 prints
│   ├── Galeria.tsx                  # tiras de print secundárias
│   ├── BlocoTecnico.tsx             # stack + notas de engenharia
│   └── AlternadorIdioma.tsx
├── content/
│   ├── tipos.ts                     # o contrato de um projeto
│   ├── indice.ts                    # ordem dos projetos na home
│   ├── ui.ts                        # textos da casca em pt e en
│   └── projetos/
│       ├── revy.ts
│       ├── bddente.ts
│       ├── office-timesheet.ts
│       └── autotune.ts
├── lib/
│   ├── contraste.ts                 # razão de contraste WCAG
│   └── idioma.ts                    # resolve pt/en, cai no pt
├── scripts/
│   ├── seed-revy-demo.py            # popula a stack local da Revy
│   └── seed-office-timesheet.js
└── public/prints/<slug>/*.png
```

Adicionar um projeto = criar um arquivo em `content/projetos/`, jogar os prints
numa pasta e acrescentar uma linha em `indice.ts`. Nada mais.

## 5. O contrato de um projeto

```ts
export type Idioma = 'pt' | 'en'

export type Texto = Record<Idioma, string>

export type Print = {
  arquivo: string          // relativo a /public/prints/<slug>/
  alt: Texto               // obrigatório; não é decoração
  legenda?: Texto
  largura: number
  altura: number
}

export type Projeto = {
  slug: string
  nome: string
  paraQuem: Texto          // "Revenda de veículos"
  situacao: 'no-ar' | 'fechado' | 'publicado' | 'em-construcao'

  // A ficha lateral da página do projeto. Lista livre, não campos fixos:
  // cada sistema tem um dado diferente que o descreve melhor. 2 a 5 linhas.
  ficha: { rotulo: Texto; valor: Texto }[]

  tema: Tema

  resumoHome: Texto        // ~2 frases, na faixa da home
  chamada: Texto           // 1-2 frases grandes, topo da página
  problema: Texto          // por que o sistema existe, sem jargão
  oQueFaz: Texto           // o que ele faz, sem jargão

  destaque?: {             // o bloco "o principal"
    titulo: Texto
    texto: Texto
    prints: Print[]        // 1 ou 2
  }

  numeros: { valor: string; rotulo: Texto }[]   // 3 ou 4
  galeria: Print[]
  links: { rotulo: Texto; href: string; primario?: boolean }[]

  tecnico: {
    stack: string[]
    notas: { titulo: Texto; texto: Texto }[]    // 2 ou 3
  }
}
```

Regras que o tipo impõe:

- **`alt` é obrigatório e bilíngue.** Print sem alt não compila.
- **`numeros` aceita 3 ou 4 itens.** Cinco viram sopa; dois deixam buraco.
- **`destaque` é opcional.** Só existe quando o projeto tem uma coisa que se
  entende por imagem — o agente de WhatsApp do Revy tem; o Timesheet não.
- **`links` pode ser vazio.** É o caso do Office Timesheet, que é fechado. O
  componente mostra "sistema fechado", nunca um botão morto.
- **`galeria` pode ser vazia.** É o caso do Autotune: só existem quatro prints,
  dois vão para o destaque e dois são matplotlib no default. Sem galeria, o
  peso vai para o destaque e para o bloco técnico.
- **`ficha` é lista livre, e foi o que a rodada de mockups de 04/09 provou.**
  Campos fixos obrigavam o BDDente a esconder o dado mais forte que tem
  ("Substituiu — Dentalis, em FoxPro, de 1996 a 2024") e o Office Timesheet a
  inventar um "tamanho" que não existe. Cada projeto declara os rótulos que
  fazem sentido para ele. `desde` saiu do tipo: virou uma linha da ficha, e o
  projeto que não sabe a data simplesmente não declara essa linha, em vez de
  ficar com um campo obrigatório escrito "a confirmar".

## 6. Idioma

`/pt` e `/en`, com `/` redirecionando para `/pt`. `generateStaticParams` gera
os dois na build.

Cada projeto declara `pt` e `en` lado a lado no mesmo arquivo. Traduzir é
preencher o campo vizinho, não manter dois arquivos em sincronia.

Se um `en` faltar, o site cai no `pt` e a build imprime aviso nomeando o campo.
Não falha: um projeto novo pode nascer só em português e ser traduzido depois.

## 7. Prints

Ficam em `public/prints/<slug>/`, nomeados com número e descrição:
`01-visao-geral.png`, `02-agente-whatsapp.png`.

**Regra que não se quebra: nenhum print pode conter dado real de cliente, de
paciente ou de empresa.** Sistema em produção é fotografado a partir de
instância local populada com dados inventados. Os scripts que fazem isso vivem
em `scripts/` e são reexecutáveis.

Estado em 04/09/2026:

| Projeto | Prints | Como foram feitos |
|---|---|---|
| Revy | 6, prontos | stack local, loja fictícia "Garagem Vale Motos" |
| BDDente | faltam | o dono vai mandar os arquivos |
| Office Timesheet | em andamento | subida local com seed fictício |
| Autotune | usar `TCC_autotune/results/figures/` | gráficos de resultado já existem |

## 8. Estrutura das duas telas

### Home

1. Topo: nome, navegação, alternador PT/EN. Fundo claro.
2. Abertura: uma frase grande sobre a ideia do site, uma linha de apoio. Sem
   hero de viewport inteira.
3. Uma faixa por projeto, largura total, cada uma na cor do sistema:
   - nome + para quem + situação, sobre uma régua
   - print grande de um lado, texto e números do outro
   - botão primário (entrar no sistema) e secundário (ver o projeto)

4. **O "Sobre", como último bloco da home** — não como página. Decidido em
   04/09 depois de três mockups (página neutra, página no azul, bloco na home).
   O item "Sobre" da navegação é uma âncora, não uma rota. Texto à esquerda,
   ficha à direita, tudo sobre o neutro da casca.
5. **Fechamento no azul da marca.** Depois de quatro faixas com a cor dos
   produtos, a última faixa da página é a cor da casa, `#2A4FD7`. Dentro dela,
   e-mail e telefone em tamanho de leitura — são a informação, não botão —, o
   currículo em PDF como o único item que o visitante leva embora, e GitHub e
   LinkedIn em segundo plano. O rodapé mora aqui dentro.

A ordem das faixas alterna o lado do print para o olho não cansar.

Isso mata o `/sobre` como rota: são duas telas no site, não três. E ajusta a
regra da seção 2 sobre a marca nunca entrar numa faixa colorida — ela continua
valendo para as faixas dos produtos, mas o fechamento **é** a cor da marca, então
lá o azul é o fundo e a assinatura vai em branco.

### Página do projeto

1. Topo e voltar, já na cor do sistema.
2. Nome + chamada + ficha lateral. Os rótulos da ficha são por projeto, não
   fixos (seção 5) — a Revy declara "Tamanho", o BDDente declara "Substituiu".
   Onde o sistema é fechado, o lugar dos botões diz por que não há botão.
3. **Destaque**, quando existe: título, texto e um ou dois prints grandes com
   legenda. É o primeiro conteúdo depois da chamada, de propósito.
4. Régua de números (3 ou 4).
5. Duas colunas: "O problema" e "O que o sistema faz". Português comum.
6. Galeria: três tiras com as outras telas.
7. Bloco técnico: stack em chips + duas ou três notas de engenharia. Abre com
   "Esta parte é pra quem é da área. Se não for o seu caso, pode pular."

## 9. Acessibilidade e desempenho

- Contraste testado por build, como na seção 3.
- Foco de teclado visível em todo link e botão, inclusive sobre fundo escuro.
- `prefers-reduced-motion` respeitado. A direção não depende de movimento.
- Todo print tem `alt` descrevendo o que a tela mostra, não "print do sistema".
- Nada essencial aparece só depois de rolar: a primeira faixa já está visível
  e legível no primeiro quadro.
- Mobile: a grade da faixa vira uma coluna, print em cima, texto embaixo.

## 10. Fora de escopo

- Blog, seção de artigos, newsletter.
- CMS ou painel de administração. O conteúdo é código.
- Analytics, cookie banner, formulário de contato com backend. Contato é
  e-mail, WhatsApp, currículo em PDF e dois perfis, tudo em link direto.
- Página `/sobre`. O Sobre é bloco no fim da home (seção 8).
- Tema claro/escuro escolhido pelo visitante. As paletas de projeto são fixas
  por definição da direção; um alternador brigaria com elas.
- Animação de entrada por seção.

## 11. Decisões ainda em aberto

1. **O app de finanças volta?** Saiu em 04/09 porque não tinha tela e cor
   inventada era proibida. A proibição caiu no mesmo dia (seções 2 e 3). O
   motivo da remoção não existe mais; a remoção continua valendo até alguém
   decidir o contrário.
2. **O assistente-virtual entra?** Ficou combinado que sim, como cartão menor,
   sem faixa.
3. **Domínio e deploy.** `gacherubini.dev` na Vercel. Falta confirmar se o
   domínio já está comprado e onde está o DNS.

### Fechadas em 04/09/2026

- **A direção visual.** Camaleão foi reaberta e comparada contra três
  alternativas em mockup (casca editorial, azul da marca, vitrine). Confirmada.
  A queixa que motivou a reabertura — "o site fica sem cara própria" — segue
  valendo como crítica; a resposta escolhida foi manter a direção mesmo assim.
- **O Autotune entra como faixa de largura total**, não como cartão em "outros
  projetos". Ordem da home: Revy, BDDente, Office Timesheet, Autotune.
