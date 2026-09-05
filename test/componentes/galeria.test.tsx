import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, it, afterEach } from 'vitest'
import { Galeria } from '@/components/Galeria'
import { revy } from '@/content/projetos/revy'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { autotune } from '@/content/projetos/autotune'

afterEach(cleanup)

describe('Galeria', () => {
  it('com uma fileira, desenha três pranchas sob um título', () => {
    const { container } = render(<Galeria projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('.pranchas')).toHaveLength(1)
    expect(container.querySelectorAll('.prancha')).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'As outras telas' })).toBeInTheDocument()
  })

  it('com duas fileiras, cada uma tem o seu título', () => {
    const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('.pranchas')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'O dia de quem aponta' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'O fechamento do mês' })).toBeInTheDocument()
  })

  it('sem fileira nenhuma, a seção não existe', () => {
    const { container } = render(<Galeria projeto={autotune} lang="pt" />)
    expect(container.firstChild).toBeNull()
  })

  // A legenda deixou de ser rodapé e virou texto de leitura na margem.
  it('toda prancha leva legenda na margem e alt na imagem', () => {
    const { container } = render(<Galeria projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('.prancha--margem')).toHaveLength(3)
    expect(screen.getByAltText(/Painel do lojista/)).toBeInTheDocument()
    expect(screen.getByText('O painel do lojista.')).toBeInTheDocument()
  })
})
