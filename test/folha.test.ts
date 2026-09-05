import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OPACIDADES_DE_TEXTO, OPACIDADES_NO_AZUL } from '@/lib/contraste'

const folha = readFileSync('app/globals.css', 'utf8')

describe('a regra da folha', () => {
  it('não usa nenhuma opacity fora da lista medida', () => {
    const permitidas = new Set([...OPACIDADES_DE_TEXTO, ...OPACIDADES_NO_AZUL, 0, 1])
    const usadas = [...folha.matchAll(/opacity:\s*([\d.]+)/g)].map((m) => Number(m[1]))
    expect(usadas.length).toBeGreaterThan(0)
    expect(usadas.filter((o) => !permitidas.has(o))).toEqual([])
  })

  it('não esmaece nada pintado com --calmo', () => {
    const blocos = folha.split('}')
    const errados = blocos.filter(
      (b) => /color:\s*var\(--calmo\)/.test(b) && /opacity:\s*(?!1\b)[\d.]+/.test(b),
    )
    expect(errados).toEqual([])
  })
})
