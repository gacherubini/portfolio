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

Consequência de manutenção: **projeto sem identidade visual própria precisa
receber uma antes de entrar no site.** O app de finanças, que ainda não tem
tela, ganhou uma paleta inventada e deve migrar para a real quando existir.

### Tipografia

Uma família só: **Archivo** (variável, eixos de largura e peso). A decisão é
deliberada — quem fala no site é a cor, então o tipo se mantém neutro e
consistente entre faixas de paletas muito diferentes. Pesos em uso: 400, 500,
600, 700, 800.

Escala: 44px (h1 da home) · 52px (h1 da página do projeto) · 34px (nome do
sistema na faixa) · 24px (destaque) · 16.5px (lede) · 15px (corpo) ·
13.5px (rótulo) · 12px (legenda).

Texto corrido não passa de ~50 caracteres por linha (`max-width` em `ch`).

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
| Revy | `#0C0D0C` | `#EAF0EA` | `#7CE0A8` | painel da Revy Loja |
| BDDente | `#5B21A8` | `#F4EEFC` | `#D9C4F5` | menu lateral do sistema |
| Office Timesheet | `#EEF1F6` | `#151A22` | `#2563EB` | tema claro do front |
| Autotune | `#10312F` | `#E4F2F0` | `#F3B843` | âmbar da curva de pitch |
| Gastos do mês | `#FBF7F0` | `#1F1B14` | `#C2562B` | **inventada** — o app não tem tela ainda |

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
│       ├── autotune.ts
│       └── gastos-do-mes.ts
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
  desde: number

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
| Gastos do mês | não existem | o app está em construção |

## 8. Estrutura das duas telas

### Home

1. Topo: nome, navegação, alternador PT/EN. Fundo claro.
2. Abertura: uma frase grande sobre a ideia do site, uma linha de apoio. Sem
   hero de viewport inteira.
3. Uma faixa por projeto, largura total, cada uma na cor do sistema:
   - nome + para quem + situação, sobre uma régua
   - print grande de um lado, texto e números do outro
   - botão primário (entrar no sistema) e secundário (ver o projeto)

A ordem das faixas alterna o lado do print para o olho não cansar.

### Página do projeto

1. Topo e voltar, já na cor do sistema.
2. Nome + chamada + ficha lateral (situação, para quem, tamanho, desde, botões).
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
- Analytics, cookie banner, formulário de contato com backend. Contato é um
  e-mail e links.
- Tema claro/escuro escolhido pelo visitante. As paletas de projeto são fixas
  por definição da direção; um alternador brigaria com elas.
- Animação de entrada por seção.

## 11. Decisões ainda em aberto

1. **Autotune e Gastos do mês entram na home como faixa ou numa seção menor no
   fim?** Cinco faixas de largura total deixam a home longa. Proposta: as três
   em produção viram faixa; Autotune e Gastos entram numa seção "outros
   projetos" com cartão menor, e ainda assim ganham página própria.
2. **O assistente-virtual entra?** Ficou combinado que sim, como cartão menor,
   sem faixa.
3. **Domínio e deploy.** `gacherubini.dev` na Vercel. Falta confirmar se o
   domínio já está comprado e onde está o DNS.
