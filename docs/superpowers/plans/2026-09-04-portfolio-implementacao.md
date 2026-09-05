# gacherubini.dev — plano de implementação

> **Para quem executa com agente:** SUB-SKILL OBRIGATÓRIA — use
> `superpowers:subagent-driven-development` (recomendado) ou
> `superpowers:executing-plans` para executar tarefa a tarefa. Os passos usam
> checkbox (`- [ ]`) para acompanhamento.

**Objetivo:** sair do repositório sem uma linha de site e chegar em
`gacherubini.dev` no ar na Vercel, bilíngue, com a home de quatro faixas e as
quatro páginas de projeto exatamente como os comps aprovados em 04/09/2026.

**Arquitetura:** Next.js 15 (App Router) estático. A cor não mora no CSS: cada
projeto declara um objeto `tema` de oito hex (nove no Autotune, que tem
`fundo3`), que vira custom properties inline
no elemento raiz da faixa ou da página; uma folha só serve as quatro paletas.
Um teste de contraste roda antes do `next build` e derruba a build se qualquer
par declarado reprovar.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS 4 · Vitest + Testing Library ·
Archivo via `next/font/google` · Vercel.

**Spec:** `docs/superpowers/specs/2026-09-04-portfolio-design.md`
**Estado do trabalho:** `ESTADO.md`
**Comps aprovados:** `mockups/a3-autotune-ambar.html`, `mockups/s3-sobre-na-home.html`,
`mockups/p1-projeto-revy.html`, `mockups/p2-projeto-bddente.html`,
`mockups/p3-projeto-office-timesheet.html`, `mockups/p4-projeto-autotune.html`,
`mockups/camaleao.css`

---

## Restrições globais

Valem em toda tarefa. Os valores são literais, copiados da spec.

- **Não reabrir decisão de design.** A direção Camaleão foi reaberta e
  reconfirmada em 04/09. O CSS dos comps é a fonte da verdade visual: portar,
  não redesenhar. Toda divergência entre comp e spec se resolve pelo comp.
- **Tipografia:** só **Archivo** é baixada (pesos 400, 500, 600, 700, 800).
  Monoespaçada só onde o conteúdo é literalmente código, e só com a pilha do
  sistema: `ui-monospace, SFMono-Regular, Menlo, monospace`. Nenhuma fonte
  além de Archivo entra na rede.
- **Marca:** `gacherubini` em `#0F1317` + `.dev` em `#2A4FD7`, e só sobre o
  neutro da casca. Dentro de faixa colorida ou de página de projeto a marca é
  monocromática (`.dev` em `opacity: .55`). No fechamento azul ela vai em
  branco.
- **Neutros da casca:** fundo `#FAFAF7`, tinta `#15171A`, régua `#E4E4DE`,
  secundário `#585D62`.
- **Acessibilidade, testada por build:** todo par texto/fundo ≥ **4.5:1**, todo
  par destaque/fundo ≥ **3:1**. O laranja do Office Timesheet dá **3,08:1** com
  0,08 de folga — o teste precisa existir antes das paletas.
- **Opacidade mínima em texto: 0,72** nas faixas e páginas de projeto (abaixo
  disso o roxo do BDDente reprova: 4,22:1 a 0,65), e **0,85 dentro do
  fechamento azul** (branco a 0,72 sobre `#2A4FD7` dá 4,21:1). Ver Tarefa 2.
- **Quem recebe `opacity` é sempre `--texto`.** `--calmo` já é a tinta
  esmaecida do sistema e não aguenta um segundo desconto: nas quatro paletas
  ele passa em cheio e reprova a 0,72 (3,12:1 no Office Timesheet, 3,37:1 no
  BDDente). Elemento pintado com `var(--calmo)` fica em opacidade cheia.
- **Opacidade compõe.** Pai a `.88` com filho a `.85` dá `.748`, e nenhum teste
  de paleta pega isso: o hex não mudou, só o produto. Dentro de um bloco que já
  esmaece, o filho vai em `opacity: 1`.
- **Idioma:** `/pt` e `/en`; `/` redireciona para `/pt`. `en` faltando cai no
  `pt` e a build imprime aviso nomeando o campo — **não falha**.
- **Prints:** nenhum com dado real de cliente, paciente ou empresa. Os 32
  arquivos em `public/prints/` já foram conferidos um a um; não trocar nenhum.
- **Fora de escopo:** blog, CMS, analytics, cookie banner, formulário de
  contato, rota `/sobre`, alternador claro/escuro, animação de entrada.

### Os três slots

Nada aqui bloqueia o plano. Cada um é um buraco previsto, com comportamento
definido e uma linha de dado para fechar quando a informação chegar.

| Slot | Onde vive | Comportamento enquanto vazio | Como fecha |
|---|---|---|---|
| **PDF do currículo** | `public/curriculo-gabriel-cherubini.pdf` | o botão some do fechamento e a build avisa; nunca vira link morto (Tarefa 10) | jogar o PDF em `public/` |
| **Print do `/assistente`** | `destaque.prints` de `office-timesheet.ts` | `prints: []`; o destaque vira só texto + a lista dos 17 tools, que é o comp P3 aprovado (Tarefa 6, 12) | acrescentar um `Print` ao array |
| **Números da Revy** | `numeros` de `revy.ts` | `numeros: []`; a régua e a linha de números da faixa somem, e a build avisa (Tarefa 4, 9, 13) | trocar `[]` por 3 ou 4 itens |

### Divergências deliberadas entre a spec e este plano

A spec §5 foi escrita antes da rodada de comps de 04/09. Os comps aprovados
exigem oito relaxamentos no contrato. Cada um está listado aqui porque muda o
tipo, não o desenho — e a lista é exaustiva de propósito: divergência que não
está aqui é erro, não decisão.

1. **`destaque.prints` aceita 0, 1 ou 2** (spec: "1 ou 2"). Zero é o slot do
   print do assistente; um é o comp P2 (`.placa-larga`); dois é P1 e P4.
2. **`numeros` aceita 0, 3 ou 4** (spec: "3 ou 4"). Zero é o slot da Revy.
3. **`galeria` é lista de fileiras nomeadas**, não lista de prints (spec:
   `Print[]`). P3 tem duas fileiras com títulos diferentes ("O dia de quem
   aponta", "O fechamento do mês"); P1 e P2 têm uma; P4 tem zero.
4. **`tecnico.notas` aceita 2, 3 ou 4** (spec: "2 ou 3"). P4 tem quatro.
5. **`Tema` tem nove campos, não seis.** Os comps das páginas de projeto usam
   `calmo` (texto secundário sobre a cor do sistema) e `fundo2` (superfície do
   bloco de destaque); o Autotune ainda usa `fundo3` para as placas dos prints.
6. **Tradução faltando falha o teste, não só avisa** (spec §6: "não falha"). O
   `t()` em runtime continua caindo no português sem quebrar nada — o que muda
   é que o repositório trata `en` vazio como trabalho pendente e não como
   estado normal. Um projeto novo pode nascer só em português: quem o
   acrescentar relaxa `test/traducao.test.ts` de propósito, e essa decisão fica
   visível no diff em vez de virar um aviso que ninguém lê.
7. **`Texto` é `{ pt: string; en?: string }`**, não `Record<Idioma, string>`
   (spec §5, onde os dois idiomas são obrigatórios). É o que sustenta o
   mecanismo inteiro da divergência 6: sem `en` opcional não existe queda para
   o português nem aviso nomeando o campo.
8. **`problema`, `oQueFaz`, `destaque.texto` e `tecnico.notas[].texto` são
   `Texto[]`**, não `Texto` (spec §5). Todos os quatro comps aprovados escrevem
   esses blocos em dois parágrafos; um campo só obrigaria a emendar os dois com
   `
` e a deixar o componente partir string.

---

## A ordem, e por que ela é essa

| # | Tarefa | Entrega |
|---|---|---|
| 1 | Esqueleto e portão de build | `npm run build` roda o teste antes do `next build` |
| 2 | **Teste de contraste** | roda em fixture, **antes de qualquer paleta existir** |
| 3 | Contrato de um projeto | aguenta link vazio, destaque ausente e galeria vazia |
| 4 | Conteúdo: Revy | o caso completo, com os números como slot |
| 5 | Conteúdo: BDDente | o caso sem link |
| 6 | Conteúdo: Office Timesheet | sem link, sem print de destaque, paleta clara |
| 7 | Conteúdo: Autotune + índice | sem galeria; o contraste passa a rodar nas paletas reais |
| 8 | Casca da home | Archivo, marca, alternador, abertura |
| 9 | Faixa de projeto | as quatro faixas da home |
| 10 | Sobre e fechamento | fecha a home, com o currículo como slot |
| 11 | Página do projeto: topo e ficha | blocos 1 e 2 da spec §8 |
| 12 | Destaque | bloco 3 — a peça que cada projeto usa de um jeito |
| 13 | Régua e prosa | blocos 4 e 5 |
| 14 | Galeria | bloco 6 |
| 15 | Bloco técnico | bloco 7; a página do projeto fecha aqui |
| 16 | Inglês | `/en` deixa de cair no português |
| 17 | Acessibilidade, metadata, imagens | spec §9, mais o que faz o site ser achado |
| 18 | Deploy na Vercel | no ar |

Duas amarras de ordem valem por si:

- **A 2 vem antes da 4.** A folga do Office Timesheet é de 0,08 sobre o mínimo.
  Teste de contraste escrito depois da paleta tende a ser escrito para caber
  nela; escrito antes, ele é uma régua.
- **As 4 a 7 vêm antes da 9.** Cada uma exercita uma borda diferente do
  contrato, e é mais barato descobrir que o contrato não aguenta com um arquivo
  de dados na mão do que com meia interface construída em cima.

De 11 a 15 a página do projeto cresce um bloco por vez, e cada bloco é testável
sozinho — dá para parar entre duas tarefas com o site inteiro funcionando.

---

## Estrutura de arquivos

O que cada arquivo responde. Um arquivo, uma responsabilidade — a folha de
estilo é a exceção deliberada, porque a spec §3 pede uma folha só servindo
todas as paletas.

```
portfolio/
├── package.json                  # scripts; `build` roda vitest antes do next
├── vercel.json                   # força a Vercel a chamar `npm run build`
├── next.config.ts                # redirect / -> /pt
├── vitest.config.ts              # jsdom + plugin react
├── vitest.setup.ts               # jest-dom
├── tsconfig.json
├── postcss.config.mjs            # @tailwindcss/postcss
├── middleware.ts                 # NÃO existe: o redirect vive no next.config
├── app/
│   ├── globals.css               # tokens da casca + faixa + página de projeto
│   ├── [lang]/layout.tsx         # layout RAIZ (<html lang>), Archivo, metadata
│   ├── [lang]/page.tsx           # home: abertura, 4 faixas, Sobre, Fechamento
│   └── [lang]/[slug]/page.tsx    # página do projeto, os 7 blocos da spec §8
├── components/
│   ├── Marca.tsx                 # gacherubini.dev, 3 variantes de cor
│   ├── AlternadorIdioma.tsx      # PT / EN
│   ├── CabecalhoCasca.tsx        # topo claro da home
│   ├── CabecalhoProjeto.tsx      # topo tematizado + "← Todos os projetos"
│   ├── FaixaProjeto.tsx          # a faixa da home
│   ├── AberturaProjeto.tsx       # nome + chamada + ficha + links ou o motivo
│   ├── PrintFigura.tsx           # <figure> + next/image + legenda
│   ├── TextoComMarcas.tsx        # `crase` vira <code>, *asterisco* vira <b>
│   ├── Destaque.tsx              # "o principal": 0-2 prints, lista, amarras
│   ├── ReguaNumeros.tsx          # 0, 3 ou 4 números
│   ├── Prosa.tsx                 # "O problema" e "O que o sistema faz"
│   ├── Galeria.tsx               # fileiras nomeadas; 0 fileiras = nada
│   ├── BlocoTecnico.tsx          # chips + terminal opcional + 2-4 notas
│   ├── Sobre.tsx                 # último bloco da home
│   └── Fechamento.tsx            # faixa azul da marca + rodapé
├── content/
│   ├── tipos.ts                  # o contrato (Projeto, Tema, Print, Texto)
│   ├── indice.ts                 # ordem das faixas na home
│   ├── ui.ts                     # textos da casca, pt e en
│   ├── sobre.ts                  # JÁ EXISTE — só reimporta os tipos
│   └── projetos/{revy,bddente,office-timesheet,autotune}.ts
├── lib/
│   ├── contraste.ts              # WCAG 2.x + verificarTema()
│   ├── idioma.ts                 # t(), fallback pt, aviso de build
│   ├── tema.ts                   # Tema -> React.CSSProperties
│   └── curriculo.ts              # o PDF existe? (slot)
├── test/
│   ├── harness.test.tsx          # prova o portão, e que next/link e next/image renderizam
│   ├── contraste.test.ts         # fixtures, incl. o caso 3,08:1
│   ├── folha.test.ts             # lê globals.css: nenhuma opacity fora da lista
│   ├── temas.test.ts             # itera os temas reais do indice
│   ├── contrato.test.ts          # as três bordas: sem link, sem destaque, sem galeria
│   ├── idioma.test.ts
│   └── componentes/*.test.tsx
└── public/
    ├── prints/<slug>/*.png|jpg   # 32 arquivos, já conferidos
    └── curriculo-gabriel-cherubini.pdf   # SLOT: ainda não existe
```

**Por que o layout raiz mora em `app/[lang]/layout.tsx`:** o `<html lang>`
precisa do idioma, e no App Router um `app/layout.tsx` não recebe `params`.
Sem `app/layout.tsx`, o Next aceita o layout raiz dentro do segmento dinâmico,
desde que toda rota passe por ele — e passa, porque `/` é redirect de config,
não uma página.

**Dimensões reais dos prints.** Os comps declaram `1896×932` para os três
`.jpg` da Revy; os arquivos são `1568×772` (e `06-resultado.jpg` é `1568×726`).
Usar os valores reais, medidos em 04/09:

| Arquivo | px |
|---|---|
| `revy/01-visao-geral.png` | 1897 × 938 |
| `revy/02-agente-whatsapp.png` | 1896 × 932 |
| `revy/03-atendimento-lista.jpg` | 1568 × 772 |
| `revy/04-conversa-agente.jpg` | 1568 × 772 |
| `revy/05-estoque.jpg` | 1568 × 772 |
| `revy/06-resultado.jpg` | 1568 × 726 |
| `bddente/*.png` (8 arquivos) | 3200 × 2000 |
| `office-timesheet/*.png` (13 arquivos) | 3200 × 2000 |
| `autotune/01-plugin-cantando-v3.png` | 639 × 458 |
| `autotune/02-plugin-parado-psola.png` | 642 × 488 |
| `autotune/03-comparativo-rpa.png` | 960 × 600 |
| `autotune/04-comparativo-gpe.png` | 960 × 600 |
| `autotune/05-plugin-cantando-psola.png` | 637 × 455 |

Os gráficos `03` e `04` do Autotune ficam **fora** do site (recomendação do
`ESTADO.md`: matplotlib no default, não separam nada).

---

## Tarefa 1: Esqueleto do projeto e o portão de build

**Arquivos:**
- Criar: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`,
  `vitest.config.ts`, `vitest.setup.ts`, `vercel.json`, `app/globals.css`,
  `app/[lang]/layout.tsx`, `app/[lang]/page.tsx`
- Criar teste: `test/harness.test.tsx`

**Interfaces:**
- Consome: nada.
- Produz: `npm test` (`vitest run`) e `npm run build` (`vitest run && next build`).
  Toda tarefa seguinte roda esses dois comandos.

- [ ] **Passo 1: criar o `package.json`**

```json
{
  "name": "gacherubini-portfolio",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "vitest run && next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "15.5.4",
    "react": "19.1.1",
    "react-dom": "19.1.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.13",
    "@testing-library/jest-dom": "6.8.0",
    "@testing-library/react": "16.3.0",
    "@types/node": "22.18.1",
    "@types/react": "19.1.13",
    "@types/react-dom": "19.1.9",
    "@vitejs/plugin-react": "5.0.2",
    "jsdom": "26.1.0",
    "tailwindcss": "4.1.13",
    "typescript": "5.9.2",
    "vitest": "3.2.4"
  }
}
```

O `build` roda o Vitest antes do `next build`: é assim que o teste de contraste
da spec §3 "derruba o build".

- [ ] **Passo 2: instalar**

Rode: `npm install`
Esperado: termina sem erro; `node_modules/` aparece (já está no `.gitignore`).

- [ ] **Passo 3: `vercel.json`, para a Vercel não pular o portão**

A Vercel roda o script `build` do `package.json` quando ele existe, então o
portão já valeria. Fixar o comando é redundância barata: deixa explícito no
repositório qual comando a produção roda, e o dia em que alguém trocar o preset
ou acrescentar um `vercel-build` o Vitest continua na frente.

```json
{ "buildCommand": "npm run build" }
```

- [ ] **Passo 4: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Passo 5: `next.config.ts` — o redirect de `/` para `/pt`**

Redirect de configuração, não middleware: é estático, não custa runtime, e
deixa `app/[lang]/layout.tsx` ser o layout raiz.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/pt', permanent: false }]
  },
}

export default nextConfig
```

- [ ] **Passo 6: `postcss.config.mjs`**

```js
export default { plugins: { '@tailwindcss/postcss': {} } }
```

- [ ] **Passo 7: `vitest.config.ts` e `vitest.setup.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['test/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
  },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Passo 8: escrever o teste que prova que o portão existe**

```tsx
// test/harness.test.tsx
import { render, screen } from '@testing-library/react'
import Link from 'next/link'
import Image from 'next/image'
import { describe, expect, it } from 'vitest'

describe('harness de teste', () => {
  it('roda TypeScript', () => {
    const soma = (a: number, b: number): number => a + b
    expect(soma(2, 2)).toBe(4)
  })

  it('tem DOM', () => {
    document.body.innerHTML = '<b id="x">ok</b>'
    expect(document.getElementById('x')).toHaveTextContent('ok')
  })

  // Sete arquivos de teste deste plano renderizam componente que importa
  // next/link ou next/image, e os dois contam com contexto que só existe
  // dentro do Next. Se eles não renderizam em jsdom, isso tem que aparecer
  // aqui, com duas linhas de conserto — não na Tarefa 8, com meia interface
  // escrita em cima.
  it('renderiza next/link fora do Next', () => {
    render(<Link href="/pt">PT</Link>)
    expect(screen.getByRole('link', { name: 'PT' })).toHaveAttribute('href', '/pt')
  })

  it('renderiza next/image fora do Next', () => {
    render(
      <Image src="/prints/revy/01-visao-geral.png" alt="painel" width={1897} height={938} />,
    )
    expect(screen.getByAltText('painel')).toBeInTheDocument()
  })
})
```

- [ ] **Passo 9: rodar e ver passar**

Rode: `npm test`
Esperado: 4 testes passando.

Se um dos dois últimos falhar, conserte agora, em `vitest.config.ts`: um alias
de `next/image` para um componente que devolve `<img>`, ou `vi.mock`. O resto
do plano assume que os dois renderizam.

- [ ] **Passo 10: casca mínima só para a build compilar**

```css
/* app/globals.css */
@import "tailwindcss";
```

```tsx
// app/[lang]/layout.tsx — este é o layout RAIZ. Não existe app/layout.tsx.
import type { ReactNode } from 'react'
import './../globals.css'

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }]
}

