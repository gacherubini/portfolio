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
