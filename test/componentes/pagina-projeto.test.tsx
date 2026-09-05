import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CabecalhoProjeto } from '@/components/CabecalhoProjeto'
import { AberturaProjeto } from '@/components/AberturaProjeto'
import { revy } from '@/content/projetos/revy'
import { officeTimesheet } from '@/content/projetos/office-timesheet'

afterEach(() => cleanup())

describe('CabecalhoProjeto', () => {
  it('volta para a home do idioma corrente', () => {
    render(<CabecalhoProjeto lang="pt" slug="revy" />)
    expect(screen.getByRole('link', { name: /Todos os projetos/ })).toHaveAttribute('href', '/pt')
  })

  it('mantém a página ao trocar de idioma', () => {
    render(<CabecalhoProjeto lang="pt" slug="revy" />)
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en/revy')
  })

  it('usa a marca monocromática: o azul some ou vibra sobre a cor do sistema', () => {
    const { container } = render(<CabecalhoProjeto lang="pt" slug="revy" />)
    expect(container.querySelector('.marca')).toHaveClass('marca--mono')
  })
})

describe('AberturaProjeto', () => {
  it('traz nome, chamada e a ficha de rótulos livres', () => {
    render(<AberturaProjeto projeto={revy} lang="pt" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Revy' })).toBeInTheDocument()
    expect(screen.getByText(/Quem responde o cliente no WhatsApp/)).toBeInTheDocument()
    expect(screen.getByText('Tamanho')).toBeInTheDocument()
  })

  it('com link, desenha os botões', () => {
    render(<AberturaProjeto projeto={revy} lang="pt" />)
    expect(screen.getByRole('link', { name: 'Entrar no sistema' })).toBeInTheDocument()
  })

  // A borda dos comps P2 e P3.
  it('sem link, o lugar do botão diz por que não há botão', () => {
    render(<AberturaProjeto projeto={officeTimesheet} lang="pt" />)
    expect(screen.getByText('Sem link para entrar')).toBeInTheDocument()
    expect(screen.getByText(/não tem área pública nem conta de visitante/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Entrar/ })).not.toBeInTheDocument()
  })

  it('nenhuma ficha traz "a confirmar"', () => {
    for (const projeto of [revy, officeTimesheet]) {
      for (const linha of projeto.ficha) {
        expect(linha.valor.pt).not.toMatch(/a confirmar/i)
      }
    }
  })
})
