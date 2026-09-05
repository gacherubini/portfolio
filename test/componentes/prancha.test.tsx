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

// Os 502 em produção vieram daqui: o `next/image` pedia variantes de até
// 3840px de um PNG de 3200×2000, e o sharp estourava os 256MB da máquina
// encodando AVIF nesse tamanho — o kernel matava o servidor e a VM reiniciava.
// A prancha maior do site tem 1320px de CSS. Nada acima de 2×1320 serve para
// alguma coisa, e nada disso precisa ser feito em runtime: os prints são
// estáticos e conhecidos no build.
describe('PrintFigura não otimiza imagem em runtime', () => {
  it('serve AVIF e WebP prontos, não o otimizador do Next', () => {
    const { container } = render(<PrintFigura print={PRINT} {...padrao} />)

    const avif = container.querySelector('picture source[type="image/avif"]')
    const webp = container.querySelector('picture source[type="image/webp"]')

    expect(avif?.getAttribute('srcset')).toContain('/prints-otimizados/office-timesheet/')
    expect(avif?.getAttribute('srcset')).toContain('.avif')
    expect(webp?.getAttribute('srcset')).toContain('.webp')
    expect(container.innerHTML).not.toContain('/_next/image')
  })

  it('não pede largura acima do dobro da prancha de 1320px', () => {
    const { container } = render(<PrintFigura print={PRINT} {...padrao} />)
    const srcset = container.querySelector('picture source')!.getAttribute('srcset')!
    const larguras = [...srcset.matchAll(/(\d+)w/g)].map((m) => Number(m[1]))

    expect(larguras.length).toBeGreaterThan(1)
    expect(Math.max(...larguras)).toBeLessThanOrEqual(2640)
  })

  it('carrega o sizes e o lazy que o chamador pediu', () => {
    const { container } = render(<PrintFigura print={PRINT} {...padrao} sizes="50vw" />)
    expect(container.querySelector('picture source')).toHaveAttribute('sizes', '50vw')
    expect(container.querySelector('img')).toHaveAttribute('loading', 'lazy')
  })
})
