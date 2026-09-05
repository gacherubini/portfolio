import { describe, expect, it } from 'vitest'
import { verificarTema } from '@/lib/contraste'
import { validarProjeto } from '@/content/tipos'
import { projetos, projetoPorSlug } from '@/content/indice'

describe('as quatro paletas reais', () => {
  it('a home tem exatamente quatro faixas, nesta ordem', () => {
    expect(projetos.map((p) => p.slug)).toEqual([
      'revy',
      'bddente',
      'office-timesheet',
      'autotune',
    ])
  })

  it.each(['revy', 'bddente', 'office-timesheet', 'autotune'])(
    '%s passa no contraste',
    (slug) => {
      const projeto = projetoPorSlug(slug)!
      expect(verificarTema(slug, projeto.tema)).toEqual([])
    },
  )

  it.each(['revy', 'bddente', 'office-timesheet', 'autotune'])(
    '%s passa no contrato',
    (slug) => {
      expect(validarProjeto(projetoPorSlug(slug)!)).toEqual([])
    },
  )

  it('nenhum slug se repete', () => {
    expect(new Set(projetos.map((p) => p.slug)).size).toBe(projetos.length)
  })

  it('devolve undefined para slug que não existe', () => {
    expect(projetoPorSlug('gastos-do-mes')).toBeUndefined()
  })
})
