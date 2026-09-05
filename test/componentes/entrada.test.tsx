import { readFileSync } from 'node:fs'
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

describe('o script que marca a entrada como vista', () => {
  const layout = readFileSync('app/[lang]/layout.tsx', 'utf8')

  it('avisa o React que o atributo do <html> é só do cliente', () => {
    // O script roda antes do primeiro quadro e põe `data-entrada="visto"` no
    // <html>. O HTML do servidor não tem esse atributo, e não pode ter: ele sai
    // do sessionStorage, que só existe no navegador, e estas páginas são
    // geradas estáticas. Da segunda carga da sessão em diante o React acha a
    // diferença ao hidratar e derruba um erro no console.
    //
    // `suppressHydrationWarning` é a saída documentada para exatamente este
    // caso, e vale UM nível: cala os atributos do próprio <html>, nunca os dos
    // filhos. Tirar isto daqui devolve o erro.
    // Os comentários saem antes da busca: o próprio comentário que explica
    // isto no layout cita `<html>`, e sem tirá-los o regex casa a citação.
    const codigo = layout.replace(/^\s*\/\/.*$/gm, '')
    const tagHtml = codigo.match(/<html\s[\s\S]*?>/)?.[0] ?? ''
    expect(tagHtml).toContain('suppressHydrationWarning')
  })
})
