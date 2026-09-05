import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { projetos } from '@/content/indice'
import { caminhoOtimizado, largurasDe } from '@/lib/prints'
import type { Print } from '@/content/tipos'

/**
 * O site não otimiza imagem em runtime: `scripts/otimizar-prints.mjs` assa as
 * variantes no build e o `PrintFigura` só pede o arquivo. Isso troca um custo
 * de CPU por um contrato, e contrato sem teste quebra calado — um `srcset`
 * apontando para arquivo que não existe não dá erro em lugar nenhum, o
 * navegador só não mostra a imagem.
 *
 * São dois elos, e os dois estão aqui:
 *   1. o script lê a largura do ARQUIVO; o componente usa a largura DECLARADA
 *      no `content/`. Se divergirem, o componente pede largura que ninguém
 *      assou.
 *   2. toda variante pedida tem que existir em disco.
 */

function prints(): { slug: string; print: Print }[] {
  return projetos.flatMap((projeto) =>
    [
      ...(projeto.printAbertura ? [projeto.printAbertura] : []),
      ...(projeto.destaque?.prints ?? []),
      ...projeto.galeria.flatMap((f) => f.prints),
    ].map((print) => ({ slug: projeto.slug, print })),
  )
}

describe('prints assados no build', () => {
  // Sem isto os testes abaixo passariam com a lista vazia, que é exatamente
  // como um contrato quebrado se disfarça de contrato cumprido. São 18 prints
  // declarados hoje; o piso é baixo de propósito, para pegar a lista sumindo,
  // não para brigar com quem acrescentar ou tirar um print.
  it('a lista de prints não está vazia', () => {
    expect(prints().length).toBeGreaterThan(15)
  })

  it('a largura declarada no conteúdo é a largura real do arquivo', async () => {
    for (const { slug, print } of prints()) {
      const arquivo = `public/prints/${slug}/${print.arquivo}`
      const { width, height } = await sharp(arquivo).metadata()

      expect(`${slug}/${print.arquivo}: ${width}×${height}`).toBe(
        `${slug}/${print.arquivo}: ${print.largura}×${print.altura}`,
      )
    }
  })

  it('toda variante que o srcset pede existe em disco', () => {
    const faltando: string[] = []

    for (const { slug, print } of prints()) {
      for (const largura of largurasDe(print.largura)) {
        for (const formato of ['avif', 'webp'] as const) {
          const caminho = caminhoOtimizado(slug, print.arquivo, largura, formato)
          if (!existsSync(`public${caminho}`)) faltando.push(caminho)
        }
      }
    }

    expect(
      faltando.length ? `rode \`node scripts/otimizar-prints.mjs\`; faltam: ${faltando}` : [],
    ).toEqual([])
  })

  it('nenhuma variante é maior que o original', () => {
    for (const { print } of prints()) {
      expect(Math.max(...largurasDe(print.largura))).toBeLessThanOrEqual(print.largura)
    }
  })
})
