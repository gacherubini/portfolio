import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Movimento } from '@/components/Movimento'

// O componente lê a rota para se remontar a cada navegação. Fora do App Router
// `usePathname` devolveria `null`, o que já bastaria para os testes antigos —
// mas o de navegação precisa TROCAR a rota, então o módulo é dublado.
const rota = vi.hoisted(() => ({ atual: '/pt' }))
vi.mock('next/navigation', () => ({ usePathname: () => rota.atual }))

afterEach(cleanup)
afterEach(() => { rota.atual = '/pt' })

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

// A consulta de tela estreita é relida a cada resize, não guardada na
// montagem: o stub responde ao que `tela.estreita` disser na hora.
function fingirTela(tela: { estreita: boolean }) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (consulta: string) =>
      ({
        get matches() {
          return consulta.includes('max-width') && tela.estreita
        },
        media: consulta,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList,
  )
}

afterEach(() => vi.restoreAllMocks())
afterEach(() => vi.unstubAllGlobals())
beforeEach(() => document.documentElement.removeAttribute('data-mov'))

/**
 * Um IntersectionObserver que não observa nada de verdade: guarda quem foi
 * observado e deixa o teste dizer quando todos entram na tela. O stub global
 * de `vitest.setup.ts` tem métodos vazios e nunca chama o callback.
 */
function fingirObservador() {
  const estado = {
    observados: [] as Element[],
    entrar: () => {},
  }
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      root = null
      rootMargin = ''
      thresholds: number[] = []
      constructor(cb: IntersectionObserverCallback) {
        estado.entrar = () =>
          cb(
            estado.observados.map((target) => ({ target, isIntersecting: true })) as
              unknown as IntersectionObserverEntry[],
            this as unknown as IntersectionObserver,
          )
      }
      observe(el: Element) { estado.observados.push(el) }
      unobserve(el: Element) { estado.observados = estado.observados.filter((o) => o !== el) }
      disconnect() { estado.observados = [] }
      takeRecords() { return [] }
    },
  )
  return estado
}

/** Crava a largura exibida que a regra do 1,5× precisa; jsdom não faz layout. */
function cravarLargura(alvo: HTMLElement, exibida: number) {
  alvo.getBoundingClientRect = () =>
    ({ width: exibida, height: exibida * 0.62, left: 0, top: 0, right: exibida, bottom: 0 }) as DOMRect
}

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

  // A prancha aberta é exibida na largura ABERTA. Medindo 1,5× contra ela, um
  // print de 1568 — que existe no conteúdo — reprovava aberto a 1320, ganhava
  // `prancha--fixa` no primeiro resize e o clique parava de fechá-lo: o cursor
  // continuava prometendo `zoom-out` e só `Esc` salvava.
  it('a prancha aberta continua fechando depois de um resize', () => {
    const alvo = montarPrancha(1568, 880)
    render(<Movimento />)
    alvo.click()

    // Aberta, o alvo passa a ocupar a largura de abertura.
    alvo.getBoundingClientRect = () =>
      ({ width: 1320, height: 818, left: 0, top: 0, right: 1320, bottom: 0 }) as DOMRect
    dispatchEvent(new Event('resize'))

    expect(alvo.closest('.prancha')?.classList.contains('prancha--fixa')).toBe(false)
    alvo.click()
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(false)
  })

  it('em tela estreita a prancha não abre e não é link', () => {
    fingirTela({ estreita: true })
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    expect(alvo.hasAttribute('href')).toBe(false)
    alvo.click()
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(false)
  })

  it('a janela que encolhe para estreita fecha a prancha que estava aberta', () => {
    const tela = { estreita: false }
    fingirTela(tela)
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    alvo.click()
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(true)

    tela.estreita = true
    dispatchEvent(new Event('resize'))

    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(false)
    expect(alvo.hasAttribute('href')).toBe(false)
  })

  it('Esc fecha', () => {
    const alvo = montarPrancha(3200, 880)
    render(<Movimento />)
    alvo.click()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(alvo.closest('.prancha')?.classList.contains('aberta')).toBe(false)
  })

  // `avaliar` pula a prancha aberta. Sem reavaliar no fechamento, a ex-aberta
  // fica com o `prancha--fixa`, o href e o convite calculados para a largura
  // de antes do resize — e passa a convidar a abrir uma prancha sem resolução
  // a revelar até o resize seguinte.
  it('reavalia a prancha assim que ela fecha', () => {
    const alvo = montarPrancha(1568, 880)
    render(<Movimento />)
    alvo.click()

    // A janela cresceu com a prancha aberta: fechada, ela agora é exibida a
    // 1200 e os 1568 do arquivo já não dão 1,5×.
    alvo.getBoundingClientRect = () =>
      ({ width: 1200, height: 744, left: 0, top: 0, right: 1200, bottom: 0 }) as DOMRect
    dispatchEvent(new Event('resize'))
    alvo.click()

    expect(alvo.closest('.prancha')?.classList.contains('prancha--fixa')).toBe(true)
    expect(alvo.hasAttribute('href')).toBe(false)
  })
})

