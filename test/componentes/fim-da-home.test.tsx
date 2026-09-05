import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Sobre } from '@/components/Sobre'
import { Fechamento } from '@/components/Fechamento'

afterEach(() => cleanup())

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
