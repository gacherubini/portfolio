import { render, cleanup } from '@testing-library/react'
import { describe, expect, it, afterEach } from 'vitest'
import { projetos } from '@/content/indice'
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
