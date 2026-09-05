import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, it, afterEach } from 'vitest'
import { BlocoTecnico } from '@/components/BlocoTecnico'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { autotune } from '@/content/projetos/autotune'

afterEach(cleanup)

describe('BlocoTecnico', () => {
  it('abre dizendo que dá para pular', () => {
    render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(screen.getByText(/pode pular/)).toBeInTheDocument()
  })

  it('desenha um chip por item da stack', () => {
    const { container } = render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('.chip')).toHaveLength(revy.tecnico.stack.length)
  })

  it('duas notas viram duas colunas; quatro viram quatro', () => {
    const { container: a } = render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(a.querySelector('.notas')).toHaveClass('notas--2')
    const { container: b } = render(<BlocoTecnico projeto={autotune} lang="pt" />)
    expect(b.querySelector('.notas')).toHaveClass('notas--4')
  })

  it('nome de campo do banco sai em monoespaçada', () => {
    const { container } = render(<BlocoTecnico projeto={bddente} lang="pt" />)
    const codes = [...container.querySelectorAll('code')].map((c) => c.textContent)
    expect(codes).toContain('aceita_whatsapp')
    expect(codes).toContain('NULL')
  })

  it('o terminal do Autotune vai como texto selecionável, não como imagem', () => {
    const { container } = render(<BlocoTecnico projeto={autotune} lang="pt" />)
    const pre = container.querySelector('.terminal pre')
    expect(pre).toBeInTheDocument()
    expect(pre).toHaveTextContent('Correcao planejada')
    expect(container.querySelector('.terminal img')).toBeNull()
  })

  it('projeto sem terminal não desenha o bloco', () => {
    const { container } = render(<BlocoTecnico projeto={revy} lang="pt" />)
    expect(container.querySelector('.terminal')).toBeNull()
  })

  it('o título de nota também aceita monoespaçada', () => {
    const { container } = render(<BlocoTecnico projeto={bddente} lang="pt" />)
    expect(container.querySelector('.nota h3 code')).toBeInTheDocument()
  })
})
