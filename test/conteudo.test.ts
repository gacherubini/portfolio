import { describe, expect, it } from 'vitest'
import { validarProjeto } from '@/content/tipos'
import { bddente } from '@/content/projetos/bddente'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { revy } from '@/content/projetos/revy'
import { autotune } from '@/content/projetos/autotune'
import { sobre } from '@/content/sobre'

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

  it('não declara "Desde" — o contrato deixa a linha de fora quando não se sabe', () => {
    expect(revy.ficha.some((l) => /a confirmar/i.test(l.valor.pt))).toBe(false)
  })
})

describe('Revy', () => {
  it('tem os três números de vitrine confirmados pelo dono', () => {
    expect(revy.numeros).toHaveLength(3)
    expect(revy.numeros.map((n) => n.valor.pt)).toEqual(['120', '~80%', '75'])
  })

  it('o número em inglês não usa separador de milhar do português', () => {
    for (const n of revy.numeros) expect(n.valor.en).toBeTruthy()
  })

  it('leva o selo de IA', () => {
    expect(revy.selo?.pt).toContain('IA')
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

describe('Office Timesheet', () => {
  it('a régua da página encurta o rótulo do 34, que quebrava em duas linhas', () => {
    const trinta = officeTimesheet.numeros.find((n) => n.valor.pt === '34')
    expect(trinta?.rotulo.pt).toBe('funções que o assistente pode chamar')
  })

  it('leva o selo de IA', () => {
    expect(officeTimesheet.selo?.pt).toContain('IA')
  })

  // PENDENTE: os três valores só o dono tem. Enquanto não vierem, vazio — e a
  // régua da faixa some sozinha, que é o comportamento certo.
  it('declara numerosHome, ainda que vazio', () => {
    expect(officeTimesheet.numerosHome).toEqual([])
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

describe('Sobre', () => {
  it('não fala mais de idade nem de faculdade', () => {
    const tudo = sobre.paragrafos.map((p) => `${p.pt} ${p.en}`).join(' ')
    expect(tudo).not.toMatch(/23 anos|faculdade|PUC-RS|degree/i)
  })

  // "5+ anos" não envelhece; "desde 2023" envelhece sozinho todo ano.
  it('diz o tempo de ofício em vez da data de entrada', () => {
    const tudo = sobre.paragrafos.map((p) => p.pt).join(' ')
    expect(tudo).toContain('mais de 5 anos')
    expect(tudo).not.toContain('2023')
  })

  it('diz o que ele faz com IA, e a ficha repete em uma linha', () => {
    const tudo = sobre.paragrafos.map((p) => p.pt).join(' ')
    expect(tudo).toMatch(/agent|loops de agente/i)
    expect(sobre.ficha.some((l) => l.rotulo.pt === 'IA')).toBe(true)
  })

  // Pedido do dono: travessão sai dos textos em primeira pessoa. Os textos dos
  // projetos mantêm os deles.
  it('nenhum travessão nos textos em primeira pessoa', () => {
    const alvo = [
      ...sobre.paragrafos.flatMap((p) => [p.pt, p.en ?? '']),
      ...sobre.ficha.flatMap((l) => [l.valor.pt, l.valor.en ?? '']),
      sobre.contato.telefone.via.pt,
      sobre.contato.telefone.via.en ?? '',
      sobre.contato.curriculo.rotulo.pt,
      sobre.contato.curriculo.rotulo.en ?? '',
    ]
    expect(alvo.filter((s) => s.includes('—'))).toEqual([])
  })
})
