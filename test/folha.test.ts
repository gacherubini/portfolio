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
    // `calmo` reprova a 0,72 nas quatro paletas (ver test/contraste.test.ts).
    // Quem recebe opacity é `--texto`; quem usa `--calmo` fica em opacidade
    // cheia. Regra grosseira, mas pega o caso real: uma declaração de opacity
    // no mesmo bloco em que `--calmo` pinta a cor.
    const blocos = folha.split('}')
    const errados = blocos.filter(
      (b) => /color:\s*var\(--calmo\)/.test(b) && /opacity:\s*(?!1)[\d.]+/.test(b),
    )
    expect(errados).toEqual([])
  })

  it('mantém o padding lateral de .wrap no Sobre', () => {
    const regraSobre = folha.match(/\.sobre\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(regraSobre).toContain('padding-block: 84px 92px')
    expect(regraSobre).not.toMatch(/padding\s*:/)
  })

  it('prende .col-texto e .col-print na mesma linha na faixa espelhada', () => {
    // `grid-column` explícito avança o cursor de auto-placement em DOM order:
    // sem `grid-row` fixo, `.col-texto` (coluna 2) ocupa a linha 1 e
    // `.col-print` (coluna 1), vindo depois no DOM, não cabe mais nela — cai
    // para a linha 2 e abre uma faixa vazia da cor do sistema ao lado do texto.
    const texto = folha.match(/\.faixa\.espelho \.col-texto \{([^}]*)\}/)?.[1] ?? ''
    const print = folha.match(/\.faixa\.espelho \.col-print \{([^}]*)\}/)?.[1] ?? ''
    expect(texto).toMatch(/grid-row:\s*1\b/)
    expect(print).toMatch(/grid-row:\s*1\b/)
  })

  it('não deixa o grid-row da faixa espelhada vazar para o empilhamento mobile', () => {
    const inicio = folha.indexOf('@media (max-width: 820px) {\n  .faixa .grade')
    const fim = folha.indexOf('@media (max-width: 820px) {\n  .abertura-home')
    const blocoMobile = folha.slice(inicio, fim)
    const reset =
      blocoMobile.match(/\.faixa\.espelho \.col-texto, \.faixa\.espelho \.col-print \{([^}]*)\}/)?.[1] ?? ''
    expect(reset).not.toMatch(/grid-row:\s*1\b/)
  })
})