describe('a navegação interna, que troca a página sem desmontar o layout', () => {
  // `app/[lang]/layout.tsx` é o mesmo da home e das páginas de projeto, e os
  // `<Link>` da faixa e do cabeçalho navegam pelo cliente: o `<Movimento />`
  // nunca é desmontado. Com o efeito preso a `[]` ele rodava uma vez por
  // sessão, e a partir do primeiro clique a página nova ficava com
  // `html[data-anima]` posto e ninguém observando — a maior parte dela em
  // `opacity: 0`, para sempre — e com as pranchas do retrato da página velha,
  // então clicar num print saía do site para o PNG cru.
  it('a página nova é revelada e tem as suas próprias pranchas avaliadas', () => {
    document.body.innerHTML = ''
    const pagina = document.createElement('div')
    document.body.append(pagina)

    pagina.innerHTML = `
      <div class="revela" id="home-revela">home</div>
      <div class="prancha prancha--nua" id="home-prancha">
        <a class="prancha-alvo" href="/prints/x/home.png" data-largura="3200"><img alt=""></a>
      </div>`
    cravarLargura(pagina.querySelector<HTMLElement>('#home-prancha .prancha-alvo')!, 880)

    const observador = fingirObservador()
    const { rerender } = render(<Movimento />)

    expect(document.documentElement.hasAttribute('data-anima')).toBe(true)
    observador.entrar()
    expect(document.querySelector('#home-revela')?.classList.contains('dentro')).toBe(true)

    // A navegação: o layout fica, o conteúdo troca, a rota muda.
    pagina.innerHTML = `
      <div class="revela" id="projeto-revela">projeto</div>
      <div class="prancha prancha--margem" id="projeto-abre">
        <a class="prancha-alvo" href="/prints/x/abre.png" data-largura="3200"><img alt=""></a>
      </div>
      <div class="prancha prancha--margem" id="projeto-fixa">
        <a class="prancha-alvo" href="/prints/x/fixa.png" data-largura="639"><img alt=""></a>
      </div>`
    const abre = pagina.querySelector<HTMLElement>('#projeto-abre .prancha-alvo')!
    const fixa = pagina.querySelector<HTMLElement>('#projeto-fixa .prancha-alvo')!
    cravarLargura(abre, 880)
    cravarLargura(fixa, 520)

    rota.atual = '/pt/revy'
    rerender(<Movimento />)

    // 1. O que esconde os `.revela` continua posto — e agora com um observador
    //    olhando os da página nova, que é o que os traz de volta.
    expect(document.documentElement.hasAttribute('data-anima')).toBe(true)
    observador.entrar()
    expect(document.querySelector('#projeto-revela')?.classList.contains('dentro')).toBe(true)

    // 2. As pranchas novas foram avaliadas: a que não tem resolução a revelar
    //    deixou de ser link, a outra continua sendo.
    expect(fixa.closest('.prancha')?.classList.contains('prancha--fixa')).toBe(true)
    expect(fixa.hasAttribute('href')).toBe(false)
    expect(abre.getAttribute('href')).toBe('/prints/x/abre.png')

    // 3. E ganharam o clique: sem isto, clicar levaria embora do site.
    abre.click()
    expect(abre.closest('.prancha')?.classList.contains('aberta')).toBe(true)
  })

  it('a prancha da página velha não fica com listener pendurado', () => {
    document.body.innerHTML = ''
    const pagina = document.createElement('div')
    document.body.append(pagina)

    pagina.innerHTML = `
      <div class="prancha prancha--nua" id="velha">
        <a class="prancha-alvo" href="/prints/x/a.png" data-largura="3200"><img alt=""></a>
      </div>`
    const prancha = pagina.querySelector<HTMLElement>('#velha')!
    const velha = pagina.querySelector<HTMLElement>('#velha .prancha-alvo')!
    cravarLargura(velha, 880)

    const { rerender } = render(<Movimento />)

    // O nó sai do documento na navegação, mas o teste o segura: se a limpeza
    // não tirasse o listener, ele continuaria abrindo uma prancha órfã.
    prancha.remove()
    rota.atual = '/pt/revy'
    rerender(<Movimento />)

    // Sem listener sobrando o clique segue o `href`, e jsdom reclama de
    // navegação não implementada. O que importa aqui é a classe, não o ruído.
    // O nó já saiu do documento: quem pode barrar o default é a própria
    // prancha, e ela só vê o evento depois do alvo — um listener sobrando
    // ainda apareceria na classe.
    prancha.addEventListener('click', (e) => e.preventDefault())
    velha.click()

    expect(prancha.classList.contains('aberta')).toBe(false)
  })
})

