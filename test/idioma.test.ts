import { beforeEach, describe, expect, it } from 'vitest'
import { avisosDeTraducao, limparAvisosDeTraducao, t } from '@/lib/idioma'

beforeEach(() => limparAvisosDeTraducao())

describe('t', () => {
  it('devolve o idioma pedido', () => {
    expect(t({ pt: 'Projetos', en: 'Projects' }, 'en', 'ui.nav')).toBe('Projects')
  })

  it('cai no pt quando o en falta', () => {
    expect(t({ pt: 'Projetos' }, 'en', 'ui.nav')).toBe('Projetos')
  })

  it('cai no pt quando o en está em branco', () => {
    expect(t({ pt: 'Projetos', en: '   ' }, 'en', 'ui.nav')).toBe('Projetos')
  })

  it('registra aviso nomeando o campo', () => {
    t({ pt: 'Projetos' }, 'en', 'ui.nav')
    expect(avisosDeTraducao()).toEqual(['ui.nav'])
  })

  it('não repete o mesmo campo no aviso', () => {
    t({ pt: 'Projetos' }, 'en', 'ui.nav')
    t({ pt: 'Projetos' }, 'en', 'ui.nav')
    expect(avisosDeTraducao()).toHaveLength(1)
  })

  it('não avisa quando o idioma é pt', () => {
    t({ pt: 'Projetos' }, 'pt', 'ui.nav')
    expect(avisosDeTraducao()).toEqual([])
  })
})
