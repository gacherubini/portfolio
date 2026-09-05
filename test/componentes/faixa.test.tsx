import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FaixaProjeto } from '@/components/FaixaProjeto'
import { estiloDoTema } from '@/lib/tema'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { autotune } from '@/content/projetos/autotune'

afterEach(() => cleanup())

const txt = (s: string) => ({ pt: s, en: s })

describe('estiloDoTema', () => {
  it('vira custom properties, uma por campo do tema', () => {
    const estilo = estiloDoTema(revy.tema) as Record<string, string>
    expect(estilo['--fundo']).toBe('#111111')
    expect(estilo['--destaque']).toBe('#7FBFA3')
    expect(estilo['--calmo']).toBe('#9AA39D')
  })

  it('só declara --fundo3 quando o tema tem', () => {
    expect(estiloDoTema(revy.tema)).not.toHaveProperty('--fundo3')
  })
})

describe('FaixaProjeto', () => {
  it('mostra nome, para quem e situação', () => {
    render(<FaixaProjeto projeto={revy} lang="pt" espelho={false} />)
    expect(screen.getByRole('heading', { name: 'Revy' })).toBeInTheDocument()
    expect(screen.getByText('Revenda de veículos')).toBeInTheDocument()
    expect(screen.getByText('no ar')).toBeInTheDocument()
  })

  it('leva o botão de entrar e o de ver o projeto', () => {
    render(<FaixaProjeto projeto={revy} lang="pt" espelho={false} />)
    expect(screen.getByRole('link', { name: 'Entrar no sistema' })).toHaveAttribute(
      'href',
      'https://revyapp.com.br',
    )
    expect(screen.getByRole('link', { name: 'Ver o projeto' })).toHaveAttribute('href', '/pt/revy')
  })

  // A borda que o comp P2 provou: sem link, e nunca um botão morto.
  it('sem link, mostra o motivo no lugar do botão', () => {
    render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(screen.getByText(/Sistema fechado/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Entrar/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver o projeto' })).toHaveAttribute(
      'href',
      '/pt/bddente',
    )
  })

  // A régua com zero números some da tela — não é sobre a Revy, é sobre o
  // componente com um projeto sem números confirmados.
  it('sem números, não desenha a linha de números', () => {
    const semNumeros = { ...revy, numeros: [] }
    const { container } = render(<FaixaProjeto projeto={semNumeros} lang="pt" espelho={false} />)
    expect(container.querySelector('.numeros')).toBeNull()
  })

  it('com números, desenha um por item', () => {
    const { container } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(container.querySelectorAll('.num')).toHaveLength(4)
  })

  it('a faixa espelhada troca o lado do print', () => {
    const { container } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(container.querySelector('.faixa')).toHaveClass('espelho')
  })

  it('pinta a faixa com o tema do projeto', () => {
    const { container } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    const faixa = container.querySelector('.faixa') as HTMLElement
    expect(faixa.style.getPropertyValue('--fundo')).toBe('#5A21B4')
  })

  it('o Autotune abre a faixa pelo print marcado, não pelo primeiro do destaque', () => {
    render(<FaixaProjeto projeto={autotune} lang="pt" espelho />)
    expect(screen.getByAltText(/Low Latency marcado/)).toBeInTheDocument()
  })

  it('o print tem o alt do conteúdo, não "print do sistema"', () => {
    render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(screen.getByAltText(/Agenda da semana/)).toBeInTheDocument()
  })

  it('na home usa numerosHome quando o projeto declara', () => {
    const projeto = {
      ...revy,
      numeros: [{ valor: txt('999'), rotulo: txt('só da página') }],
      numerosHome: [
        { valor: txt('1'), rotulo: txt('um') },
        { valor: txt('2'), rotulo: txt('dois') },
        { valor: txt('3'), rotulo: txt('três') },
      ],
    }
    render(<FaixaProjeto projeto={projeto} lang="pt" espelho={false} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.queryByText('999')).not.toBeInTheDocument()
  })

  it('sem numerosHome, cai em numeros', () => {
    render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(screen.getByText('5.559')).toBeInTheDocument()
  })

  // O Office Timesheet fica assim enquanto os valores reais não chegam.
  it('com numerosHome vazio, a régua some da faixa', () => {
    const { container } = render(
      <FaixaProjeto projeto={{ ...revy, numerosHome: [] }} lang="pt" espelho={false} />,
    )
    expect(container.querySelector('.numeros')).toBeNull()
  })

  it('desenha o selo quando existe, e nada quando não existe', () => {
    const { container: com } = render(<FaixaProjeto projeto={revy} lang="pt" espelho={false} />)
    expect(com.querySelector('.selo')?.textContent).toContain('IA')
    cleanup()
    const { container: sem } = render(<FaixaProjeto projeto={bddente} lang="pt" espelho />)
    expect(sem.querySelector('.selo')).toBeNull()
  })
})
