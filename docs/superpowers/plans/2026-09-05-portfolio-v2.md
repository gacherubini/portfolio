# Portfólio v2 — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar o site de `gacherubini.dev` da v1 para a v2 — tela de entrada animada, prints legíveis em pranchas que abrem, movimento discreto com o mouse, e os cortes de conteúdo que o dono pediu.

**Architecture:** O site é 100% server component hoje. A v2 acrescenta **exatamente dois componentes client** — um para o movimento do mouse e a abertura de prancha, outro nenhum: a tela de entrada é CSS puro mais um script inline de 8 linhas. Todo o resto é mudança de conteúdo, de contrato (`content/tipos.ts`) e de marcação em componentes que continuam sendo server components.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 (só o reset; a folha é CSS escrito à mão em `app/globals.css`) · Vitest + Testing Library · `next/image`.

**Spec:** `docs/superpowers/specs/2026-09-05-portfolio-v2-design.md`
Spec antecessora, ainda em vigor: `docs/superpowers/specs/2026-09-04-portfolio-design.md`
Protótipo validado com o dono: `mockups/v2-home.html`, `mockups/v2-projeto-office.html`, `mockups/v2-proto.css`, `mockups/v2-proto.js`

## Global Constraints

- **`npm test` são 163 testes em 18 arquivos e todos passam hoje. Nenhum pode
  quebrar.** `npm run build` roda `vitest run && next build`: teste vermelho
  derruba a build, e isso é o desenho.
- **Todo texto novo nasce em PT e EN, lado a lado.** `test/traducao.test.ts`
  varre o conteúdo inteiro e falha se um campo `en` estiver faltando.
- **Nenhuma regra nova de CSS pode usar `opacity` fora de
  `[0.72, 0.85, 0.88, 0.9, 0.92, 0, 1]`** (`lib/contraste.ts`,
  `test/folha.test.ts`). Abaixo de 0.72 o roxo do BDDente reprova no contraste.
- **Nada pintado com `var(--calmo)` pode receber `opacity`** menor que 1.
- **`test/folha.test.ts` acha o CSS móvel por uma string literal exata:**
  `'@media (max-width: 820px) {\n  .faixa .grade'`. **Acrescentar CSS no fim da
  folha é seguro; consolidar ou reordenar aquele bloco quebra um teste verde.**
- **Nunca inventar número de vitrine.** Número na tela é fato conferido com o
  dono. Onde o número não existe, o campo fica vazio e o componente some.
- **Toda animação é desligada por `prefers-reduced-motion: reduce`**, e todo
  efeito de cursor também por `@media (hover: none)`.
- **Nada nasce escondido no HTML.** Elementos só ficam invisíveis depois que o
  JS confirma que sabe animá-los. Sem JavaScript o site aparece inteiro.
- Idioma do código: **os identificadores e comentários deste repo são em
  português.** Seguir.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade | Task |
|---|---|---|
| `content/tipos.ts` | contrato: `+numerosHome`, `+selo`, `−destaque.lista` | 1 |
| `content/projetos/revy.ts` | números de vitrine e selo de IA | 2 |
| `content/projetos/office-timesheet.ts` | assistente reescrito, `numerosHome`, selo | 3 |
| `components/Destaque.tsx` | deixa de desenhar a lista de funções | 3 |
| `content/sobre.ts` | cortes, parágrafo de IA, sem travessão | 4 |
| `components/FaixaProjeto.tsx` | `numerosHome ?? numeros`, selo | 5 |
| `components/PrintFigura.tsx` | **todo print do site vira prancha** | 6 |
| `components/Galeria.tsx` | grade de selos → pranchas alternadas | 7 |
| `components/Movimento.tsx` | **novo, client**: abertura de prancha (FLIP) | 8 |
| `components/Movimento.tsx` | **mesmo arquivo**: mouse e entrada na rolagem | 9 |
| `components/Entrada.tsx` | **novo, server**: o véu | 10 |
| `app/[lang]/layout.tsx` | monta véu, script de sessão e `<Movimento>` | 8, 10 |
| `app/globals.css` | regras novas, sempre **no fim do arquivo** | 3, 5, 6, 7, 8, 9, 10 |
| `vitest.setup.ts` | stubs de `matchMedia`, `IntersectionObserver`, `scrollIntoView` | 8 |

`Movimento.tsx` recebe duas tasks de propósito: a Task 8 entrega a abertura de
prancha, que é o que o dono pediu; a Task 9 acrescenta o movimento do mouse, que
é enfeite. Se a Task 9 for cortada, a 8 continua de pé sozinha.

---

### Task 1: O contrato de conteúdo

**Files:**
- Modify: `content/tipos.ts`
- Test: `test/contrato.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `Projeto.numerosHome?: { valor: Texto; rotulo: Texto }[]`,
  `Projeto.selo?: Texto`. O campo `Projeto.destaque.lista` **deixa de existir**.
  `validarProjeto(p: Projeto): string[]` passa a checar os dois novos.

- [ ] **Step 1: Escrever os testes que falham**

Acrescentar ao fim de `test/contrato.test.ts`, dentro do `describe` que já existe
(ou num `describe` novo, seguindo o arquivo):

```ts
describe('numerosHome', () => {
  it('aceita ausente: quem não declara usa `numeros` na home', () => {
    expect(validarProjeto(BASE)).toEqual([])
  })

  it('aceita 3 e aceita 4', () => {
    const tres = [
      { valor: txt('1'), rotulo: txt('um') },
      { valor: txt('2'), rotulo: txt('dois') },
      { valor: txt('3'), rotulo: txt('três') },
    ]
    expect(validarProjeto({ ...BASE, numerosHome: tres })).toEqual([])
    expect(
      validarProjeto({ ...BASE, numerosHome: [...tres, { valor: txt('4'), rotulo: txt('quatro') }] }),
    ).toEqual([])
  })

  it('aceita vazio: é o estado de "ainda não confirmado"', () => {
    expect(validarProjeto({ ...BASE, numerosHome: [] })).toEqual([])
  })

  it('recusa 2, que nunca fica de pé na faixa', () => {
    const falhas = validarProjeto({
      ...BASE,
      numerosHome: [
        { valor: txt('1'), rotulo: txt('um') },
        { valor: txt('2'), rotulo: txt('dois') },
      ],
    })
    expect(falhas).toHaveLength(1)
    expect(falhas[0]).toContain('numerosHome')
  })
})

