import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, it, afterEach } from 'vitest'
import { ReguaNumeros } from '@/components/ReguaNumeros'
import { Prosa } from '@/components/Prosa'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { autotune } from '@/content/projetos/autotune'

afterEach(cleanup)

describe('ReguaNumeros', () => {
  it('com quatro números, desenha quatro', () => {
    const { container } = render(<ReguaNumeros projeto={bddente} lang="pt" />)
    expect(container.querySelectorAll('.num')).toHaveLength(4)
    expect(screen.getByText('5.559')).toBeInTheDocument()
  })

  it('com três, desenha três', () => {
    const { container } = render(<ReguaNumeros projeto={autotune} lang="pt" />)
    expect(container.querySelectorAll('.num')).toHaveLength(3)
  })

  // Slot da Revy: os do seed são inventados e não podem virar vitrine.
  it('sem números confirmados, a régua não existe', () => {
    const { container } = render(<ReguaNumeros projeto={revy} lang="pt" />)
    expect(container.firstChild).toBeNull()
  })

  it('a régua ajusta as colunas ao número de itens', () => {
    const { container } = render(<ReguaNumeros projeto={bddente} lang="pt" />)
    expect(container.querySelector('.regua')).toHaveClass('regua--4')
  })
})

describe('Prosa', () => {
  it('põe o problema e o que o sistema faz lado a lado', () => {
    render(<Prosa projeto={bddente} lang="pt" />)
    expect(screen.getByRole('heading', { name: 'O problema' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'O que o sistema faz' })).toBeInTheDocument()
  })

  it('desenha um parágrafo por item', () => {
    const { container } = render(<Prosa projeto={autotune} lang="pt" />)
    expect(container.querySelectorAll('p')).toHaveLength(
      autotune.problema.length + autotune.oQueFaz.length,
    )
  })
})
