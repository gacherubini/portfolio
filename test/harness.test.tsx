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
