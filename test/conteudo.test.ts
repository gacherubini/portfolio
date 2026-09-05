import { describe, expect, it } from 'vitest'
import { validarProjeto } from '@/content/tipos'
import { bddente } from '@/content/projetos/bddente'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { revy } from '@/content/projetos/revy'
import { autotune } from '@/content/projetos/autotune'

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

describe('bddente', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(bddente)).toEqual([])
  })

  it('não tem link nenhum — prontuário de clínica real não tem tela pública', () => {
    expect(bddente.links).toEqual([])
    expect(bddente.semLink?.curto.pt).toMatch(/fechado/i)
  })

  it('tem destaque com um print só', () => {
    expect(bddente.destaque?.prints).toHaveLength(1)
  })

  it('tem quatro números', () => {
    expect(bddente.numeros).toHaveLength(4)
  })

  it('tem três notas técnicas', () => {
    expect(bddente.tecnico.notas).toHaveLength(3)
  })
})

describe('office-timesheet', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(officeTimesheet)).toEqual([])
  })

  it('não tem link — é sistema interno do escritório', () => {
    expect(officeTimesheet.links).toEqual([])
    expect(officeTimesheet.semLink?.titulo.pt).toBe('Sem link para entrar')
  })

  // Slot: quando o print do /assistente existir, isto vira toHaveLength(1).
  it('tem destaque sem print, porque a captura do assistente está bloqueada', () => {
    expect(officeTimesheet.destaque?.prints).toEqual([])
  })

  it('conta o assistente pela lista dos 17 tools de leitura', () => {
    expect(officeTimesheet.destaque?.lista?.itens).toHaveLength(17)
  })

  it('tem as três amarras do assistente', () => {
    expect(officeTimesheet.destaque?.amarras).toHaveLength(3)
  })

  it('abre com o print do quadro de tarefas, já que o destaque não tem imagem', () => {
    expect(officeTimesheet.printAbertura?.arquivo).toBe('03-tarefas-kanban.png')
  })

  it('tem a galeria em duas fileiras nomeadas', () => {
    expect(officeTimesheet.galeria).toHaveLength(2)
    expect(officeTimesheet.galeria.map((f) => f.prints.length)).toEqual([3, 3])
  })

  it('é a única paleta clara, e o laranja passa raspando', () => {
    expect(officeTimesheet.tema.fundo).toBe('#ECECEC')
    expect(officeTimesheet.tema.destaque).toBe('#CB6D31')
  })
})

describe('autotune', () => {
  it('passa no contrato', () => {
    expect(validarProjeto(autotune)).toEqual([])
  })

  // Só existem quatro prints e dois são matplotlib no default: o peso vai
  // para o destaque e para o bloco técnico.
  it('não tem galeria', () => {
    expect(autotune.galeria).toEqual([])
  })

  it('tem o par de motores no destaque, cada placa com etiqueta e latência', () => {
    expect(autotune.destaque?.prints).toHaveLength(2)
    expect(autotune.destaque?.prints.map((p) => p.valor?.pt)).toEqual(['61,72 ms', '0,18 ms'])
    // Formato de número muda com o idioma: vírgula de decimal em pt vira ponto em en.
    expect(autotune.destaque?.prints.map((p) => p.valor?.en)).toEqual(['61.72 ms', '0.18 ms'])
  })

  it('fecha o destaque com a leitura da comparação', () => {
    expect(autotune.destaque?.fecho?.pt).toContain('340')
  })

  it('tem o terminal como texto, não como print', () => {
    expect(autotune.tecnico.terminal?.comando).toContain('autotune.exe')
    expect(autotune.tecnico.terminal?.saida).toContain('Correcao planejada')
  })

  it('tem quatro notas técnicas', () => {
    expect(autotune.tecnico.notas).toHaveLength(4)
  })

  it('usa uma paleta atribuída, não amostrada de print nenhum', () => {
    expect(autotune.tema.destaque).toBe('#F3B843')
  })
})
