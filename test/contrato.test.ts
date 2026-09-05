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

describe('limites máximos aceitos pelo contrato', () => {
  it('aceita ficha com cinco linhas', () => {
    const ficha = Array.from({ length: 5 }, (_, i) => ({
      rotulo: txt(`Rótulo ${i}`),
      valor: txt(`Valor ${i}`),
    }))
    expect(validarProjeto({ ...BASE, ficha })).toEqual([])
  })

  it('aceita quatro números', () => {
    const numeros = [1, 2, 3, 4].map((n) => ({ valor: String(n), rotulo: txt(String(n)) }))
    expect(validarProjeto({ ...BASE, numeros })).toEqual([])
  })

  it('aceita destaque com dois prints', () => {
    const print = { arquivo: '01-x.png', alt: txt('alt'), largura: 100, altura: 100 }
    const destaque = { titulo: txt('t'), texto: [txt('p')], prints: [print, print] }
    expect(validarProjeto({ ...BASE, destaque })).toEqual([])
  })

  it('aceita quatro notas técnicas', () => {
    const nota = { titulo: txt('t'), texto: [txt('p')] }
    expect(validarProjeto({ ...BASE, tecnico: { ...BASE.tecnico, notas: [nota, nota, nota, nota] } })).toEqual([])
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

  it.each([
    ['largura zero', 0, 10],
    ['altura zero', 10, 0],
    ['largura negativa', -1, 10],
    ['altura negativa', 10, -1],
  ])('recusa print com %s', (_caso, largura, altura) => {
    const p: Projeto = {
      ...BASE,
      galeria: [
        {
          titulo: txt('As outras telas'),
          prints: [{ arquivo: '01-x.png', alt: txt('alt'), largura, altura }],
        },
      ],
    }
    expect(validarProjeto(p).join(' ')).toMatch(/largura\/altura/)
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