export default async function LayoutRaiz({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <html lang={lang === 'en' ? 'en' : 'pt-BR'}>
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/[lang]/page.tsx
export default function Home() {
  return <main>em construção</main>
}
```

- [ ] **Passo 11: provar que a build passa e que o portão morde**

Rode: `npm run build`
Esperado: Vitest passa, depois `next build` gera `/pt` e `/en` como estáticas.

Agora quebre um teste de propósito (troque `toBe(4)` por `toBe(5)`), rode
`npm run build` de novo e confirme que **o `next build` não chega a rodar**.
Desfaça a quebra.

- [ ] **Passo 12: commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts \
        postcss.config.mjs vercel.json vitest.config.ts vitest.setup.ts \
        app test
git commit -m "chore: esqueleto Next 15 + Vitest, com o teste barrando o build"
```

---

## Tarefa 2: O teste de contraste — antes de qualquer paleta

Esta tarefa vem antes das paletas de propósito. A folga do Office Timesheet é
de 0,08 sobre o mínimo; um teste escrito depois da paleta tende a ser escrito
para caber nela.

**Arquivos:**
- Criar: `lib/contraste.ts`
- Criar teste: `test/contraste.test.ts`

**Interfaces:**
- Consome: nada.
- Produz:
  - `razaoDeContraste(a: string, b: string): number` — hex `#RRGGBB`, retorna a
    razão WCAG 2.x.
  - `misturar(frente: string, fundo: string, alfa: number): string` — hex da cor
    resultante de `frente` com opacidade `alfa` sobre `fundo`.
  - `MIN_TEXTO = 4.5`, `MIN_DESTAQUE = 3`, `OPACIDADES_DE_TEXTO: number[]`,
    `OPACIDADES_NO_AZUL: number[]`, `CASCA`
  - `verificarCasca(): string[]` — os neutros da casca e o fechamento azul
  - `verificarTema(nome: string, tema: Tema): string[]` — lista de falhas; vazia
    quando passa. O tipo `Tema` só nasce na Tarefa 3, e `content/tipos.ts` vai
    importar daqui — então a forma estrutural declarada abaixo fica como está,
    para os dois arquivos não se importarem em círculo.

- [ ] **Passo 1: escrever o teste, que ainda não compila**

```ts
// test/contraste.test.ts
import { describe, expect, it } from 'vitest'
import {
  CASCA,
  MIN_DESTAQUE,
  MIN_TEXTO,
  OPACIDADES_DE_TEXTO,
  OPACIDADES_NO_AZUL,
  misturar,
  razaoDeContraste,
  verificarCasca,
  verificarTema,
} from '@/lib/contraste'

describe('razaoDeContraste', () => {
  it('dá 21 entre preto e branco', () => {
    expect(razaoDeContraste('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
  })

  it('dá 1 entre uma cor e ela mesma', () => {
    expect(razaoDeContraste('#CB6D31', '#CB6D31')).toBeCloseTo(1, 5)
  })

  it('não depende da ordem', () => {
    const a = razaoDeContraste('#CB6D31', '#ECECEC')
    const b = razaoDeContraste('#ECECEC', '#CB6D31')
    expect(a).toBeCloseTo(b, 10)
  })

  // O caso que a spec seção 3 manda proteger: o laranja do Office Timesheet
  // passa com 0,08 de folga. Se este número mudar, a paleta mudou.
  it('mede o laranja do Office Timesheet em 3,08', () => {
    expect(razaoDeContraste('#CB6D31', '#ECECEC')).toBeCloseTo(3.08, 2)
  })

  it('mede a alternativa mais escura em 3,78', () => {
    expect(razaoDeContraste('#B85F27', '#ECECEC')).toBeCloseTo(3.78, 2)
  })
})

describe('misturar', () => {
  it('a 100% devolve a cor da frente', () => {
    expect(misturar('#EAF0EA', '#111111', 1)).toBe('#EAF0EA')
  })

  it('a 0% devolve o fundo', () => {
    expect(misturar('#EAF0EA', '#111111', 0)).toBe('#111111')
  })
})

const TEMA_BOM = {
  fundo: '#10312F',
  texto: '#E4F2F0',
  borda: '#2A5A56',
  destaque: '#F3B843',
  ctaFundo: '#F3B843',
  ctaTexto: '#10312F',
  calmo: '#9FBCB8',
  fundo2: '#0D2827',
}

describe('verificarTema', () => {
  it('aceita um tema que passa', () => {
    expect(verificarTema('bom', TEMA_BOM)).toEqual([])
  })

  it('aceita o destaque exatamente em 3,08 — a folga é pequena, mas existe', () => {
    const ot = {
      fundo: '#ECECEC',
      texto: '#1D2724',
      borda: '#C9CFCC',
      destaque: '#CB6D31',
      ctaFundo: '#2E3D38',
      ctaTexto: '#FFFFFF',
      calmo: '#55605C',
      fundo2: '#FFFFFF',
    }
    expect(verificarTema('office-timesheet', ot)).toEqual([])
  })

  it('recusa destaque abaixo de 3:1', () => {
    // #D98A55 sobre #ECECEC dá cerca de 2,3:1 — um passo mais claro que o real.
    const falhas = verificarTema('ruim', {
      ...TEMA_BOM,
      fundo: '#ECECEC',
      texto: '#1D2724',
      calmo: '#55605C',
      fundo2: '#FFFFFF',
      destaque: '#D98A55',
    })
    expect(falhas.join(' ')).toMatch(/destaque\/fundo/)
  })

  it('recusa texto abaixo de 4,5:1', () => {
    const falhas = verificarTema('ruim', { ...TEMA_BOM, texto: '#3D6B67' })
    expect(falhas.join(' ')).toMatch(/texto\/fundo/)
  })

  it('recusa rótulo de botão ilegível sobre o fundo do botão', () => {
    const falhas = verificarTema('ruim', { ...TEMA_BOM, ctaTexto: '#C79A3F' })
    expect(falhas.join(' ')).toMatch(/ctaTexto\/ctaFundo/)
  })

  it('nomeia o tema, para a build dizer qual arquivo consertar', () => {
    const falhas = verificarTema('bddente', { ...TEMA_BOM, texto: '#3D6B67' })
    expect(falhas[0]).toContain('bddente')
  })

  // Opacidade é o furo silencioso: o comp da home escurece texto com opacity,
  // e opacity baixa derruba contraste sem mudar hex nenhum.
  it('checa cada nível de opacidade que a folha usa', () => {
    const bddente = {
      fundo: '#5A21B4',
      texto: '#F4EEFC',
      borda: '#7E4EC0',
      destaque: '#D9C4F5',
      ctaFundo: '#FFFFFF',
      ctaTexto: '#4A1A8C',
      calmo: '#CBBCE8',
      fundo2: '#451890',
    }
    expect(verificarTema('bddente', bddente)).toEqual([])
    // 0,65 sobre o roxo dá 4,22:1. É de onde vem o piso de 0,72.
    expect(
      razaoDeContraste(misturar('#F4EEFC', '#5A21B4', 0.65), '#5A21B4'),
    ).toBeLessThan(MIN_TEXTO)
    expect(Math.min(...OPACIDADES_DE_TEXTO)).toBeGreaterThanOrEqual(0.72)
  })

  // O outro lado do mesmo furo. `calmo` é a segunda tinta e passa em cheio nas
  // quatro paletas — mas não sobra folga para esmaecer: a 0,72 as quatro
  // reprovam. É de onde vem a regra da folha de que opacity só cai em `texto`.
  // Sem isto escrito, `.regua .num span{color:var(--calmo)}` herda um
  // `opacity:.72` de outra regra e ninguém percebe.
  it('calmo passa em cheio e não aguenta opacidade nenhuma', () => {
    const paletas: [string, string, string][] = [
      ['revy', '#9AA39D', '#111111'],
      ['bddente', '#CBBCE8', '#5A21B4'],
      ['office-timesheet', '#55605C', '#ECECEC'],
      ['autotune', '#9FBCB8', '#10312F'],
    ]
    for (const [nome, calmo, fundo] of paletas) {
      expect(razaoDeContraste(calmo, fundo), nome).toBeGreaterThanOrEqual(MIN_TEXTO)
      expect(
        razaoDeContraste(misturar(calmo, fundo, 0.72), fundo),
        nome,
      ).toBeLessThan(MIN_TEXTO)
    }
  })

  it('expõe os mínimos da spec', () => {
    expect(MIN_TEXTO).toBe(4.5)
    expect(MIN_DESTAQUE).toBe(3)
  })
})

describe('verificarCasca', () => {
  it('a casca e o fechamento azul passam', () => {
    expect(verificarCasca()).toEqual([])
  })

  // O furo que quase passou: o comp do fechamento esmaecia branco a 70%.
  it('branco a 72% sobre o azul da marca reprovaria', () => {
    expect(razaoDeContraste(misturar('#FFFFFF', CASCA.dev, 0.72), CASCA.dev)).toBeLessThan(MIN_TEXTO)
    expect(Math.min(...OPACIDADES_NO_AZUL)).toBeGreaterThanOrEqual(0.85)
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/contraste.test.ts`
Esperado: FALHA com `Failed to resolve import "@/lib/contraste"`.

- [ ] **Passo 3: implementar `lib/contraste.ts`**

```ts
/**
 * Contraste WCAG 2.x. A direção Camaleão depende de paletas fortes, e paleta
 * forte erra contraste com facilidade — por isso isto roda no `npm run build`
 * antes do `next build`, e não como conferência manual.
 */

export const MIN_TEXTO = 4.5
export const MIN_DESTAQUE = 3

/**
 * Os níveis de opacidade que `app/globals.css` usa em texto. Duas regras da
 * folha, e `test/folha.test.ts` (Tarefa 8) guarda a primeira:
 *
 * 1. Nenhuma regra usa opacity fora desta lista. 0,72 é o piso porque 0,65
 *    sobre o roxo do BDDente dá 4,22:1.
 * 2. Opacity só cai sobre `--texto`. `--calmo` fica em opacidade cheia: ele já
 *    é a tinta esmaecida do sistema, e a 0,72 as quatro paletas reprovam.
 *    Por isso o sweep abaixo roda em `tema.texto` e não em `tema.calmo` —
 *    incluir `calmo` aqui derrubaria as quatro paletas aprovadas em vez de
 *    consertar o CSS, que é onde o erro mora.
 */
export const OPACIDADES_DE_TEXTO = [0.72, 0.85, 0.88, 0.9, 0.92]

/**
 * Os níveis usados dentro do fechamento azul. O piso ali é 0,85, não 0,72:
 * branco a 72% sobre `#2A4FD7` dá 4,21:1, e a 85% sobe para 5,23:1.
 */
export const OPACIDADES_NO_AZUL = [0.85, 0.88]

/** Os neutros da casca e o azul da marca. Não mudam entre projetos. */
export const CASCA = {
  fundo: '#FAFAF7',
  tinta: '#15171A',
  regua: '#E4E4DE',
  calmo: '#585D62',
  corpoSobre: '#2A2E32',
  marca: '#0F1317',
  dev: '#2A4FD7',
} as const

type Canais = [number, number, number]

function canais(hex: string): Canais {
  const limpo = hex.trim().replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(limpo)) {
    throw new Error(`cor precisa ser #RRGGBB, veio "${hex}"`)
  }
  return [
    parseInt(limpo.slice(0, 2), 16),
    parseInt(limpo.slice(2, 4), 16),
    parseInt(limpo.slice(4, 6), 16),
  ]
}

function paraLinear(canal: number): number {
  const c = canal / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminancia(hex: string): number {
  const [r, g, b] = canais(hex)
  return 0.2126 * paraLinear(r) + 0.7152 * paraLinear(g) + 0.0722 * paraLinear(b)
}

export function razaoDeContraste(a: string, b: string): number {
  const la = luminancia(a)
  const lb = luminancia(b)
  const claro = Math.max(la, lb)
  const escuro = Math.min(la, lb)
  return (claro + 0.05) / (escuro + 0.05)
}

/** Hex resultante de `frente` desenhada com opacidade `alfa` sobre `fundo`. */
export function misturar(frente: string, fundo: string, alfa: number): string {
  const f = canais(frente)
  const t = canais(fundo)
  const oito = (n: number) =>
    Math.round(n).toString(16).padStart(2, '0').toUpperCase()
  return '#' + f.map((c, i) => oito(c * alfa + t[i] * (1 - alfa))).join('')
}

type TemaVerificavel = {
  fundo: string
  texto: string
  borda: string
  destaque: string
  ctaFundo: string
  ctaTexto: string
  calmo: string
  fundo2: string
  fundo3?: string
}

/** Lista das falhas do tema. Vazia = passou. */
export function verificarTema(nome: string, tema: TemaVerificavel): string[] {
  const falhas: string[] = []

  const exigir = (par: string, frente: string, atras: string, minimo: number) => {
    const razao = razaoDeContraste(frente, atras)
    if (razao + 1e-9 < minimo) {
      falhas.push(
        `${nome}: ${par} (${frente} sobre ${atras}) dá ${razao.toFixed(2)}:1, ` +
          `mínimo ${minimo}:1`,
      )
    }
  }

  const superficies: [string, string][] = [
    ['fundo', tema.fundo],
    ['fundo2', tema.fundo2],
  ]
  if (tema.fundo3) superficies.push(['fundo3', tema.fundo3])

  for (const [rotulo, superficie] of superficies) {
    exigir(`texto/${rotulo}`, tema.texto, superficie, MIN_TEXTO)
    exigir(`calmo/${rotulo}`, tema.calmo, superficie, MIN_TEXTO)
    exigir(`destaque/${rotulo}`, tema.destaque, superficie, MIN_DESTAQUE)

    for (const alfa of OPACIDADES_DE_TEXTO) {
      exigir(
        `texto@${alfa}/${rotulo}`,
        misturar(tema.texto, superficie, alfa),
        superficie,
        MIN_TEXTO,
      )
    }
  }

  exigir('ctaTexto/ctaFundo', tema.ctaTexto, tema.ctaFundo, MIN_TEXTO)

  return falhas
}

/**
 * A casca e o fechamento azul não são tema de projeto e escapariam de
 * `verificarTema` — mas é lá que mora a única cor fixa do site, e é lá que o
 * branco esmaecido reprova mais fácil.
 */
export function verificarCasca(): string[] {
  const falhas: string[] = []

  const exigir = (par: string, frente: string, atras: string, minimo: number) => {
    const razao = razaoDeContraste(frente, atras)
    if (razao + 1e-9 < minimo) {
      falhas.push(`casca: ${par} dá ${razao.toFixed(2)}:1, mínimo ${minimo}:1`)
    }
  }

  exigir('tinta/fundo', CASCA.tinta, CASCA.fundo, MIN_TEXTO)
  exigir('calmo/fundo', CASCA.calmo, CASCA.fundo, MIN_TEXTO)
  exigir('corpoSobre/fundo', CASCA.corpoSobre, CASCA.fundo, MIN_TEXTO)
  exigir('marca/fundo', CASCA.marca, CASCA.fundo, MIN_TEXTO)
  exigir('dev/fundo', CASCA.dev, CASCA.fundo, MIN_TEXTO)
  exigir('branco/dev', '#FFFFFF', CASCA.dev, MIN_TEXTO)

  for (const alfa of OPACIDADES_NO_AZUL) {
    exigir(`branco@${alfa}/dev`, misturar('#FFFFFF', CASCA.dev, alfa), CASCA.dev, MIN_TEXTO)
  }

  return falhas
}
```

- [ ] **Passo 4: rodar e ver passar**

Rode: `npm test -- test/contraste.test.ts`
Esperado: todos passando, inclusive o de 3,08.

- [ ] **Passo 5: commit**

```bash
git add lib/contraste.ts test/contraste.test.ts
git commit -m "test: contraste WCAG barrando a build, antes de as paletas entrarem"
```

---

## Tarefa 3: O contrato de um projeto, e as três bordas que ele tem que aguentar

Cada uma das quatro páginas fechadas exercita uma borda diferente: o BDDente e
o Office Timesheet não têm link nenhum, o Office Timesheet ainda não tem print
de destaque, e o Autotune não tem galeria. Se o contrato não aguentar as três,
uma página não fecha.

**Arquivos:**
- Criar: `content/tipos.ts`, `lib/idioma.ts`
- Modificar: `content/sobre.ts` (só os imports; o conteúdo fica como está)
- Criar teste: `test/contrato.test.ts`, `test/idioma.test.ts`

**Interfaces:**
- Consome: `verificarTema` de `lib/contraste.ts` (Tarefa 2).
- Produz:
  - Tipos `Idioma`, `Texto`, `Tema`, `Print`, `FileiraGaleria`, `Projeto`
  - `validarProjeto(p: Projeto): string[]` — falhas de cardinalidade; vazia = ok
  - `t(texto: Texto, lang: Idioma, campo: string): string` — texto no idioma,
    com queda para `pt` e aviso
  - `avisosDeTraducao(): string[]` e `limparAvisosDeTraducao(): void`
  - `IDIOMAS: readonly ['pt', 'en']`, `ehIdioma(v: string): v is Idioma`

- [ ] **Passo 1: escrever `test/contrato.test.ts`**

```tsx
import { describe, expect, it } from 'vitest'
import type { Projeto } from '@/content/tipos'
import { validarProjeto } from '@/content/tipos'

const TEMA = {
  fundo: '#111111',
  texto: '#EAF0EA',
  borda: '#2A322C',
  destaque: '#7FBFA3',
  ctaFundo: '#7FBFA3',
  ctaTexto: '#111111',
  calmo: '#9AA39D',
  fundo2: '#171917',
}

const txt = (s: string) => ({ pt: s, en: s })

const BASE: Projeto = {
  slug: 'exemplo',
  nome: 'Exemplo',
  paraQuem: txt('Para quem'),
  situacao: 'no-ar',
  ficha: [{ rotulo: txt('Para quem'), valor: txt('Alguém') }, { rotulo: txt('Situação'), valor: txt('No ar') }],
  tema: TEMA,
  resumoHome: txt('Resumo na faixa da home.'),
  chamada: txt('A chamada grande do topo da página.'),
  problema: [txt('Por que o sistema existe.')],
  oQueFaz: [txt('O que o sistema faz.')],
  numeros: [
    { valor: '1', rotulo: txt('um') },
    { valor: '2', rotulo: txt('dois') },
    { valor: '3', rotulo: txt('três') },
  ],
  galeria: [],
  links: [],
  semLink: {
    curto: txt('Sistema fechado.'),
    titulo: txt('Sistema fechado'),
    texto: txt('Não existe tela de entrada pública.'),
  },
  tecnico: {
    stack: ['TypeScript'],
    notas: [
      { titulo: txt('Nota um'), texto: [txt('Texto.')] },
      { titulo: txt('Nota dois'), texto: [txt('Texto.')] },
    ],
  },
}

describe('validarProjeto — o caso completo', () => {
  it('aceita o projeto base', () => {
    expect(validarProjeto(BASE)).toEqual([])
  })
})

describe('as três bordas que os comps aprovados provaram', () => {
  // P2 (BDDente) e P3 (Office Timesheet): sistema fechado, nenhum botão.
  it('aceita links vazio quando o projeto explica a ausência', () => {
    expect(validarProjeto({ ...BASE, links: [] })).toEqual([])
  })

  it('recusa links vazio sem explicação — nunca um espaço em branco', () => {
    const { semLink: _fora, ...mudo } = BASE
    expect(validarProjeto({ ...(mudo as Projeto), links: [] }).join(' ')).toMatch(/semLink/)
  })

  // BASE não declara destaque: um projeto sem "o principal" é válido.
  it('aceita destaque ausente', () => {
    expect(BASE.destaque).toBeUndefined()
    expect(validarProjeto(BASE)).toEqual([])
  })

  // P3 (Office Timesheet): o print do assistente não existe (403 na API key).
  it('aceita destaque com zero print — o texto carrega sozinho', () => {
    const p: Projeto = {
      ...BASE,
      destaque: { titulo: txt('O assistente'), texto: [txt('Um parágrafo.')], prints: [] },
    }
    expect(validarProjeto(p)).toEqual([])
  })

  // P4 (Autotune): só existem quatro prints e dois são matplotlib default.
  it('aceita galeria vazia', () => {
    expect(validarProjeto({ ...BASE, galeria: [] })).toEqual([])
  })
})

describe('validarProjeto — o que ele recusa', () => {
  it('recusa dois números (a régua fica com buraco)', () => {
    const falhas = validarProjeto({ ...BASE, numeros: BASE.numeros.slice(0, 2) })
    expect(falhas.join(' ')).toMatch(/numeros/)
  })

  it('aceita zero números — é o slot da Revy até o dono confirmar', () => {
    expect(validarProjeto({ ...BASE, numeros: [] })).toEqual([])
  })

  it('recusa cinco números (viram sopa)', () => {
    const cinco = [1, 2, 3, 4, 5].map((n) => ({ valor: String(n), rotulo: txt(String(n)) }))
    expect(validarProjeto({ ...BASE, numeros: cinco }).join(' ')).toMatch(/numeros/)
  })

  it('recusa destaque com três prints', () => {
    const print = { arquivo: '01-x.png', alt: txt('alt'), largura: 100, altura: 100 }
    const p: Projeto = {
      ...BASE,
      destaque: { titulo: txt('t'), texto: [txt('p')], prints: [print, print, print] },
    }
    expect(validarProjeto(p).join(' ')).toMatch(/destaque/)
  })

  it('recusa ficha com uma linha só, e com seis', () => {
    expect(validarProjeto({ ...BASE, ficha: BASE.ficha.slice(0, 1) }).join(' ')).toMatch(/ficha/)
    const seis = Array.from({ length: 6 }, (_, i) => ({ rotulo: txt(String(i)), valor: txt('v') }))
    expect(validarProjeto({ ...BASE, ficha: seis }).join(' ')).toMatch(/ficha/)
  })

  it('recusa uma nota técnica só, e cinco', () => {
    const nota = { titulo: txt('t'), texto: [txt('p')] }
    expect(
      validarProjeto({ ...BASE, tecnico: { ...BASE.tecnico, notas: [nota] } }).join(' '),
    ).toMatch(/notas/)
    expect(
      validarProjeto({
        ...BASE,
        tecnico: { ...BASE.tecnico, notas: [nota, nota, nota, nota, nota] },
      }).join(' '),
    ).toMatch(/notas/)
  })

  it('recusa print com alt vazio — alt não é decoração', () => {
    const p: Projeto = {
      ...BASE,
      galeria: [
        {
          titulo: txt('As outras telas'),
          prints: [{ arquivo: '01-x.png', alt: { pt: '', en: '' }, largura: 10, altura: 10 }],
        },
      ],
    }
    expect(validarProjeto(p).join(' ')).toMatch(/alt/)
  })

  it('recusa link primário sem href', () => {
    const p: Projeto = { ...BASE, links: [{ rotulo: txt('Entrar'), href: '', primario: true }] }
    expect(validarProjeto(p).join(' ')).toMatch(/href/)
  })

  it('recusa tema que reprova no contraste', () => {
    const p: Projeto = { ...BASE, tema: { ...TEMA, texto: '#333333' } }
    expect(validarProjeto(p).join(' ')).toMatch(/texto\/fundo/)
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/contrato.test.ts`
Esperado: FALHA com `Failed to resolve import "@/content/tipos"`.

- [ ] **Passo 3: escrever `content/tipos.ts`**

```ts
import { verificarTema } from '@/lib/contraste'

export const IDIOMAS = ['pt', 'en'] as const
export type Idioma = (typeof IDIOMAS)[number]

export function ehIdioma(v: string): v is Idioma {
  return (IDIOMAS as readonly string[]).includes(v)
}

/**
 * Todo texto do site nasce nos dois idiomas lado a lado. `en` pode ficar em
 * branco: `t()` cai no `pt` e a build avisa. Traduzir é preencher o campo
 * vizinho, não manter dois arquivos em sincronia.
 */
export type Texto = { pt: string; en?: string }

/**
 * A paleta do sistema. Oito hex por projeto — nove no Autotune, que declara
 * `fundo3` —, e é a única coisa que muda entre uma faixa e outra: a folha de
 * estilo é a mesma para as quatro.
 *
 * `fundo2` é a superfície do bloco de destaque — mais escura nas páginas
 * escuras, branca na única página clara. `fundo3` só existe no Autotune, para
 * as placas onde o menta dos prints não pode encostar no âmbar da página.
 */
export type Tema = {
  fundo: string
  texto: string
  borda: string
  destaque: string
  ctaFundo: string
  ctaTexto: string
  calmo: string
  fundo2: string
  fundo3?: string
}

export type Print = {
  /** relativo a `/public/prints/<slug>/` */
  arquivo: string
  /** obrigatório e bilíngue: descreve o que a tela mostra, não "print do sistema" */
  alt: Texto
  legenda?: Texto
  largura: number
  altura: number
  /** P4: o nome do motor no alto da placa ("TD-PSOLA") */
  etiqueta?: Texto
  /** P4: o número que acompanha a etiqueta ("61,72 ms") */
  valor?: string
  /**
   * Marca o print que abre a faixa da home. Sem marca nenhuma, a faixa usa o
   * primeiro do destaque. O Autotune precisa da marca: o comp da home mostra o
   * motor de ponteiro móvel, que é o segundo print do destaque.
   */
  naFaixa?: boolean
}

/** P3 tem duas fileiras com títulos diferentes; P1 e P2 têm uma; P4 tem zero. */
export type FileiraGaleria = { titulo: Texto; prints: Print[] }

export type Situacao = 'no-ar' | 'fechado' | 'publicado' | 'em-construcao'

export type Nota = { titulo: Texto; texto: Texto[] }

export type Projeto = {
  slug: string
  nome: string
  paraQuem: Texto
  situacao: Situacao

  /** Lista livre, 2 a 5 linhas. Cada sistema declara os rótulos que servem a ele. */
  ficha: { rotulo: Texto; valor: Texto }[]

  tema: Tema

  resumoHome: Texto
  chamada: Texto
  problema: Texto[]
  oQueFaz: Texto[]

  /** P3: um print de página inteira antes do destaque, quando o destaque não tem imagem. */
  printAbertura?: Print

  destaque?: {
    titulo: Texto
    texto: Texto[]
    /** 0, 1 ou 2. Zero é o slot do print que ainda não existe. */
    prints: Print[]
    /** P3: os 17 tools de leitura, em monoespaçada porque são nomes de função. */
    lista?: { rotulo: Texto; itens: string[] }
    /** P3: as três garantias abaixo da lista. */
    amarras?: Nota[]
    /** P4: a frase que fecha o bloco, centralizada. */
    fecho?: Texto
  }

  /** 3 ou 4. Zero significa "ainda não confirmado" e some da tela. */
  numeros: { valor: string; rotulo: Texto }[]
  galeria: FileiraGaleria[]
  links: { rotulo: Texto; href: string; primario?: boolean }[]

  /**
   * Obrigatório quando `links` está vazio: o lugar do botão diz por que não há
   * botão, em vez de virar link morto. `curto` é a linha da faixa da home;
   * `titulo` e `texto` são o cartão da página do projeto.
   */
  semLink?: { curto: Texto; titulo: Texto; texto: Texto }

  tecnico: {
    stack: string[]
    /** P4: a saída de CLI, como texto e não como print. */
    terminal?: { comando: string; saida: string; legenda: Texto }
    notas: Nota[]
  }
}

function entre(n: number, min: number, max: number): boolean {
  return n >= min && n <= max
}

/**
 * Cardinalidade e contraste. Roda no teste e na build — não é validação de
 * runtime para dado de usuário, é conferência de conteúdo escrito à mão.
 */
export function validarProjeto(p: Projeto): string[] {
  const falhas: string[] = []
  const erro = (msg: string) => falhas.push(`${p.slug}: ${msg}`)

  if (!entre(p.ficha.length, 2, 5)) {
    erro(`ficha tem ${p.ficha.length} linhas; o contrato pede de 2 a 5`)
  }

  if (p.numeros.length !== 0 && !entre(p.numeros.length, 3, 4)) {
    erro(`numeros tem ${p.numeros.length}; o contrato pede 0, 3 ou 4`)
  }

  if (p.destaque && !entre(p.destaque.prints.length, 0, 2)) {
    erro(`destaque tem ${p.destaque.prints.length} prints; o contrato pede de 0 a 2`)
  }

  if (!entre(p.tecnico.notas.length, 2, 4)) {
    erro(`tecnico.notas tem ${p.tecnico.notas.length}; o contrato pede de 2 a 4`)
  }

  const prints: Print[] = [
    ...(p.printAbertura ? [p.printAbertura] : []),
    ...(p.destaque?.prints ?? []),
    ...p.galeria.flatMap((fileira) => fileira.prints),
  ]
  for (const print of prints) {
    if (!print.alt.pt.trim()) erro(`print ${print.arquivo} está sem alt em pt`)
    if (print.largura <= 0 || print.altura <= 0) {
      erro(`print ${print.arquivo} está sem largura/altura reais`)
    }
  }

  for (const link of p.links) {
    if (!link.href.trim()) erro(`link "${link.rotulo.pt}" está sem href`)
  }

  if (p.links.length === 0 && !p.semLink) {
    erro('sem links e sem semLink: o lugar do botão precisa dizer por que não há botão')
  }

  falhas.push(...verificarTema(p.slug, p.tema))

  return falhas
}
```

- [ ] **Passo 4: rodar e ver passar**

Rode: `npm test -- test/contrato.test.ts`
Esperado: todos passando.

- [ ] **Passo 5: escrever `test/idioma.test.ts`**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { avisosDeTraducao, limparAvisosDeTraducao, t } from '@/lib/idioma'

beforeEach(() => limparAvisosDeTraducao())

describe('t', () => {
  it('devolve o idioma pedido', () => {
    expect(t({ pt: 'Projetos', en: 'Projects' }, 'en', 'ui.nav')).toBe('Projects')
  })

  it('cai no pt quando o en falta', () => {
    expect(t({ pt: 'Projetos' }, 'en', 'ui.nav')).toBe('Projetos')
  })

  it('cai no pt quando o en está em branco', () => {
    expect(t({ pt: 'Projetos', en: '   ' }, 'en', 'ui.nav')).toBe('Projetos')
  })

  it('registra aviso nomeando o campo', () => {
    t({ pt: 'Projetos' }, 'en', 'ui.nav')
    expect(avisosDeTraducao()).toEqual(['ui.nav'])
  })

  it('não repete o mesmo campo no aviso', () => {
    t({ pt: 'Projetos' }, 'en', 'ui.nav')
    t({ pt: 'Projetos' }, 'en', 'ui.nav')
    expect(avisosDeTraducao()).toHaveLength(1)
  })

  it('não avisa quando o idioma é pt', () => {
    t({ pt: 'Projetos' }, 'pt', 'ui.nav')
    expect(avisosDeTraducao()).toEqual([])
  })
})
```

- [ ] **Passo 6: rodar e ver falhar**

Rode: `npm test -- test/idioma.test.ts`
Esperado: FALHA com `Failed to resolve import "@/lib/idioma"`.

- [ ] **Passo 7: escrever `lib/idioma.ts`**

```ts
import type { Idioma, Texto } from '@/content/tipos'

const faltando = new Set<string>()

/**
 * Texto no idioma pedido, com queda para o português.
 *
 * Um projeto novo pode nascer só em português e ser traduzido depois — por isso
 * a falta de `en` avisa em vez de falhar. `campo` é o caminho do dado
 * ("revy.chamada"), e é o que o aviso imprime: aviso que não nomeia o campo
 * não conserta nada.
 */
export function t(texto: Texto, lang: Idioma, campo: string): string {
  if (lang === 'pt') return texto.pt

  const traduzido = texto.en?.trim()
  if (traduzido) return traduzido

  faltando.add(campo)
  return texto.pt
}

export function avisosDeTraducao(): string[] {
  return [...faltando].sort()
}

export function limparAvisosDeTraducao(): void {
  faltando.clear()
}

/** Chamado no fim da geração de cada página em inglês. */
export function imprimirAvisosDeTraducao(): void {
  const campos = avisosDeTraducao()
  if (campos.length === 0) return
  console.warn(
    `[i18n] ${campos.length} campo(s) sem tradução em inglês; caíram no ` +
      `português:\n  ${campos.join('\n  ')}`,
  )
}
```

- [ ] **Passo 8: rodar e ver passar**

Rode: `npm test -- test/idioma.test.ts`
Esperado: 6 testes passando.

- [ ] **Passo 9: apontar `content/sobre.ts` para os tipos novos**

O arquivo já existe e o texto dele não muda. Só o cabeçalho: remova as duas
declarações locais de `Idioma` e `Texto` e importe do contrato.

```ts
// no topo de content/sobre.ts, no lugar dos dois `export type` de hoje:
import type { Texto } from '@/content/tipos'
export type { Idioma, Texto } from '@/content/tipos'
```

Apague o comentário "Os tipos abaixo migram para `content/tipos.ts` quando o
site existir" — migraram. Apague também o campo `titulo`: o comp aprovado
titula o bloco com "Quem fez", que mora em `ui.sobreTitulo` (Tarefa 8), e um
segundo título no arquivo de conteúdo só cria duas fontes para a mesma coisa.

- [ ] **Passo 10: rodar tudo**

Rode: `npm run build`
Esperado: Vitest verde, `next build` gera `/pt` e `/en`.

- [ ] **Passo 11: commit**

```bash
git add content/tipos.ts content/sobre.ts lib/idioma.ts test/contrato.test.ts test/idioma.test.ts
git commit -m "feat: contrato de projeto aguentando link vazio, destaque ausente e galeria vazia"
```

---

## Tarefa 4: Conteúdo da Revy — o caso completo, com o slot dos números

Primeiro projeto: é o que tem link, tem destaque com dois prints e tem galeria.
É também onde mora o slot dos números de vitrine.

**Arquivos:**
- Criar: `content/projetos/revy.ts`
- Criar teste: `test/conteudo.test.ts`

**Interfaces:**
- Consome: `Projeto`, `validarProjeto` de `content/tipos.ts` (Tarefa 3).
- Produz: `export const revy: Projeto`.

**Sobre os números.** O levantamento é explícito: os números do seed são
inventados e **não podem virar número de vitrine**. Os "96 atendimentos" e os
"75% resolvidos" que aparecem no comp saem do `seed-revy-demo.py`. Então
`numeros: []`, a régua some, e a build avisa. A legenda do print continua
descrevendo o que a tela mostra — descrever uma captura de demonstração é uma
coisa, cravar o número como resultado é outra.

- [ ] **Passo 1: escrever o teste**

```ts
// test/conteudo.test.ts
import { describe, expect, it } from 'vitest'
import { validarProjeto } from '@/content/tipos'
import { revy } from '@/content/projetos/revy'

describe('revy', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(revy)).toEqual([])
  })

  it('tem link, porque o sistema é público', () => {
    expect(revy.links.length).toBeGreaterThan(0)
    expect(revy.links.some((l) => l.primario)).toBe(true)
  })

  it('tem destaque com os dois prints do agente', () => {
    expect(revy.destaque?.prints).toHaveLength(2)
  })

  it('tem uma fileira de galeria', () => {
    expect(revy.galeria).toHaveLength(1)
    expect(revy.galeria[0].prints).toHaveLength(3)
  })

  // Slot: os números do seed são inventados. Quando o dono confirmar os reais,
  // este teste vira `expect(revy.numeros).toHaveLength(3)`.
  it('está sem números de vitrine, à espera da confirmação do dono', () => {
    expect(revy.numeros).toEqual([])
  })

  it('não declara "Desde" — o contrato deixa a linha de fora quando não se sabe', () => {
    expect(revy.ficha.some((l) => /a confirmar/i.test(l.valor.pt))).toBe(false)
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/conteudo.test.ts`
Esperado: FALHA com `Failed to resolve import "@/content/projetos/revy"`.

- [ ] **Passo 3: escrever `content/projetos/revy.ts`**

Texto vindo de `mockups/p1-projeto-revy.html` e `mockups/a3-autotune-ambar.html`,
que são os comps aprovados. Matéria-prima em `docs/levantamentos/revy.md`.

```ts
import type { Projeto } from '@/content/tipos'

export const revy: Projeto = {
  slug: 'revy',
  nome: 'Revy',
  paraQuem: { pt: 'Revenda de veículos' },
  situacao: 'no-ar',

  // Cores amostradas do menu lateral e da barra do agente em
  // 02-agente-whatsapp.png, em 04/09/2026.
  tema: {
    fundo: '#111111',
    texto: '#EAF0EA',
    borda: '#2A322C',
    destaque: '#7FBFA3',
    ctaFundo: '#7FBFA3',
    ctaTexto: '#111111',
    calmo: '#9AA39D',
    fundo2: '#171917',
  },

  // "Desde" ficou de fora de propósito: ninguém confirmou a data, e o contrato
  // prefere a linha ausente a uma linha escrita "a confirmar".
  ficha: [
    { rotulo: { pt: 'Para quem' }, valor: { pt: 'Revenda de veículos' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'No ar, com loja real usando' } },
    { rotulo: { pt: 'Tamanho' }, valor: { pt: '7 produtos, bancos separados' } },
  ],

  resumoHome: {
    pt: 'Quem responde o cliente no WhatsApp é o sistema. Ele puxa a moto do estoque, responde preço e condição, e passa para uma pessoa quando o assunto sai do roteiro.',
  },

  chamada: {
    pt: 'Quem responde o cliente no WhatsApp é o sistema — e o dono da loja vê exatamente o que ele respondeu.',
  },

  problema: [
    {
      pt: 'Numa revenda de motos, a venda começa no WhatsApp e quase sempre passa por financiamento. Alguém da loja responde a mesma pergunta de preço trinta vezes por dia, e depois abre o site de cada banco, um por um, para simular a parcela.',
    },
    {
      pt: 'Enquanto isso o estoque vive numa planilha, o anúncio vive noutro lugar, e ninguém sabe qual campanha trouxe qual cliente.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Junta o conjunto do que a loja precisa para vender moto financiada: o atendimento no WhatsApp, o estoque com preço e situação, a simulação de financiamento nos bancos, a vitrine pública e o resultado do mês.',
    },
    {
      pt: 'Do primeiro "oi" até a venda fechada no relatório, sem sair do sistema e sem planilha no meio.',
    },
  ],

  destaque: {
    titulo: { pt: 'O agente de atendimento no WhatsApp' },
    texto: [
      {
        pt: 'Ele puxa a moto do estoque, responde preço e condição, e passa para uma pessoa quando o assunto sai do roteiro. O valor não é ter um robô: é o dono da loja ver quanto o robô resolveu sozinho, e a passagem para uma pessoa ser explícita em vez de o cliente ficar preso falando com uma máquina.',
      },
    ],
    prints: [
      {
        arquivo: '02-agente-whatsapp.png',
        largura: 1896,
        altura: 932,
        alt: {
          pt: 'Aba Agente: 96 atendimentos no mês, 72 resolvidos só com o agente, 24 transferidos, e o gráfico por dia.',
        },
        legenda: {
          pt: 'A aba Agente: 96 conversas no mês, 72 fechadas sem ninguém, 24 passadas para uma pessoa.',
        },
      },
      {
        arquivo: '04-conversa-agente.jpg',
        largura: 1568,
        altura: 772,
        alt: {
          pt: 'Uma conversa: o diálogo do agente com o cliente, mensagem a mensagem.',
        },
        legenda: {
          pt: 'A conversa por dentro, com a resposta do agente ao lado da do cliente.',
        },
      },
    ],
  },

  // SLOT. Os do comp ("96", "75%", "7") saem do seed-revy-demo.py e são
  // inventados; o levantamento proíbe que virem número de vitrine. Quando o
  // dono confirmar os reais, entram 3 ou 4 aqui e a régua reaparece sozinha.
  // Candidatos que já são fato e não dependem de confirmação: "7" produtos que
  // só conversam por HTTP, "4" bancos no motor de simulação.
  numeros: [],

  galeria: [
    {
      titulo: { pt: 'As outras telas' },
      prints: [
        {
          arquivo: '01-visao-geral.png',
          largura: 1897,
          altura: 938,
          alt: { pt: 'Painel do lojista com os indicadores de estoque e de tráfego.' },
          legenda: { pt: 'O painel do lojista.' },
        },
        {
          arquivo: '05-estoque.jpg',
          largura: 1568,
          altura: 772,
          alt: { pt: 'Estoque de motos com preço e situação de cada uma.' },
          legenda: { pt: 'Estoque: preço, custo e situação.' },
        },
        {
          arquivo: '06-resultado.jpg',
          largura: 1568,
          altura: 726,
          alt: { pt: 'Vendas confirmadas, receita e margem do mês.' },
          legenda: { pt: 'Resultado do mês.' },
        },
      ],
    },
  ],

  // O botão secundário do comp ("Ver o catálogo público") depende de uma URL
  // que ninguém confirmou. Link sem href é recusado pelo contrato, então ele
  // fica de fora até a URL existir.
  links: [
    { rotulo: { pt: 'Entrar no sistema' }, href: 'https://revyapp.com.br', primario: true },
  ],

  tecnico: {
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Playwright', 'Docker', 'Cloudflare Pages'],
    notas: [
      {
        titulo: { pt: 'Sete produtos, não um sistema' },
        texto: [
          {
            pt: 'O monorepo tem sete produtos que só conversam por HTTP. Nenhum importa Python do outro, e cada um tem banco e migrations próprios. É a decisão de engenharia mais forte do projeto, e é o que sustenta o resto: o chatbot cair não derruba o estoque.',
          },
        ],
      },
      {
        titulo: { pt: 'O motor de simulação dirige o site do banco' },
        texto: [
          {
            pt: 'Banco que não oferece API não deixa alternativa elegante. Em vez de fingir uma integração que não existe, o motor abre o site do banco no Playwright e preenche o formulário — Santander, Fontecred, Bradesco, Pan. É a solução feia que funciona, e vale contar como tal.',
          },
        ],
      },
    ],
  },
}
```

- [ ] **Passo 4: rodar e ver passar**

Rode: `npm test -- test/conteudo.test.ts`
Esperado: 6 testes passando.

- [ ] **Passo 5: conferir que os arquivos de print existem mesmo**

Rode: `ls public/prints/revy/`
Esperado: `01-visao-geral.png`, `02-agente-whatsapp.png`, `03-atendimento-lista.jpg`,
`04-conversa-agente.jpg`, `05-estoque.jpg`, `06-resultado.jpg`.

- [ ] **Passo 6: commit**

```bash
git add content/projetos/revy.ts test/conteudo.test.ts
git commit -m "feat: conteudo da Revy, com os numeros de vitrine como slot"
```

---

## Tarefa 5: Conteúdo do BDDente — o caso sem link

Segundo projeto, e o primeiro dos dois fechados. Destaque com um print só
(`.placa-larga` no comp P2), quatro números, três notas técnicas com trechos de
código em monoespaçada.

**Arquivos:**
- Criar: `content/projetos/bddente.ts`
- Modificar: `test/conteudo.test.ts`

**Interfaces:**
- Consome: `Projeto`, `validarProjeto`.
- Produz: `export const bddente: Projeto`.

- [ ] **Passo 1: acrescentar o bloco de teste**

```ts
// no fim de test/conteudo.test.ts
import { bddente } from '@/content/projetos/bddente'

describe('bddente', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(bddente)).toEqual([])
  })

  it('não tem link nenhum — prontuário de clínica real não tem tela pública', () => {
    expect(bddente.links).toEqual([])
    expect(bddente.semLink?.curto.pt).toMatch(/fechado/i)
  })

  it('tem destaque com um print só', () => {
    expect(bddente.destaque?.prints).toHaveLength(1)
  })

  it('tem quatro números', () => {
    expect(bddente.numeros).toHaveLength(4)
  })

  it('tem três notas técnicas', () => {
    expect(bddente.tecnico.notas).toHaveLength(3)
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/conteudo.test.ts`
Esperado: FALHA no import de `@/content/projetos/bddente`.

- [ ] **Passo 3: escrever `content/projetos/bddente.ts`**

Texto de `mockups/p2-projeto-bddente.html`. Os trechos que estão em `<code>` no
comp entram aqui envolvidos em crase simples — o componente de nota renderiza
crase como `<code>` (ver Tarefa 15).

```ts
import type { Projeto } from '@/content/tipos'

export const bddente: Projeto = {
  slug: 'bddente',
  nome: 'BDDente',
  paraQuem: { pt: 'Consultório odontológico' },
  situacao: 'no-ar',

  // Amostrada do item ativo do menu lateral em 01-agenda-semana.png.
  // fundo2 é um roxo vizinho mais escuro: roxo cheio numa página inteira cansa.
  tema: {
    fundo: '#5A21B4',
    texto: '#F4EEFC',
    borda: '#7E4EC0',
    destaque: '#D9C4F5',
    ctaFundo: '#FFFFFF',
    ctaTexto: '#4A1A8C',
    calmo: '#CBBCE8',
    fundo2: '#451890',
  },

  ficha: [
    { rotulo: { pt: 'Para quem' }, valor: { pt: 'Consultório odontológico' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'No ar, com uma clínica real usando' } },
    { rotulo: { pt: 'Substituiu' }, valor: { pt: 'Dentalis, em FoxPro, de 1996 a 2024' } },
  ],

  resumoHome: {
    pt: 'Substituiu um FoxPro que rodou no consultório de 1996 a 2024. Trinta anos de prontuário entraram junto — migração, LGPD e backup foram escopo do primeiro dia, não fase dois.',
  },

  chamada: {
    pt: 'Trinta anos de prontuário saíram de um sistema de 1996 — e o novo se recusa a mandar mensagem para quem nunca foi perguntado.',
  },

  problema: [
    {
      pt: 'O consultório rodou num sistema em FoxPro de 1996 a 2024. Ele parou de ser usável, e junto com ele ficaram presos o cadastro de 5.559 pacientes e 44.812 lançamentos clínicos — o que cada um tinha, o que foi feito, quando e por quanto.',
    },
    {
      pt: 'Trocar de sistema aqui não é começar do zero: é levar trinta anos de prontuário para o outro lado sem perder e sem inventar nada. Por isso migração, LGPD e backup foram escopo do primeiro dia, não fase 2 — o sistema entrou em uso real já com prontuário de gente dentro, e não existe "depois a gente arruma" nesse caso.',
    },
  ],

  oQueFaz: [
    {
      pt: 'É o consultório inteiro numa tela só: prontuário, agenda e dinheiro. O odontograma desenha a arcada completa e guarda, dente por dente e face por face, o que está planejado, o que já foi feito e o que já estava lá antes de a atual responsável assumir.',
    },
    {
      pt: 'A agenda marca e atende por semana ou por mês. O financeiro separa duas coisas que costumam ser confundidas — o que foi produzido no mês e o dinheiro que de fato entrou. Anamnese, prontuário em PDF, backup com restauração testada.',
    },
  ],

  destaque: {
    titulo: { pt: 'Quem pode receber mensagem — e quem nunca foi perguntado' },
    texto: [
      {
        pt: 'A agenda diz, consulta por consulta, quem está autorizado a receber o lembrete de véspera. São três respostas, não duas: tem permissão, não tem, e — a que importa — *nunca foi perguntado*. Os 5.559 pacientes que vieram do sistema antigo entraram assim, porque o FoxPro nunca perguntou, e presumir autorização de 5.559 pessoas é exatamente o que a lei não permite. O botão "perguntar" é como isso vira sim ou não, uma pessoa por vez, com ela na cadeira.',
      },
      {
        pt: 'O envio em si está construído e desligado. A tarja no alto da tela é o próprio sistema avisando que ninguém está sendo lembrado da consulta hoje: a chave nasce fechada e só abre quando a clínica conectar o WhatsApp. Um sistema que herda 5.559 cadastros e escolhe não mandar nada para nenhum deles até perguntar.',
      },
    ],
    prints: [
      {
        arquivo: '01-agenda-semana.png',
        largura: 3200,
        altura: 2000,
        alt: {
          pt: 'Agenda da semana em grade por hora, com uma tarja amarela no topo avisando que os lembretes de WhatsApp estão desligados e ninguém está sendo avisado da consulta. Nos cartões de consulta aparecem os três estados: alguns só com nome, horário e telefone, um marcado «sem lembrete» por não ter telefone, e outros marcados «sem permissão de WhatsApp» com um botão «perguntar».',
        },
        legenda: {
          pt: 'A agenda da semana. A tarja no topo é o sistema admitindo que o lembrete está desligado; nos cartões, "sem lembrete" é paciente sem telefone cadastrado, e "sem permissão de WhatsApp · perguntar" é paciente que ainda não foi perguntado. Consulta cancelada aparece riscada.',
        },
      },
    ],
  },

  // Diferente da Revy: estes quatro saem do README do projeto, não de seed
  // inventado, então entram como fato. O levantamento ainda lista "confirmar
  // se 914 e 44.812 podem virar vitrine" — se o dono disser que não, o
  // conserto é o mesmo da Revy: `numeros: []` e a régua some sozinha.
  numeros: [
    { valor: '~30', rotulo: { pt: 'anos de histórico migrados' } },
    { valor: '5.559', rotulo: { pt: 'pacientes no cadastro histórico' } },
    { valor: '44.812', rotulo: { pt: 'lançamentos clínicos migrados' } },
    { valor: '914', rotulo: { pt: 'testes passando' } },
  ],

  galeria: [
    {
      titulo: { pt: 'As outras telas' },
      prints: [
        {
          arquivo: '02-odontograma.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Odontograma: as duas arcadas completas em numeração FDI, com dentes contornados em vermelho (planejado), verde (realizado) e azul (já existente), o painel de lançamento aberto à direita com categoria, faces da coroa e situação, e o histórico de atendimentos por data logo abaixo.',
          },
          legenda: {
            pt: 'O odontograma. Vermelho é planejado, verde é realizado, azul é o que já estava lá.',
          },
        },
        {
          arquivo: '03-pacientes.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Lista de pacientes com idade, telefone, data do último atendimento, convênio, quantos tratamentos pendentes e quanto há a fazer em reais, com filtros por ativos, com pendência e com tratamento a fazer.',
          },
          legenda: {
            pt: 'A lista de pacientes, com quem tem tratamento pendente separado de quem não tem.',
          },
        },
        {
          arquivo: '05-financeiro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Financeiro do mês com quatro cartões — recebido, produzido, a receber e tratamentos realizados — e o gráfico de barras do dinheiro recebido mês a mês no ano.',
          },
          legenda: {
            pt: 'Financeiro: recebido e produzido raramente batem no mesmo mês, e a tela diz isso em vez de esconder.',
          },
        },
      ],
    },
  ],

  // Sistema fechado. O componente mostra o motivo no lugar dos botões.
  links: [],
  semLink: {
    curto: { pt: 'Sistema fechado — prontuário de clínica real.' },
    titulo: { pt: 'Sistema fechado' },
    texto: {
      pt: 'Aqui dentro tem prontuário de gente de verdade. Não existe demonstração aberta nem tela de entrada pública — o que dá para ver do sistema são os prints desta página, feitos com pacientes inventados.',
    },
  },

  tecnico: {
    stack: ['Python', 'FastAPI', 'SQLAlchemy 2', 'Alembic', 'PostgreSQL 16', 'argon2', 'Fly.io'],
    notas: [
      {
        titulo: { pt: 'Consentimento com três estados' },
        texto: [
          {
            pt: 'O campo `aceita_whatsapp` aceita `NULL`, e `NULL` não é "não": é nunca perguntamos. Os 5.559 pacientes migrados entraram assim, e nenhum recebe mensagem nesse estado. Foi a decisão mais difícil de implementar e a mais fácil de explicar para a clínica.',
          },
        ],
      },
      {
        titulo: { pt: 'Idempotência no banco, não num `if`' },
        texto: [
          {
            pt: 'Um `UniqueConstraint(agendamento_id, tipo)` na tabela `lembrete`: a segunda linha é recusada pelo banco. Vale se o cron disparar duas vezes, se houver duas máquinas no ar durante um deploy, e se alguém clicar em "enviar agora" enquanto o cron roda.',
          },
        ],
      },
      {
        titulo: { pt: 'Dado suspeito é marcado, nunca corrigido no chute' },
        texto: [
          {
            pt: 'Trinta anos de FoxPro produzem registro ambíguo. Em vez de adivinhar, o paciente e o lançamento carregam `revisar_motivo` e ficam sinalizados. Toda escrita ainda deixa linha em `auditoria`, com o antes e o depois — é exigência de LGPD e a única forma de responder quem mudou o prontuário e quando.',
          },
        ],
      },
    ],
  },
}
```

- [ ] **Passo 4: rodar e ver passar**

Rode: `npm test -- test/conteudo.test.ts`
Esperado: 11 testes passando.

- [ ] **Passo 5: commit**

```bash
git add content/projetos/bddente.ts test/conteudo.test.ts
git commit -m "feat: conteudo do BDDente, o caso sem link"
```

---

## Tarefa 6: Conteúdo do Office Timesheet — sem link, sem print de destaque, e a única página clara

Terceiro projeto, e o que mais estica o contrato: nenhum link, um destaque cujo
print não existe, um print de abertura no lugar dele, e a galeria em duas
fileiras com títulos diferentes.

**Arquivos:**
- Criar: `content/projetos/office-timesheet.ts`
- Modificar: `test/conteudo.test.ts`

**Interfaces:**
- Consome: `Projeto`, `validarProjeto`.
- Produz: `export const officeTimesheet: Projeto`.

**Sobre o print que falta.** A `AGENT_API_KEY` do `.env` local do
office-timesheet responde `403 Forbidden`, então não existe captura da tela
`/assistente`. O comp P3 foi desenhado já sabendo disso: a feature é contada
pela lista dos 17 tools de leitura, que é a imagem. Quando a chave aparecer,
acrescentar um `Print` a `destaque.prints` e o layout absorve sozinho.

- [ ] **Passo 1: acrescentar o bloco de teste**

```ts
// no fim de test/conteudo.test.ts
import { officeTimesheet } from '@/content/projetos/office-timesheet'

describe('office-timesheet', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(officeTimesheet)).toEqual([])
  })

  it('não tem link — é sistema interno do escritório', () => {
    expect(officeTimesheet.links).toEqual([])
    expect(officeTimesheet.semLink?.titulo.pt).toBe('Sem link para entrar')
  })

  // Slot: quando o print do /assistente existir, isto vira toHaveLength(1).
  it('tem destaque sem print, porque a captura do assistente está bloqueada', () => {
    expect(officeTimesheet.destaque?.prints).toEqual([])
  })

  it('conta o assistente pela lista dos 17 tools de leitura', () => {
    expect(officeTimesheet.destaque?.lista?.itens).toHaveLength(17)
  })

  it('tem as três amarras do assistente', () => {
    expect(officeTimesheet.destaque?.amarras).toHaveLength(3)
  })

  it('abre com o print do quadro de tarefas, já que o destaque não tem imagem', () => {
    expect(officeTimesheet.printAbertura?.arquivo).toBe('03-tarefas-kanban.png')
  })

  it('tem a galeria em duas fileiras nomeadas', () => {
    expect(officeTimesheet.galeria).toHaveLength(2)
    expect(officeTimesheet.galeria.map((f) => f.prints.length)).toEqual([3, 3])
  })

  it('é a única paleta clara, e o laranja passa raspando', () => {
    expect(officeTimesheet.tema.fundo).toBe('#ECECEC')
    expect(officeTimesheet.tema.destaque).toBe('#CB6D31')
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/conteudo.test.ts`
Esperado: FALHA no import de `@/content/projetos/office-timesheet`.

- [ ] **Passo 3: escrever `content/projetos/office-timesheet.ts`**

```ts
import type { Projeto } from '@/content/tipos'

export const officeTimesheet: Projeto = {
  slug: 'office-timesheet',
  nome: 'Office Timesheet',
  paraQuem: { pt: 'Escritório de arquitetura' },
  situacao: 'fechado',

  // Amostrada de 03-tarefas-kanban.png: fundo cinza claro, topo verde-escuro,
  // laranja queimado nos marcadores. Este sistema não é azul — o #2563EB que a
  // versão anterior da spec trazia não existe no produto.
  // Única página clara do site, então fundo2 sobe para o branco.
  tema: {
    fundo: '#ECECEC',
    texto: '#1D2724',
    borda: '#C9CFCC',
    destaque: '#CB6D31',
    ctaFundo: '#2E3D38',
    ctaTexto: '#FFFFFF',
    calmo: '#55605C',
    fundo2: '#FFFFFF',
  },

  ficha: [
    { rotulo: { pt: 'Para quem' }, valor: { pt: 'Escritório de arquitetura' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'Sistema fechado, interno do escritório' } },
    { rotulo: { pt: 'Tamanho' }, valor: { pt: '26 páginas, 4 papéis de acesso' } },
  ],

  resumoHome: {
    pt: 'Saber onde o tempo da equipe foi parar e quanto cada projeto custou. Tem um assistente que responde as perguntas chatas de segunda-feira sem ninguém abrir sete telas.',
  },

  chamada: {
    pt: 'O escritório de arquitetura descobre onde o tempo da equipe foi parar — e quanto cada projeto custou — sem depender de planilha.',
  },

  problema: [
    {
      pt: 'Num escritório de arquitetura, a hora trabalhada é o que se vende. Só que ela fica espalhada: cada pessoa em vários projetos no mesmo dia, cada projeto em várias etapas, e o registro disso vivendo numa planilha.',
    },
    {
      pt: 'No fim do mês, ninguém consegue responder com segurança as duas perguntas que importam — onde o tempo da equipe foi parar, e quanto cada projeto custou de verdade.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Marcar hora por projeto sem planilha: abre o projeto, clica em apontar horas, o cronômetro roda, pausa no almoço, retoma, encerra.',
    },
    {
      pt: 'Tocar os projetos: cada um tem as quatro etapas — Levantamento, Estudo Preliminar, Anteprojeto, Projeto Executivo — e um quadro de tarefas com responsável, prazo e cronômetro por tarefa.',
    },
    {
      pt: 'E fechar o mês: o admin vê quanto a equipe trabalhou e quanto cada projeto custou, e resolve numa fila só as três coisas que precisam de gente — correção de ponto, reembolso de despesa e pedido de férias. Em volta disso, um cadastro que junta colaboradores, clientes e fornecedores, e uma agenda com férias, feriados, prazos e o Google Calendar de cada um.',
    },
  ],

  // O destaque desta página não tem imagem, então o quadro de tarefas abre a
  // página logo abaixo da chamada. É também de onde a cor foi amostrada.
  printAbertura: {
    arquivo: '03-tarefas-kanban.png',
    largura: 3200,
    altura: 2000,
    alt: {
      pt: 'Quadro de tarefas com cinco colunas — A fazer, Fazendo, Falta info, Em revisão e Concluído. Cada cartão traz o projeto, a etapa, o responsável, as horas já contadas, o prazo e um botão Contar horas.',
    },
    legenda: {
      pt: 'O quadro de tarefas, com todas as tarefas de todos os projetos. O marcador laranja de cada cartão é de onde saiu a cor desta página.',
    },
  },

  destaque: {
    titulo: { pt: 'O assistente, e as 17 perguntas que ele sabe responder' },
    texto: [
      {
        pt: 'Um assistente construído com DeepSeek, dentro do sistema. Em vez de abrir sete telas para montar a resposta, a pessoa pergunta.',
      },
      {
        pt: 'A lista dos tools de leitura explica melhor do que qualquer descrição para que ele serve: são as perguntas chatas de segunda-feira, cada uma virada função.',
      },
    ],
    // SLOT: a AGENT_API_KEY do .env local responde 403, então não há captura da
    // tela /assistente. Com a chave válida, um Print entra aqui e o componente
    // passa a mostrar imagem sem mais nenhuma mudança.
    prints: [],
    lista: {
      rotulo: { pt: 'O que ele lê' },
      itens: [
        'quemNaoApontou',
        'tasksTravadas',
        'cargaEquipe',
        'feriasEConflitos',
        'custoPorProjeto',
        'aprovacoesPendentes',
        'apontamentosAbertos',
        'andamentoDeProjeto',
        'despesasDoPeriodo',
        'agendaDoPeriodo',
        'simulacaoPerformance',
        'gerarRelatorio',
        'statusProjeto',
        'listarEquipe',
        'bonusDoPeriodo',
        'meusBonus',
        'aniversariantes',
      ],
    },
    amarras: [
      {
        titulo: { pt: 'Ele propõe, não executa' },
        texto: [
          {
            pt: 'Nada é escrito no sistema pelo assistente. Ele monta a proposta, e a pessoa aprova ou descarta.',
          },
        ],
      },
      {
        titulo: { pt: 'Não é um canal privilegiado' },
        texto: [
          {
            pt: 'Cada pessoa alcança pelo assistente exatamente o que alcançaria navegando o site. A mesma régua de permissão vale nos dois caminhos.',
          },
        ],
      },
      {
        titulo: { pt: 'Cada resposta declara suas fontes' },
        texto: [
          {
            pt: 'No rodapé da resposta vai a lista de quais leituras a produziram. Dá para conferir em vez de acreditar.',
          },
        ],
      },
    ],
  },

  numeros: [
    { valor: '1.452', rotulo: { pt: 'casos de teste, contra Postgres real no CI' } },
    { valor: '148', rotulo: { pt: 'endpoints HTTP' } },
    { valor: '40', rotulo: { pt: 'tabelas no banco' } },
    // O comp P3 escreve "34 · 17 de leitura, 15 de escrita", e 17+15 dá 32.
    // O levantamento explica o resto: 34 = 17 leitura + 15 escrita + SQL
    // ad-hoc + meta. Conta errada na tela é pior que rótulo comprido.
    { valor: '34', rotulo: { pt: 'tools no assistente, 17 deles só de leitura' } },
  ],

  galeria: [
    {
      titulo: { pt: 'O dia de quem aponta' },
      prints: [
        {
          arquivo: '02-registro-horas-projetos.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Lista de projetos em cartões, cada um com o cliente, a contagem de tarefas por coluna e o botão Apontar horas; num deles o cronômetro está rodando, com pausar e encerrar ao lado.',
          },
          legenda: { pt: 'Os projetos da pessoa, e o cronômetro rodando num deles.' },
        },
        {
          arquivo: '04-projeto-etapas-e-quadro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Página de um projeto: as quatro etapas em régua no topo, cada uma com prazo e horas acumuladas, o briefing, o quadro de tarefas do projeto e, na coluna da direita, contratante e horas do mês.',
          },
          legenda: { pt: 'Um projeto por dentro: etapas, briefing e o quadro só dele.' },
        },
        {
          arquivo: '07-agenda-equipe.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Agenda em vista de mês com férias da equipe, feriados, prazos de tarefa e quem está no escritório; à esquerda, a conexão com o Google Calendar e as agendas ligadas.',
          },
          legenda: { pt: 'A agenda junta férias, feriados, prazos e o Google Calendar.' },
        },
      ],
    },
    {
      titulo: { pt: 'O fechamento do mês' },
      prints: [
        {
          arquivo: '08-dashboard-admin.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Visão geral da operação: horas da equipe no período, quem está com cronômetro rodando agora, a lista da equipe com horas e número de projetos, e a coluna Precisa de você com os pedidos e os botões aprovar e rejeitar.',
          },
          legenda: { pt: 'A visão do admin, com quem está trabalhando agora.' },
        },
        {
          arquivo: '11-aprovacoes.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Tela de aprovações em três colunas: correções de apontamento, despesas e pedidos de férias, cada item com a justificativa de quem pediu e os botões aprovar e rejeitar.',
          },
          legenda: { pt: 'A fila única: ponto, despesa e férias no mesmo lugar.' },
        },
        {
          arquivo: '13-relatorio-financeiro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Relatório financeiro por período: total a pagar, custo de horas, despesas aprovadas e bônus, com as tabelas de maiores pagamentos por colaborador e de projetos com maior custo, em horas e em reais.',
          },
          legenda: { pt: 'Quanto custou o período, por pessoa e por projeto.' },
        },
      ],
    },
  ],

  links: [],
  semLink: {
    curto: { pt: 'Sistema fechado — interno do escritório.' },
    titulo: { pt: 'Sem link para entrar' },
    texto: {
      pt: 'É um sistema interno: não tem área pública nem conta de visitante. O que dá para mostrar aqui são os prints.',
    },
  },

  tecnico: {
    stack: [
      'Node 20',
      'Express 5',
      'PostgreSQL 16',
      'React 19',
      'Vite 6',
      'Tailwind',
      'DeepSeek',
      'Fly.io',
      'GitHub Actions',
    ],
    notas: [
      {
        titulo: { pt: 'Os quinze tools de escrita começam com `propor`' },
        texto: [
          {
            pt: 'Nenhum se chama `criar` ou `aprovar`: `proporCriarTask`, `proporAprovarDespesa`, `proporPedirFerias`, e assim os quinze. A regra não está num comentário nem numa checagem solta — está no nome de cada função que o modelo pode chamar. Escrever direto é uma coisa que não existe para ele.',
          },
        ],
      },
      {
        titulo: { pt: 'A regra vive no banco, não só no código' },
        texto: [
          {
            pt: 'Índice único parcial garantindo um apontamento aberto por pessoa, `EXCLUDE` barrando férias sobrepostas, um pedido pendente por apontamento e `ON DELETE RESTRICT` entre apontamento e projeto. Onde não dá para burlar.',
          },
        ],
      },
      {
        titulo: { pt: 'O valor/hora congela no apontamento' },
        texto: [
          {
            pt: 'O custo de uma hora é gravado no momento em que ela é apontada. Aumento de salário depois não reescreve o custo do que já passou, e o relatório de um mês fechado continua dando o mesmo número no ano que vem.',
          },
        ],
      },
    ],
  },
}
```

- [ ] **Passo 4: rodar e ver passar**

Rode: `npm test -- test/conteudo.test.ts`
Esperado: 19 testes passando.

- [ ] **Passo 5: commit**

```bash
git add content/projetos/office-timesheet.ts test/conteudo.test.ts
git commit -m "feat: conteudo do Office Timesheet, com o print do assistente como slot"
```

---

## Tarefa 7: Conteúdo do Autotune, o índice, e o teste que roda em cima das quatro paletas reais

Quarto projeto: galeria vazia, paleta atribuída, e o bloco de terminal. Fecha o
conteúdo e liga o teste de contraste às paletas de verdade — até aqui ele só
rodou em fixture.

**Arquivos:**
- Criar: `content/projetos/autotune.ts`, `content/indice.ts`
- Criar teste: `test/temas.test.ts`
- Modificar: `test/conteudo.test.ts`

**Interfaces:**
- Consome: `Projeto`, `validarProjeto`, `verificarTema`, os quatro conteúdos.
- Produz:
  - `export const autotune: Projeto`
  - `export const projetos: Projeto[]` — a ordem das faixas na home
  - `export function projetoPorSlug(slug: string): Projeto | undefined`

- [ ] **Passo 1: escrever `test/temas.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { verificarTema } from '@/lib/contraste'
import { validarProjeto } from '@/content/tipos'
import { projetos, projetoPorSlug } from '@/content/indice'

describe('as quatro paletas reais', () => {
  it('a home tem exatamente quatro faixas, nesta ordem', () => {
    expect(projetos.map((p) => p.slug)).toEqual([
      'revy',
      'bddente',
      'office-timesheet',
      'autotune',
    ])
  })

  it.each(['revy', 'bddente', 'office-timesheet', 'autotune'])(
    '%s passa no contraste',
    (slug) => {
      const projeto = projetoPorSlug(slug)!
      expect(verificarTema(slug, projeto.tema)).toEqual([])
    },
  )

  it.each(['revy', 'bddente', 'office-timesheet', 'autotune'])(
    '%s passa no contrato',
    (slug) => {
      expect(validarProjeto(projetoPorSlug(slug)!)).toEqual([])
    },
  )

  it('nenhum slug se repete', () => {
    expect(new Set(projetos.map((p) => p.slug)).size).toBe(projetos.length)
  })

  it('devolve undefined para slug que não existe', () => {
    expect(projetoPorSlug('gastos-do-mes')).toBeUndefined()
  })
})
```

- [ ] **Passo 2: acrescentar o bloco do Autotune em `test/conteudo.test.ts`**

```ts
// no fim de test/conteudo.test.ts
import { autotune } from '@/content/projetos/autotune'

describe('autotune', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(autotune)).toEqual([])
  })

  // Só existem quatro prints e dois são matplotlib no default: o peso vai
  // para o destaque e para o bloco técnico.
  it('não tem galeria', () => {
    expect(autotune.galeria).toEqual([])
  })

  it('tem o par de motores no destaque, cada placa com etiqueta e latência', () => {
    expect(autotune.destaque?.prints).toHaveLength(2)
    expect(autotune.destaque?.prints.map((p) => p.valor)).toEqual(['61,72 ms', '0,18 ms'])
  })

  it('fecha o destaque com a leitura da comparação', () => {
    expect(autotune.destaque?.fecho?.pt).toContain('340')
  })

  it('tem o terminal como texto, não como print', () => {
    expect(autotune.tecnico.terminal?.comando).toContain('autotune.exe')
    expect(autotune.tecnico.terminal?.saida).toContain('Correcao planejada')
  })

  it('tem quatro notas técnicas', () => {
    expect(autotune.tecnico.notas).toHaveLength(4)
  })

  it('usa uma paleta atribuída, não amostrada de print nenhum', () => {
    expect(autotune.tema.destaque).toBe('#F3B843')
  })
})
```

- [ ] **Passo 3: rodar e ver falhar**

Rode: `npm test`
Esperado: FALHA nos imports de `@/content/projetos/autotune` e `@/content/indice`.

- [ ] **Passo 4: escrever `content/projetos/autotune.ts`**

Texto de `mockups/p4-projeto-autotune.html`.

```ts
import type { Projeto } from '@/content/tipos'

export const autotune: Projeto = {
  slug: 'autotune',
  nome: 'Autotune',
  paraQuem: { pt: 'Trabalho de conclusão, PUCRS' },
  situacao: 'publicado',

  // A ÚNICA paleta atribuída do site. O plugin real é menta #2EE6A0 sobre
  // #0D1512, que repetia a dupla da Revy; os gráficos do TCC são o azul default
  // do matplotlib. O âmbar não existe em print nenhum — foi atribuído em
  // 04/09/2026, e a seção 2 da spec foi reescrita para permitir isso.
  // fundo3 é a placa onde os prints ficam: o menta deles não encosta no âmbar.
  tema: {
    fundo: '#10312F',
    texto: '#E4F2F0',
    borda: '#2A5A56',
    destaque: '#F3B843',
    ctaFundo: '#F3B843',
    ctaTexto: '#10312F',
    calmo: '#9FBCB8',
    fundo2: '#0D2827',
    fundo3: '#0A211F',
  },

  ficha: [
    { rotulo: { pt: 'O que é' }, valor: { pt: 'Parte prática do TCC, PUCRS' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'Publicado, código aberto' } },
    {
      rotulo: { pt: 'Entrega' },
      valor: {
        pt: 'Executáveis de linha de comando, núcleo de streaming header-only e plugin VST3 / Standalone',
      },
    },
    { rotulo: { pt: 'Testado em' }, valor: { pt: 'Ableton Live' } },
  ],

  resumoHome: {
    pt: 'O que o Auto-Tune faz, feito do zero em C++. Dois motores de correção com o mesmo deslocamento: um preserva a voz da pessoa, o outro preserva a latência.',
  },

  chamada: {
    pt: 'Um corretor de afinação vocal em tempo real, feito do zero em C++ — com dois motores de correção que resolvem a mesma nota de dois jeitos opostos.',
  },

  problema: [
    {
      pt: 'Corrigir a afinação de uma voz parece um problema só, e são dois. Quem está cantando precisa se ouvir corrigido no fone, na hora — qualquer atraso perceptível atrapalha o próprio take. Quem está mixando uma gravação antiga não tem pressa nenhuma, mas não aceita que a voz saia descaracterizada.',
    },
    {
      pt: 'Os dois pedidos puxam para lados opostos, e é comum ver o assunto tratado como se houvesse uma resposta única.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Encontra a nota que está sendo cantada com pYIN — o YIN probabilístico, com HMM e Viterbi —, compara com a escala escolhida e desloca o sinal para a nota alvo.',
    },
    {
      pt: 'O deslocamento é o mesmo nos dois casos; o que muda é quem executa. Assumir isso na interface, e deixar a escolha com quem está cantando, é o que o trabalho defende. Junto vêm os controles de tessitura, tônica e escala, e a correção regulada por Retune Speed, tolerância em cents, Natural Vibrato e Humanize.',
    },
  ],

  destaque: {
    titulo: { pt: 'Dois motores para a mesma correção' },
    texto: [
      {
        pt: 'O sistema encontra a nota com pYIN e corrige por um de dois motores de síntese, com o mesmo deslocamento. Um deles preserva os formantes: a voz continua soando como a pessoa. O outro preserva a latência: oito amostras fixas, e o cantor se escuta corrigido enquanto canta. Escolher entre os dois é a principal contribuição de engenharia do trabalho.',
      },
    ],
    prints: [
      {
        arquivo: '05-plugin-cantando-psola.png',
        largura: 637,
        altura: 455,
        // Nome de motor é nome, não código: fica em Archivo, não em mono.
        etiqueta: { pt: 'TD-PSOLA' },
        valor: '61,72 ms',
        alt: {
          pt: 'O plugin corrigindo ao vivo com TD-PSOLA, Low Latency desmarcado: nota-alvo E3, cantado 154,0 Hz contra alvo 164,8 Hz, correção de +118 cents, o gráfico cheio com a voz sendo corrigida, e latência de 61,72 ms no rodapé.',
        },
        legenda: {
          pt: 'O motor padrão, corrigindo. E3 na mira: cantado a 154,0 Hz, alvo 164,8 Hz, +118 cents. Ele reconstrói o sinal preservando os formantes — a voz continua soando como a pessoa —, e cobra 61,72 ms por isso. Corrigindo uma faixa já gravada, esse é o motor certo: o formante importa mais que a latência.',
        },
      },
      {
        arquivo: '01-plugin-cantando-v3.png',
        largura: 639,
        altura: 458,
        etiqueta: { pt: 'Ponteiro móvel (v3)' },
        valor: '0,18 ms',
        // O comp da home abre a faixa do Autotune com este print, não com o
        // TD-PSOLA que vem primeiro no destaque.
        naFaixa: true,
        alt: {
          pt: 'O mesmo plugin corrigindo voz ao vivo, com Low Latency marcado e o cabeçalho pYIN para ponteiro móvel (v3): nota-alvo F3, cantado 170,9 Hz contra alvo 174,6 Hz, correção de mais 38 cents, o gráfico cheio com a linha de correção ao longo do tempo e a latência de 0,18 ms.',
        },
        legenda: {
          pt: 'O mesmo plugin, o mesmo cantor, com Low Latency marcado. F3 na mira: cantado a 170,9 Hz, alvo 174,6 Hz, correção de +38 cents ao vivo. São 8 amostras fixas de atraso. Monitorando a própria voz, 61 ms é intolerável — aqui esse problema some.',
        },
      },
    ],
    fecho: {
      pt: 'Mesmo plugin, mesmo cantor, dois números de latência separados por um fator de *340*. Não existe motor certo: existe o que o cantor precisa naquele take.',
    },
  },

  numeros: [
    { valor: '61,72 ms', rotulo: { pt: 'TD-PSOLA, preserva os formantes' } },
    { valor: '0,18 ms', rotulo: { pt: 'ponteiro móvel, 8 amostras fixas' } },
    { valor: '340×', rotulo: { pt: 'de diferença entre os dois motores' } },
  ],

  // Sem galeria: dos quatro prints, dois estão no destaque e dois são
  // matplotlib no default e não separam nada.
  galeria: [],

  // A confirmar com o dono quais repositórios entram: TCC_autotune_cpp,
  // TCC-autotune-python, TCC-TEXT. Os dois abaixo saem do comp P4; se alguma
  // URL estiver errada, o contrato recusa href vazio e a build aponta.
  links: [
    {
      rotulo: { pt: 'Ver o protótipo em C++' },
      href: 'https://github.com/gacherubini/TCC_autotune_cpp',
      primario: true,
    },
    {
      rotulo: { pt: 'Ver o estudo de detecção de pitch' },
      href: 'https://github.com/gacherubini/TCC-autotune-python',
    },
  ],

  tecnico: {
    stack: ['C++', 'JUCE', 'VST3', 'pYIN', 'TD-PSOLA', 'dr_wav', 'CMake', 'Python'],

    // O CLI vai como texto, não como print: fica nítido em qualquer tela, dá
    // para selecionar, e o leitor de tela lê.
    terminal: {
      comando: 'autotune.exe exemplo-antes.wav saida.wav 1.0 Am tol=15 glide=40',
      saida: [
        'Sinal: 5.00 s | 44100 Hz | mix=1.00',
        'Escala: Am  (notas alvo: C D E F G A B )',
        'tol=15 ct | retune=40 ms | vibrato=1.00 | humanize=0.00',
        '',
        'Correcao planejada (1 leitura por segundo):',
        '  t=  1.0s   376.2 Hz -> G4   ( 388.6 Hz)  correcao   +56 ct',
        '  t=  2.0s   371.9 Hz -> G4   ( 388.6 Hz)  correcao   +76 ct',
        '  t=  3.0s   278.6 Hz -> D4   ( 291.1 Hz)  correcao   +76 ct',
        '  t=  4.0s   194.7 Hz -> G3   ( 194.7 Hz)  correcao    +0 ct',
        '',
        'real  0m0.207s',
      ].join('\n'),
      legenda: {
        pt: 'O mesmo núcleo roda fora do plugin, por linha de comando. Cinco segundos de áudio em *0,207 s* — cerca de 24× mais rápido que o tempo real.',
      },
    },

    notas: [
      {
        titulo: { pt: 'Um núcleo, três entregas' },
        texto: [
          {
            pt: 'O núcleo de streaming é header-only, e é o mesmo código nos três lugares: nos executáveis de linha de comando, no plugin VST3 e no Standalone. Build por CMake, leitura de WAV com `dr_wav`, interface e empacotamento com JUCE.',
          },
          {
            pt: 'O plugin foi validado no Ableton Live, que é onde a conta de latência deixa de ser teórica.',
          },
        ],
      },
      {
        titulo: { pt: 'A escolha do pYIN veio de um estudo, não de um chute' },
        texto: [
          {
            pt: 'O segundo repositório, em Python, compara algoritmos de detecção de pitch antes de o C++ existir. É esse estudo que fundamenta a escolha do pYIN para o protótipo.',
          },
          { pt: 'É trabalho que não aparece na interface e sustenta tudo o que aparece.' },
        ],
      },
      {
        titulo: { pt: 'O que reprovou no teste de usuário' },
        texto: [
          {
            pt: 'O teste reprovou dois requisitos: latência e naturalidade — a voz saía "dura, robótica". O motor de ponteiro móvel (v3) responde à latência; a naturalidade foi atacada pelo Retune Speed com fusão do Glide, tolerância em cents e humanize.',
          },
          { pt: 'O README não esconde nenhum dos dois, e isso está registrado de propósito.' },
        ],
      },
      {
        titulo: { pt: 'A documentação corrige a própria documentação' },
        texto: [
          {
            pt: 'O projeto carrega uma errata da revisão bibliográfica e um documento (`analise-v1-v2-v3.md`) que existe só para corrigir dois números de latência errados em outros arquivos, aberto com o aviso "leia antes de citar qualquer número".',
          },
          {
            pt: 'Um trabalho que documenta os próprios erros vale mais que um que só mostra o que deu certo.',
          },
        ],
      },
    ],
  },
}
```

- [ ] **Passo 5: escrever `content/indice.ts`**

```ts
import type { Projeto } from '@/content/tipos'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { autotune } from '@/content/projetos/autotune'

/**
 * A ordem das faixas na home, fechada em 04/09/2026. O lado do print alterna
 * faixa a faixa para o olho não cansar — quem faz isso é o índice do array,
 * não um campo do projeto.
 */
export const projetos: Projeto[] = [revy, bddente, officeTimesheet, autotune]

export function projetoPorSlug(slug: string): Projeto | undefined {
  return projetos.find((p) => p.slug === slug)
}
```

- [ ] **Passo 6: rodar e ver passar**

Rode: `npm test`
Esperado: tudo verde, incluindo `temas.test.ts` medindo as quatro paletas reais.

- [ ] **Passo 7: provar que o portão morde de verdade**

Troque, só na memória do editor, o destaque do Office Timesheet de `#CB6D31`
para `#D98A55` e rode `npm run build`.
Esperado: Vitest falha com uma mensagem citando `office-timesheet`,
`destaque/fundo` e um valor abaixo de 3, e **o `next build` não roda**.
Desfaça a troca e confirme que volta a passar.

Este passo não é cerimônia: é a única prova de que o requisito da spec §3 está
de pé, e ele existe porque a folga do Office Timesheet é de 0,08.

- [ ] **Passo 8: commit**

```bash
git add content/projetos/autotune.ts content/indice.ts test/temas.test.ts test/conteudo.test.ts
git commit -m "feat: conteudo do Autotune e indice, com o contraste rodando nas quatro paletas"
```

---

## Tarefa 8: A casca — Archivo, tokens, marca, alternador e a abertura da home

A partir daqui o site aparece na tela. Esta tarefa entrega `/pt` e `/en` com o
topo claro e a frase de abertura, sem faixa nenhuma ainda.

**Arquivos:**
- Criar: `content/ui.ts`, `components/Marca.tsx`, `components/AlternadorIdioma.tsx`,
  `components/CabecalhoCasca.tsx`
- Modificar: `app/globals.css`, `app/[lang]/layout.tsx`, `app/[lang]/page.tsx`
- Criar teste: `test/componentes/casca.test.tsx`, `test/folha.test.ts`

**Interfaces:**
- Consome: `t`, `Idioma`, `ehIdioma`, `OPACIDADES_DE_TEXTO`, `OPACIDADES_NO_AZUL`.
- Produz:
  - `ui` — objeto de textos da casca, com `nav`, `abertura`, `situacao`,
    `verOProjeto`, `voltar`, `avisoTecnico`, `rodape`
  - `<Marca variante="casca" | "mono" | "branca" />`
  - `<AlternadorIdioma lang atual href />`
  - `<CabecalhoCasca lang />`

- [ ] **Passo 1: escrever `test/componentes/casca.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Marca } from '@/components/Marca'
import { CabecalhoCasca } from '@/components/CabecalhoCasca'

describe('Marca', () => {
  it('escreve o domínio inteiro', () => {
    render(<Marca variante="casca" />)
    expect(screen.getByText(/gacherubini/)).toBeInTheDocument()
    expect(screen.getByText('.dev')).toBeInTheDocument()
  })

  it('na casca o .dev fica azul da marca', () => {
    const { container } = render(<Marca variante="casca" />)
    expect(container.querySelector('.marca')).toHaveClass('marca--casca')
  })

  it('dentro de faixa colorida a marca é monocromática', () => {
    const { container } = render(<Marca variante="mono" />)
    expect(container.querySelector('.marca')).toHaveClass('marca--mono')
  })
})

describe('CabecalhoCasca', () => {
  it('leva Projetos e Sobre, e o Sobre é âncora e não rota', () => {
    render(<CabecalhoCasca lang="pt" />)
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '#sobre')
  })

  it('marca o idioma corrente e linka o outro', () => {
    render(<CabecalhoCasca lang="pt" />)
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en')
    expect(screen.getByText('PT')).toHaveAttribute('aria-current', 'true')
  })

  it('em inglês, inverte', () => {
    render(<CabecalhoCasca lang="en" />)
    expect(screen.getByRole('link', { name: 'PT' })).toHaveAttribute('href', '/pt')
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/componentes/casca.test.tsx`
Esperado: FALHA nos imports de `@/components/Marca` e `@/components/CabecalhoCasca`.

- [ ] **Passo 3: escrever `content/ui.ts`**

```ts
import type { Idioma, Situacao, Texto } from '@/content/tipos'

export const ui = {
  nav: {
    projetos: { pt: 'Projetos', en: 'Projects' },
    sobre: { pt: 'Sobre', en: 'About' },
  },
  abertura: {
    titulo: { pt: 'Os sistemas que eu construí.', en: 'The systems I built.' },
    apoio: {
      pt: 'Cada um com print, explicação em português comum e, quando o sistema é público, link para entrar e clicar.',
      en: 'Each one with screenshots, an explanation in plain language and, when the system is public, a link to go in and click around.',
    },
  },
  situacao: {
    'no-ar': { pt: 'no ar', en: 'live' },
    fechado: { pt: 'fechado', en: 'private' },
    publicado: { pt: 'publicado', en: 'published' },
    'em-construcao': { pt: 'em construção', en: 'in progress' },
  } satisfies Record<Situacao, Texto>,
  verOProjeto: { pt: 'Ver o projeto', en: 'See the project' },
  voltar: { pt: '← Todos os projetos', en: '← All projects' },
  sobreTitulo: { pt: 'Quem fez', en: 'Who built this' },
  avisoTecnico: {
    pt: 'Esta parte é pra quem é da área. Se não for o seu caso, pode pular — acabou aqui.',
    en: "This part is for the technical crowd. If that's not you, feel free to stop here.",
  },
  rodape: {
    lugar: { pt: 'Gabriel Cherubini · Porto Alegre · GMT−3', en: 'Gabriel Cherubini · Porto Alegre, Brazil · GMT−3' },
    dominio: { pt: 'gacherubini.dev', en: 'gacherubini.dev' },
  },
} as const

export const OUTRO_IDIOMA: Record<Idioma, Idioma> = { pt: 'en', en: 'pt' }
```

- [ ] **Passo 4: escrever `components/Marca.tsx`**

```tsx
/**
 * O logotipo é a palavra inteira. Na casca clara o `.dev` é o azul da marca;
 * dentro de uma faixa colorida ou de uma página de projeto o azul some ou
 * vibra, então a marca vira monocromática. No fechamento azul ela vai branca.
 */
export function Marca({ variante }: { variante: 'casca' | 'mono' | 'branca' }) {
  return (
    <span className={`marca marca--${variante}`}>
      gacherubini<span className="marca-dev">.dev</span>
    </span>
  )
}
```

- [ ] **Passo 5: escrever `components/AlternadorIdioma.tsx`**

```tsx
import Link from 'next/link'
import type { Idioma } from '@/content/tipos'
import { OUTRO_IDIOMA } from '@/content/ui'

/**
 * `caminho` é o que vem depois do idioma: '' na home, '/revy' na página do
 * projeto. Trocar de idioma mantém a página.
 */
export function AlternadorIdioma({ lang, caminho = '' }: { lang: Idioma; caminho?: string }) {
  const outro = OUTRO_IDIOMA[lang]
  const rotulo = (i: Idioma) => i.toUpperCase()

  return (
    <p className="idioma">
      <span aria-current="true">{rotulo(lang)}</span>
      {' / '}
      <Link href={`/${outro}${caminho}`} hrefLang={outro}>
        {rotulo(outro)}
      </Link>
    </p>
  )
}
```

- [ ] **Passo 6: escrever `components/CabecalhoCasca.tsx`**

```tsx
import Link from 'next/link'
import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { Marca } from '@/components/Marca'
import { AlternadorIdioma } from '@/components/AlternadorIdioma'

/** O topo claro da home. A página do projeto usa o seu próprio, tematizado. */
export function CabecalhoCasca({ lang }: { lang: Idioma }) {
  return (
    <header className="casca-topo">
      <div className="wrap topo">
        <Marca variante="casca" />
        <nav>
          {/* "Sobre" é âncora, não rota: o Sobre é o último bloco da home. */}
          <Link href={`/${lang}#projetos`}>{t(ui.nav.projetos, lang, 'ui.nav.projetos')}</Link>
          <Link href="#sobre">{t(ui.nav.sobre, lang, 'ui.nav.sobre')}</Link>
        </nav>
        <AlternadorIdioma lang={lang} />
      </div>
    </header>
  )
}
```

- [ ] **Passo 7: escrever a folha da casca em `app/globals.css`**

Porte de `mockups/camaleao.css`. Não redesenhe: os valores são os aprovados.

```css
@import "tailwindcss";

/*
  A casca. Fora das faixas o site é claro e quieto; os neutros têm viés
  levemente quente para não brigar com nenhuma paleta de projeto.

  REGRA DA FOLHA: nenhuma regra de texto usa `opacity` fora dos valores em
  OPACIDADES_DE_TEXTO (lib/contraste.ts): 0.72, 0.85, 0.88, 0.9, 0.92.
  Abaixo de 0.72 o roxo do BDDente reprova no contraste (4,22:1 a 0,65).
  Dentro do fechamento azul o piso é mais alto — 0.85, por OPACIDADES_NO_AZUL:
  branco a 0.72 sobre #2A4FD7 dá só 4,21:1.
*/
:root {
  --casca: #FAFAF7;
  --tinta: #15171A;
  --regua: #E4E4DE;
  --calmo: #585D62;
  --marca: #0F1317;
  --dev: #2A4FD7;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--casca);
  color: var(--tinta);
  font-family: var(--fonte-archivo), system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; }
a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }

.wrap { max-width: 1180px; margin: 0 auto; padding: 0 32px; }

.casca-topo { border-bottom: 1px solid var(--regua); }
.topo { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; }

.marca { font-weight: 700; font-size: 17px; letter-spacing: -.01em; }
.marca--casca { color: var(--marca); }
.marca--casca .marca-dev { color: var(--dev); }
.marca--mono { color: inherit; }
.marca--mono .marca-dev { opacity: .72; }
.marca--branca { color: #fff; }
.marca--branca .marca-dev { opacity: .85; }

nav { display: flex; gap: 26px; font-size: 14px; color: var(--calmo); }
nav a { text-decoration: none; }
nav a:hover { color: var(--tinta); }

.idioma { margin: 0; font-size: 13px; color: var(--calmo); }
.idioma [aria-current] { color: var(--tinta); font-weight: 600; }
.idioma a { text-decoration: none; }
.idioma a:hover { color: var(--tinta); }

.abertura-home { padding: 64px 0 56px; }
.abertura-home h1 {
  font-size: 44px; line-height: 1.1; font-weight: 700;
  letter-spacing: -.025em; margin: 0 0 16px; max-width: 16ch;
}
.abertura-home p { margin: 0; color: var(--calmo); font-size: 16.5px; max-width: 52ch; }

@media (max-width: 820px) {
  .abertura-home h1 { font-size: 32px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Passo 8: carregar Archivo no layout raiz**

```tsx
// app/[lang]/layout.tsx
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Archivo } from 'next/font/google'
import { ehIdioma } from '@/content/tipos'
import '../globals.css'

// Archivo sozinha, e nada além dela. Monoespaçada, onde aparece, é a pilha do
// sistema — nenhuma segunda fonte é baixada.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--fonte-archivo',
})

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }]
}

export default async function LayoutRaiz({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!ehIdioma(lang)) notFound()

  return (
    <html lang={lang === 'en' ? 'en' : 'pt-BR'} className={archivo.variable}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Passo 9: a home, ainda só com o topo e a abertura**

```tsx
// app/[lang]/page.tsx
import { notFound } from 'next/navigation'
import { ehIdioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoCasca } from '@/components/CabecalhoCasca'

// Sem `generateStaticParams` aqui: quem gera o segmento `[lang]` é o layout
// raiz, e cada segmento é gerado uma vez só. Repetir a mesma chave nos dois
// níveis é ruído no melhor caso e conflito no pior.

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!ehIdioma(lang)) notFound()

  return (
    <>
      <CabecalhoCasca lang={lang} />
      <main>
        <div className="wrap abertura-home">
          <h1>{t(ui.abertura.titulo, lang, 'ui.abertura.titulo')}</h1>
          <p>{t(ui.abertura.apoio, lang, 'ui.abertura.apoio')}</p>
        </div>
      </main>
    </>
  )
}
```

- [ ] **Passo 10: o teste que impede a folha de reimportar as opacidades do comp**

Os comps traziam `.65`, `.7` e `.72` esmaecendo texto sobre o roxo e sobre o
azul da marca. Portar CSS à mão reintroduz esses valores sem ninguém notar, e
nenhum teste de paleta os pega: o hex não muda, só a opacidade. Daqui em diante
toda tarefa acrescenta regra nesta folha, então o guarda entra agora.

```ts
// test/folha.test.ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OPACIDADES_DE_TEXTO, OPACIDADES_NO_AZUL } from '@/lib/contraste'

const folha = readFileSync('app/globals.css', 'utf8')

describe('a regra da folha', () => {
  it('não usa nenhuma opacity fora da lista medida', () => {
    const permitidas = new Set([...OPACIDADES_DE_TEXTO, ...OPACIDADES_NO_AZUL, 0, 1])
    const usadas = [...folha.matchAll(/opacity:\s*([\d.]+)/g)].map((m) => Number(m[1]))
    expect(usadas.length).toBeGreaterThan(0)
    expect(usadas.filter((o) => !permitidas.has(o))).toEqual([])
  })

  it('não esmaece nada pintado com --calmo', () => {
    // `calmo` reprova a 0,72 nas quatro paletas (ver test/contraste.test.ts).
    // Quem recebe opacity é `--texto`; quem usa `--calmo` fica em opacidade
    // cheia. Regra grosseira, mas pega o caso real: uma declaração de opacity
    // no mesmo bloco em que `--calmo` pinta a cor.
    const blocos = folha.split('}')
    const errados = blocos.filter(
      (b) => /color:\s*var\(--calmo\)/.test(b) && /opacity:\s*(?!1)[\d.]+/.test(b),
    )
    expect(errados).toEqual([])
  })
})
```

Rode: `npm test -- test/folha.test.ts`
Esperado: 2 testes passando.

- [ ] **Passo 11: rodar os testes de componente e ver passar**

Rode: `npm test -- test/componentes/casca.test.tsx`
Esperado: 6 testes passando.

- [ ] **Passo 12: olhar com o olho**

Rode: `npm run dev` e abra `http://localhost:3000/` (deve cair em `/pt`).
Confira: fundo `#FAFAF7`, marca com `.dev` azul, "Sobre" apontando para
`#sobre`, `EN` levando para `/en`. Compare com o topo de
`mockups/a3-autotune-ambar.html`.

- [ ] **Passo 13: commit**

```bash
git add app content/ui.ts components test/componentes
git commit -m "feat: casca da home com Archivo, marca e alternador PT/EN"
```

---

## Tarefa 9: A faixa de projeto, e as quatro faixas na home

O coração da direção Camaleão: o tema vira custom properties inline e uma folha
só serve as quatro paletas.

**Arquivos:**
- Criar: `lib/tema.ts`, `components/FaixaProjeto.tsx`, `components/PrintFigura.tsx`
- Modificar: `app/globals.css`, `app/[lang]/page.tsx`
- Criar teste: `test/componentes/faixa.test.tsx`

**Interfaces:**
- Consome: `Projeto`, `Tema`, `t`, `ui`, `projetos`.
- Produz:
  - `estiloDoTema(tema: Tema): CSSProperties` — as custom properties inline
  - `<FaixaProjeto projeto lang espelho prioridade />`
  - `<PrintFigura print slug lang campo sizes prioridade className />`

- [ ] **Passo 1: escrever `test/componentes/faixa.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FaixaProjeto } from '@/components/FaixaProjeto'
import { estiloDoTema } from '@/lib/tema'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { autotune } from '@/content/projetos/autotune'

describe('estiloDoTema', () => {
  it('vira custom properties, uma por campo do tema', () => {
    const estilo = estiloDoTema(revy.tema) as Record<string, string>
    expect(estilo['--fundo']).toBe('#111111')
    expect(estilo['--destaque']).toBe('#7FBFA3')
    expect(estilo['--calmo']).toBe('#9AA39D')
  })

  it('só declara --fundo3 quando o tema tem', () => {
    expect(estiloDoTema(revy.tema)).not.toHaveProperty('--fundo3')
  })
})

describe('FaixaProjeto', () => {
  it('mostra nome, para quem e situação', () => {
    render(<FaixaProjeto projeto={revy} lang="pt" espelho={false} />)
    expect(screen.getByRole('heading', { name: 'Revy' })).toBeInTheDocument()
    expect(screen.getByText('Revenda de veículos')).toBeInTheDocument()
    expect(screen.getByText('no ar')).toBeInTheDocument()
  })

  it('leva o botão de entrar e o de ver o projeto', () => {
    render(<FaixaProjeto projeto={revy} lang="pt" espelho={false} />)
    expect(screen.getByRole('link', { name: 'Entrar no sistema' })).toHaveAttribute(
      'href',
      'https://revyapp.com.br',
    )
    expect(screen.getByRole('link', { name: 'Ver o projeto' })).toHaveAttribute('href', '/pt/revy')
  })

  // A borda que o comp P2 provou: sem link, e nunca um botão morto.
  it('sem link, mostra o motivo no lugar do botão', () => {
    render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(screen.getByText(/Sistema fechado/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Entrar/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver o projeto' })).toHaveAttribute(
      'href',
      '/pt/bddente',
    )
  })

  // A borda da Revy: números ainda não confirmados.
  it('sem números, não desenha a linha de números', () => {
    const { container } = render(<FaixaProjeto projeto={revy} lang="pt" espelho={false} />)
    expect(revy.numeros).toEqual([])
    expect(container.querySelector('.numeros')).toBeNull()
  })

  it('com números, desenha um por item', () => {
    const { container } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(container.querySelectorAll('.num')).toHaveLength(4)
  })

  it('a faixa espelhada troca o lado do print', () => {
    const { container } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(container.querySelector('.faixa')).toHaveClass('espelho')
  })

  it('pinta a faixa com o tema do projeto', () => {
    const { container } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    const faixa = container.querySelector('.faixa') as HTMLElement
    expect(faixa.style.getPropertyValue('--fundo')).toBe('#5A21B4')
  })

  it('o Autotune abre a faixa pelo print marcado, não pelo primeiro do destaque', () => {
    render(<FaixaProjeto projeto={autotune} lang="pt" espelho />)
    expect(screen.getByAltText(/Low Latency marcado/)).toBeInTheDocument()
  })

  it('o print tem o alt do conteúdo, não "print do sistema"', () => {
    render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(screen.getByAltText(/Agenda da semana/)).toBeInTheDocument()
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/componentes/faixa.test.tsx`
Esperado: FALHA no import de `@/components/FaixaProjeto`.

- [ ] **Passo 3: escrever `lib/tema.ts`**

```ts
import type { CSSProperties } from 'react'
import type { Tema } from '@/content/tipos'

/**
 * A paleta vive no dado, não no CSS. Cada faixa e cada página de projeto
 * recebe o tema como custom properties inline, e uma folha só serve as quatro.
 * Cor de projeto novo = oito hex num arquivo.
 */
export function estiloDoTema(tema: Tema): CSSProperties {
  const estilo: Record<string, string> = {
    '--fundo': tema.fundo,
    '--texto': tema.texto,
    '--borda': tema.borda,
    '--destaque': tema.destaque,
    '--ctaFundo': tema.ctaFundo,
    '--ctaTexto': tema.ctaTexto,
    '--calmo': tema.calmo,
    '--fundo2': tema.fundo2,
  }
  if (tema.fundo3) estilo['--fundo3'] = tema.fundo3
  return estilo as CSSProperties
}
```

- [ ] **Passo 4: escrever `components/PrintFigura.tsx`**

```tsx
import Image from 'next/image'
import type { Idioma, Print } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Todo print do site passa por aqui. `next/image` existe no projeto por causa
 * destes arquivos: as capturas retina são 3200×2000, e resize, formato moderno
 * e lazy loading não podem ser trabalho manual.
 */
export function PrintFigura({
  print,
  slug,
  lang,
  campo,
  sizes,
  prioridade = false,
  className,
  mostrarLegenda = true,
}: {
  print: Print
  slug: string
  lang: Idioma
  campo: string
  sizes: string
  prioridade?: boolean
  className?: string
  mostrarLegenda?: boolean
}) {
  return (
    <figure className={className}>
      <Image
        src={`/prints/${slug}/${print.arquivo}`}
        alt={t(print.alt, lang, `${campo}.alt`)}
        width={print.largura}
        height={print.altura}
        sizes={sizes}
        priority={prioridade}
        // A primeira faixa precisa estar legível no primeiro quadro; o resto
        // pode chegar rolando.
        loading={prioridade ? undefined : 'lazy'}
      />
      {mostrarLegenda && print.legenda ? (
        <figcaption>{t(print.legenda, lang, `${campo}.legenda`)}</figcaption>
      ) : null}
    </figure>
  )
}
```

Os arquivos ficam em `public/prints/<slug>/`, então a URL pública é
`/prints/<slug>/<arquivo>` — sem o `/public` que os comps escreveram, porque no
Next `public/` é a raiz servida.

- [ ] **Passo 5: escrever `components/FaixaProjeto.tsx`**

```tsx
import Link from 'next/link'
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { estiloDoTema } from '@/lib/tema'
import { PrintFigura } from '@/components/PrintFigura'

/**
 * O print que abre a faixa: o marcado com `naFaixa`, senão o primeiro do
 * destaque, senão o de abertura — que é o caso do Office Timesheet, cujo
 * destaque não tem imagem.
 */
function printDaFaixa(projeto: Projeto) {
  const doDestaque = projeto.destaque?.prints
  return (
    doDestaque?.find((p) => p.naFaixa) ??
    doDestaque?.[0] ??
    projeto.printAbertura ??
    projeto.galeria[0]?.prints[0]
  )
}

export function FaixaProjeto({
  projeto,
  lang,
  espelho,
  prioridade = false,
}: {
  projeto: Projeto
  lang: Idioma
  espelho: boolean
  prioridade?: boolean
}) {
  const print = printDaFaixa(projeto)
  const primario = projeto.links.find((l) => l.primario) ?? projeto.links[0]
  const campo = `${projeto.slug}.faixa`

  return (
    <section
      className={`faixa${espelho ? ' espelho' : ''}`}
      style={estiloDoTema(projeto.tema)}
      aria-labelledby={`faixa-${projeto.slug}`}
    >
      <div className="wrap grade">
        <div className="col-texto">
          <div className="ficha-faixa">
            <h2 className="nome" id={`faixa-${projeto.slug}`}>
              {projeto.nome}
            </h2>
            <p className="paraquem">{t(projeto.paraQuem, lang, `${campo}.paraQuem`)}</p>
            <p className="situacao">
              {t(ui.situacao[projeto.situacao], lang, `ui.situacao.${projeto.situacao}`)}
            </p>
          </div>

          <p className="resumo">{t(projeto.resumoHome, lang, `${campo}.resumoHome`)}</p>

          {projeto.numeros.length > 0 ? (
            <div className="numeros">
              {projeto.numeros.map((n) => (
                <div className="num" key={n.valor + n.rotulo.pt}>
                  <b>{n.valor}</b>
                  <span>{t(n.rotulo, lang, `${campo}.numeros`)}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="botoes">
            {primario ? (
              <a className="cta" href={primario.href}>
                {t(primario.rotulo, lang, `${campo}.link`)}
              </a>
            ) : projeto.semLink ? (
              <p className="fechado">{t(projeto.semLink.curto, lang, `${campo}.semLink.curto`)}</p>
            ) : null}
            <Link className="cta fantasma" href={`/${lang}/${projeto.slug}`}>
              {t(ui.verOProjeto, lang, 'ui.verOProjeto')}
            </Link>
          </div>
        </div>

        <div className={`col-print${print && print.largura < 900 ? ' pequeno' : ''}`}>
          {print ? (
            <PrintFigura
              print={print}
              slug={projeto.slug}
              lang={lang}
              campo={`${campo}.print`}
              sizes="(max-width: 820px) 100vw, 620px"
              prioridade={prioridade}
              mostrarLegenda={false}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Passo 6: acrescentar as regras da faixa em `app/globals.css`**

Porte direto de `mockups/camaleao.css`, com três mudanças anotadas:

1. `.ficha` virou `.ficha-faixa` — a página do projeto também tem uma `.ficha`,
   e são coisas diferentes.
2. `.fechado` subiu de `opacity: .65` para `.72`, e `.num span` de `.7` para
   `.72`. É o piso medido no roxo do BDDente.
3. `.num b` e `.num span` nascem escopados em `.faixa`. A régua da página do
   projeto (Tarefa 13) reusa a classe `.num` mas pinta o rótulo com
   `var(--calmo)`, e herdar daqui um `opacity: .72` derrubaria o contraste
   para 3,12:1 no Office Timesheet sem mudar hex nenhum.

```css
/* --- a faixa de projeto ------------------------------------------------- */
.faixa { background: var(--fundo); color: var(--texto); padding: 64px 0; }
.faixa .grade {
  display: grid; grid-template-columns: 1fr 1.15fr; gap: 56px; align-items: center;
}
.faixa.espelho .grade { grid-template-columns: 1.15fr 1fr; }
.faixa.espelho .col-texto { grid-column: 2; }
.faixa.espelho .col-print { grid-column: 1; }

.ficha-faixa {
  display: flex; align-items: baseline; gap: 14px;
  padding-bottom: 12px; margin-bottom: 20px; border-bottom: 1px solid var(--borda);
}
.nome { margin: 0; font-size: 34px; font-weight: 800; letter-spacing: -.02em; line-height: 1; }
.paraquem { margin: 0; font-size: 13.5px; opacity: .72; }
.situacao {
  margin: 0 0 0 auto; font-size: 12px; font-weight: 600;
  border: 1px solid var(--borda); border-radius: 999px; padding: 3px 10px; opacity: .85;
}
.resumo { font-size: 16.5px; margin: 0 0 26px; max-width: 46ch; opacity: .92; }

.numeros { display: flex; gap: 36px; margin-bottom: 30px; flex-wrap: wrap; }
/* Escopadas na faixa de propósito: a régua da página do projeto reusa `.num`
   com o rótulo em `var(--calmo)`, e calmo não aguenta opacity. Ver Tarefa 13. */
.faixa .num b {
  display: block; font-size: 24px; font-weight: 700;
  color: var(--destaque); letter-spacing: -.01em;
}
.faixa .num span { font-size: 12px; opacity: .72; display: block; max-width: 16ch; line-height: 1.35; }

.botoes { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.cta {
  background: var(--ctaFundo); color: var(--ctaTexto); text-decoration: none;
  font-weight: 600; font-size: 14px; padding: 11px 20px; border-radius: 6px;
}
.cta.fantasma { background: transparent; color: var(--texto); border: 1px solid var(--borda); }
/* 0.72 é o piso: 0.65 sobre o roxo do BDDente dá 4,22:1. Ver lib/contraste.ts. */
.fechado { margin: 0; font-size: 13px; opacity: .72; }

.col-print img { width: 100%; height: auto; display: block; border-radius: 8px; border: 1px solid var(--borda); }
.col-print figure { margin: 0; }
.col-print.pequeno img { max-width: 520px; margin: 0 auto; }

@media (max-width: 820px) {
  .faixa .grade, .faixa.espelho .grade { grid-template-columns: 1fr; gap: 28px; }
  .faixa.espelho .col-texto, .faixa.espelho .col-print { grid-column: 1; }
}
```

- [ ] **Passo 7: pendurar as quatro faixas na home**

```tsx
// em app/[lang]/page.tsx, dentro do <main>, depois da abertura:
import { projetos } from '@/content/indice'
import { FaixaProjeto } from '@/components/FaixaProjeto'

// ...
<div id="projetos">
  {projetos.map((projeto, i) => (
    <FaixaProjeto
      key={projeto.slug}
      projeto={projeto}
      lang={lang}
      // O lado do print alterna para o olho não cansar.
      espelho={i % 2 === 1}
      // Nada essencial só depois de rolar: a primeira faixa carrega no primeiro quadro.
      prioridade={i === 0}
    />
  ))}
</div>
```

- [ ] **Passo 8: rodar e ver passar**

Rode: `npm test -- test/componentes/faixa.test.tsx`
Esperado: 11 testes passando.

- [ ] **Passo 9: comparar com o comp, lado a lado**

Numa aba, `npm run dev` em `http://localhost:3000/pt`. Noutra,
`python -m http.server 4321` na raiz e `http://localhost:4321/mockups/a3-autotune-ambar.html`.

Confira: a ordem Revy, BDDente, Office Timesheet, Autotune; o print alternando
de lado; a faixa do Autotune com o print pequeno e centralizado; a Revy **sem**
a linha de números (é o slot); o BDDente e o Office Timesheet com a frase no
lugar do botão de entrar.

- [ ] **Passo 10: commit**

```bash
git add lib/tema.ts components app content test
git commit -m "feat: a faixa de projeto e as quatro faixas da home"
```

---

## Tarefa 10: O Sobre, o fechamento azul, e o slot do currículo

Fecha a home. O Sobre é bloco, não página — o item da nav é âncora. Depois de
quatro faixas com a cor dos produtos, a última é a cor da casa.

**Arquivos:**
- Criar: `components/Sobre.tsx`, `components/Fechamento.tsx`, `lib/curriculo.ts`
- Modificar: `app/globals.css`, `app/[lang]/page.tsx`
- Criar teste: `test/componentes/fim-da-home.test.tsx`

**Interfaces:**
- Consome: `sobre` de `content/sobre.ts`, `ui`, `t`, `Marca`.
- Produz:
  - `curriculoDisponivel(): boolean` — o PDF existe em `public/`?
  - `<Sobre lang />`
  - `<Fechamento lang temCurriculo />`

**O slot.** `public/curriculo-gabriel-cherubini.pdf` não existe. O botão só
aparece quando o arquivo está lá; sem ele, a build avisa e o fechamento fica com
e-mail, WhatsApp, GitHub e LinkedIn. Botão morto seria pior que botão ausente.

- [ ] **Passo 1: escrever o teste**

```tsx
// test/componentes/fim-da-home.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Sobre } from '@/components/Sobre'
import { Fechamento } from '@/components/Fechamento'

describe('Sobre', () => {
  it('é âncora #sobre, não rota', () => {
    const { container } = render(<Sobre lang="pt" />)
    expect(container.querySelector('#sobre')).toBeInTheDocument()
  })

  it('abre com a lede e traz a ficha ao lado', () => {
    const { container } = render(<Sobre lang="pt" />)
    expect(screen.getByText(/Sou desenvolvedor backend/)).toBeInTheDocument()
    expect(screen.getByText('Onde')).toBeInTheDocument()
    // "Porto Alegre" sai duas vezes na tela: no segundo parágrafo e na ficha.
    // `getByText` estoura com dois matches, e o que este teste quer é a ficha.
    expect(container.querySelector('.rail dd')).toHaveTextContent('Porto Alegre')
  })
})

describe('Fechamento', () => {
  it('põe e-mail e telefone em tamanho de leitura, como link direto', () => {
    render(<Fechamento lang="pt" temCurriculo />)
    expect(screen.getByRole('link', { name: 'bielcheeeeee@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:bielcheeeeee@gmail.com',
    )
    expect(screen.getByRole('link', { name: '(51) 98033-6365' })).toHaveAttribute(
      'href',
      'https://wa.me/5551980336365',
    )
  })

  it('leva GitHub e LinkedIn em segundo plano', () => {
    render(<Fechamento lang="pt" temCurriculo />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })

  it('com o PDF em public, oferece o currículo', () => {
    render(<Fechamento lang="pt" temCurriculo />)
    expect(screen.getByRole('link', { name: /Baixar o currículo/ })).toHaveAttribute(
      'href',
      '/curriculo-gabriel-cherubini.pdf',
    )
  })

  // O slot: nunca um botão que baixa 404.
  it('sem o PDF, o botão simplesmente não existe', () => {
    render(<Fechamento lang="pt" temCurriculo={false} />)
    expect(screen.queryByRole('link', { name: /currículo/i })).not.toBeInTheDocument()
  })

  it('a marca vai em branco sobre o azul da casa', () => {
    const { container } = render(<Fechamento lang="pt" temCurriculo />)
    expect(container.querySelector('.marca')).toHaveClass('marca--branca')
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/componentes/fim-da-home.test.tsx`
Esperado: FALHA nos imports.

- [ ] **Passo 3: escrever `lib/curriculo.ts`**

```ts
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * SLOT: o PDF ainda não existe. Enquanto não existir, o fechamento não mostra
 * o botão — link morto é pior que link ausente. Basta jogar o arquivo em
 * `public/` e a próxima build o oferece.
 *
 * Roda só em tempo de build, dentro de Server Component.
 */
export function curriculoDisponivel(): boolean {
  const caminho = join(process.cwd(), 'public', 'curriculo-gabriel-cherubini.pdf')
  const existe = existsSync(caminho)
  if (!existe) {
    console.warn(
      '[currículo] public/curriculo-gabriel-cherubini.pdf não existe; ' +
        'o botão de download não vai aparecer no fechamento da home.',
    )
  }
  return existe
}
```

- [ ] **Passo 4: escrever `components/Sobre.tsx`**

```tsx
import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { sobre } from '@/content/sobre'

/**
 * O Sobre é o último bloco da home, não uma página — decidido em 04/09 depois
 * de três comps. O primeiro parágrafo é a lede, em corpo grande; os outros são
 * texto normal. Tudo sobre o neutro da casca.
 */
export function Sobre({ lang }: { lang: Idioma }) {
  const [lede, ...resto] = sobre.paragrafos

  return (
    <section className="sobre wrap" id="sobre">
      <h2>{t(ui.sobreTitulo, lang, 'ui.sobreTitulo')}</h2>
      <div className="grade">
        <div>
          <p className="lede">{t(lede, lang, 'sobre.paragrafos.0')}</p>
          {resto.map((p, i) => (
            <p className="corpo" key={i}>
              {t(p, lang, `sobre.paragrafos.${i + 1}`)}
            </p>
          ))}
        </div>
        <aside className="rail">
          <dl>
            {sobre.ficha.map((linha, i) => (
              <div key={i}>
                <dt>{t(linha.rotulo, lang, `sobre.ficha.${i}.rotulo`)}</dt>
                <dd>{t(linha.valor, lang, `sobre.ficha.${i}.valor`)}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
```

- [ ] **Passo 5: escrever `components/Fechamento.tsx`**

```tsx
import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { sobre } from '@/content/sobre'
import { Marca } from '@/components/Marca'

/**
 * A última faixa da página é a cor da casa. E-mail e telefone vão em tamanho de
 * leitura porque são a informação, não botão — dá para copiar com o olho. O
 * currículo é o único item que o visitante leva embora. O rodapé mora aqui
 * dentro.
 */
export function Fechamento({ lang, temCurriculo }: { lang: Idioma; temCurriculo: boolean }) {
  return (
    <section className="fechamento">
      <div className="wrap">
        <div className="linha">
          <div className="canais">
            <p className="canal">
              <a href={`mailto:${sobre.contato.email}`}>{sobre.contato.email}</a>
            </p>
            <p className="canal">
              <a href={sobre.contato.telefone.href}>{sobre.contato.telefone.exibicao}</a>
              <span className="via">
                {t(sobre.contato.telefone.via, lang, 'sobre.contato.telefone.via')}
              </span>
            </p>
          </div>

          <div className="perfis">
            {/* SLOT: sem o PDF em public/, nada aqui. */}
            {temCurriculo ? (
              <a className="curriculo" href={sobre.contato.curriculo.href} download>
                {t(sobre.contato.curriculo.rotulo, lang, 'sobre.contato.curriculo.rotulo')}{' '}
                <span>PDF</span>
              </a>
            ) : null}
            {sobre.links.map((l) => (
              <a key={l.rotulo} href={l.href} rel="me noopener">
                {l.rotulo}
              </a>
            ))}
          </div>
        </div>

        <div className="assinatura">
          <span>{t(ui.rodape.lugar, lang, 'ui.rodape.lugar')}</span>
          <Marca variante="branca" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Passo 6: acrescentar as regras em `app/globals.css`**

Porte de `mockups/s3-sobre-na-home.html`. A ficha do Sobre agora usa
`<div>` dentro do `<dl>` para parear `dt`/`dd`; o seletor de espaçamento muda de
`dt:first-child` para `div:first-child dt`.

```css
/* --- o Sobre, último bloco da home -------------------------------------- */
.sobre { padding: 84px 0 92px; }
/* A ficha anda junto do texto: encostada na direita ela deixava um vão de
   300px no meio do bloco. */
.sobre .grade {
  display: grid; grid-template-columns: minmax(0, 1fr) 285px;
  gap: 72px; align-items: start; max-width: 935px;
}
.sobre h2 { margin: 0 0 26px; font-size: 13px; font-weight: 600; color: var(--calmo); }
.sobre .lede {
  margin: 0 0 26px; font-size: 28px; line-height: 1.22; font-weight: 700;
  letter-spacing: -.025em; max-width: 20ch;
}
.sobre p.corpo { margin: 0 0 18px; font-size: 16.5px; line-height: 1.6; max-width: 52ch; color: #2A2E32; }

.rail { border-top: 2px solid var(--tinta); padding-top: 18px; }
.rail dl { margin: 0; }
.rail dt { font-size: 12.5px; color: var(--calmo); margin-top: 16px; }
.rail div:first-child dt { margin-top: 0; }
.rail dd { margin: 2px 0 0; font-size: 14px; font-weight: 500; line-height: 1.4; }

/* --- o fechamento, na cor da casa --------------------------------------- */
.fechamento { background: var(--dev); color: #fff; padding: 60px 0 56px; margin-top: 8px; }
.fechamento .linha { display: grid; grid-template-columns: 1fr auto; gap: 56px; align-items: end; }
.canais { display: flex; flex-direction: column; gap: 16px; }
.canal { margin: 0; display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.canal a {
  font-size: 27px; font-weight: 600; letter-spacing: -.022em; color: #fff;
  text-decoration: none; border-bottom: 2px solid rgba(255,255,255,.3);
  padding-bottom: 3px; line-height: 1.25;
}
.canal a:hover { border-bottom-color: #fff; }
.canal .via { font-size: 13px; opacity: .85; }

.perfis { display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }
.perfis a {
  font-size: 15px; font-weight: 500; color: #fff; opacity: .88;
  text-decoration: none; border-bottom: 1px solid transparent; padding-bottom: 1px;
}
.perfis a:hover { opacity: 1; border-bottom-color: rgba(255,255,255,.6); }
/* O currículo é a única coisa aqui que o visitante leva embora. */
.perfis a.curriculo {
  opacity: 1; font-weight: 600; border: 1px solid rgba(255,255,255,.55);
  border-radius: 5px; padding: 9px 16px; margin-bottom: 6px;
}
.perfis a.curriculo:hover { background: #fff; color: var(--dev); border-color: #fff; }
.perfis a.curriculo span { font-weight: 400; opacity: .85; font-size: 13px; }

.assinatura {
  margin-top: 44px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.22);
  display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;
  font-size: 13px; opacity: .88;
}
/* Opacidade compõe. O `.85` do `.marca-dev` dentro do `.88` daqui dá `.748`,
   que sobre o azul da marca é 4,42:1 — abaixo do mínimo, e invisível para
   `verificarCasca`, que mede cada valor declarado isolado. Dentro de um bloco
   que já esmaece, o filho vai em opacidade cheia. */
.assinatura .marca--branca .marca-dev { opacity: 1; }
.fechamento a:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

@media (max-width: 820px) {
  .sobre .grade { grid-template-columns: 1fr; gap: 40px; }
  .sobre .lede { font-size: 23px; }
  .fechamento .linha { grid-template-columns: 1fr; gap: 34px; align-items: start; }
  .perfis { flex-direction: row; gap: 22px; align-items: flex-start; flex-wrap: wrap; }
  .canal a { font-size: 21px; }
}
```

O comp esmaecia branco a `.7` no `.canal .via`, `.85` nos perfis e `.72` na
assinatura. Sobre `#2A4FD7` isso dá 3,78:1 e 4,21:1 — abaixo do mínimo de
texto. Aqui o piso do fechamento é **0,85** (5,23:1), e é o que
`OPACIDADES_NO_AZUL` guarda em `lib/contraste.ts`. Os perfis e a assinatura
ficam em `.88`, o resto em `.85`.

O que `verificarCasca` não vê é a composição: dois níveis de `opacity`
aninhados multiplicam, e o par `.88` da assinatura com `.85` do `.marca-dev`
cai para 4,42:1 sem que nenhum hex mude. Por isso a regra extra acima, e por
isso `test/folha.test.ts` (Tarefa 8) confere a folha inteira e não só as
paletas.

- [ ] **Passo 7: pendurar os dois no fim da home**

```tsx
// em app/[lang]/page.tsx, depois do <div id="projetos">:
import { Sobre } from '@/components/Sobre'
import { Fechamento } from '@/components/Fechamento'
import { curriculoDisponivel } from '@/lib/curriculo'

// dentro do componente, antes do return:
const temCurriculo = curriculoDisponivel()

// no JSX, depois das faixas e fora do <main> ou no fim dele:
<Sobre lang={lang} />
<Fechamento lang={lang} temCurriculo={temCurriculo} />
```

- [ ] **Passo 8: rodar e ver passar**

Rode: `npm test -- test/componentes/fim-da-home.test.tsx`
Esperado: 7 testes passando.

- [ ] **Passo 9: conferir o aviso do slot**

Rode: `npm run build`
Esperado: no meio da saída, `[currículo] public/curriculo-gabriel-cherubini.pdf
não existe`. A build **passa** — é aviso, não erro.

- [ ] **Passo 10: conferir contra o comp**

`http://localhost:3000/pt#sobre` contra
`http://localhost:4321/mockups/s3-sobre-na-home.html`. O bloco do Sobre, o
fechamento azul, e o lugar do botão de currículo vazio.

- [ ] **Passo 11: commit**

```bash
git add components/Sobre.tsx components/Fechamento.tsx lib/curriculo.ts app test
git commit -m "feat: Sobre e fechamento da home, com o curriculo como slot"
```

---

## Tarefa 11: A página do projeto — rota, topo tematizado, chamada e ficha

Os blocos 1 e 2 da spec §8. A página inteira veste a paleta do sistema desde o
topo, e é aqui que o lugar do botão aprende a dizer por que não há botão.

**Arquivos:**
- Criar: `app/[lang]/[slug]/page.tsx`, `components/CabecalhoProjeto.tsx`,
  `components/AberturaProjeto.tsx`, `components/TextoComMarcas.tsx`
- Modificar: `app/globals.css`
- Criar teste: `test/componentes/pagina-projeto.test.tsx`,
  `test/componentes/texto-com-marcas.test.tsx`

**Interfaces:**
- Consome: `projetoPorSlug`, `estiloDoTema`, `t`, `ui`, `Marca`, `AlternadorIdioma`.
- Produz:
  - `<CabecalhoProjeto lang slug />`
  - `<AberturaProjeto projeto lang />`
  - `<TextoComMarcas texto />` — renderiza `` `assim` `` como `<code>` e
    `*assim*` como `<b>`
  - a rota estática `/pt/<slug>` e `/en/<slug>` para os quatro projetos

- [ ] **Passo 1: escrever `test/componentes/texto-com-marcas.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextoComMarcas } from '@/components/TextoComMarcas'

describe('TextoComMarcas', () => {
  it('deixa texto comum em paz', () => {
    render(<p><TextoComMarcas texto="Só prosa." /></p>)
    expect(screen.getByText('Só prosa.')).toBeInTheDocument()
  })

  it('crase vira code — nome de função não lê como prosa', () => {
    const { container } = render(<p><TextoComMarcas texto="O campo `aceita_whatsapp` aceita `NULL`." /></p>)
    const codes = container.querySelectorAll('code')
    expect([...codes].map((c) => c.textContent)).toEqual(['aceita_whatsapp', 'NULL'])
  })

  it('asterisco vira ênfase', () => {
    const { container } = render(<p><TextoComMarcas texto="fator de *340*" /></p>)
    expect(container.querySelector('b')).toHaveTextContent('340')
  })

  it('não engole o texto em volta', () => {
    const { container } = render(<p><TextoComMarcas texto="antes `meio` depois" /></p>)
    expect(container.textContent).toBe('antes meio depois')
  })
})
```

- [ ] **Passo 2: escrever `components/TextoComMarcas.tsx`**

```tsx
import { Fragment } from 'react'

/**
 * A spec fecha a tipografia em Archivo sozinha, com uma exceção estreita:
 * código e saída de terminal vão em monoespaçada, porque nome de função lê como
 * prosa em fonte proporcional. O conteúdo marca esses trechos com crase.
 *
 * `*assim*` é ênfase — usada em três lugares dos comps aprovados, sempre para
 * a palavra que o parágrafo inteiro está construindo.
 */
export function TextoComMarcas({ texto }: { texto: string }) {
  const pedacos = texto.split(/(`[^`]+`|\*[^*]+\*)/g)

  return (
    <>
      {pedacos.map((pedaco, i) => {
        if (pedaco.startsWith('`') && pedaco.endsWith('`') && pedaco.length > 2) {
          return <code key={i}>{pedaco.slice(1, -1)}</code>
        }
        if (pedaco.startsWith('*') && pedaco.endsWith('*') && pedaco.length > 2) {
          return <b key={i}>{pedaco.slice(1, -1)}</b>
        }
        return <Fragment key={i}>{pedaco}</Fragment>
      })}
    </>
  )
}
```

- [ ] **Passo 3: rodar e ver passar**

Rode: `npm test -- test/componentes/texto-com-marcas.test.tsx`
Esperado: 4 testes passando.

- [ ] **Passo 4: escrever o teste da página**

```tsx
// test/componentes/pagina-projeto.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CabecalhoProjeto } from '@/components/CabecalhoProjeto'
import { AberturaProjeto } from '@/components/AberturaProjeto'
import { revy } from '@/content/projetos/revy'
import { officeTimesheet } from '@/content/projetos/office-timesheet'

describe('CabecalhoProjeto', () => {
  it('volta para a home do idioma corrente', () => {
    render(<CabecalhoProjeto lang="pt" slug="revy" />)
    expect(screen.getByRole('link', { name: /Todos os projetos/ })).toHaveAttribute('href', '/pt')
  })

  it('mantém a página ao trocar de idioma', () => {
    render(<CabecalhoProjeto lang="pt" slug="revy" />)
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en/revy')
  })

  it('usa a marca monocromática: o azul some ou vibra sobre a cor do sistema', () => {
    const { container } = render(<CabecalhoProjeto lang="pt" slug="revy" />)
    expect(container.querySelector('.marca')).toHaveClass('marca--mono')
  })
})

describe('AberturaProjeto', () => {
  it('traz nome, chamada e a ficha de rótulos livres', () => {
    render(<AberturaProjeto projeto={revy} lang="pt" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Revy' })).toBeInTheDocument()
    expect(screen.getByText(/Quem responde o cliente no WhatsApp/)).toBeInTheDocument()
    expect(screen.getByText('Tamanho')).toBeInTheDocument()
  })

  it('com link, desenha os botões', () => {
    render(<AberturaProjeto projeto={revy} lang="pt" />)
    expect(screen.getByRole('link', { name: 'Entrar no sistema' })).toBeInTheDocument()
  })

  // A borda dos comps P2 e P3.
  it('sem link, o lugar do botão diz por que não há botão', () => {
    render(<AberturaProjeto projeto={officeTimesheet} lang="pt" />)
    expect(screen.getByText('Sem link para entrar')).toBeInTheDocument()
    expect(screen.getByText(/não tem área pública nem conta de visitante/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Entrar/ })).not.toBeInTheDocument()
  })

  it('nenhuma ficha traz "a confirmar"', () => {
    for (const projeto of [revy, officeTimesheet]) {
      for (const linha of projeto.ficha) {
        expect(linha.valor.pt).not.toMatch(/a confirmar/i)
      }
    }
  })
})
```

- [ ] **Passo 5: escrever `components/CabecalhoProjeto.tsx`**

```tsx
import Link from 'next/link'
import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { Marca } from '@/components/Marca'
import { AlternadorIdioma } from '@/components/AlternadorIdioma'

/**
 * O topo da página do projeto já vem na cor do sistema. A marca sai do neutro
 * da casca e entra numa faixa colorida, então aqui ela é monocromática.
 */
export function CabecalhoProjeto({ lang, slug }: { lang: Idioma; slug: string }) {
  return (
    <header className="projeto-topo">
      <div className="wrap topo">
        <Link href={`/${lang}`} className="marca-link">
          <Marca variante="mono" />
        </Link>
        <Link className="voltar" href={`/${lang}`}>
          {t(ui.voltar, lang, 'ui.voltar')}
        </Link>
        <AlternadorIdioma lang={lang} caminho={`/${slug}`} />
      </div>
    </header>
  )
}
```

- [ ] **Passo 6: escrever `components/AberturaProjeto.tsx`**

```tsx
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Nome, chamada e a ficha lateral. Os rótulos da ficha são por projeto e não
 * fixos: campo fixo obrigava o BDDente a esconder "Substituiu — Dentalis, em
 * FoxPro, de 1996 a 2024", que é o dado mais forte que ele tem.
 */
export function AberturaProjeto({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const campo = projeto.slug

  return (
    <section className="wrap abertura-projeto">
      <div>
        <h1>{projeto.nome}</h1>
        <p className="chamada">{t(projeto.chamada, lang, `${campo}.chamada`)}</p>
      </div>

      <aside className="ficha">
        <dl>
          {projeto.ficha.map((linha, i) => (
            <div key={i}>
              <dt>{t(linha.rotulo, lang, `${campo}.ficha.${i}.rotulo`)}</dt>
              <dd>{t(linha.valor, lang, `${campo}.ficha.${i}.valor`)}</dd>
            </div>
          ))}
        </dl>

        {projeto.links.length > 0 ? (
          <div className="acoes">
            {projeto.links.map((link, i) => (
              <a
                key={link.href}
                className={`cta${link.primario || i === 0 ? '' : ' fantasma'}`}
                href={link.href}
              >
                {t(link.rotulo, lang, `${campo}.links.${i}`)}
              </a>
            ))}
          </div>
        ) : projeto.semLink ? (
          <div className="semlink">
            <b>{t(projeto.semLink.titulo, lang, `${campo}.semLink.titulo`)}</b>
            <p>{t(projeto.semLink.texto, lang, `${campo}.semLink.texto`)}</p>
          </div>
        ) : null}
      </aside>
    </section>
  )
}
```

- [ ] **Passo 7: escrever a rota `app/[lang]/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { ehIdioma } from '@/content/tipos'
import { projetos, projetoPorSlug } from '@/content/indice'
import { estiloDoTema } from '@/lib/tema'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoProjeto } from '@/components/CabecalhoProjeto'
import { AberturaProjeto } from '@/components/AberturaProjeto'

// Só o segmento desta rota: o layout raiz já gera `[lang]`, e o Next chama
// esta função uma vez por `lang` que ele gerou. Devolver `{ lang, slug }`
// daqui repetiria uma chave que o pai já resolveu.
export function generateStaticParams() {
  return projetos.map((p) => ({ slug: p.slug }))
}

export default async function PaginaProjeto({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!ehIdioma(lang)) notFound()

  const projeto = projetoPorSlug(slug)
  if (!projeto) notFound()

  return (
    // A página inteira veste a paleta do sistema — spec §8.
    <div className="pagina-projeto" style={estiloDoTema(projeto.tema)}>
      <CabecalhoProjeto lang={lang} slug={projeto.slug} />
      <main>
        <AberturaProjeto projeto={projeto} lang={lang} />
        {/* Destaque, régua, prosa, galeria e técnico entram nas Tarefas 12 a 15. */}
      </main>
      <footer className="wrap rodape-projeto">
        <span>{t(ui.rodape.lugar, lang, 'ui.rodape.lugar')}</span>
        <span>{t(ui.rodape.dominio, lang, 'ui.rodape.dominio')}</span>
      </footer>
    </div>
  )
}
```

- [ ] **Passo 8: acrescentar as regras da página de projeto em `app/globals.css`**

Porte de `mockups/p1-projeto-revy.html`, mais o `.semlink` de
`mockups/p3-projeto-office-timesheet.html` e o `.fechado` de `p2`. As duas
variantes de cartão do comp viraram uma só classe `.semlink`: a diferença entre
elas era a borda tracejada, e ela não carregava informação.

```css
/* --- a página do projeto ------------------------------------------------ */
.pagina-projeto { background: var(--fundo); color: var(--texto); min-height: 100vh; }

.projeto-topo { border-bottom: 1px solid var(--borda); }
.projeto-topo .marca-link { text-decoration: none; }
.voltar { font-size: 14px; color: var(--calmo); text-decoration: none; }
.voltar:hover { color: var(--texto); }
.pagina-projeto .idioma { color: var(--calmo); }
.pagina-projeto .idioma [aria-current] { color: var(--texto); }

.abertura-projeto {
  padding: 64px 0 56px; display: grid; grid-template-columns: 1fr 300px;
  gap: 72px; align-items: start;
}
.abertura-projeto h1 {
  margin: 0 0 18px; font-size: 52px; line-height: 1.02; font-weight: 800;
  letter-spacing: -.032em;
}
.chamada { margin: 0; font-size: 22px; line-height: 1.4; max-width: 34ch; opacity: .92; }

.ficha { border-top: 2px solid var(--destaque); padding-top: 18px; }
.ficha dl { margin: 0; }
.ficha dt { font-size: 12.5px; color: var(--calmo); margin-top: 16px; }
.ficha div:first-child dt { margin-top: 0; }
.ficha dd { margin: 2px 0 0; font-size: 14px; font-weight: 500; line-height: 1.4; }

.ficha .acoes { margin-top: 26px; display: flex; flex-direction: column; gap: 10px; }
.ficha .cta {
  display: block; text-align: center; background: var(--ctaFundo); color: var(--ctaTexto);
  text-decoration: none; font-weight: 600; font-size: 14.5px; padding: 12px 18px; border-radius: 6px;
}
.ficha .cta.fantasma { background: transparent; color: var(--texto); border: 1px solid var(--borda); }
.ficha .cta.fantasma:hover { border-color: var(--destaque); }

/* Sistema fechado: no lugar do botão vai o motivo. Botão morto seria pior. */
.semlink {
  margin-top: 26px; background: var(--fundo2); border: 1px solid var(--borda);
  border-radius: 6px; padding: 14px 16px;
}
.semlink b { display: block; font-size: 14px; font-weight: 700; margin-bottom: 5px; }
.semlink p { margin: 0; font-size: 13.5px; line-height: 1.5; color: var(--calmo); }

.pagina-projeto figure { margin: 0; }
.pagina-projeto figure img {
  width: 100%; height: auto; display: block;
  border: 1px solid var(--borda); border-radius: 8px; background: var(--fundo2);
}
.pagina-projeto figcaption {
  margin-top: 11px; font-size: 12.5px; color: var(--calmo); line-height: 1.45; max-width: 64ch;
}

.rodape-projeto {
  border-top: 1px solid var(--borda); padding: 34px 0 56px;
  display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;
  font-size: 13.5px; color: var(--calmo);
}

.pagina-projeto a:focus-visible { outline: 2px solid var(--destaque); outline-offset: 3px; }

@media (max-width: 900px) {
  .abertura-projeto { grid-template-columns: 1fr; gap: 36px; padding: 44px 0 32px; }
  .abertura-projeto h1 { font-size: 36px; }
  .chamada { font-size: 19px; }
}
@media (max-width: 560px) {
  .wrap { padding: 0 20px; }
  .abertura-projeto h1 { font-size: 32px; }
}
```

- [ ] **Passo 9: rodar e ver passar**

Rode: `npm test -- test/componentes/pagina-projeto.test.tsx`
Esperado: 7 testes passando.

- [ ] **Passo 10: ver as quatro no navegador**

`npm run dev` e abra `/pt/revy`, `/pt/bddente`, `/pt/office-timesheet`,
`/pt/autotune`. As quatro devem estar cada uma na sua cor desde o topo, com a
única clara sendo a do Office Timesheet.

- [ ] **Passo 11: commit**

```bash
git add app components test
git commit -m "feat: rota e topo da pagina de projeto, com o motivo no lugar do botao ausente"
```

---

## Tarefa 12: O destaque — 0, 1 ou 2 prints, a lista dos 17 tools e as placas do Autotune

O bloco 3 da spec §8, e o mais exigido do plano: é o primeiro conteúdo depois da
chamada, e cada uma das quatro páginas o usa de um jeito diferente.

| Projeto | Como usa |
|---|---|
| Revy | dois prints lado a lado, um parágrafo |
| BDDente | um print de largura inteira, dois parágrafos |
| Office Timesheet | **zero print** — dois parágrafos, a lista dos 17 tools, três amarras |
| Autotune | dois prints em placa, cada uma com etiqueta e latência, mais um fecho |

**Arquivos:**
- Criar: `components/Destaque.tsx`
- Modificar: `app/globals.css`, `app/[lang]/[slug]/page.tsx`
- Criar teste: `test/componentes/destaque.test.tsx`

**Interfaces:**
- Consome: `Projeto`, `PrintFigura`, `TextoComMarcas`, `t`.
- Produz: `<Destaque projeto lang />` — devolve `null` quando o projeto não
  declara destaque.

- [ ] **Passo 1: escrever o teste**

```tsx
// test/componentes/destaque.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Destaque } from '@/components/Destaque'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { autotune } from '@/content/projetos/autotune'

describe('Destaque', () => {
  it('com dois prints, desenha as duas placas', () => {
    const { container } = render(<Destaque projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('figure')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: /agente de atendimento/i })).toBeInTheDocument()
  })

  it('com um print, ele ocupa a largura toda', () => {
    const { container } = render(<Destaque projeto={bddente} lang="pt" />)
    expect(container.querySelectorAll('figure')).toHaveLength(1)
    expect(container.querySelector('figure')).toHaveClass('placa-larga')
  })

  // A borda que o print bloqueado do assistente criou.
  it('com zero print, o texto carrega o bloco e nada quebra', () => {
    const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('figure')).toHaveLength(0)
    expect(container.querySelector('.placas')).toBeNull()
    expect(screen.getByRole('heading', { name: /17 perguntas/ })).toBeInTheDocument()
  })

  it('desenha os 17 tools como lista, em monoespaçada', () => {
    const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('.tools li')).toHaveLength(17)
    expect(screen.getByText('quemNaoApontou')).toBeInTheDocument()
  })

  it('desenha as três amarras', () => {
    const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('.amarra')).toHaveLength(3)
  })

  it('sem lista e sem amarras, não sobra div vazia', () => {
    const { container } = render(<Destaque projeto={revy} lang="pt" />)
    expect(container.querySelector('.tools')).toBeNull()
    expect(container.querySelector('.amarras')).toBeNull()
  })

  it('as placas do Autotune trazem etiqueta e latência', () => {
    render(<Destaque projeto={autotune} lang="pt" />)
    expect(screen.getByText('TD-PSOLA')).toBeInTheDocument()
    expect(screen.getByText('61,72 ms')).toBeInTheDocument()
    expect(screen.getByText('0,18 ms')).toBeInTheDocument()
  })

  it('o fecho do Autotune destaca o fator', () => {
    const { container } = render(<Destaque projeto={autotune} lang="pt" />)
    expect(container.querySelector('.leitura b')).toHaveTextContent('340')
  })

  it('projeto sem destaque não desenha nada', () => {
    const semDestaque = { ...revy, destaque: undefined }
    const { container } = render(<Destaque projeto={semDestaque} lang="pt" />)
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/componentes/destaque.test.tsx`
Esperado: FALHA no import de `@/components/Destaque`.

- [ ] **Passo 3: escrever `components/Destaque.tsx`**

```tsx
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { PrintFigura } from '@/components/PrintFigura'
import { TextoComMarcas } from '@/components/TextoComMarcas'

/**
 * "O principal" de cada projeto: o primeiro conteúdo depois da chamada, de
 * propósito. Só existe quando o projeto tem uma coisa que se entende por
 * imagem — ou, no caso do Office Timesheet, quando tem uma que se entende por
 * lista enquanto a imagem não existe.
 */
export function Destaque({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const destaque = projeto.destaque
  if (!destaque) return null

  const campo = `${projeto.slug}.destaque`
  const quantos = destaque.prints.length

  return (
    <section className="destaque">
      <div className="wrap">
        <div className="cabeca">
          <h2>{t(destaque.titulo, lang, `${campo}.titulo`)}</h2>
          {destaque.texto.map((p, i) => (
            <p key={i}>
              <TextoComMarcas texto={t(p, lang, `${campo}.texto.${i}`)} />
            </p>
          ))}
        </div>

        {quantos > 0 ? (
          <div className={quantos === 2 ? 'placas' : undefined}>
            {destaque.prints.map((print, i) => {
              const figura = (
                <PrintFigura
                  key={print.arquivo}
                  print={print}
                  slug={projeto.slug}
                  lang={lang}
                  campo={`${campo}.prints.${i}`}
                  sizes={
                    quantos === 2
                      ? '(max-width: 900px) 100vw, 560px'
                      : '(max-width: 900px) 100vw, 960px'
                  }
                  className={quantos === 1 ? 'placa-larga' : undefined}
                />
              )

              // O Autotune põe cada print numa placa com nome do motor e
              // latência no alto: o menta dos prints não pode encostar no
              // âmbar da página, e a placa é o que separa os dois.
              if (!print.etiqueta) return figura

              return (
                <div className="placa" key={print.arquivo}>
                  <div className="topo-placa">
                    <span className="motor">{t(print.etiqueta, lang, `${campo}.prints.${i}.etiqueta`)}</span>
                    {print.valor ? <span className="lat">{print.valor}</span> : null}
                  </div>
                  <div className="pequeno">{figura}</div>
                </div>
              )
            })}
          </div>
        ) : null}

        {destaque.lista ? (
          <>
            <p className="rotulo">{t(destaque.lista.rotulo, lang, `${campo}.lista.rotulo`)}</p>
            <ul className="tools">
              {destaque.lista.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}

        {destaque.amarras ? (
          <div className="amarras">
            {destaque.amarras.map((amarra, i) => (
              <div className="amarra" key={i}>
                <h3>{t(amarra.titulo, lang, `${campo}.amarras.${i}.titulo`)}</h3>
                {amarra.texto.map((p, j) => (
                  <p key={j}>
                    <TextoComMarcas texto={t(p, lang, `${campo}.amarras.${i}.texto.${j}`)} />
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {destaque.fecho ? (
          <p className="leitura">
            <TextoComMarcas texto={t(destaque.fecho, lang, `${campo}.fecho`)} />
          </p>
        ) : null}
      </div>
    </section>
  )
}
```

- [ ] **Passo 4: acrescentar as regras em `app/globals.css`**

Porte de `p1` (o gabarito), `p2` (`.placa-larga`), `p3` (`.tools`, `.amarras`,
`.rotulo`) e `p4` (`.placa`, `.motor`, `.lat`, `.leitura`).

```css
/* --- o destaque --------------------------------------------------------- */
.destaque {
  background: var(--fundo2); border-top: 1px solid var(--borda);
  border-bottom: 1px solid var(--borda); padding: 64px 0;
}
.destaque .cabeca { max-width: 58ch; margin-bottom: 36px; }
.destaque h2 {
  margin: 0 0 12px; font-size: 30px; font-weight: 700;
  letter-spacing: -.025em; line-height: 1.15;
}
.destaque .cabeca p { margin: 0 0 14px; font-size: 17px; line-height: 1.6; opacity: .9; }
.destaque .cabeca p:last-child { margin-bottom: 0; }
.placas { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
.placa-larga { max-width: 960px; }

/* As placas do Autotune: os prints são capturas nativas de ~640px. Esticar
   borra, então a placa cresce e a imagem para no tamanho em que foi capturada. */
.placa {
  background: var(--fundo3, var(--fundo2)); border: 1px solid var(--borda);
  border-radius: 10px; padding: 20px; display: flex; flex-direction: column; height: 100%;
}
.placa .topo-placa {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  padding-bottom: 14px; margin-bottom: 18px; border-bottom: 1px solid var(--borda);
}
/* Nome de motor é nome, não código: fica em Archivo. */
.motor { font-size: 14px; font-weight: 600; letter-spacing: -.005em; color: var(--texto); }
.lat {
  font-size: 26px; font-weight: 800; letter-spacing: -.03em;
  color: var(--destaque); line-height: 1; white-space: nowrap;
}
.placa .pequeno img { max-width: 642px; margin: 0 auto; border-radius: 6px; }
.placa figcaption { margin-top: 16px; font-size: 13px; line-height: 1.5; }

.leitura {
  margin: 38px auto 0; max-width: 62ch; border-top: 1px solid var(--borda);
  padding-top: 22px; font-size: 16px; line-height: 1.62; text-align: center;
}
.leitura b { color: var(--destaque); font-weight: 700; }

/* A lista dos 17 tools do Office Timesheet. São nomes de função: monoespaçada
   da pilha do sistema, sem baixar fonte nenhuma. 6+6+5 por coluna para a lista
   fechar sem sobra. */
.rotulo { font-size: 13px; font-weight: 600; color: var(--calmo); margin: 0 0 16px; }
.tools {
  display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(6, auto);
  grid-auto-flow: column; gap: 0 32px; list-style: none; padding: 0; margin: 0 0 36px;
}
.tools li {
  display: flex; align-items: center; gap: 9px; border-bottom: 1px solid var(--borda);
  padding: 9px 2px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13.5px; letter-spacing: -.01em; word-break: break-word;
}
.tools li::before { content: ""; flex: none; width: 9px; height: 9px; background: var(--destaque); }

.amarras {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;
  border-top: 1px solid var(--borda); padding-top: 26px;
}
.amarra h3 { margin: 0 0 6px; font-size: 15px; font-weight: 700; letter-spacing: -.012em; }
.amarra p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--calmo); max-width: 34ch; }

@media (max-width: 900px) {
  .destaque { padding: 48px 0 52px; }
  .destaque h2 { font-size: 25px; }
  .placas, .amarras { grid-template-columns: 1fr; gap: 28px; }
  .tools { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(9, auto); gap: 0 20px; }
  .leitura { text-align: left; margin-top: 28px; }
}
@media (max-width: 560px) {
  .placa { padding: 16px; }
  .placa .topo-placa { flex-direction: column; gap: 6px; }
  .tools { grid-template-columns: 1fr; grid-auto-flow: row; grid-template-rows: none; }
}
```

- [ ] **Passo 5: pendurar o destaque e o print de abertura na página**

O Office Timesheet abre com o quadro de tarefas porque o destaque dele não tem
imagem; o print entra antes do destaque, de largura inteira.

```tsx
// em app/[lang]/[slug]/page.tsx, dentro do <main>, depois de <AberturaProjeto>:
import { PrintFigura } from '@/components/PrintFigura'
import { Destaque } from '@/components/Destaque'

{projeto.printAbertura ? (
  <section className="wrap abre">
    <PrintFigura
      print={projeto.printAbertura}
      slug={projeto.slug}
      lang={lang}
      campo={`${projeto.slug}.printAbertura`}
      sizes="(max-width: 900px) 100vw, 1116px"
      prioridade
    />
  </section>
) : null}

<Destaque projeto={projeto} lang={lang} />
```

E no CSS:

```css
.abre { padding: 0 0 8px; }
.abre figcaption { max-width: 60ch; }
.abre + .destaque { margin-top: 56px; }
@media (max-width: 900px) { .abre + .destaque { margin-top: 40px; } }
```

- [ ] **Passo 6: rodar e ver passar**

Rode: `npm test -- test/componentes/destaque.test.tsx`
Esperado: 9 testes passando.

- [ ] **Passo 7: conferir as quatro contra os comps**

`/pt/revy` contra `p1`, `/pt/bddente` contra `p2`, `/pt/office-timesheet` contra
`p3` e `/pt/autotune` contra `p4`. A do Office Timesheet é a que importa: sem
imagem no destaque, a lista dos 17 tools é o que carrega o bloco.

- [ ] **Passo 8: commit**

```bash
git add components/Destaque.tsx app test
git commit -m "feat: destaque aguentando zero, um e dois prints"
```

---

## Tarefa 13: A régua de números e a prosa em duas colunas

Blocos 4 e 5 da spec §8. Curta, e é onde o slot dos números da Revy aparece na
página do projeto.

**Arquivos:**
- Criar: `components/ReguaNumeros.tsx`, `components/Prosa.tsx`
- Modificar: `app/globals.css`, `app/[lang]/[slug]/page.tsx`
- Criar teste: `test/componentes/regua-e-prosa.test.tsx`

**Interfaces:**
- Consome: `Projeto`, `t`, `TextoComMarcas`.
- Produz: `<ReguaNumeros projeto lang />` (devolve `null` com zero números),
  `<Prosa projeto lang />`.

- [ ] **Passo 1: escrever o teste**

```tsx
// test/componentes/regua-e-prosa.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReguaNumeros } from '@/components/ReguaNumeros'
import { Prosa } from '@/components/Prosa'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { autotune } from '@/content/projetos/autotune'

describe('ReguaNumeros', () => {
  it('com quatro números, desenha quatro', () => {
    const { container } = render(<ReguaNumeros projeto={bddente} lang="pt" />)
    expect(container.querySelectorAll('.num')).toHaveLength(4)
    expect(screen.getByText('5.559')).toBeInTheDocument()
  })

  it('com três, desenha três', () => {
    const { container } = render(<ReguaNumeros projeto={autotune} lang="pt" />)
    expect(container.querySelectorAll('.num')).toHaveLength(3)
  })

  // Slot da Revy: os do seed são inventados e não podem virar vitrine.
  it('sem números confirmados, a régua não existe', () => {
    const { container } = render(<ReguaNumeros projeto={revy} lang="pt" />)
    expect(container.firstChild).toBeNull()
  })

  it('a régua ajusta as colunas ao número de itens', () => {
    const { container } = render(<ReguaNumeros projeto={bddente} lang="pt" />)
    expect(container.querySelector('.regua')).toHaveClass('regua--4')
  })
})

describe('Prosa', () => {
  it('põe o problema e o que o sistema faz lado a lado', () => {
    render(<Prosa projeto={bddente} lang="pt" />)
    expect(screen.getByRole('heading', { name: 'O problema' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'O que o sistema faz' })).toBeInTheDocument()
  })

  it('desenha um parágrafo por item', () => {
    const { container } = render(<Prosa projeto={autotune} lang="pt" />)
    expect(container.querySelectorAll('p')).toHaveLength(
      autotune.problema.length + autotune.oQueFaz.length,
    )
  })
})
```

- [ ] **Passo 2: acrescentar os títulos em `content/ui.ts`**

```ts
// dentro de `ui`:
  prosa: {
    problema: { pt: 'O problema', en: 'The problem' },
    oQueFaz: { pt: 'O que o sistema faz', en: 'What the system does' },
  },
```

- [ ] **Passo 3: escrever `components/ReguaNumeros.tsx`**

```tsx
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Três ou quatro números. Zero significa "ainda não confirmado" e some da tela
 * — é o caso da Revy, cujos números de vitrine ainda vêm do seed fictício.
 */
export function ReguaNumeros({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  if (projeto.numeros.length === 0) return null

  return (
    <section className={`wrap regua regua--${projeto.numeros.length}`}>
      {projeto.numeros.map((n, i) => (
        <div className="num" key={n.valor + i}>
          <b>{n.valor}</b>
          <span>{t(n.rotulo, lang, `${projeto.slug}.numeros.${i}`)}</span>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Passo 4: escrever `components/Prosa.tsx`**

```tsx
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { TextoComMarcas } from '@/components/TextoComMarcas'

/**
 * Português comum, sem jargão: é o bloco que a primeira plateia — dono de
 * empresa, recrutador, cliente — lê para entender o que o sistema resolve.
 */
export function Prosa({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const coluna = (titulo: string, paragrafos: Projeto['problema'], campo: string) => (
    <div>
      <h2>{titulo}</h2>
      {paragrafos.map((p, i) => (
        <p key={i}>
          <TextoComMarcas texto={t(p, lang, `${campo}.${i}`)} />
        </p>
      ))}
    </div>
  )

  return (
    <section className="wrap prosa">
      {coluna(t(ui.prosa.problema, lang, 'ui.prosa.problema'), projeto.problema, `${projeto.slug}.problema`)}
      {coluna(t(ui.prosa.oQueFaz, lang, 'ui.prosa.oQueFaz'), projeto.oQueFaz, `${projeto.slug}.oQueFaz`)}
    </section>
  )
}
```

- [ ] **Passo 5: acrescentar as regras em `app/globals.css`**

```css
/* --- régua de números e prosa ------------------------------------------- */
/* A régua reusa `.num` da faixa, mas as regras de lá são escopadas em `.faixa`
   (Tarefa 9). Aqui o rótulo é `var(--calmo)`, e calmo fica em opacidade cheia:
   a 0,72 ele dá 3,12:1 no Office Timesheet. */
.regua { padding: 48px 0; border-bottom: 1px solid var(--borda); display: grid; gap: 40px; }
.regua--3 { grid-template-columns: repeat(3, 1fr); }
.regua--4 { grid-template-columns: repeat(4, 1fr); gap: 34px; }
.regua .num b {
  display: block; font-size: 40px; font-weight: 800; color: var(--destaque);
  letter-spacing: -.03em; line-height: 1;
}
.regua--4 .num b { font-size: 38px; }
.regua .num span {
  display: block; font-size: 13px; color: var(--calmo); margin-top: 8px;
  max-width: 24ch; line-height: 1.4;
}

.prosa { padding: 64px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 72px; }
.prosa h2 { margin: 0 0 14px; font-size: 19px; font-weight: 700; letter-spacing: -.015em; }
.prosa p { margin: 0 0 16px; font-size: 16px; line-height: 1.62; opacity: .88; max-width: 48ch; }
.prosa p:last-child { margin-bottom: 0; }

@media (max-width: 1000px) {
  .regua--4 { grid-template-columns: repeat(2, 1fr); gap: 32px 24px; }
}
@media (max-width: 900px) {
  .prosa { grid-template-columns: 1fr; gap: 28px; }
  .regua, .regua--3, .regua--4 { grid-template-columns: 1fr; gap: 26px; }
}
```

- [ ] **Passo 6: pendurar os dois na página**

```tsx
// em app/[lang]/[slug]/page.tsx, depois de <Destaque>:
<ReguaNumeros projeto={projeto} lang={lang} />
<Prosa projeto={projeto} lang={lang} />
```

- [ ] **Passo 7: rodar e ver passar**

Rode: `npm test -- test/componentes/regua-e-prosa.test.tsx`
Esperado: 6 testes passando.

Abra `/pt/revy` e confirme que a régua não aparece, e que a prosa encosta
direto no destaque sem buraco.

- [ ] **Passo 8: commit**

```bash
git add components/ReguaNumeros.tsx components/Prosa.tsx content/ui.ts app test
git commit -m "feat: regua de numeros e prosa, com a regua sumindo quando nao ha numero confirmado"
```

---

## Tarefa 14: A galeria — zero, uma ou duas fileiras nomeadas

Bloco 6 da spec §8. A borda aqui é o Autotune: sem galeria nenhuma.

**Arquivos:**
- Criar: `components/Galeria.tsx`
- Modificar: `app/globals.css`, `app/[lang]/[slug]/page.tsx`
- Criar teste: `test/componentes/galeria.test.tsx`

**Interfaces:**
- Consome: `Projeto`, `PrintFigura`, `t`.
- Produz: `<Galeria projeto lang />`, `null` quando não há fileira.

- [ ] **Passo 1: escrever o teste**

```tsx
// test/componentes/galeria.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Galeria } from '@/components/Galeria'
import { revy } from '@/content/projetos/revy'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { autotune } from '@/content/projetos/autotune'

describe('Galeria', () => {
  it('com uma fileira, desenha três tiras sob um título', () => {
    const { container } = render(<Galeria projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('.tiras')).toHaveLength(1)
    expect(container.querySelectorAll('figure')).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'As outras telas' })).toBeInTheDocument()
  })

  it('com duas fileiras, cada uma tem o seu título', () => {
    const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('.tiras')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'O dia de quem aponta' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'O fechamento do mês' })).toBeInTheDocument()
  })

  // A borda do Autotune: só existem quatro prints e dois são matplotlib default.
  it('sem fileira nenhuma, a seção não existe', () => {
    const { container } = render(<Galeria projeto={autotune} lang="pt" />)
    expect(container.firstChild).toBeNull()
  })

  it('toda tira leva legenda e alt', () => {
    render(<Galeria projeto={revy} lang="pt" />)
    expect(screen.getByAltText(/Painel do lojista/)).toBeInTheDocument()
    expect(screen.getByText('O painel do lojista.')).toBeInTheDocument()
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/componentes/galeria.test.tsx`
Esperado: FALHA no import de `@/components/Galeria`.

- [ ] **Passo 3: escrever `components/Galeria.tsx`**

```tsx
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { PrintFigura } from '@/components/PrintFigura'

/**
 * As outras telas, em tiras de três. O Office Timesheet tem duas fileiras
 * porque as telas dele contam duas histórias diferentes — o dia de quem aponta
 * e o fechamento do mês —, e uma fileira só apagaria essa divisão.
 *
 * O Autotune não tem galeria: o peso dele vai para o destaque e para o bloco
 * técnico.
 */
export function Galeria({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  if (projeto.galeria.length === 0) return null

  return (
    <section className="wrap galeria">
      {projeto.galeria.map((fileira, f) => (
        <div key={f}>
          <h2>{t(fileira.titulo, lang, `${projeto.slug}.galeria.${f}.titulo`)}</h2>
          <div className="tiras">
            {fileira.prints.map((print, i) => (
              <PrintFigura
                key={print.arquivo}
                print={print}
                slug={projeto.slug}
                lang={lang}
                campo={`${projeto.slug}.galeria.${f}.prints.${i}`}
                sizes="(max-width: 900px) 100vw, 372px"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Passo 4: acrescentar as regras em `app/globals.css`**

```css
/* --- galeria ------------------------------------------------------------ */
.galeria { padding: 8px 0 64px; }
.galeria h2 { margin: 0 0 22px; font-size: 13px; font-weight: 600; color: var(--calmo); }
.galeria > div + div { margin-top: 44px; }
.tiras { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }

@media (max-width: 900px) {
  .tiras { grid-template-columns: 1fr; }
}
```

- [ ] **Passo 5: pendurar na página**

```tsx
// em app/[lang]/[slug]/page.tsx, depois de <Prosa>:
<Galeria projeto={projeto} lang={lang} />
```

- [ ] **Passo 6: rodar e ver passar**

Rode: `npm test -- test/componentes/galeria.test.tsx`
Esperado: 4 testes passando.

Abra `/pt/autotune` e confirme que entre a prosa e o bloco técnico não sobrou
título órfão nem espaço morto.

- [ ] **Passo 7: commit**

```bash
git add components/Galeria.tsx app test
git commit -m "feat: galeria em fileiras nomeadas, sumindo por inteiro quando nao ha print"
```

---

## Tarefa 15: O bloco técnico — chips, terminal e notas

Bloco 7 da spec §8, o último da página. Abre avisando que dá para pular.

**Arquivos:**
- Criar: `components/BlocoTecnico.tsx`
- Modificar: `app/globals.css`, `app/[lang]/[slug]/page.tsx`
- Criar teste: `test/componentes/bloco-tecnico.test.tsx`

**Interfaces:**
- Consome: `Projeto`, `TextoComMarcas`, `t`, `ui.avisoTecnico`.
- Produz: `<BlocoTecnico projeto lang />`.

- [ ] **Passo 1: escrever o teste**

```tsx
// test/componentes/bloco-tecnico.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlocoTecnico } from '@/components/BlocoTecnico'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { autotune } from '@/content/projetos/autotune'

describe('BlocoTecnico', () => {
  it('abre dizendo que dá para pular', () => {
    render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(screen.getByText(/pode pular/)).toBeInTheDocument()
  })

  it('desenha um chip por item da stack', () => {
    const { container } = render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('.chip')).toHaveLength(revy.tecnico.stack.length)
  })

  it('duas notas viram duas colunas; quatro viram quatro', () => {
    const { container: a } = render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(a.querySelector('.notas')).toHaveClass('notas--2')
    const { container: b } = render(<BlocoTecnico projeto={autotune} lang="pt" />)
    expect(b.querySelector('.notas')).toHaveClass('notas--4')
  })

  it('nome de campo do banco sai em monoespaçada', () => {
    const { container } = render(<BlocoTecnico projeto={bddente} lang="pt" />)
    const codes = [...container.querySelectorAll('code')].map((c) => c.textContent)
    expect(codes).toContain('aceita_whatsapp')
    expect(codes).toContain('NULL')
  })

  it('o terminal do Autotune vai como texto selecionável, não como imagem', () => {
    const { container } = render(<BlocoTecnico projeto={autotune} lang="pt" />)
    const pre = container.querySelector('.terminal pre')
    expect(pre).toBeInTheDocument()
    expect(pre).toHaveTextContent('Correcao planejada')
    expect(container.querySelector('.terminal img')).toBeNull()
  })

  it('projeto sem terminal não desenha o bloco', () => {
    const { container } = render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(container.querySelector('.terminal')).toBeNull()
  })

  it('o título de nota também aceita monoespaçada', () => {
    const { container } = render(<BlocoTecnico projeto={bddente} lang="pt" />)
    expect(container.querySelector('.nota h3 code')).toBeInTheDocument()
  })
})
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npm test -- test/componentes/bloco-tecnico.test.tsx`
Esperado: FALHA no import de `@/components/BlocoTecnico`.

- [ ] **Passo 3: escrever `components/BlocoTecnico.tsx`**

```tsx
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { TextoComMarcas } from '@/components/TextoComMarcas'

/**
 * A segunda plateia — tech lead, outro dev — recebe stack e decisão de
 * engenharia aqui, no fim, marcado como pulável. É o único lugar da página
 * onde o jargão é bem-vindo.
 */
export function BlocoTecnico({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const { stack, terminal, notas } = projeto.tecnico
  const campo = `${projeto.slug}.tecnico`

  return (
    <section className="wrap tecnico">
      <p className="aviso">{t(ui.avisoTecnico, lang, 'ui.avisoTecnico')}</p>

      <div className="chips">
        {stack.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </div>

      {terminal ? (
        <>
          <div className="terminal">
            <pre>
              <b>$ {terminal.comando}</b>
              {'\n\n'}
              {terminal.saida}
            </pre>
          </div>
          <p className="legenda-terminal">
            <TextoComMarcas texto={t(terminal.legenda, lang, `${campo}.terminal.legenda`)} />
          </p>
        </>
      ) : null}

      <div className={`notas notas--${notas.length}`}>
        {notas.map((nota, i) => (
          <div className="nota" key={i}>
            <h3>
              <TextoComMarcas texto={t(nota.titulo, lang, `${campo}.notas.${i}.titulo`)} />
            </h3>
            {nota.texto.map((p, j) => (
              <p key={j}>
                <TextoComMarcas texto={t(p, lang, `${campo}.notas.${i}.texto.${j}`)} />
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Passo 4: acrescentar as regras em `app/globals.css`**

```css
/* --- bloco técnico ------------------------------------------------------ */
.tecnico { border-top: 1px solid var(--borda); padding: 56px 0 72px; }
.tecnico .aviso { margin: 0 0 30px; font-size: 14px; color: var(--calmo); max-width: 52ch; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 34px; }
.chip {
  font-size: 13px; font-weight: 500; border: 1px solid var(--borda);
  border-radius: 5px; padding: 5px 11px; color: var(--calmo); background: var(--fundo2);
}

/* O CLI vai como texto, não como print: fica nítido em qualquer tela, dá para
   selecionar, e o leitor de tela lê. */
.terminal {
  background: var(--fundo3, var(--fundo2)); border: 1px solid var(--borda);
  border-radius: 8px; padding: 22px 24px; margin: 0 0 14px; overflow-x: auto;
}
.terminal pre {
  margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12.5px; line-height: 1.7; color: var(--calmo); white-space: pre;
}
.terminal pre b { color: var(--texto); font-weight: 500; }
.legenda-terminal { margin: 0 0 40px; font-size: 13px; color: var(--calmo); max-width: 60ch; }
.legenda-terminal b { color: var(--destaque); font-weight: 700; }

.notas { display: grid; gap: 44px 48px; }
.notas--2 { grid-template-columns: 1fr 1fr; }
.notas--3 { grid-template-columns: repeat(3, 1fr); gap: 34px; }
.notas--4 { grid-template-columns: 1fr 1fr; }
.nota h3 { margin: 0 0 9px; font-size: 16px; font-weight: 700; letter-spacing: -.012em; }
.nota p { margin: 0 0 12px; font-size: 15px; line-height: 1.6; opacity: .88; max-width: 46ch; }
.nota p:last-child { margin-bottom: 0; }
/* Sem `color` próprio: herda `--texto` do parágrafo, que já vem a `.88` e é o
   nível que o contraste cobre. Pintar de `--calmo` aqui dentro daria calmo a
   0,88 — 4,27:1 no Office Timesheet. O que separa código de prosa é a
   monoespaçada, não a cor; é assim nos comps P2 e P4. */
.nota code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13.5px;
  word-break: break-word;
}
/* No título, o código fica na tinta do corpo: 16px bold não é "texto grande",
   e o destaque do Office Timesheet só tem 3,08:1 — reprovaria aqui. */
.nota h3 code {
  font-size: .94em; background: none; border: 0; padding: 0;
  color: var(--texto); font-weight: 700;
}

@media (max-width: 1000px) {
  .notas--3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 900px) {
  .notas, .notas--2, .notas--3, .notas--4 { grid-template-columns: 1fr; gap: 28px; }
}
```

- [ ] **Passo 5: pendurar na página**

```tsx
// em app/[lang]/[slug]/page.tsx, depois de <Galeria>, fechando o <main>:
<BlocoTecnico projeto={projeto} lang={lang} />
```

- [ ] **Passo 6: rodar tudo**

Rode: `npm run build`
Esperado: Vitest verde, `next build` gerando 10 páginas estáticas — `/pt`,
`/en`, e as quatro de projeto em cada idioma.

- [ ] **Passo 7: fechar a comparação com os quatro comps**

Abra as quatro páginas lado a lado com `p1` a `p4`. Confira em cada uma:
a ordem dos sete blocos, a paleta, o comportamento do bloco que aquela página
não tem, e — no Office Timesheet — que a página é a única clara.

- [ ] **Passo 8: commit**

```bash
git add components/BlocoTecnico.tsx app test
git commit -m "feat: bloco tecnico com chips, terminal em texto e 2 a 4 notas"
```

---

## Tarefa 16: O inglês

Até aqui `/en` existe e renderiza, caindo no português campo a campo. Esta
tarefa preenche os `en` e apaga os avisos.

**Arquivos:**
- Modificar: `content/projetos/{revy,bddente,office-timesheet,autotune}.ts`,
  `content/ui.ts`, `content/sobre.ts` (o `sobre.ts` já está bilíngue — só
  conferir)
- Modificar: `app/[lang]/page.tsx`, `app/[lang]/[slug]/page.tsx`
- Criar teste: `test/traducao.test.ts`

**Interfaces:**
- Consome: `t`, `avisosDeTraducao`, `limparAvisosDeTraducao`, o conteúdo.
- Produz: `en` preenchido em todo campo, e um teste que falha se algum voltar
  a faltar.

**Como traduzir.** O português já está no mesmo arquivo, no campo vizinho. Não
é tradução literal: é o mesmo texto escrito em inglês comum, com o mesmo tom
seco dos comps. Glossário para o vocabulário não oscilar entre páginas:

| pt | en |
|---|---|
| sistema fechado | private system |
| no ar | live |
| prontuário | patient records |
| apontamento (de horas) | time entry |
| apontar horas | log hours |
| lançamento clínico | clinical entry |
| revenda de veículos | vehicle dealership |
| estoque | inventory |
| escritório de arquitetura | architecture studio |
| etapa (de projeto) | phase |
| aprovação | approval |
| ficha (lateral) | at a glance |
| destaque | the main thing |
| motor (de correção) | engine |
| afinação | pitch |
| tessitura | vocal range |
| latência | latency |
| prazo | due date |
| consentimento | consent |
| lembrete | reminder |

Nomes de sistema (Revy, BDDente, Office Timesheet, Autotune), nomes de função
(`quemNaoApontou`), nomes de campo (`aceita_whatsapp`), nomes de produto
(Ableton Live, FoxPro, DeepSeek) e a saída do terminal **não se traduzem**.

- [ ] **Passo 1: escrever o teste que mede o buraco**

```ts
// test/traducao.test.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { avisosDeTraducao, limparAvisosDeTraducao, t } from '@/lib/idioma'
import type { Texto } from '@/content/tipos'
import { projetos } from '@/content/indice'
import { ui } from '@/content/ui'
import { sobre } from '@/content/sobre'

/** Varre um objeto e chama `t` em todo `Texto` que encontrar. */
function traduzirTudo(valor: unknown, caminho: string): void {
  if (valor === null || typeof valor !== 'object') return

  if (Array.isArray(valor)) {
    valor.forEach((item, i) => traduzirTudo(item, `${caminho}[${i}]`))
    return
  }

  const obj = valor as Record<string, unknown>
  if (typeof obj.pt === 'string' && Object.keys(obj).every((k) => k === 'pt' || k === 'en')) {
    t(obj as Texto, 'en', caminho)
    return
  }

  for (const [chave, dentro] of Object.entries(obj)) {
    traduzirTudo(dentro, `${caminho}.${chave}`)
  }
}

beforeEach(() => limparAvisosDeTraducao())

describe('o site inteiro em inglês', () => {
  it('não deixa nenhum campo cair no português', () => {
    traduzirTudo(ui, 'ui')
    traduzirTudo(sobre, 'sobre')
    for (const projeto of projetos) traduzirTudo(projeto, projeto.slug)

    expect(avisosDeTraducao()).toEqual([])
  })
})
```

- [ ] **Passo 2: rodar e ver a lista do que falta**

Rode: `npm test -- test/traducao.test.ts`
Esperado: FALHA com a lista completa dos campos sem `en`. Essa lista é a lista
de trabalho desta tarefa — copie-a.

- [ ] **Passo 3: preencher `en` em `content/ui.ts`**

Os campos de `ui` já nasceram bilíngues na Tarefa 8 e 13; confirme que
`prosa.problema`, `prosa.oQueFaz`, `voltar` e `sobreTitulo` também têm `en`.

- [ ] **Passo 4: traduzir a Revy**

Campos: `paraQuem`, `ficha[].rotulo`, `ficha[].valor`, `resumoHome`, `chamada`,
`problema[]`, `oQueFaz[]`, `destaque.titulo`, `destaque.texto[]`,
`destaque.prints[].alt`, `destaque.prints[].legenda`, `galeria[].titulo`,
`galeria[].prints[].alt`, `galeria[].prints[].legenda`, `links[].rotulo`,
`tecnico.notas[].titulo`, `tecnico.notas[].texto[]`.

Rode `npm test -- test/traducao.test.ts` de novo: a lista encolhe. Repita até
nenhum campo com prefixo `revy` sobrar.

- [ ] **Passo 5: traduzir o BDDente**

Mesmos campos, mais `semLink.curto`, `semLink.titulo`, `semLink.texto`. O alt do
print da agenda é longo de propósito — descreve os três estados de
consentimento —, e a versão em inglês precisa descrever os três também.

- [ ] **Passo 6: traduzir o Office Timesheet**

Mesmos campos, mais `printAbertura.alt`, `printAbertura.legenda`,
`destaque.lista.rotulo`, `destaque.amarras[].titulo`,
`destaque.amarras[].texto[]`, e as duas `galeria[].titulo`. Os 17 nomes de tool
em `destaque.lista.itens` são `string`, não `Texto`: não se traduzem e o teste
nem os visita.

- [ ] **Passo 7: traduzir o Autotune**

Mesmos campos, mais `destaque.prints[].etiqueta`, `destaque.fecho` e
`tecnico.terminal.legenda`. `terminal.comando` e `terminal.saida` são `string`
e ficam como estão — é saída de programa.

- [ ] **Passo 8: rodar e ver passar**

Rode: `npm test -- test/traducao.test.ts`
Esperado: PASSA, com `avisosDeTraducao()` vazio.

- [ ] **Passo 9: onde a falta de tradução aparece**

Não chame `imprimirAvisosDeTraducao()` dentro das páginas: os `t()` do JSX só
rodam quando o React renderiza os filhos, depois de a função da página ter
retornado, então o resumo sairia sempre vazio.

Quem vigia é `test/traducao.test.ts`, e ele roda no `npm run build` antes do
`next build` — a falta aparece na build, que é o que a spec §6 pede. A diferença
é que aqui ela **falha** em vez de avisar (ver "Divergências deliberadas"):
`imprimirAvisosDeTraducao` continua exportado para uso manual em script, e o
`t()` continua caindo no português em runtime, então uma tradução que suma nunca
quebra a página do visitante.

- [ ] **Passo 10: olhar as cinco páginas em inglês**

`npm run dev` e passe por `/en`, `/en/revy`, `/en/bddente`,
`/en/office-timesheet`, `/en/autotune`. Procure frase que ficou em português no
meio do inglês, e número com vírgula decimal onde o inglês usa ponto — os
"61,72 ms" e "0,18 ms" são `string` em `numeros[].valor` e `Print.valor`, então
**não** mudam sozinhos. Decida com o dono se viram `61.72 ms` no inglês; se
sim, esses três campos precisam virar `Texto`.

- [ ] **Passo 11: commit**

```bash
git add content test app
git commit -m "feat: site inteiro em ingles, com teste barrando campo sem traducao"
```

---

## Tarefa 17: Acessibilidade, metadata e o peso das imagens

A spec §9 inteira, mais o que o site precisa para ser achado. Última tarefa
antes do deploy.

**Arquivos:**
- Modificar: `app/[lang]/layout.tsx`, `app/[lang]/page.tsx`,
  `app/[lang]/[slug]/page.tsx`, `app/globals.css`, `next.config.ts`
- Criar: `app/icon.svg`, `app/sitemap.ts`, `app/robots.ts`,
  `app/[lang]/not-found.tsx`
- Criar teste: `test/acessibilidade.test.tsx`

**Interfaces:**
- Consome: tudo o que já existe.
- Produz: `generateMetadata` nas duas rotas, ícone, página 404.

- [ ] **Passo 1: escrever o teste**

```tsx
// test/acessibilidade.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projetos } from '@/content/indice'
import { Galeria } from '@/components/Galeria'
import { Destaque } from '@/components/Destaque'
import { FaixaProjeto } from '@/components/FaixaProjeto'

describe('alt de imagem', () => {
  it('todo print declara alt nos dois idiomas e nenhum diz "print do sistema"', () => {
    for (const projeto of projetos) {
      const prints = [
        ...(projeto.printAbertura ? [projeto.printAbertura] : []),
        ...(projeto.destaque?.prints ?? []),
        ...projeto.galeria.flatMap((f) => f.prints),
      ]
      for (const print of prints) {
        expect(print.alt.pt.length).toBeGreaterThan(20)
        expect(print.alt.pt.toLowerCase()).not.toMatch(/^print d[oa]/)
        expect(print.alt.en?.length ?? 0).toBeGreaterThan(20)
      }
    }
  })

  it('nenhuma imagem renderiza sem alt', () => {
    for (const projeto of projetos) {
      const { container } = render(
        <>
          <FaixaProjeto projeto={projeto} lang="pt" espelho={false} />
          <Destaque projeto={projeto} lang="pt" />
          <Galeria projeto={projeto} lang="pt" />
        </>,
      )
      for (const img of container.querySelectorAll('img')) {
        expect(img.getAttribute('alt')?.trim()).toBeTruthy()
      }
    }
  })
})

describe('hierarquia de títulos', () => {
  it('a faixa da home usa h2 — o h1 é a frase de abertura', () => {
    const { container } = render(
      <FaixaProjeto projeto={projetos[0]} lang="pt" espelho={false} />,
    )
    expect(container.querySelector('h1')).toBeNull()
    expect(container.querySelector('h2')).toBeInTheDocument()
  })
})
```

- [ ] **Passo 2: rodar e ver falhar ou passar**

Rode: `npm test -- test/acessibilidade.test.tsx`
Se falhar em algum `alt`, conserte o conteúdo — não o teste.

- [ ] **Passo 3: metadata da home**

```tsx
// em app/[lang]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const pt = lang !== 'en'

  return {
    title: pt
      ? 'Gabriel Cherubini — os sistemas que eu construí'
      : 'Gabriel Cherubini — the systems I built',
    description: pt
      ? 'Portfólio de Gabriel Cherubini: Revy, BDDente, Office Timesheet e Autotune, cada um com prints e explicação em português comum.'
      : 'Gabriel Cherubini’s portfolio: Revy, BDDente, Office Timesheet and Autotune, each with screenshots and a plain-language explanation.',
    alternates: {
      canonical: `/${pt ? 'pt' : 'en'}`,
      languages: { 'pt-BR': '/pt', en: '/en' },
    },
  }
}
```

- [ ] **Passo 4: metadata da página do projeto**

```tsx
// em app/[lang]/[slug]/page.tsx
import type { Metadata } from 'next'
import { t } from '@/lib/idioma'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const projeto = projetoPorSlug(slug)
  if (!projeto || !ehIdioma(lang)) return {}

  return {
    title: `${projeto.nome} — Gabriel Cherubini`,
    description: t(projeto.resumoHome, lang, `${slug}.resumoHome`),
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: { 'pt-BR': `/pt/${slug}`, en: `/en/${slug}` },
    },
    openGraph: {
      title: `${projeto.nome} — Gabriel Cherubini`,
      description: t(projeto.resumoHome, lang, `${slug}.resumoHome`),
      type: 'article',
    },
  }
}
```

- [ ] **Passo 5: metadata base no layout raiz**

```tsx
// em app/[lang]/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://gacherubini.dev'),
  authors: [{ name: 'Gabriel Cherubini', url: 'https://github.com/gacherubini' }],
}
```

- [ ] **Passo 6: o ícone, o sitemap e o robots**

`app/icon.svg` — a marca reduzida à inicial, no azul do `.dev` sobre o neutro
da casca. É a única cor fixa do site.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#FAFAF7"/>
  <text x="32" y="45" font-family="Archivo, system-ui, sans-serif" font-size="40"
        font-weight="800" text-anchor="middle" fill="#0F1317">g</text>
  <circle cx="50" cy="46" r="5" fill="#2A4FD7"/>
</svg>
```

São dez páginas e nenhum link externo apontando para cá ainda; sem sitemap o
buscador depende de rastrear a home e seguir os links das faixas. O sitemap sai
do mesmo índice que gera as rotas, então ele não pode discordar delas.

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { IDIOMAS } from '@/content/tipos'
import { projetos } from '@/content/indice'

const BASE = 'https://gacherubini.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const home = IDIOMAS.map((lang) => ({ url: `${BASE}/${lang}`, priority: 1 }))
  const paginas = IDIOMAS.flatMap((lang) =>
    projetos.map((p) => ({ url: `${BASE}/${lang}/${p.slug}`, priority: 0.8 })),
  )
  return [...home, ...paginas]
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://gacherubini.dev/sitemap.xml',
  }
}
```

Os dois já apontam para o domínio final. Enquanto ele não existe, o site sai na
URL `*.vercel.app` e essas URLs ficam erradas — de propósito: é preferível a
alternativa, que é lembrar de trocar depois.

- [ ] **Passo 7: a página 404**

```tsx
// app/[lang]/not-found.tsx
import Link from 'next/link'

export default function NaoEncontrado() {
  return (
    <main className="wrap abertura-home">
      <h1>Esta página não existe.</h1>
      <p>
        <Link href="/pt">Voltar para a home</Link>
      </p>
    </main>
  )
}
```

- [ ] **Passo 8: foco de teclado e movimento**

Confirme, em `app/globals.css`, que as três regras estão de pé:

1. `a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }`
   na casca — foco visível sobre o claro.
2. `.pagina-projeto a:focus-visible { outline: 2px solid var(--destaque); }` e
   `.fechamento a:focus-visible { outline: 2px solid #fff; }` — foco visível
   sobre fundo escuro e sobre o azul, que é o que a spec §9 pede nominalmente.
3. O bloco `@media (prefers-reduced-motion: reduce)` da Tarefa 8.

Teste com o teclado: `Tab` da barra de endereço até o fim da home, e confira que
o anel aparece em todo link, inclusive dentro das faixas escuras e do fechamento
azul.

- [ ] **Passo 9: o peso das imagens**

```ts
// em next.config.ts, dentro de nextConfig:
  images: {
    // AVIF primeiro: as capturas de 3200×2000 são o conteúdo mais pesado do
    // site, e a diferença aparece na primeira faixa.
    formats: ['image/avif', 'image/webp'],
  },
```

Rode `npm run build` e depois `npm run start`, abra `/pt` com o DevTools na aba
Network e confira:

- a primeira faixa (Revy) carrega sem esperar rolagem;
- as outras três chegam só ao rolar (`loading="lazy"`);
- os arquivos servidos são `.avif` ou `.webp`, não o PNG de 3200px;
- nenhuma requisição para `fonts.googleapis.com` — o `next/font` embute Archivo,
  e nenhuma segunda família é baixada.

- [ ] **Passo 10: conferir o 404 e o layout raiz**

Este projeto não tem `app/layout.tsx`: o layout raiz mora em
`app/[lang]/layout.tsx`, porque é lá que o `<html lang>` sabe o idioma. Rode
`npm run build` e depois `npm run start`, e confira:

- `/pt/nao-existe` cai em `app/[lang]/not-found.tsx`, com a casca;
- `/nao-existe` devolve 404 (a página padrão do Next serve).

Se o `next build` reclamar de layout raiz ausente, o conserto é criar
`app/layout.tsx` com `<html lang="pt-BR">` e mover o `<html>` do
`app/[lang]/layout.tsx` para lá — o custo é `/en` sair com `lang="pt-BR"`, e aí
vale abrir a discussão com o dono. Confirme antes que o problema é esse, e não
um import errado.

- [ ] **Passo 11: rodar tudo**

Rode: `npm run build`
Esperado: Vitest verde, 10 páginas estáticas, nenhum aviso de tradução.

- [ ] **Passo 12: commit**

```bash
git add app next.config.ts test
git commit -m "feat: metadata, sitemap, icone, 404, foco de teclado e AVIF"
```

---

## Tarefa 18: Deploy na Vercel

**Arquivos:**
- Modificar: `README.md`, `ESTADO.md`

**Interfaces:**
- Consome: o repositório inteiro.
- Produz: o site no ar.

**O domínio é slot.** `gacherubini.dev` está na lista de "a confirmar" do
`ESTADO.md` — ninguém disse se já foi comprado nem onde está o DNS. O deploy
não espera por isso: sai na URL `*.vercel.app` e o domínio entra depois, sem
rebuild.

- [ ] **Passo 1: conferir que a build local é a build da Vercel**

Rode: `npm run build`
Esperado: verde. Se o Vitest falhar aqui, falha lá — é para isso que o
`vercel.json` fixa `buildCommand`.

- [ ] **Passo 2: empurrar a branch e abrir o projeto na Vercel**

O trabalho das Tarefas 1 a 17 vive numa branch, não na `main`: o passo 4 é um
merge, e merge de branch na própria branch não existe.

```bash
git switch -c site        # se ainda não estiver nela
git push -u origin site
```

Na Vercel: **Add New → Project**, importe `gacherubini/portfolio`, framework
Next.js. Não mexa em variável de ambiente — o site não tem nenhuma.

- [ ] **Passo 3: conferir o preview**

Abra a URL de preview e passe pelas dez páginas: `/` redirecionando para `/pt`,
`/pt`, `/en`, e as quatro de projeto em cada idioma. Confira no log da build:

- Vitest rodou antes do `next build`;
- apareceu o aviso do currículo ausente;
- **não** apareceu aviso de tradução.

- [ ] **Passo 4: promover para produção**

Merge de `site` na `main` (ou **Promote to Production** no painel).

- [ ] **Passo 5: o domínio, quando ele existir**

Em **Settings → Domains**, adicione `gacherubini.dev` e `www.gacherubini.dev`.
A Vercel dá os registros; se o DNS estiver no registrador, é um `A` para
`76.76.21.21` no apex e um `CNAME` para `cname.vercel-dns.com` no `www`.
Confirme antes com o dono se o domínio já foi comprado e onde está o DNS.

Enquanto isso não acontece, a `metadataBase` já aponta para
`https://gacherubini.dev` — os links canônicos ficam certos desde o primeiro
deploy.

- [ ] **Passo 6: atualizar o `README.md`**

Troque "Estado: em construção. Design aprovado e especificado; o código do site
ainda não foi escrito" pelo estado real: no ar, com a URL, e a lista dos três
slots abertos.

- [ ] **Passo 7: atualizar o `ESTADO.md`**

Na seção **Pendências**, risque a nº 1 ("Escrever o plano de implementação") e
deixe as outras. Acrescente o que este plano deixou explícito e ainda depende do
dono:

1. o PDF do currículo em `public/`;
2. a chave da DeepSeek ou da NVIDIA para o print do `/assistente`;
3. os números de vitrine da Revy (o levantamento tem os candidatos);
4. a URL do catálogo público da Revy, para o botão secundário voltar;
5. se `61,72 ms` vira `61.72 ms` no inglês;
6. o domínio e onde está o DNS.

- [ ] **Passo 8: commit**

```bash
git add README.md ESTADO.md
git commit -m "docs: site no ar, e o que ainda depende do dono"
```

---

## Depois que estiver no ar

O que fecha cada slot, em uma linha:

- **Currículo** — jogar `curriculo-gabriel-cherubini.pdf` em `public/`. Nenhuma
  linha de código. Confirmar também se existe versão em inglês: o rótulo do
  botão é bilíngue, o arquivo é um só.
- **Print do assistente** — com uma chave válida, capturar `/assistente` pelo
  mesmo caminho dos outros 13 prints (CDP contra Chrome headless, sessão
  injetada) e acrescentar um `Print` a `destaque.prints` em
  `office-timesheet.ts`.
- **Números da Revy** — trocar `numeros: []` por 3 ou 4 itens. A régua e a linha
  da faixa voltam sozinhas.

E as decisões que o `ESTADO.md` deixou em aberto e que este plano não resolve,
porque não são dele:

- **O app de finanças volta?** A regra que o derrubou caiu no mesmo dia. Se
  voltar, é um arquivo em `content/projetos/` e uma linha em `indice.ts` — o
  plano foi montado para isso custar isso.
- **O assistente-virtual entra como cartão menor?** A spec §11 diz que sim. O
  comp de cartão existe em `mockups/camaleao.css` (`.cartao`), mas nenhum
  componente deste plano o usa: entra como tarefa nova quando a decisão for
  tomada.
- **Os gráficos 03 e 04 do Autotune entram?** Recomendação do `ESTADO.md` é não,
  e este plano os deixou de fora.