describe('selo', () => {
  it('aceita ausente', () => {
    expect(validarProjeto(BASE)).toEqual([])
  })

  it('aceita texto', () => {
    expect(validarProjeto({ ...BASE, selo: txt('IA · agente no WhatsApp') })).toEqual([])
  })

  it('recusa selo em branco, que desenharia uma pílula vazia', () => {
    const falhas = validarProjeto({ ...BASE, selo: { pt: '   ', en: '' } })
    expect(falhas).toHaveLength(1)
    expect(falhas[0]).toContain('selo')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/contrato.test.ts`
Expected: FAIL — TypeScript recusa `numerosHome` e `selo`, que não existem no tipo.

- [ ] **Step 3: Acrescentar os dois campos ao tipo**

Em `content/tipos.ts`, dentro de `export type Projeto`, logo abaixo de `numeros`:

```ts
  /**
   * A régua da **faixa da home**, quando ela precisa ser diferente da régua da
   * página do projeto. Ausente, a home usa `numeros`.
   *
   * Existe por causa do Office Timesheet: os quatro números dele ("1.452 casos
   * de teste", "148 endpoints HTTP") são de tech lead, e a home é vitrine. Eles
   * continuam existindo — na página do projeto, que é onde essa plateia chega.
   */
  numerosHome?: { valor: Texto; rotulo: Texto }[]

  /**
   * Pílula curta ao lado de "no ar"/"fechado" na faixa da home. Hoje só marca
   * quem tem IA por dentro: Revy e Office Timesheet.
   */
  selo?: Texto
```

E remover o campo `lista` de dentro de `destaque` — o bloco inteiro, com o
comentário:

```ts
    /** P3: os 17 tools de leitura, em monoespaçada porque são nomes de função. */
    lista?: { rotulo: Texto; itens: string[] }
```

- [ ] **Step 4: Acrescentar as duas validações**

Em `validarProjeto`, logo depois do bloco que valida `numeros`:

```ts
  // Mesma régua de `numeros`: 0, 3 ou 4. Dois números numa faixa nunca ficam
  // de pé — sobra um vão do tamanho de uma coluna.
  if (p.numerosHome && p.numerosHome.length !== 0 && !entre(p.numerosHome.length, 3, 4)) {
    erro(`numerosHome tem ${p.numerosHome.length}; o contrato pede 0, 3 ou 4`)
  }

  if (p.selo && !p.selo.pt.trim()) {
    erro('selo está em branco; sem texto ele vira uma pílula vazia')
  }
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run test/contrato.test.ts`
Expected: PASS. `test/conteudo.test.ts` ainda vai falhar se algum conteúdo usar
`destaque.lista` — isso é a Task 3; aqui basta que `contrato` passe.

- [ ] **Step 6: Commit**

```bash
git add content/tipos.ts test/contrato.test.ts
git commit -m "feat(contrato): numerosHome e selo entram, destaque.lista sai"
```

---

### Task 2: Revy — os números de vitrine e o selo

**Files:**
- Modify: `content/projetos/revy.ts:114` (o `numeros: []`) e o topo do objeto
- Test: `test/conteudo.test.ts`

**Interfaces:**
- Consumes: `Projeto.selo` da Task 1.
- Produces: `revy.numeros` com 3 entradas; `revy.selo`.

Números confirmados pelo dono em 05/09/2026. Fecha a pendência 7 do `ESTADO.md`.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `test/conteudo.test.ts`:

```ts
describe('Revy', () => {
  it('tem os três números de vitrine confirmados pelo dono', () => {
    expect(revy.numeros).toHaveLength(3)
    expect(revy.numeros.map((n) => n.valor.pt)).toEqual(['120', '~80%', '75'])
  })

  it('o número em inglês não usa separador de milhar do português', () => {
    for (const n of revy.numeros) expect(n.valor.en).toBeTruthy()
  })

  it('leva o selo de IA', () => {
    expect(revy.selo?.pt).toContain('IA')
  })
})
```

Se `revy` ainda não estiver importado no arquivo, acrescentar
`import { revy } from '@/content/projetos/revy'` no topo.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/conteudo.test.ts`
Expected: FAIL — `revy.numeros` tem 0 entradas.

- [ ] **Step 3: Preencher os números e o selo**

Em `content/projetos/revy.ts`, substituir o bloco `numeros: []` **e o comentário
SLOT acima dele** por:

```ts
  // Confirmados pelo dono em 05/09/2026, da loja real que usa o sistema.
  // Substituem o slot que existia desde 04/09; os do seed continuam proibidos.
  numeros: [
    {
      valor: { pt: '120', en: '120' },
      rotulo: { pt: 'pessoas atendidas por dia no WhatsApp', en: 'people served per day on WhatsApp' },
    },
    {
      valor: { pt: '~80%', en: '~80%' },
      rotulo: {
        pt: 'das conversas o agente resolve sozinho',
        en: 'of conversations the agent handles on its own',
      },
    },
    {
      valor: { pt: '75', en: '75' },
      rotulo: { pt: 'motos no estoque da loja', en: "bikes in the store's inventory" },
    },
  ],
```

E, logo depois de `situacao: 'no-ar',`:

```ts
  selo: { pt: 'IA · agente no WhatsApp', en: 'AI · WhatsApp agent' },
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run test/conteudo.test.ts test/traducao.test.ts`
Expected: PASS nos dois.

- [ ] **Step 5: Commit**

```bash
git add content/projetos/revy.ts test/conteudo.test.ts
git commit -m "feat(revy): tres numeros de vitrine confirmados e selo de IA"
```

---

### Task 3: Office Timesheet — o assistente sem as 17 funções

**Files:**
- Modify: `content/projetos/office-timesheet.ts`
- Modify: `components/Destaque.tsx` (remove o desenho de `lista`)
- Modify: `app/globals.css` (remove `.tools` e `.rotulo`)
- Test: `test/componentes/destaque.test.tsx`, `test/conteudo.test.ts`

**Interfaces:**
- Consumes: `Projeto.numerosHome`, `Projeto.selo` da Task 1.
- Produces: `officeTimesheet.numerosHome` (vazio por ora), `officeTimesheet.selo`.

- [ ] **Step 1: Escrever os testes que falham**

Em `test/componentes/destaque.test.tsx`:

```ts
it('não lista mais os nomes das funções do assistente', () => {
  const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
  expect(container.querySelector('.tools')).toBeNull()
  expect(screen.queryByText('quemNaoApontou')).not.toBeInTheDocument()
  expect(screen.queryByText('proporCriarTask')).not.toBeInTheDocument()
})

it('diz que ele chama funções do sistema, sem nomeá-las', () => {
  render(<Destaque projeto={officeTimesheet} lang="pt" />)
  expect(screen.getByText(/function calling/)).toBeInTheDocument()
})

// As três garantias são o que o bloco tem de melhor e continuam.
it('mantém as três amarras', () => {
  const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
  expect(container.querySelectorAll('.amarra')).toHaveLength(3)
})
```

Em `test/conteudo.test.ts`:

```ts
describe('Office Timesheet', () => {
  it('a régua da página encurta o rótulo do 34, que quebrava em duas linhas', () => {
    const trinta = officeTimesheet.numeros.find((n) => n.valor.pt === '34')
    expect(trinta?.rotulo.pt).toBe('funções que o assistente pode chamar')
  })

  it('leva o selo de IA', () => {
    expect(officeTimesheet.selo?.pt).toContain('IA')
  })

  // PENDENTE: os três valores só o dono tem. Enquanto não vierem, vazio — e a
  // régua da faixa some sozinha, que é o comportamento certo.
  it('declara numerosHome, ainda que vazio', () => {
    expect(officeTimesheet.numerosHome).toEqual([])
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/componentes/destaque.test.tsx test/conteudo.test.ts`
Expected: FAIL — a lista ainda é desenhada e os campos não existem.

- [ ] **Step 3: Reescrever o destaque no conteúdo**

Em `content/projetos/office-timesheet.ts`, substituir `titulo`, `texto` e
**remover `lista` inteira** (o campo e os 17 itens):

```ts
  destaque: {
    titulo: {
      pt: 'O assistente que vive dentro do sistema',
      en: 'The assistant that lives inside the system',
    },
    texto: [
      {
        pt: 'Um chat dentro do próprio sistema, construído sobre um modelo de linguagem, a DeepSeek. Em vez de abrir sete telas para montar a resposta, a pessoa pergunta em português.',
        en: 'A chat inside the system itself, built on a language model, DeepSeek. Instead of opening seven screens to piece the answer together, the person just asks in plain language.',
      },
      {
        pt: 'Ele não adivinha: responde **chamando funções do sistema**, o function calling. Cada pergunta vira uma ou mais chamadas, ele decide quais precisa, junta o que voltou e escreve a resposta. É o mesmo dado que a pessoa veria navegando, só que sem navegar.',
        en: 'It does not guess: it answers by **calling functions in the system**, function calling. Each question turns into one or more calls, it decides which ones it needs, puts together what came back and writes the answer. It is the same data the person would see browsing, minus the browsing.',
      },
    ],
    // SLOT: a AGENT_API_KEY do .env local responde 403, então não há captura da
    // tela /assistente. Com a chave válida, um Print entra aqui e preenche o
    // vazio que a saída da lista deixou à direita do bloco.
    prints: [],
    amarras: [
      // as três amarras ficam exatamente como estão
    ],
  },
```

`TextoComMarcas` já entende `**negrito**` — é assim que o resto do conteúdo
marca ênfase. Conferir em `components/TextoComMarcas.tsx` antes de escrever.

- [ ] **Step 4: Encurtar o rótulo do 34 e acrescentar selo e numerosHome**

No mesmo arquivo, dentro de `numeros`, substituir a última entrada (e o
comentário de três linhas acima dela) por:

```ts
    // Era "tools no assistente, dos quais 17 de leitura e 15 de escrita — o
    // resto é SQL avulso e meta". O rótulo comprido quebrava a régua em duas
    // linhas na faixa da home; agora esta régua só existe na página, e o
    // rótulo curto serve melhor nas duas.
    { valor: { pt: '34', en: '34' }, rotulo: { pt: 'funções que o assistente pode chamar', en: 'functions the assistant can call' } },
```

Depois de `situacao: 'fechado',`:

```ts
  selo: { pt: 'IA · assistente embutido', en: 'AI · built-in assistant' },
```

E logo depois do array `numeros`:

```ts
  // PENDENTE, BLOQUEADO NO DONO. As três métricas escolhidas são: horas
  // apontadas no sistema, projetos acompanhados, e pessoas apontando hora todo
  // dia. Os valores são do escritório real e ninguém os tem aqui — os do seed
  // são inventados e não servem. Vazio, a régua da faixa some sozinha, que é o
  // comportamento certo. Não preencher com estimativa.
  numerosHome: [],
```

- [ ] **Step 5: Parar de desenhar a lista**

Em `components/Destaque.tsx`, remover o bloco inteiro:

```tsx
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
```

Em `app/globals.css`, remover as regras `.rotulo`, `.tools`, `.tools li`,
`.tools li::before` e o comentário de quatro linhas acima delas, mais as duas
linhas de `.tools` dentro dos dois `@media` do fim daquele bloco.

- [ ] **Step 6: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS, 163 testes mais os novos. Se `folha.test.ts` reclamar, foi a
remoção do CSS — conferir que só as regras de `.tools`/`.rotulo` saíram.

- [ ] **Step 7: Commit**

```bash
git add content/projetos/office-timesheet.ts components/Destaque.tsx app/globals.css test/
git commit -m "feat(office-timesheet): assistente descrito por function calling, sem listar as 17 funcoes"
```

---

### Task 4: Sobre — 5+ anos, IA, e o travessão fora

**Files:**
- Modify: `content/sobre.ts`
- Test: `test/conteudo.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `sobre.paragrafos` com 4 entradas (era 4, muda o conteúdo);
  `sobre.ficha` com 5 linhas (era 4).

- [ ] **Step 1: Escrever os testes que falham**

```ts
describe('Sobre', () => {
  it('não fala mais de idade nem de faculdade', () => {
    const tudo = sobre.paragrafos.map((p) => `${p.pt} ${p.en}`).join(' ')
    expect(tudo).not.toMatch(/23 anos|faculdade|PUC-RS|degree/i)
  })

  // "5+ anos" não envelhece; "desde 2023" envelhece sozinho todo ano.
  it('diz o tempo de ofício em vez da data de entrada', () => {
    const tudo = sobre.paragrafos.map((p) => p.pt).join(' ')
    expect(tudo).toContain('mais de 5 anos')
    expect(tudo).not.toContain('2023')
  })

  it('diz o que ele faz com IA, e a ficha repete em uma linha', () => {
    const tudo = sobre.paragrafos.map((p) => p.pt).join(' ')
    expect(tudo).toMatch(/agent|loops de agente/i)
    expect(sobre.ficha.some((l) => l.rotulo.pt === 'IA')).toBe(true)
  })

  // Pedido do dono: travessão sai dos textos em primeira pessoa. Os textos dos
  // projetos mantêm os deles.
  it('nenhum travessão nos textos em primeira pessoa', () => {
    const alvo = [
      ...sobre.paragrafos.flatMap((p) => [p.pt, p.en ?? '']),
      ...sobre.ficha.flatMap((l) => [l.valor.pt, l.valor.en ?? '']),
      sobre.contato.telefone.via.pt,
      sobre.contato.telefone.via.en ?? '',
      sobre.contato.curriculo.rotulo.pt,
      sobre.contato.curriculo.rotulo.en ?? '',
    ]
    expect(alvo.filter((s) => s.includes('—'))).toEqual([])
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/conteudo.test.ts`
Expected: FAIL em todos os quatro.

- [ ] **Step 3: Reescrever os parágrafos**

Em `content/sobre.ts`, substituir o array `paragrafos` inteiro por:

```ts
  paragrafos: [
    {
      pt: 'Sou desenvolvedor backend. Java e Spring Boot no dia a dia, Go antes disso.',
      en: "I'm a backend developer. Java and Spring Boot day to day, Go before that.",
    },
    {
      // "desde 2023" saiu de propósito, a pedido do dono em 05/09: o tempo de
      // ofício não envelhece, a data de entrada envelhece sozinha todo ano.
      pt: 'Programo há mais de 5 anos. Moro em Porto Alegre e trabalho remoto para a Ambush, em Austin, no Texas. Comecei em Go e hoje trabalho no backend da Binance, em Java.',
      en: "I've been programming for more than 5 years. I live in Porto Alegre, Brazil, and work remotely for Ambush, in Austin, Texas. I started in Go and today I work on Binance's backend, in Java.",
    },
    {
      pt: 'Os quatro sistemas aqui de cima são de fora do expediente. Construí cada um inteiro, sozinho, e coloquei no ar com gente usando.',
      en: 'The four systems above were built outside work hours. I built each one end to end, alone, and put it in front of real users.',
    },
    {
      pt: 'IA é onde minha atenção está hoje, e não como quem usa chat. Construo por dentro: agentes que chamam funções do próprio produto, skills, loops de agente que tocam a tarefa inteira e param exatamente onde precisam de uma pessoa. O assistente do Office Timesheet e o agente de WhatsApp da Revy saíram daí. Este site também.',
      en: "AI is where my attention is right now, and not as someone who uses a chat window. I build the inside of it: agents that call functions in the product itself, skills, agent loops that carry a task all the way and stop exactly where a person is needed. The Office Timesheet assistant and Revy's WhatsApp agent came out of that. So did this site.",
    },
  ],
```

- [ ] **Step 4: Acrescentar a linha de IA na ficha**

No array `ficha`, entre `Stack` e `Inglês`:

```ts
    {
      rotulo: { pt: 'IA', en: 'AI' },
      // "modelos" saiu: a coluna da ficha tem 285px e a linha quebrava em duas.
      valor: {
        pt: 'agent loops · skills · function calling',
        en: 'agent loops · skills · function calling',
      },
    },
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run test/conteudo.test.ts test/traducao.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add content/sobre.ts test/conteudo.test.ts
git commit -m "feat(sobre): 5+ anos no lugar da data, paragrafo de IA, sem travessao"
```

---

### Task 5: A faixa da home — `numerosHome` e o selo

**Files:**
- Modify: `components/FaixaProjeto.tsx:60-72`
- Modify: `app/globals.css` (acrescentar **no fim**)
- Test: `test/componentes/faixa.test.tsx`

**Interfaces:**
- Consumes: `Projeto.numerosHome`, `Projeto.selo` das Tasks 1–3.
- Produces: nada para tasks seguintes.

- [ ] **Step 1: Escrever os testes que falham**

```ts
it('na home usa numerosHome quando o projeto declara', () => {
  const projeto = {
    ...revy,
    numeros: [{ valor: txt('999'), rotulo: txt('só da página') }],
    numerosHome: [
      { valor: txt('1'), rotulo: txt('um') },
      { valor: txt('2'), rotulo: txt('dois') },
      { valor: txt('3'), rotulo: txt('três') },
    ],
  }
  render(<FaixaProjeto projeto={projeto} lang="pt" espelho={false} />)
  expect(screen.getByText('1')).toBeInTheDocument()
  expect(screen.queryByText('999')).not.toBeInTheDocument()
})

it('sem numerosHome, cai em numeros', () => {
  render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
  expect(screen.getByText('5.559')).toBeInTheDocument()
})

// O Office Timesheet fica assim enquanto os valores reais não chegam.
it('com numerosHome vazio, a régua some da faixa', () => {
  const { container } = render(
    <FaixaProjeto projeto={{ ...revy, numerosHome: [] }} lang="pt" espelho={false} />,
  )
  expect(container.querySelector('.numeros')).toBeNull()
})

it('desenha o selo quando existe, e nada quando não existe', () => {
  const { container: com } = render(<FaixaProjeto projeto={revy} lang="pt" espelho={false} />)
  expect(com.querySelector('.selo')?.textContent).toContain('IA')
  cleanup()
  const { container: sem } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
  expect(sem.querySelector('.selo')).toBeNull()
})
```

`txt` é o mesmo ajudante de `test/contrato.test.ts`:
`const txt = (s: string) => ({ pt: s, en: s })`. Declarar no topo do arquivo se
ainda não existir.

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/componentes/faixa.test.tsx`
Expected: FAIL — `numerosHome` é ignorado e `.selo` não existe.

- [ ] **Step 3: Ler numerosHome e desenhar o selo**

Em `components/FaixaProjeto.tsx`, logo depois de `const print = printDaFaixa(projeto)`:

```tsx
  // A régua da vitrine pode ser diferente da régua da página: o Office
  // Timesheet mostra operação aqui e engenharia lá dentro.
  const numeros = projeto.numerosHome ?? projeto.numeros
```

Trocar as duas ocorrências de `projeto.numeros` dentro do JSX por `numeros`, e
o campo de tradução de `${campo}.numeros.${i}` para `${campo}.numerosDaFaixa.${i}`
não é necessário — manter `${campo}.numeros.${i}`, que é só rótulo de aviso.

Dentro de `.ficha-faixa`, entre `.paraquem` e `.situacao`:

```tsx
            {projeto.selo ? (
              <p className="selo">{t(projeto.selo, lang, `${campo}.selo`)}</p>
            ) : null}
```

- [ ] **Step 4: Acrescentar o CSS do selo no fim de `app/globals.css`**

```css
/* --- o selo de IA na faixa ---------------------------------------------- */
/* O texto herda `--texto`; quem carrega a cor do projeto é o ponto. Pintar a
   letra de `--destaque` reprovaria no portão de contraste: no Office Timesheet
   ele dá 3,08:1, e 12px em peso 600 não é "texto grande". */
.selo {
  margin: 0; font-size: 12px; font-weight: 600; opacity: .85;
  display: inline-flex; align-items: center; gap: 7px;
  border: 1px solid var(--borda); border-radius: 999px; padding: 3px 11px;
}
.selo::before {
  content: ""; flex: none; width: 7px; height: 7px;
  border-radius: 50%; background: var(--destaque);
}
/* Agora são duas pílulas: quem empurra para a direita é a primeira delas. */
.ficha-faixa { flex-wrap: wrap; }
.ficha-faixa .situacao { margin-left: 0; }
.ficha-faixa .selo { margin-left: auto; }
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npm test`
Expected: PASS. `folha.test.ts` cobre `opacity: .85`, que está na lista.

- [ ] **Step 6: Commit**

```bash
git add components/FaixaProjeto.tsx app/globals.css test/componentes/faixa.test.tsx
git commit -m "feat(faixa): numerosHome na vitrine e selo de IA ao lado da situacao"
```

---

### Task 6: Todo print do site vira prancha

**Files:**
- Modify: `components/PrintFigura.tsx`
- Modify: `app/globals.css` (acrescentar **no fim**)
- Test: `test/componentes/prancha.test.tsx` (criar)

**Interfaces:**
- Consumes: `Print` de `content/tipos.ts` (já tem `largura`, `altura`, `alt`, `legenda`).
- Produces: `PrintFigura` passa a aceitar
  `variante?: 'margem' | 'abaixo' | 'nua'` (padrão `'abaixo'`), e renderiza:

```html
<div class="prancha prancha--<variante>">
  <div class="prancha-nota"><p>legenda</p></div>   <!-- só se houver legenda e variante ≠ 'nua' -->
  <a class="prancha-alvo" href="/prints/<slug>/<arquivo>" data-largura="3200" style="--nat:3200px">
    <img …>
  </a>
</div>
```

A Task 8 lê `data-largura` e a classe `.prancha`.

- [ ] **Step 1: Escrever os testes que falham**

Criar `test/componentes/prancha.test.tsx`:

```tsx
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PrintFigura } from '@/components/PrintFigura'

afterEach(cleanup)

const PRINT = {
  arquivo: '03-tarefas-kanban.png',
  largura: 3200,
  altura: 2000,
  alt: { pt: 'Quadro de tarefas', en: 'Task board' },
  legenda: { pt: 'O quadro de tarefas.', en: 'The task board.' },
}

const padrao = { slug: 'office-timesheet', lang: 'pt' as const, campo: 'x', sizes: '100vw' }

describe('PrintFigura como prancha', () => {
  // Sem JavaScript, clicar abre o arquivo. Nunca é botão morto.
  it('o print é um link para o arquivo original', () => {
    const { container } = render(<PrintFigura print={PRINT} {...padrao} />)
    const alvo = container.querySelector('a.prancha-alvo')
    expect(alvo).toHaveAttribute('href', '/prints/office-timesheet/03-tarefas-kanban.png')
  })

  // A Task 8 precisa da largura do ARQUIVO, não da variante que o next/image
  // serviu — `naturalWidth` devolveria a segunda e a regra do 1,5× erraria.
  it('publica a largura real do arquivo para o cliente ler', () => {
    const { container } = render(<PrintFigura print={PRINT} {...padrao} />)
    expect(container.querySelector('a.prancha-alvo')).toHaveAttribute('data-largura', '3200')
  })

  it('a legenda vira nota da prancha', () => {
    const { container } = render(<PrintFigura print={PRINT} {...padrao} variante="margem" />)
    expect(container.querySelector('.prancha--margem')).not.toBeNull()
    expect(container.querySelector('.prancha-nota')?.textContent).toBe('O quadro de tarefas.')
  })

  it('na variante nua não há nota, mesmo com legenda', () => {
    const { container } = render(<PrintFigura print={PRINT} {...padrao} variante="nua" />)
    expect(container.querySelector('.prancha-nota')).toBeNull()
  })

  it('sem legenda não há nota', () => {
    const { legenda, ...semLegenda } = PRINT
    const { container } = render(<PrintFigura print={semLegenda} {...padrao} />)
    expect(container.querySelector('.prancha-nota')).toBeNull()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/componentes/prancha.test.tsx`
Expected: FAIL — hoje o componente devolve `<figure>` e não conhece `variante`.

- [ ] **Step 3: Reescrever `components/PrintFigura.tsx`**

```tsx
import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { Idioma, Print } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Todo print do site passa por aqui, e todo print do site é uma prancha.
 *
 * Uma prancha é: a imagem em tamanho de leitura, a legenda em corpo de leitura,
 * e — quando o arquivo tem resolução a revelar — um clique que a abre maior. A
 * decisão de abrir é do cliente (`components/Movimento.tsx`), porque depende da
 * largura em que a prancha está sendo exibida, que muda com o breakpoint.
 *
 * O que o servidor entrega é o dado que essa decisão precisa: `data-largura`,
 * a largura do ARQUIVO. Não usar `img.naturalWidth` no cliente — com
 * `next/image` ele é a largura da variante servida, não a do original.
 *
 * `variante`:
 *   `margem` — legenda na coluna ao lado (a galeria)
 *   `abaixo` — legenda embaixo (o print de abertura, as placas do Autotune)
 *   `nua`    — sem legenda (a faixa da home)
 */
export function PrintFigura({
  print,
  slug,
  lang,
  campo,
  sizes,
  prioridade = false,
  className,
  variante = 'abaixo',
}: {
  print: Print
  slug: string
  lang: Idioma
  campo: string
  sizes: string
  prioridade?: boolean
  className?: string
  variante?: 'margem' | 'abaixo' | 'nua'
}) {
  const caminho = `/prints/${slug}/${print.arquivo}`
  const temNota = variante !== 'nua' && Boolean(print.legenda)

  return (
    <div className={`prancha prancha--${variante}${className ? ` ${className}` : ''}`}>
      {temNota ? (
        <div className="prancha-nota">
          <p>{t(print.legenda!, lang, `${campo}.legenda`)}</p>
        </div>
      ) : null}

      <a
        className="prancha-alvo"
        href={caminho}
        data-largura={print.largura}
        style={{ '--nat': `${print.largura}px` } as CSSProperties}
      >
        <Image
          src={caminho}
          alt={t(print.alt, lang, `${campo}.alt`)}
          width={print.largura}
          height={print.altura}
          sizes={sizes}
          priority={prioridade}
          loading={prioridade ? undefined : 'lazy'}
        />
      </a>
    </div>
  )
}
```

- [ ] **Step 4: Ajustar quem chamava com `mostrarLegenda`**

`components/FaixaProjeto.tsx` passa `mostrarLegenda={false}` — trocar por
`variante="nua"`. `app/[lang]/[slug]/page.tsx` (o print de abertura) e
`components/Destaque.tsx` não passavam nada: ficam em `abaixo`, o padrão.

**E os três precisam de `sizes` novo.** Uma prancha fechada tem 567px (faixa),
880px (galeria) ou 1116px (abertura), mas **aberta vai a 1320**. Se `sizes`
declarar só a largura fechada, o `next/image` serve a variante pequena e a
abertura mostra exatamente aquilo que ela existe para consertar: uma imagem
borrada.

| Arquivo | de | para |
|---|---|---|
| `FaixaProjeto.tsx` | `(max-width: 820px) 100vw, 620px` | `(max-width: 820px) 100vw, 1320px` |
| `app/[lang]/[slug]/page.tsx` | `(max-width: 900px) 100vw, 1116px` | `(max-width: 900px) 100vw, 1320px` |
| `Destaque.tsx` | `…560px` / `…960px` | manter — as placas do Autotune nunca abrem |

- [ ] **Step 5: Acrescentar o CSS das pranchas no fim de `app/globals.css`**

```css
/* --- pranchas ------------------------------------------------------------
   Um print de 3200×2000 de um app de 1600px de CSS num quadro de 357px não é
   uma imagem pequena: é uma imagem errada. A prancha é o conserto — imagem em
   tamanho de leitura, legenda na margem em corpo de leitura. */
.prancha-alvo { display: block; position: relative; text-decoration: none; }
.prancha-alvo img {
  width: 100%; height: auto; display: block;
  border: 1px solid var(--borda); border-radius: 8px; background: var(--fundo2);
}
.prancha-nota { border-top: 1px solid var(--borda); padding-top: 15px; }
.prancha-nota p { margin: 0; font-size: 14.5px; line-height: 1.52; color: var(--calmo); }

/* Legenda embaixo: o print de abertura e as placas. */
.prancha--abaixo .prancha-nota { border-top: 0; padding-top: 11px; max-width: 64ch; }
.prancha--abaixo { display: flex; flex-direction: column-reverse; }

/* Sem moldura própria na faixa da home: lá quem emoldura é a faixa. */
.faixa .prancha-alvo img { border-radius: 8px; }
```

- [ ] **Step 6: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS. `test/componentes/galeria.test.tsx` **vai falhar** — ele conta
`figure`, que não existe mais. **Isso é a Task 7.** Se ela ainda não rodou,
ajustar só o seletor aqui (`figure` → `.prancha`) e deixar a reestruturação
para a Task 7.

- [ ] **Step 7: Commit**

```bash
git add components/PrintFigura.tsx components/FaixaProjeto.tsx app/globals.css test/componentes/
git commit -m "feat(prancha): todo print vira prancha, com a largura do arquivo publicada"
```

---

### Task 7: A galeria em pranchas alternadas

**Files:**
- Modify: `components/Galeria.tsx`
- Modify: `app/globals.css` (acrescentar **no fim**)
- Test: `test/componentes/galeria.test.tsx`

**Interfaces:**
- Consumes: `PrintFigura` com `variante="margem"` da Task 6.
- Produces: `.pranchas > .prancha` no lugar de `.tiras > figure`.

- [ ] **Step 1: Reescrever os testes**

Substituir `test/componentes/galeria.test.tsx` inteiro:

```tsx
import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, it, afterEach } from 'vitest'
import { Galeria } from '@/components/Galeria'
import { revy } from '@/content/projetos/revy'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { autotune } from '@/content/projetos/autotune'

afterEach(cleanup)

describe('Galeria', () => {
  it('com uma fileira, desenha três pranchas sob um título', () => {
    const { container } = render(<Galeria projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('.pranchas')).toHaveLength(1)
    expect(container.querySelectorAll('.prancha')).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'As outras telas' })).toBeInTheDocument()
  })

  it('com duas fileiras, cada uma tem o seu título', () => {
    const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('.pranchas')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'O dia de quem aponta' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'O fechamento do mês' })).toBeInTheDocument()
  })

  it('sem fileira nenhuma, a seção não existe', () => {
    const { container } = render(<Galeria projeto={autotune} lang="pt" />)
    expect(container.firstChild).toBeNull()
  })

  // A legenda deixou de ser rodapé e virou texto de leitura na margem.
  it('toda prancha leva legenda na margem e alt na imagem', () => {
    const { container } = render(<Galeria projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('.prancha--margem')).toHaveLength(3)
    expect(screen.getByAltText(/Painel do lojista/)).toBeInTheDocument()
    expect(screen.getByText('O painel do lojista.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/componentes/galeria.test.tsx`
Expected: FAIL — `.pranchas` e `.prancha--margem` não existem.

- [ ] **Step 3: Reescrever `components/Galeria.tsx`**

```tsx
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { PrintFigura } from '@/components/PrintFigura'

/**
 * As outras telas, em pranchas.
 *
 * Era uma grade de três selos de 357px por fileira, e eles eram ilegíveis. A
 * prancha é larga, a legenda vai para a margem em corpo de leitura, e o lado
 * alterna a cada uma — que é a mesma língua que as faixas da home já falam com
 * `espelho`. Nenhum dispositivo novo foi inventado para isto.
 *
 * O Office Timesheet tem duas fileiras porque as telas dele contam duas
 * histórias diferentes. O Autotune não tem galeria.
 */
export function Galeria({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  if (projeto.galeria.length === 0) return null

  return (
    <section className="wrap galeria">
      {projeto.galeria.map((fileira, f) => (
        <div key={f}>
          <h2>{t(fileira.titulo, lang, `${projeto.slug}.galeria.${f}.titulo`)}</h2>
          <div className="pranchas">
            {fileira.prints.map((print, i) => (
              <PrintFigura
                key={print.arquivo}
                print={print}
                slug={projeto.slug}
                lang={lang}
                campo={`${projeto.slug}.galeria.${f}.prints.${i}`}
                variante="margem"
                // Fechada a prancha tem 880px; aberta vai a 1320. `sizes`
                // precisa cobrir os dois, senão o next/image serve a variante
                // pequena e a abertura mostra uma imagem borrada.
                sizes="(max-width: 900px) 100vw, 1320px"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Step 4: Acrescentar o CSS no fim de `app/globals.css`**

```css
/* --- a galeria em pranchas ---------------------------------------------- */
.pranchas { display: grid; gap: 72px; }

.prancha--margem {
  display: grid; grid-template-columns: 196px minmax(0, 1fr);
  gap: 40px; align-items: start; scroll-margin-top: 28px;
}
/* O lado alterna, como `.faixa.espelho` na home. */
.prancha--margem:nth-child(even) { grid-template-columns: minmax(0, 1fr) 196px; }
.prancha--margem:nth-child(even) .prancha-nota { grid-column: 2; grid-row: 1; }
.prancha--margem:nth-child(even) .prancha-alvo { grid-column: 1; grid-row: 1; }

@media (max-width: 900px) {
  .prancha--margem,
  .prancha--margem:nth-child(even) { grid-template-columns: 1fr; gap: 18px; }
  .prancha--margem:nth-child(even) .prancha-nota,
  .prancha--margem:nth-child(even) .prancha-alvo { grid-column: 1; grid-row: auto; }
  .pranchas { gap: 48px; }
}
```

Remover as regras antigas `.tiras` e o `@media` de `.tiras` do bloco `--- galeria ---`.

- [ ] **Step 5: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/Galeria.tsx app/globals.css test/componentes/galeria.test.tsx
git commit -m "feat(galeria): pranchas alternadas no lugar da grade de selos"
```

---

### Task 8: A abertura da prancha (o primeiro componente client)

**Files:**
- Create: `components/Movimento.tsx`
- Modify: `app/[lang]/layout.tsx`
- Modify: `app/globals.css` (acrescentar **no fim**)
- Test: `test/componentes/movimento.test.tsx` (criar)

**Interfaces:**
- Consumes: `.prancha`, `.prancha-alvo[data-largura]` da Task 6.
- Produces: `<Movimento />`, client component sem props. Acrescenta
  `.prancha.aberta`, `.prancha--virando` e `.prancha--fixa` ao DOM.

**Esta é a task de maior risco do plano.** Cinco armadilhas foram encontradas no
protótipo, todas medidas. Estão na seção 2 da spec e repetidas nos comentários
do código abaixo. **Não simplificar nenhuma delas.**

- [ ] **Step 1: Tapar os buracos do jsdom no setup**

**Medido neste repo:** `matchMedia`, `IntersectionObserver`,
`Element.prototype.scrollIntoView` e `Element.prototype.animate` são **todos
`undefined`** no jsdom desta configuração. Sem isto o componente estoura na
primeira linha do efeito.

O remendo vai em `vitest.setup.ts`, **não em guardas dentro do componente**: o
efeito só roda em `useEffect`, sempre num navegador de verdade, e blindá-lo
contra buracos do jsdom seria dano causado pelo teste.

```ts
// jsdom não implementa nenhum dos quatro, e components/Movimento.tsx usa todos.
if (!window.matchMedia) {
  window.matchMedia = ((consulta: string) => ({
    matches: false,
    media: consulta,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    root = null
    rootMargin = ''
    thresholds: number[] = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  } as unknown as typeof window.IntersectionObserver
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {}
}

// `animate` fica de fora DE PROPÓSITO. Ausente, `virar()` cai no caminho sem
// animação e o teste exercita a mudança de estado, que é o que importa. A
// animação em si foi verificada por medição de quadro no navegador, não aqui.
```

- [ ] **Step 2: Escrever os testes que falham**

Criar `test/componentes/movimento.test.tsx`:

```tsx
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Movimento } from '@/components/Movimento'

afterEach(cleanup)

// jsdom não faz layout: toda caixa é 0×0. Cravamos as larguras que a regra do
// 1,5× precisa.
function montarPrancha(largura: number, exibida: number) {
  document.body.innerHTML = `
    <div class="prancha prancha--margem">
      <a class="prancha-alvo" href="/prints/x/a.png" data-largura="${largura}">
        <img src="/prints/x/a.png" alt="">
      </a>
    </div>`
  const alvo = document.querySelector('.prancha-alvo') as HTMLElement
  alvo.getBoundingClientRect = () =>
    ({ width: exibida, height: exibida * 0.62, left: 0, top: 0, right: exibida, bottom: 0 }) as DOMRect
  return alvo
}

afterEach(() => vi.restoreAllMocks())
beforeEach(() => document.documentElement.removeAttribute('data-mov'))

describe('a regra que decide se a prancha abre', () => {
  // 3200 contra 880 é 3,6×: abrir revela detalhe que não estava lá.
  it('abre quando o arquivo tem 1,5× ou mais que o espaço exibido', () => {
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    expect(alvo.closest('.prancha')?.classList.contains('prancha--fixa')).toBe(false)
    expect(alvo.getAttribute('href')).toBe('/prints/x/a.png')
  })

  // O Autotune: 639 contra 520 é 1,2×. Abrir só borraria.
  it('não abre quando o print já está no tamanho em que foi capturado', () => {
    const alvo = montarPrancha(639, 520)
    render(<Movimento />)
    expect(alvo.closest('.prancha')?.classList.contains('prancha--fixa')).toBe(true)
  })

  // Convite que não cumpre é pior que convite ausente.
  it('a prancha que não abre deixa de ser link', () => {
    const alvo = montarPrancha(639, 520)
    render(<Movimento />)
    expect(alvo.hasAttribute('href')).toBe(false)
  })

  it('clicar numa prancha que abre põe a classe aberta', () => {
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    alvo.click()
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(true)
  })

  it('Esc fecha', () => {
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    alvo.click()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(false)
  })
})
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npx vitest run test/componentes/movimento.test.tsx`
Expected: FAIL — `@/components/Movimento` não existe.

- [ ] **Step 4: Escrever `components/Movimento.tsx`**

```tsx
'use client'

import { useEffect } from 'react'

const DURACAO = 460
const CURVA = 'cubic-bezier(.22,.72,.24,1)'

/**
 * O único componente client do site, montado uma vez no layout.
 *
 * Nesta task ele faz uma coisa só: abrir e fechar prancha. A Task 9 acrescenta
 * o movimento com o mouse no mesmo arquivo.
 */
export function Movimento() {
  useEffect(() => {
    const raiz = document.documentElement
    const menos = matchMedia('(prefers-reduced-motion: reduce)').matches
    const pranchas = [...document.querySelectorAll<HTMLElement>('.prancha')]
    let aberta: HTMLElement | null = null

    /**
     * Uma prancha só abre quando existe resolução a revelar: o arquivo precisa
     * ter pelo menos 1,5× mais pixel que o espaço em que está sendo mostrado.
     *
     * A largura do arquivo vem de `data-largura`, do conteúdo. NÃO usar
     * `img.naturalWidth`: com `next/image` ele é a largura da variante
     * servida, e a conta erraria.
     */
    function avaliar(p: HTMLElement) {
      const alvo = p.querySelector<HTMLAnchorElement>('.prancha-alvo')
      if (!alvo) return
      const arquivo = Number(alvo.dataset.largura)
      const exibida = alvo.getBoundingClientRect().width
      if (!arquivo || !exibida) return

      const vale = arquivo >= exibida * 1.5
      p.classList.toggle('prancha--fixa', !vale)

      if (vale) {
        alvo.dataset.convite = 'ver maior'
        if (!alvo.hasAttribute('href')) alvo.setAttribute('href', alvo.dataset.arquivo ?? '')
      } else {
        // Sem href a prancha deixa de ser link: sem cursor de mão, sem clique
        // morto, sem anunciar uma coisa que não acontece.
        delete alvo.dataset.convite
        alvo.dataset.arquivo = alvo.getAttribute('href') ?? ''
        alvo.removeAttribute('href')
      }
    }

    /**
     * FLIP. Mede onde a imagem está, muda o layout de uma vez, mede de novo, e
     * devolve a imagem ao lugar antigo com um `transform` — daí anima esse
     * transform até zero.
     *
     * Por que não animar `width`: largura é propriedade de layout. O navegador
     * refaria o layout da página e reescalaria um bitmap de 3200×2000 a cada
     * quadro. Medido: com `width`, quadros de 34ms; com FLIP, 9,4ms.
     */
    function virar(p: HTMLElement, mudar: () => void) {
      const alvo = p.querySelector<HTMLElement>('.prancha-alvo')!
      const antes = alvo.getBoundingClientRect()

      // Dentro da faixa da home, `50%` no centramento resolve contra a coluna
      // do print, não contra a página — e a coluna não está no meio da tela.
      if (p.closest('.faixa')) alvo.style.setProperty('--esq', `${antes.left}px`)

      if (menos || !alvo.animate) { mudar(); return }

      p.classList.add('prancha--virando')
      mudar()

      // A rolagem entra ANTES da segunda medição, de propósito: assim o
      // transform absorve os dois movimentos de uma vez. `scrollIntoView`
      // suave rodando em paralelo põe duas animações competindo, e a página
      // desliza por baixo de uma imagem que cresce.
      if (p.classList.contains('aberta')) p.scrollIntoView({ block: 'start', behavior: 'auto' })

      const depois = alvo.getBoundingClientRect()
      const escala = depois.width ? antes.width / depois.width : 1

      const anim = alvo.animate(
        [
          {
            transformOrigin: '0 0',
            transform: `translate(${antes.left - depois.left}px, ${antes.top - depois.top}px) scale(${escala})`,
          },
          { transformOrigin: '0 0', transform: 'none' },
        ],
        { duration: DURACAO, easing: CURVA },
      )
      anim.finished.catch(() => {}).then(() => p.classList.remove('prancha--virando'))
    }

    function fechar() {
      if (!aberta) return
      const p = aberta
      aberta = null
      virar(p, () => {
        p.classList.remove('aberta')
        p.querySelector<HTMLElement>('.prancha-alvo')!.dataset.convite = 'ver maior'
      })
    }

    function abrir(p: HTMLElement) {
      if (aberta === p) { fechar(); return }
      if (aberta) {
        // Sem animar: duas pranchas se mexendo ao mesmo tempo é movimento
        // demais, e a rolagem iria para o lugar errado.
        aberta.classList.remove('aberta')
        aberta.querySelector<HTMLElement>('.prancha-alvo')!.dataset.convite = 'ver maior'
      }
      aberta = p
      virar(p, () => {
        p.classList.add('aberta')
        p.querySelector<HTMLElement>('.prancha-alvo')!.dataset.convite = 'fechar'
      })
    }

    const cliques: Array<() => void> = []
    for (const p of pranchas) {
      const alvo = p.querySelector<HTMLAnchorElement>('.prancha-alvo')
      if (!alvo) continue
      avaliar(p)
      const aoClicar = (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        if (p.classList.contains('prancha--fixa')) return
        e.preventDefault()
        abrir(p)
      }
      alvo.addEventListener('click', aoClicar)
      cliques.push(() => alvo.removeEventListener('click', aoClicar))
    }

    const aoTeclar = (e: KeyboardEvent) => { if (e.key === 'Escape') fechar() }
    // Redimensionar muda a largura exibida, e com ela a conta do 1,5×.
    const aoRedimensionar = () => pranchas.forEach(avaliar)
    document.addEventListener('keydown', aoTeclar)
    addEventListener('resize', aoRedimensionar)

    raiz.dataset.mov = 'sim'
    return () => {
      cliques.forEach((f) => f())
      document.removeEventListener('keydown', aoTeclar)
      removeEventListener('resize', aoRedimensionar)
      delete raiz.dataset.mov
    }
  }, [])

  return null
}
```

- [ ] **Step 5: Montar no layout**

Em `app/[lang]/layout.tsx`, importar e pôr como último filho de `<body>`:

```tsx
import { Movimento } from '@/components/Movimento'
// …
      <body>
        {children}
        <Movimento />
      </body>
```

- [ ] **Step 6: Acrescentar o CSS da abertura no fim de `app/globals.css`**

```css
/* --- abrir a prancha ----------------------------------------------------- */
/* 1320px: a 100vw a prancha deixa de ser prancha e vira tomada de tela; a
   1180 o salto não paga o clique. `--nat` limita: nenhum print é esticado
   além de onde foi capturado. */
:root { --aberta: min(1320px, calc(100vw - 64px)); }

.prancha-alvo { cursor: zoom-in; }
.prancha--fixa .prancha-alvo { cursor: default; }

.prancha.aberta,
.prancha--margem.aberta:nth-child(even) { grid-template-columns: minmax(0, 1fr); gap: 20px; }
.prancha.aberta .prancha-alvo { grid-column: 1; grid-row: 1; }
.prancha.aberta .prancha-nota { grid-column: 1; grid-row: 2; }

.prancha.aberta .prancha-alvo {
  --larga: min(var(--aberta), var(--nat, 100000px));
  width: var(--larga);
  margin-left: calc(50% - var(--larga) / 2);
  cursor: zoom-out;
}
.prancha.aberta .prancha-alvo img { max-width: 100%; }
.prancha.aberta .prancha-nota {
  border-top: 0; padding-top: 0; max-width: 64ch; margin: 0 auto; text-align: center;
}

/* Dentro da faixa, `50%` resolve contra a coluna do print, não contra a
   página. `--esq` é a distância do print até a borda da tela, medida no JS. */
.faixa .prancha.aberta .prancha-alvo {
  margin-left: calc(50vw - var(--larga) / 2 - var(--esq, 0px));
}
/* Uma coluna `1fr` tem piso de `min-content`: com o print a 1320px ela estoura
   e arrasta a faixa 102px de lado, e o centramento erra por exatamente isso. */
.faixa:has(.prancha.aberta) .grade { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); }
.faixa.espelho:has(.prancha.aberta) .grade { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); }

/* A legenda salta de 196px para 64ch centrada: interpolar isso nunca fica bom. */
.prancha-nota { transition: opacity .18s ease; }
.prancha--virando .prancha-nota { opacity: 0; }
.prancha--virando .prancha-alvo { will-change: transform; }

/* O convite só aparece no hover. Ícone permanente pousado em cima de toda tela
   do sistema seria sujeira. */
.prancha-alvo::after {
  content: attr(data-convite);
  position: absolute; right: 14px; bottom: 14px;
  background: var(--fundo); color: var(--texto);
  border: 1px solid var(--borda); border-radius: 999px;
  padding: 6px 14px; font-size: 12.5px; font-weight: 600;
  opacity: 0; transform: translateY(6px); pointer-events: none;
  transition: opacity .22s ease, transform .28s cubic-bezier(.2,.7,.3,1);
}
.prancha-alvo:hover::after, .prancha-alvo:focus-visible::after { opacity: 1; transform: none; }
.prancha--fixa .prancha-alvo::after { content: none; }

@media (max-width: 900px) {
  /* Numa tela estreita a prancha já ocupa quase tudo: abrir não acrescenta. */
  .prancha.aberta .prancha-alvo { width: 100%; margin-left: 0; }
  .prancha-alvo::after { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .prancha-nota, .prancha-alvo::after { transition-duration: .01ms; }
}
```

- [ ] **Step 7: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Conferir no navegador servido**

```bash
npm run build && npm start
```

Abrir `http://localhost:3000/pt/office-timesheet`. Conferir, na ordem:
1. Uma prancha da galeria abre para 1320px, **centrada**, com margem igual dos
   dois lados.
2. Na home, a prancha da faixa do BDDente abre centrada — se ela pular de lado,
   a regra `:has()` do Step 6 não entrou.
3. **A prancha do Autotune não abre e não tem cursor de mão.**
4. `Esc` fecha.
5. Com JavaScript desligado, clicar num print abre o arquivo.

- [ ] **Step 9: Commit**

```bash
git add components/Movimento.tsx vitest.setup.ts app/[lang]/layout.tsx app/globals.css test/componentes/movimento.test.tsx
git commit -m "feat(prancha): abertura por FLIP, so quando ha resolucao a revelar"
```

---

### Task 9: O movimento com o mouse

**Files:**
- Modify: `components/Movimento.tsx`
- Modify: `app/globals.css` (acrescentar **no fim**)
- Modify: `components/FaixaProjeto.tsx` (`data-brilho` na faixa)
- Test: `test/componentes/movimento.test.tsx`

**Interfaces:**
- Consumes: o `useEffect` da Task 8.
- Produces: `.revela`/`.dentro` e `[data-brilho]` no DOM.

- [ ] **Step 1: Escrever o teste que falha**

```tsx
it('sob movimento reduzido, revela tudo de uma vez em vez de animar', () => {
  // O setup já dá um matchMedia que sempre diz `false`; aqui ele passa a dizer
  // `true` só para a consulta de movimento reduzido.
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (q: string) => ({ matches: q.includes('prefers-reduced-motion') }) as MediaQueryList,
  )
  document.body.innerHTML = '<section class="faixa"><div class="revela">x</div></section>'
  render(<Movimento />)
  expect(document.querySelector('.revela')?.classList.contains('dentro')).toBe(true)
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/componentes/movimento.test.tsx`
Expected: FAIL — nada põe `.dentro`.

- [ ] **Step 3: Acrescentar o laço do mouse ao `useEffect`**

Dentro do mesmo `useEffect`, antes do `return`:

```tsx
    // --- entrada na rolagem ---
    // Os elementos nascem VISÍVEIS no HTML. Só ficam escondidos depois que o
    // JS confirma que sabe animá-los: quem está sem JS vê o site inteiro.
    const reveladores = [...document.querySelectorAll<HTMLElement>('.revela')]
    let observador: IntersectionObserver | null = null
    if (menos) {
      reveladores.forEach((n) => n.classList.add('dentro'))
    } else {
      raiz.dataset.anima = 'sim'
      observador = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue
            e.target.classList.add('dentro')
            observador!.unobserve(e.target)
          }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
      )
      reveladores.forEach((n) => observador!.observe(n))
    }

    // --- o cursor ---
    // As caixas ficam em cache. Medir `.cta` a cada quadro força recálculo de
    // layout a cada movimento do cursor, e engasga a página inteira — não só a
    // imagem. Medido: 346 movimentos em 1,4s, pior quadro 9,2ms.
    let px = 0, py = 0, pendente = false, sujo = true
    let botoes: HTMLElement[] = []
    let caixas = new WeakMap<Element, DOMRect>()
    let inclinado: HTMLElement | null = null

    function medir() {
      botoes = [...document.querySelectorAll<HTMLElement>('.cta')]
      caixas = new WeakMap()
      for (const el of [...botoes, ...document.querySelectorAll('[data-brilho], .col-print')]) {
        caixas.set(el, el.getBoundingClientRect())
      }
      sujo = false
    }
    const caixa = (el: Element) => {
      const r = caixas.get(el)
      if (r) return r
      const novo = el.getBoundingClientRect()
      caixas.set(el, novo)
      return novo
    }

    function pintar() {
      pendente = false
      if (sujo) medir()
      const sob = document.elementFromPoint(px, py)

      const brilho = sob?.closest<HTMLElement>('[data-brilho]')
      if (brilho) {
        const r = caixa(brilho)
        brilho.style.setProperty('--mx', `${((px - r.left) / r.width) * 100}%`)
        brilho.style.setProperty('--my', `${((py - r.top) / r.height) * 100}%`)
      }

      for (const b of botoes) {
        const r = caixa(b)
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        if (Math.hypot(px - cx, py - cy) < 110) {
          b.style.setProperty('--dx', `${Math.max(-5, Math.min(5, (px - cx) * 0.16))}px`)
          b.style.setProperty('--dy', `${Math.max(-5, Math.min(5, (py - cy) * 0.16))}px`)
        } else {
          b.style.removeProperty('--dx')
          b.style.removeProperty('--dy')
        }
      }

      // Prancha aberta não inclina: ela já é o assunto da tela, e um segundo
      // `transform` brigaria com o da abertura.
      let col = sob?.closest<HTMLElement>('.col-print') ?? null
      if (col?.classList.contains('aberta')) col = null
      if (inclinado && inclinado !== col) {
        const f = inclinado.querySelector<HTMLElement>('.prancha-alvo')
        f?.style.removeProperty('--rx')
        f?.style.removeProperty('--ry')
      }
      inclinado = col
      if (col) {
        const f = col.querySelector<HTMLElement>('.prancha-alvo')
        const r = caixa(col)
        f?.style.setProperty('--ry', `${(((px - r.left) / r.width - 0.5) * 5).toFixed(2)}deg`)
        f?.style.setProperty('--rx', `${(((py - r.top) / r.height - 0.5) * -5).toFixed(2)}deg`)
      }
    }

    const aoMover = (e: PointerEvent) => {
      px = e.clientX; py = e.clientY
      if (!pendente) { pendente = true; requestAnimationFrame(pintar) }
    }
    const sujar = () => { sujo = true }
    if (!menos) {
      addEventListener('pointermove', aoMover, { passive: true })
      addEventListener('scroll', sujar, { passive: true })
    }
```

E no `return` de limpeza:

```tsx
      observador?.disconnect()
      removeEventListener('pointermove', aoMover)
      removeEventListener('scroll', sujar)
      delete raiz.dataset.anima
```

- [ ] **Step 4: Marcar as faixas**

Em `components/FaixaProjeto.tsx`, na `<section className={...}>`, acrescentar
`data-brilho`. Em `app/[lang]/[slug]/page.tsx`, o mesmo na `<section className="destaque">`
não é necessário — o `Destaque.tsx` é quem desenha; acrescentar `data-brilho`
lá, na `<section className="destaque">`.

Marcar com `revela` (junto das classes que já existem): `.col-texto` e
`.col-print` em `FaixaProjeto`, o `<div>` e o `<aside>` de `AberturaProjeto`,
cada `.prancha` na `Galeria`, o `<div>` e o `.rail` do `Sobre`, e as seções
`.regua`, `.prosa` e `.tecnico`.

- [ ] **Step 5: Acrescentar o CSS no fim de `app/globals.css`**

```css
/* --- movimento ----------------------------------------------------------- */
[data-brilho] { position: relative; isolation: isolate; }
[data-brilho] > * { position: relative; z-index: 1; }
[data-brilho]::before {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
  opacity: 0; transition: opacity .45s ease;
  background: radial-gradient(460px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--destaque) 13%, transparent), transparent 68%);
}
html[data-mov] [data-brilho]:hover::before { opacity: 1; }

html[data-mov] .cta {
  transform: translate(var(--dx, 0px), var(--dy, 0px));
  transition: transform .28s cubic-bezier(.2,.7,.3,1);
}
html[data-mov] .col-print .prancha-alvo {
  transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform .4s cubic-bezier(.2,.7,.3,1);
}
/* Na cascata, uma transição de CSS vence uma animação de script: sem isto a
   transição da inclinação sequestra o FLIP da abertura. */
html[data-mov] .prancha--virando .prancha-alvo { transition: none; }
html[data-mov] .prancha.aberta .prancha-alvo { transform: none; }

html[data-anima] .revela {
  opacity: 0; transform: translateY(18px);
  transition: opacity .62s cubic-bezier(.2,.7,.3,1), transform .62s cubic-bezier(.2,.7,.3,1);
}
html[data-anima] .revela.dentro { opacity: 1; transform: none; }

@media (hover: none) {
  html[data-mov] .cta,
  html[data-mov] .col-print .prancha-alvo { transform: none; }
  [data-brilho]::before { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  html[data-anima] .revela { opacity: 1; transform: none; }
  html[data-mov] .cta,
  html[data-mov] .col-print .prancha-alvo { transform: none; }
  [data-brilho]::before { display: none; }
}
```

**Atenção:** `opacity: 0` e `opacity: 1` estão na lista permitida de
`folha.test.ts`. Nenhum outro valor de `opacity` pode entrar neste bloco.

- [ ] **Step 6: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/Movimento.tsx components/FaixaProjeto.tsx components/Destaque.tsx app/globals.css test/
git commit -m "feat(movimento): brilho, imas, inclinacao e entrada na rolagem, com caixas em cache"
```

---

### Task 10: A tela de entrada

**Files:**
- Create: `components/Entrada.tsx`
- Modify: `app/[lang]/layout.tsx`
- Modify: `app/globals.css` (acrescentar **no fim**)
- Test: `test/componentes/entrada.test.tsx` (criar)

**Interfaces:**
- Consumes: nada.
- Produces: `<Entrada />`, **server component**. Não é client: se fosse, o
  visitante veria a home por um quadro antes de o véu cobrir.

- [ ] **Step 1: Escrever os testes que falham**

Criar `test/componentes/entrada.test.tsx`:

```tsx
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Entrada } from '@/components/Entrada'

afterEach(cleanup)

describe('a tela de entrada', () => {
  // Leitor de tela nunca deve narrar o véu: a home inteira está atrás dele.
  it('é invisível para tecnologia assistiva', () => {
    const { container } = render(<Entrada />)
    expect(container.querySelector('.entrada')).toHaveAttribute('aria-hidden', 'true')
  })

  it('não tem nada focável dentro: o véu nunca prende o teclado', () => {
    const { container } = render(<Entrada />)
    const focavel = container.querySelectorAll('a, button, input, [tabindex]')
    expect(focavel).toHaveLength(0)
  })

  it('leva a marca e a régua das quatro cores', () => {
    const { container } = render(<Entrada />)
    expect(container.querySelector('.marca')?.textContent).toBe('gacherubini.dev')
    expect(container.querySelector('.entrada-regua i')).not.toBeNull()
  })
})
```

E em `test/folha.test.ts`:

```ts
it('a régua da entrada corre em linear, para a cor acompanhar a largura', () => {
  // As trocas de cor são temporais (25/50/75%). Com aceleração, largura e cor
  // deixariam de andar juntas e as duas últimas cores quase não apareceriam.
  const regra = folha.match(/\.entrada-regua i \{([^}]*)\}/)?.[1] ?? ''
  expect(regra).toMatch(/ent-corre[^,]*linear/)
})

it('movimento reduzido não vê véu nenhum', () => {
  expect(folha).toMatch(/prefers-reduced-motion[\s\S]*?\.entrada\s*\{[^}]*display:\s*none/)
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run test/componentes/entrada.test.tsx test/folha.test.ts`
Expected: FAIL — o componente não existe.

- [ ] **Step 3: Escrever `components/Entrada.tsx`**

```tsx
import { Marca } from '@/components/Marca'

/**
 * O véu que cobre a home enquanto a marca se revela e uma régua atravessa as
 * quatro cores dos quatro sistemas. Ensina a ideia do site — não tenho cor,
 * visto a de cada sistema — antes de o site aparecer.
 *
 * **Server component, de propósito.** Como componente client ele só existiria
 * depois da hidratação, e o visitante veria a home por um quadro antes de o
 * véu cobrir. Toda a animação é `@keyframes` com `forwards`: zero JavaScript
 * no caminho feliz.
 *
 * `aria-hidden` e sem nada focável: a home inteira está no DOM atrás dele, e o
 * véu nunca prende o teclado nem é narrado.
 */
export function Entrada() {
  return (
    <div className="entrada" aria-hidden="true">
      <div className="entrada-centro">
        <Marca variante="casca" />
        <div className="entrada-regua">
          <i />
        </div>
      </div>
    </div>
  )
}
```

Conferir a assinatura real de `components/Marca.tsx` antes de escrever — se a
prop não se chamar `variante`, usar a que existe.

- [ ] **Step 4: Montar no layout, com o script de sessão**

Em `app/[lang]/layout.tsx`:

```tsx
      <head>
        {/* Toca uma vez por sessão. Inline e antes do corpo porque precisa
            valer no primeiro quadro: em `useEffect` o véu piscaria em toda
            navegação. `try` porque navegador em modo restrito lança ao ler
            sessionStorage, e aí o certo é mostrar o véu, não quebrar. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('entrada')){document.documentElement.dataset.entrada='visto'}else{sessionStorage.setItem('entrada','1')}}catch(e){}",
          }}
        />
      </head>
      <body>
        <Entrada />
        {children}
        <Movimento />
      </body>
```

- [ ] **Step 5: Acrescentar o CSS no fim de `app/globals.css`**

```css
/* --- a tela de entrada --------------------------------------------------- */
.entrada {
  position: fixed; inset: 0; z-index: 90;
  display: grid; place-items: center;
  /* O clarão central não é estilo: a marca fica no meio exato da tela, que é
     justo onde a abertura clara vira a faixa preta da Revy. Numa janela mais
     alta a marca escura cairia sobre o preto e sumiria. */
  background:
    radial-gradient(circle 440px at 50% 50%,
      color-mix(in srgb, var(--casca) 75%, transparent) 0%, transparent 72%),
    color-mix(in srgb, var(--casca) 85%, transparent);
  backdrop-filter: blur(14px) saturate(.5);
  -webkit-backdrop-filter: blur(14px) saturate(.5);
  animation: ent-veu .42s cubic-bezier(.55,0,.35,1) 1.06s forwards;
}
html[data-entrada="visto"] .entrada { display: none; }
@keyframes ent-veu { to { opacity: 0; visibility: hidden; pointer-events: none; } }

.entrada-centro { display: grid; justify-items: center; }
.entrada .marca {
  font-size: 26px; letter-spacing: -.02em;
  clip-path: inset(0 100% 0 0);
  animation: ent-marca .62s cubic-bezier(.22,.61,.36,1) forwards;
}
@keyframes ent-marca { to { clip-path: inset(0 0 0 0); } }

.entrada-regua {
  width: 244px; height: 3px; margin-top: 20px; border-radius: 3px;
  background: var(--regua); overflow: hidden;
}
.entrada-regua i {
  display: block; height: 100%; width: 0; border-radius: 3px;
  animation: ent-corre 1.05s linear forwards, ent-cor 1.05s linear forwards;
}
@keyframes ent-corre { from { width: 0 } to { width: 100% } }
/* Em degrau, sem transição entre as cores: com degradê vira arco-íris e some
   a ideia de que são quatro sistemas. */
@keyframes ent-cor {
  0%,   24.99% { background: #7FBFA3 }
  25%,  49.99% { background: #5A21B4 }
  50%,  74.99% { background: #CB6D31 }
  75%,    100% { background: #F3B843 }
}

@media (prefers-reduced-motion: reduce) {
  .entrada { display: none; }
}
```

- [ ] **Step 7: Rodar a suíte inteira**

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Conferir no navegador servido**

```bash
npm run build && npm start
```

1. Abrir `http://localhost:3000/pt` numa aba nova: o véu toca, ~1,5s.
2. Clicar em "Ver o projeto" e voltar: **o véu não toca de novo.**
3. Abrir numa janela anônima: toca.
4. Ligar "reduzir movimento" no sistema: não toca, a home aparece direto.

- [ ] **Step 8: Commit**

```bash
git add components/Entrada.tsx app/[lang]/layout.tsx app/globals.css test/
git commit -m "feat(entrada): veu camaleao em CSS puro, uma vez por sessao"
```

---

### Task 11: Fechamento — acessibilidade, contraste e build

**Files:**
- Modify: `test/acessibilidade.test.tsx`
- Modify: `ESTADO.md`, `README.md`

- [ ] **Step 1: Escrever os testes de portão**

```tsx
it('a prancha aberta não some para o leitor de tela', () => {
  // A abertura muda tamanho, não presença: nada de `aria-hidden` na prancha.
  const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
  for (const p of container.querySelectorAll('.prancha')) {
    expect(p.getAttribute('aria-hidden')).toBeNull()
  }
})

it('todo print continua com alt não vazio', () => {
  const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
  for (const img of container.querySelectorAll('img')) {
    expect(img.getAttribute('alt')?.trim()).toBeTruthy()
  }
})
```

- [ ] **Step 2: Rodar tudo**

Run: `npm test && npm run build`
Expected: tudo verde. O único aviso esperado é o do currículo ausente.
**Não pode aparecer aviso de tradução.**

- [ ] **Step 3: Passar o olho na página servida, nos dois idiomas**

`npm start`, e conferir `/pt`, `/en`, `/pt/office-timesheet`, `/en/revy`:
a régua do Office Timesheet **não aparece** na faixa da home (é o esperado
enquanto `numerosHome` está vazio), a da Revy aparece com os três números, e o
foco de teclado é visível em toda prancha que abre.

- [ ] **Step 4: Atualizar `ESTADO.md`**

- Pendência 7 (números da Revy) → **fechada**.
- Pendência nova: **os três números do Office Timesheet**, bloqueada no dono.
- A tabela "O destaque de cada projeto" muda para o Office Timesheet: não é mais
  "a lista dos 17 tools".
- Registrar que `mockups/v2-*.html` são o protótipo da v2.

- [ ] **Step 5: Commit**

```bash
git add test/acessibilidade.test.tsx ESTADO.md README.md
git commit -m "docs: estado da v2, com os numeros do Office Timesheet como pendencia aberta"
```

---

## Depende do dono, não do código

1. **Os três números do Office Timesheet** — horas apontadas, projetos
   acompanhados, pessoas apontando todo dia. Sem eles a Task 3 entrega
   `numerosHome: []` e a faixa fica sem régua. **Não inventar.**
2. **O print da tela `/assistente`** — bloqueado por `AGENT_API_KEY` 403. O slot
   existe e o bloco funciona sem ele.
