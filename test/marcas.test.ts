import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { experiencia } from '@/content/experiencia'

/**
 * As marcas são assadas no build (`scripts/tratar-marcas.mjs`) e pintadas por
 * `mask-image` — a mesma troca do `PrintFigura`: custo de CPU por contrato, e
 * contrato sem teste quebra calado. Uma máscara apontando para arquivo que
 * não existe não dá erro em lugar nenhum, o navegador só não mostra a marca.
 *
 * São três elos, e os três estão aqui:
 *   1. todo cargo com marca declara arquivo, caixa ótica e `alt`;
 *   2. o arquivo existe em disco, é PNG e tem 40px de altura;
 *   3. a proporção da caixa ótica é a do PNG (máscara fora de proporção
 *      distorce o wordmark em silêncio).
 */
function comMarca() {
  return experiencia.filter((cargo) => cargo.marca !== undefined)
}

describe('marcas assadas no build', () => {
  // Sem isto os testes abaixo passariam com a lista vazia, que é exatamente
  // como um contrato quebrado se disfarça de contrato cumprido.
  it('ambush e pucrs declaram marca', () => {
    expect(comMarca().length).toBeGreaterThanOrEqual(2)
  })

  it('todo campo da marca está preenchido', () => {
    for (const cargo of comMarca()) {
      expect(cargo.marca?.arquivo, `${cargo.id}.arquivo`).toMatch(/\.png$/)
      expect(cargo.marca?.largura, `${cargo.id}.largura`).toBeGreaterThan(0)
      expect(cargo.marca?.altura, `${cargo.id}.altura`).toBeGreaterThan(0)
      expect(cargo.marca?.alt, `${cargo.id}.alt`).toBeTruthy()
    }
  })

  it('o arquivo existe, é PNG de 40px e na proporção da caixa ótica', async () => {
    for (const cargo of comMarca()) {
      const arquivo = `public/marcas/${cargo.marca?.arquivo}`
      expect(existsSync(arquivo), arquivo).toBe(true)

      const { width, height, format } = await sharp(arquivo).metadata()
      expect(format, arquivo).toBe('png')
      expect(height, arquivo).toBe(40)

      const proporcaoArquivo = (width ?? 0) / (height ?? 1)
      const proporcaoCaixa = (cargo.marca?.largura ?? 0) / (cargo.marca?.altura ?? 1)
      expect(
        Math.abs(proporcaoArquivo - proporcaoCaixa) / proporcaoArquivo,
        `${arquivo}: caixa fora de proporção`,
      ).toBeLessThan(0.02)
    }
  })
})
