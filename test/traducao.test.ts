import { beforeEach, describe, expect, it } from 'vitest'
import { avisosDeTraducao, limparAvisosDeTraducao, t } from '@/lib/idioma'
import type { Texto } from '@/content/tipos'
import { projetos } from '@/content/indice'
import { ui } from '@/content/ui'
import { sobre } from '@/content/sobre'

/** Varre um objeto e chama `t` em todo `Texto` que encontrar. */
function traduzirTudo(valor: unknown, caminho: string): void {
  if (valor === null || typeof valor !== 'object') return

  if (Array.isArray(valor)) {
    valor.forEach((item, i) => traduzirTudo(item, `${caminho}[${i}]`))
    return
  }

  const obj = valor as Record<string, unknown>
  if (typeof obj.pt === 'string' && Object.keys(obj).every((k) => k === 'pt' || k === 'en')) {
    t(obj as Texto, 'en', caminho)
    return
  }

  for (const [chave, dentro] of Object.entries(obj)) {
    traduzirTudo(dentro, `${caminho}.${chave}`)
  }
}

beforeEach(() => limparAvisosDeTraducao())

describe('o site inteiro em inglês', () => {
  it('não deixa nenhum campo cair no português', () => {
    traduzirTudo(ui, 'ui')
    traduzirTudo(sobre, 'sobre')
    for (const projeto of projetos) traduzirTudo(projeto, projeto.slug)

    expect(avisosDeTraducao()).toEqual([])
  })
})