describe('o movimento com o mouse', () => {
  it('sob movimento reduzido, revela tudo de uma vez em vez de animar', () => {
    // O setup já dá um matchMedia que sempre diz `false`; aqui ele passa a dizer
    // `true` só para a consulta de movimento reduzido.
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (q: string) => ({ matches: q.includes('prefers-reduced-motion') }) as MediaQueryList,
    )
    document.body.innerHTML = '<section class="faixa"><div class="revela">x</div></section>'
    render(<Movimento />)
    expect(document.querySelector('.revela')?.classList.contains('dentro')).toBe(true)
  })

  // `data-anima` é o atributo que esconde os `.revela`; quem os traz de volta é
  // o observador. Escrito ANTES do construtor, um observador que falhasse
  // deixava o atributo posto, ninguém observando e nenhuma limpeza registrada:
  // o site inteiro em opacidade zero, para sempre.
  it('o observador que falha não deixa o site escondido', () => {
    const original = window.IntersectionObserver
    window.IntersectionObserver = function () {
      throw new Error('sem observador')
    } as unknown as typeof window.IntersectionObserver
    document.body.innerHTML = '<div class="revela">x</div>'
    try {
      try {
        render(<Movimento />)
      } catch {
        // A falha em si não é o assunto: o assunto é o que ela deixa no `<html>`.
      }
      expect(document.documentElement.hasAttribute('data-anima')).toBe(false)
    } finally {
      window.IntersectionObserver = original
    }
  })

  // Num telefone o CSS já anula brilho, ímã e inclinação. Se o laço rodasse
  // assim mesmo, cada quadro de arrasto pagaria um `elementFromPoint` — que
  // força flush de estilo e layout — para escrever variáveis que ninguém lê.
  it('num aparelho sem cursor, arrastar o dedo não agenda quadro nenhum', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (consulta: string) => ({ matches: consulta.includes('hover: none') }) as MediaQueryList,
    )
    document.body.innerHTML = '<section class="faixa" data-brilho><a class="cta">x</a></section>'
    render(<Movimento />)

    const quadros = vi.spyOn(window, 'requestAnimationFrame')
    dispatchEvent(new Event('pointermove'))
    expect(quadros).not.toHaveBeenCalled()
  })
})
