import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Marca } from '@/components/Marca'
import { CabecalhoCasca } from '@/components/CabecalhoCasca'

afterEach(() => cleanup())

describe('Marca', () => {
  it('escreve o domínio inteiro', () => {
    render(<Marca variante="casca" />)
    expect(screen.getByText(/gacherubini/)).toBeInTheDocument()
    expect(screen.getByText('.dev')).toBeInTheDocument()
  })

  it('na casca o .dev fica azul da marca', () => {
    const { container } = render(<Marca variante="casca" />)
    expect(container.querySelector('.marca')).toHaveClass('marca--casca')
  })

  it('dentro de faixa colorida a marca é monocromática', () => {
    const { container } = render(<Marca variante="mono" />)
    expect(container.querySelector('.marca')).toHaveClass('marca--mono')
  })
})

describe('CabecalhoCasca', () => {
  it('leva Projetos e Sobre, e o Sobre é âncora e não rota', () => {
    render(<CabecalhoCasca lang="pt" />)
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '#sobre')
  })

  it('marca o idioma corrente e linka o outro', () => {
    render(<CabecalhoCasca lang="pt" />)
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en')
    expect(screen.getByText('PT')).toHaveAttribute('aria-current', 'true')
  })

  it('em inglês, inverte', () => {
    render(<CabecalhoCasca lang="en" />)
    expect(screen.getByRole('link', { name: 'PT' })).toHaveAttribute('href', '/pt')
  })
})
