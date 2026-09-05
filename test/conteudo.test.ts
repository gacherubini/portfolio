import { describe, expect, it } from 'vitest'
import { validarProjeto } from '@/content/tipos'
import { revy } from '@/content/projetos/revy'

describe('revy', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(revy)).toEqual([])
  })

  it('tem link, porque o sistema é público', () => {
    expect(revy.links.length).toBeGreaterThan(0)
    expect(revy.links.some((l) => l.primario)).toBe(true)
  })

  it('tem destaque com os dois prints do agente', () => {
    expect(revy.destaque?.prints).toHaveLength(2)
  })

  it('tem uma fileira de galeria', () => {
    expect(revy.galeria).toHaveLength(1)
    expect(revy.galeria[0].prints).toHaveLength(3)
  })

  // Slot: os números do seed são inventados. Quando o dono confirmar os reais,
  // este teste vira `expect(revy.numeros).toHaveLength(3)`.
  it('está sem números de vitrine, à espera da confirmação do dono', () => {
    expect(revy.numeros).toEqual([])
  })

  it('não declara "Desde" — o contrato deixa a linha de fora quando não se sabe', () => {
    expect(revy.ficha.some((l) => /a confirmar/i.test(l.valor.pt))).toBe(false)
  })
})
