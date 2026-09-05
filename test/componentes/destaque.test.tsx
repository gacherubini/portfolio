import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, it, afterEach } from 'vitest'
import { Destaque } from '@/components/Destaque'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { autotune } from '@/content/projetos/autotune'

afterEach(cleanup)

describe('Destaque', () => {
  it('com dois prints, desenha as duas placas', () => {
    const { container } = render(<Destaque projeto={revy} lang="pt" />)
    expect(container.querySelectorAll('figure')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: /agente de atendimento/i })).toBeInTheDocument()
  })

  it('com um print, ele ocupa a largura toda', () => {
    const { container } = render(<Destaque projeto={bddente} lang="pt" />)
    expect(container.querySelectorAll('figure')).toHaveLength(1)
    expect(container.querySelector('figure')).toHaveClass('placa-larga')
  })

  // A borda que o print bloqueado do assistente criou.
  it('com zero print, o texto carrega o bloco e nada quebra', () => {
    const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('figure')).toHaveLength(0)
    expect(container.querySelector('.placas')).toBeNull()
    expect(screen.getByRole('heading', { name: /17 perguntas/ })).toBeInTheDocument()
  })

  it('desenha os 17 tools como lista, em monoespaçada', () => {
    const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('.tools li')).toHaveLength(17)
    expect(screen.getByText('quemNaoApontou')).toBeInTheDocument()
  })

  it('desenha as três amarras', () => {
    const { container } = render(<Destaque projeto={officeTimesheet} lang="pt" />)
    expect(container.querySelectorAll('.amarra')).toHaveLength(3)
  })

  it('sem lista e sem amarras, não sobra div vazia', () => {
    const { container } = render(<Destaque projeto={revy} lang="pt" />)
    expect(container.querySelector('.tools')).toBeNull()
    expect(container.querySelector('.amarras')).toBeNull()
  })

  it('as placas do Autotune trazem etiqueta e latência', () => {
    render(<Destaque projeto={autotune} lang="pt" />)
    expect(screen.getByText('TD-PSOLA')).toBeInTheDocument()
    expect(screen.getByText('61,72 ms')).toBeInTheDocument()
    expect(screen.getByText('0,18 ms')).toBeInTheDocument()
  })

  it('o fecho do Autotune destaca o fator', () => {
    const { container } = render(<Destaque projeto={autotune} lang="pt" />)
    expect(container.querySelector('.leitura b')).toHaveTextContent('340')
  })

  it('projeto sem destaque não desenha nada', () => {
    const semDestaque = { ...revy, destaque: undefined }
    const { container } = render(<Destaque projeto={semDestaque} lang="pt" />)
    expect(container.firstChild).toBeNull()
  })
})
