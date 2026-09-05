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
