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

  it('recusa tema que passa cheio, mas falha em texto a 0,72', () => {
    const falhas = verificarTema('opacidade', {
      ...TEMA_BOM,
      texto: '#8FAAA6',
    })
    expect(falhas.some((falha) => falha.includes('texto/fundo ('))).toBe(false)
    expect(falhas.join(' ')).toMatch(/texto@0\.72\/fundo/)
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
    expect(OPACIDADES_DE_TEXTO).not.toHaveLength(0)
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
    expect(OPACIDADES_NO_AZUL).not.toHaveLength(0)
    expect(Math.min(...OPACIDADES_NO_AZUL)).toBeGreaterThanOrEqual(0.85)
  })
})
