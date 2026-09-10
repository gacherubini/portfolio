import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { join } from 'node:path'
import { Sobre } from '@/components/Sobre'
import { curriculoDisponivel } from '@/lib/curriculo'

const fsMock = vi.hoisted(() => ({
  existsSync: vi.fn(() => false),
}))

vi.mock('node:fs', () => ({ ...fsMock, default: fsMock }))

afterEach(() => cleanup())

describe('Sobre', () => {
  it('é âncora #sobre, não rota', () => {
    const { container } = render(<Sobre lang="pt" temCurriculo />)
    expect(container.querySelector('#sobre')).toBeInTheDocument()
  })

  it('abre com a lede e traz a ficha ao lado', () => {
    const { container } = render(<Sobre lang="pt" temCurriculo />)
    expect(screen.getByText(/Sou desenvolvedor backend/)).toBeInTheDocument()
    expect(screen.getByText('Onde')).toBeInTheDocument()
    // "Porto Alegre" sai duas vezes na tela: no segundo parágrafo e na ficha.
    // `getByText` estoura com dois matches, e o que este teste quer é a ficha.
    expect(container.querySelector('.rail dd')).toHaveTextContent('Porto Alegre')
  })
})

// A faixa azul do fim da home saiu em 09/09/2026. Tudo o que morava lá — o
// e-mail, o WhatsApp e o currículo — passou para o `.rail` do Sobre, que virou
// o único ponto de contato do site.
describe('O contato dentro do Sobre', () => {
  it('leva GitHub, LinkedIn e e-mail', () => {
    render(<Sobre lang="pt" temCurriculo />)
    expect(screen.getByRole('link', { name: /GitHub/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /E-mail/ })).toHaveAttribute(
      'href',
      'mailto:bielche2009@hotmail.com',
    )
  })

  it('o telefone é link direto de WhatsApp', () => {
    render(<Sobre lang="pt" temCurriculo />)
    expect(screen.getByRole('link', { name: /\(51\) 98033-6365/ })).toHaveAttribute(
      'href',
      'https://wa.me/5551980336365',
    )
  })

  it('com o PDF em public, oferece o currículo', () => {
    render(<Sobre lang="pt" temCurriculo />)
    expect(screen.getByRole('link', { name: /Baixar o currículo/ })).toHaveAttribute(
      'href',
      '/curriculo-gabriel-cherubini.pdf',
    )
  })

  // O slot: nunca um botão que baixa 404.
  it('sem o PDF, o botão simplesmente não existe', () => {
    render(<Sobre lang="pt" temCurriculo={false} />)
    expect(screen.queryByRole('link', { name: /currículo/i })).not.toBeInTheDocument()
  })
})

describe('Slot do currículo', () => {
  it('retorna falso quando o filesystem informa que o PDF não existe', () => {
    fsMock.existsSync.mockReturnValue(false)

    expect(curriculoDisponivel()).toBe(false)
    expect(fsMock.existsSync).toHaveBeenCalledWith(
      join(process.cwd(), 'public', 'curriculo-gabriel-cherubini.pdf'),
    )
  })
})
