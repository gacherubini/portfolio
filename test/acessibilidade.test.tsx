import { render, cleanup } from '@testing-library/react'
import { describe, expect, it, afterEach } from 'vitest'
import { projetos } from '@/content/indice'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { Galeria } from '@/components/Galeria'
import { Destaque } from '@/components/Destaque'
import { FaixaProjeto } from '@/components/FaixaProjeto'

afterEach(cleanup)

describe('alt de imagem', () => {
  it('todo print declara alt nos dois idiomas e nenhum diz "print do sistema"', () => {
    for (const projeto of projetos) {
      const prints = [
        ...(projeto.printAbertura ? [projeto.printAbertura] : []),
        ...(projeto.destaque?.prints ?? []),
        ...projeto.galeria.flatMap((f) => f.prints),
      ]
      for (const print of prints) {
        expect(print.alt.pt.length).toBeGreaterThan(20)
        expect(print.alt.pt.toLowerCase()).not.toMatch(/^print d[oa]/)
        expect(print.alt.en?.length ?? 0).toBeGreaterThan(20)
      }
    }
  })

  it('nenhuma imagem renderiza sem alt', () => {
    for (const projeto of projetos) {
      const { container } = render(
        <>
          <FaixaProjeto projeto={projeto} lang="pt" espelho={false} />
          <Destaque projeto={projeto} lang="pt" />
          <Galeria projeto={projeto} lang="pt" />
        </>,
      )
      for (const img of container.querySelectorAll('img')) {
        expect(img.getAttribute('alt')?.trim()).toBeTruthy()
      }
    }
  })
})

describe('hierarquia de títulos', () => {
  it('a faixa da home usa h2 — o h1 é a frase de abertura', () => {
    const { container } = render(
      <FaixaProjeto projeto={projetos[0]} lang="pt" espelho={false} />,
    )
    expect(container.querySelector('h1')).toBeNull()
    expect(container.querySelector('h2')).toBeInTheDocument()
  })
})

describe('portão da prancha (Task 11)', () => {
  // O nome antigo prometia "a prancha ABERTA": `.aberta` é posta no cliente, e
  // uma `<Galeria>` renderizada não tem prancha aberta nenhuma. O que este
  // teste de fato guarda é o que sai do servidor.
  it('nenhuma prancha nasce escondida para o leitor de tela', () => {
    const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
    for (const p of container.querySelectorAll('.prancha')) {
      expect(p.getAttribute('aria-hidden')).toBeNull()
    }
  })

  it('a legenda da prancha está ligada à imagem, e não só ao lado dela', () => {
    // `<figure>`/`<figcaption>` é a única construção nativa que associa
    // programaticamente uma legenda à sua imagem. Dois `<div>` irmãos — que é
    // o que a reescrita em pranchas tinha deixado — não dão nada ao leitor de
    // tela: ele lê um parágrafo solto perto de uma imagem.
    const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
    const pranchas = [...container.querySelectorAll('.prancha')]
    expect(pranchas.length).toBeGreaterThan(0)

    for (const p of pranchas) {
      expect(p.tagName).toBe('FIGURE')
      const legenda = p.querySelector('.prancha-nota')!
      expect(legenda).not.toBeNull()
      expect(legenda.tagName).toBe('FIGCAPTION')
      // Dentro da MESMA figure que a imagem, e não numa vizinha.
      expect(legenda.closest('figure')).toBe(p)
      expect(p.querySelector('img')?.closest('figure')).toBe(p)
    }
  })

  it('todo print continua com alt não vazio', () => {
    const { container } = render(<Galeria projeto={officeTimesheet} lang="pt" />)
    for (const img of container.querySelectorAll('img')) {
      expect(img.getAttribute('alt')?.trim()).toBeTruthy()
    }
  })
})
