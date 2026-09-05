import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Movimento } from '@/components/Movimento'

afterEach(cleanup)

// jsdom não faz layout: toda caixa é 0×0. Cravamos as larguras que a regra do
// 1,5× precisa.
function montarPrancha(largura: number, exibida: number) {
  document.body.innerHTML = `
    <div class="prancha prancha--margem">
      <a class="prancha-alvo" href="/prints/x/a.png" data-largura="${largura}">
        <img src="/prints/x/a.png" alt="">
      </a>
    </div>`
  const alvo = document.querySelector('.prancha-alvo') as HTMLElement
  alvo.getBoundingClientRect = () =>
    ({ width: exibida, height: exibida * 0.62, left: 0, top: 0, right: exibida, bottom: 0 }) as DOMRect
  return alvo
}

afterEach(() => vi.restoreAllMocks())
beforeEach(() => document.documentElement.removeAttribute('data-mov'))

describe('a regra que decide se a prancha abre', () => {
  // 3200 contra 880 é 3,6×: abrir revela detalhe que não estava lá.
  it('abre quando o arquivo tem 1,5× ou mais que o espaço exibido', () => {
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    expect(alvo.closest('.prancha')?.classList.contains('prancha--fixa')).toBe(false)
    expect(alvo.getAttribute('href')).toBe('/prints/x/a.png')
  })

  // O Autotune: 639 contra 520 é 1,2×. Abrir só borraria.
  it('não abre quando o print já está no tamanho em que foi capturado', () => {
    const alvo = montarPrancha(639, 520)
    render(<Movimento />)
    expect(alvo.closest('.prancha')?.classList.contains('prancha--fixa')).toBe(true)
  })

  // Convite que não cumpre é pior que convite ausente.
  it('a prancha que não abre deixa de ser link', () => {
    const alvo = montarPrancha(639, 520)
    render(<Movimento />)
    expect(alvo.hasAttribute('href')).toBe(false)
  })

  // `avaliar` roda de novo a cada resize, e na segunda passada o href já não
  // está no elemento. Sem guarda, o endereço guardado virava string vazia — e
  // quando a janela encolhia a ponto de a prancha passar a valer, ela voltava
  // a ser link para lugar nenhum.
  it('não perde o endereço do arquivo quando é avaliada duas vezes', () => {
    const alvo = montarPrancha(639, 520)
    render(<Movimento />)
    dispatchEvent(new Event('resize'))

    // A janela encolheu: a 300px exibidos os 639 do arquivo passam a valer.
    alvo.getBoundingClientRect = () =>
      ({ width: 300, height: 186, left: 0, top: 0, right: 300, bottom: 0 }) as DOMRect
    dispatchEvent(new Event('resize'))

    expect(alvo.getAttribute('href')).toBe('/prints/x/a.png')
  })

  it('clicar numa prancha que abre põe a classe aberta', () => {
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    alvo.click()
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(true)
  })

  it('Esc fecha', () => {
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    alvo.click()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(false)
  })
})
