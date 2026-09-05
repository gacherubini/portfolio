'use client'

import { useEffect } from 'react'

const DURACAO = 460
const CURVA = 'cubic-bezier(.22,.72,.24,1)'

/**
 * O único componente client do site, montado uma vez no layout.
 *
 * Duas coisas, no mesmo efeito: abrir e fechar prancha, e o movimento com o
 * mouse — brilho seguindo o cursor, botões magnéticos, prancha que inclina e
 * entrada na rolagem. A primeira é o que o site precisa; a segunda é enfeite, e
 * some inteira sob `prefers-reduced-motion` ou onde não há cursor.
 *
 * Um só listener de `pointermove`, limitado a `requestAnimationFrame`, e
 * nenhuma medição dentro do laço de quadro.
 */
export function Movimento() {
  useEffect(() => {
    const raiz = document.documentElement
    const menos = matchMedia('(prefers-reduced-motion: reduce)').matches
    // Numa tela estreita a prancha já ocupa quase tudo: abrir não acrescenta, e
    // a abertura é desligada junto com o resto do movimento. Fica guardada a
    // consulta, e não o `.matches`: `aoRedimensionar` a relê a cada quadro de
    // redimensionamento, porque atravessar 900px muda a resposta.
    const estreito = matchMedia('(max-width: 900px)')
    const pranchas = [...document.querySelectorAll<HTMLElement>('.prancha')]
    let aberta: HTMLElement | null = null

    /**
     * Uma prancha só abre quando existe resolução a revelar: o arquivo precisa
     * ter pelo menos 1,5× mais pixel que o espaço em que está sendo mostrado.
     *
     * A largura do arquivo vem de `data-largura`, do conteúdo. NÃO usar
     * `img.naturalWidth`: com `next/image` ele é a largura da variante
     * servida, e a conta erraria.
     */
    function avaliar(p: HTMLElement) {
      // A prancha aberta está exibida na largura ABERTA, não na de leitura:
      // medir 1,5× contra ela é medir a coisa errada. Um print de 1568 passa
      // fechado a 880 e reprovaria aberto a 1320 — ganharia `prancha--fixa` no
      // primeiro resize, perderia o href, e o clique deixaria de fechá-la.
      if (p === aberta) return

      const alvo = p.querySelector<HTMLAnchorElement>('.prancha-alvo')
      if (!alvo) return
      const arquivo = Number(alvo.dataset.largura)
      const exibida = alvo.getBoundingClientRect().width
      if (!arquivo || !exibida) return

      const vale = !estreito.matches && arquivo >= exibida * 1.5
      p.classList.toggle('prancha--fixa', !vale)

      if (vale) {
        alvo.dataset.convite = 'ver maior'
        if (!alvo.hasAttribute('href')) alvo.setAttribute('href', alvo.dataset.arquivo ?? '')
      } else {
        // Sem href a prancha deixa de ser link: sem cursor de mão, sem clique
        // morto, sem anunciar uma coisa que não acontece.
        delete alvo.dataset.convite
        // Só guarda o endereço na primeira vez: `avaliar` roda de novo a cada
        // resize, e aí o href já não está lá — sobrescrever apagaria o
        // endereço que o `vale` acima precisa para devolver o link.
        if (alvo.hasAttribute('href')) alvo.dataset.arquivo = alvo.getAttribute('href')!
        alvo.removeAttribute('href')
      }
    }

    /**
     * `--esq` é a distância da COLUNA do print até a borda da tela. Dentro da
     * faixa da home, `50%` no centramento resolve contra a coluna, não contra a
     * página — e a coluna não está no meio da tela.
     *
     * Quem é medido é a prancha, não o alvo: com a prancha aberta o alvo já
     * carrega a margem que esta conta produziu, e medi-lo devolveria o lugar
     * deslocado no lugar do lugar da coluna. Fechada, os dois coincidem.
     */
    function medirEsq(p: HTMLElement) {
      if (!p.closest('.faixa')) return
      const alvo = p.querySelector<HTMLElement>('.prancha-alvo')
      alvo?.style.setProperty('--esq', `${p.getBoundingClientRect().left}px`)
    }

    // Uma animação por prancha, para poder cancelar a que ainda está no ar.
    const voos = new WeakMap<HTMLElement, Animation>()

    /** Tira a prancha do estado aberto sem passar pelo FLIP. */
    function desmarcar(p: HTMLElement) {
      // Uma animação dela no ar ficaria deslizando para uma geometria que já
      // não existe: é o caso de trocar de prancha aberta, e o de encolher a
      // janela para estreito com uma prancha aberta.
      voos.get(p)?.cancel()
      p.classList.remove('aberta')
      p.querySelector<HTMLElement>('.prancha-alvo')!.dataset.convite = 'ver maior'
    }

    /**
     * FLIP. Mede onde a imagem está, muda o layout de uma vez, mede de novo, e
     * devolve a imagem ao lugar antigo com um `transform` — daí anima esse
     * transform até zero.
     *
     * Por que não animar `width`: largura é propriedade de layout. O navegador
     * refaria o layout da página e reescalaria um bitmap de 3200×2000 a cada
     * quadro. Medido: com `width`, quadros de 34ms; com FLIP, 9,4ms.
     */
    function virar(p: HTMLElement, mudar: () => void) {
      const alvo = p.querySelector<HTMLElement>('.prancha-alvo')!

      // Antes de medir: uma animação no ar deforma a caixa que `antes` vai ler,
      // e sem cancelá-la clicar em B com A voando deixa A deslizando para uma
      // geometria que já não existe. Clicar duas vezes na mesma prancha é pior:
      // o `.then` da primeira tiraria `prancha--virando` no meio da segunda.
      voos.get(p)?.cancel()

      const antes = alvo.getBoundingClientRect()

      // Só ao abrir: com a prancha já aberta o valor está aplicado, e remedir
      // aqui mexeria na geometria que `antes` acabou de capturar. Fechando,
      // `--esq` não vale mais nada — a regra que o usa pede `.aberta`.
      if (!p.classList.contains('aberta')) medirEsq(p)

      if (menos || !alvo.animate) { mudar(); return }

      p.classList.add('prancha--virando')
      mudar()

      // A rolagem entra ANTES da segunda medição, de propósito: assim o
      // transform absorve os dois movimentos de uma vez. `scrollIntoView`
      // suave rodando em paralelo põe duas animações competindo, e a página
      // desliza por baixo de uma imagem que cresce.
      if (p.classList.contains('aberta')) p.scrollIntoView({ block: 'start', behavior: 'auto' })

      const depois = alvo.getBoundingClientRect()
      const escala = depois.width ? antes.width / depois.width : 1

      const anim = alvo.animate(
        [
          {
            transformOrigin: '0 0',
            transform: `translate(${antes.left - depois.left}px, ${antes.top - depois.top}px) scale(${escala})`,
          },
          { transformOrigin: '0 0', transform: 'none' },
        ],
        { duration: DURACAO, easing: CURVA },
      )
      voos.set(p, anim)
      anim.finished.catch(() => {}).then(() => {
        // Quem limpa é só a última: uma animação cancelada não pode tirar a
        // classe de baixo da que a substituiu.
        if (voos.get(p) !== anim) return
        voos.delete(p)
        p.classList.remove('prancha--virando')
      })
    }

    function fechar() {
      if (!aberta) return
      const p = aberta
      aberta = null
      // A reavaliação vai DENTRO da mudança, e não depois de `virar`: `avaliar`
      // pula a prancha aberta, então um resize durante a abertura deixou
      // `prancha--fixa`, href e convite com a resposta da largura antiga — e ela
      // poderia ficar convidando a abrir uma prancha sem resolução a revelar até
      // o resize seguinte. Aqui a prancha já está fechada e o FLIP ainda não
      // aplicou transform nenhum: é o único ponto em que ela mede a largura de
      // leitura de verdade.
      virar(p, () => { desmarcar(p); avaliar(p) })
    }

    function abrir(p: HTMLElement) {
      if (aberta === p) { fechar(); return }
      if (aberta) {
        // Sem animar: duas pranchas se mexendo ao mesmo tempo é movimento
        // demais, e a rolagem iria para o lugar errado.
        const anterior = aberta
        // Zerar antes de reavaliar: `avaliar` sai cedo quando a prancha é a
        // aberta, e esta acabou de deixar de ser. Mesma razão do `fechar`.
        aberta = null
        desmarcar(anterior)
        avaliar(anterior)
      }
      aberta = p
      virar(p, () => {
        p.classList.add('aberta')
        p.querySelector<HTMLElement>('.prancha-alvo')!.dataset.convite = 'fechar'
      })
    }

    const cliques: Array<() => void> = []
    for (const p of pranchas) {
      const alvo = p.querySelector<HTMLAnchorElement>('.prancha-alvo')
      if (!alvo) continue
      avaliar(p)
      const aoClicar = (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        if (p.classList.contains('prancha--fixa')) return
        e.preventDefault()
        abrir(p)
      }
      alvo.addEventListener('click', aoClicar)
      cliques.push(() => alvo.removeEventListener('click', aoClicar))
    }

    const aoTeclar = (e: KeyboardEvent) => { if (e.key === 'Escape') fechar() }
    // Redimensionar muda a largura exibida, e com ela a conta do 1,5×.
    const aoRedimensionar = () => {
      // A janela atravessou para estreito com prancha aberta: lá a abertura não
      // existe, então ela fecha. Sem animar — é o mesmo caso de trocar de
      // prancha aberta, e animar uma coisa que está sendo desligada é gratuito.
      if (estreito.matches && aberta) {
        desmarcar(aberta)
        aberta = null
      }
      pranchas.forEach(avaliar)
      // `--aberta` acompanha `100vw` sozinha; `--esq` não. Sem remedir, a
      // prancha da faixa sai do centro no primeiro redimensionamento.
      if (aberta) medirEsq(aberta)
    }
    document.addEventListener('keydown', aoTeclar)
    addEventListener('resize', aoRedimensionar)

    // --- entrada na rolagem ---
    // Os elementos nascem VISÍVEIS no HTML. Só ficam escondidos depois que o
    // JS confirma que sabe animá-los: quem está sem JS vê o site inteiro.
    const reveladores = [...document.querySelectorAll<HTMLElement>('.revela')]
    let observador: IntersectionObserver | null = null
    if (menos) {
      reveladores.forEach((n) => n.classList.add('dentro'))
    } else {
      raiz.dataset.anima = 'sim'
      observador = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue
            e.target.classList.add('dentro')
            observador!.unobserve(e.target)
          }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
      )
      reveladores.forEach((n) => observador!.observe(n))
    }

    // --- o cursor ---
    // As caixas ficam em cache. Medir `.cta` a cada quadro força recálculo de
    // layout a cada movimento do cursor, e engasga a página inteira — não só a
    // imagem. Medido: 346 movimentos em 1,4s, pior quadro 9,2ms.
    let px = 0, py = 0, pendente = false, sujo = true, quadro = 0
    let botoes: HTMLElement[] = []
    let caixas = new WeakMap<Element, DOMRect>()
    let inclinado: HTMLElement | null = null

    function medir() {
      botoes = [...document.querySelectorAll<HTMLElement>('.cta')]
      caixas = new WeakMap()
      for (const el of [...botoes, ...document.querySelectorAll('[data-brilho], .col-print')]) {
        caixas.set(el, el.getBoundingClientRect())
      }
      sujo = false
    }
    const caixa = (el: Element) => {
      const r = caixas.get(el)
      if (r) return r
      const novo = el.getBoundingClientRect()
      caixas.set(el, novo)
      return novo
    }

    function pintar() {
      pendente = false
      if (sujo) medir()
      const sob = document.elementFromPoint(px, py)

      const brilho = sob?.closest<HTMLElement>('[data-brilho]')
      if (brilho) {
        const r = caixa(brilho)
        brilho.style.setProperty('--mx', `${((px - r.left) / r.width) * 100}%`)
        brilho.style.setProperty('--my', `${((py - r.top) / r.height) * 100}%`)
      }

      for (const b of botoes) {
        const r = caixa(b)
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        if (Math.hypot(px - cx, py - cy) < 110) {
          b.style.setProperty('--dx', `${Math.max(-5, Math.min(5, (px - cx) * 0.16))}px`)
          b.style.setProperty('--dy', `${Math.max(-5, Math.min(5, (py - cy) * 0.16))}px`)
        } else {
          b.style.removeProperty('--dx')
          b.style.removeProperty('--dy')
        }
      }

      // Prancha aberta não inclina: ela já é o assunto da tela, e um segundo
      // `transform` brigaria com o da abertura. Quem carrega `aberta` é a
      // `.prancha` dentro da coluna, não a coluna — o CSS já tira a inclinação
      // pela cascata, e esta guarda impede que o laço fique escrevendo `--rx`
      // e `--ry` numa prancha que não vai usá-los.
      let col = sob?.closest<HTMLElement>('.col-print') ?? null
      if (col?.querySelector('.prancha.aberta')) col = null
      if (inclinado && inclinado !== col) {
        const f = inclinado.querySelector<HTMLElement>('.prancha-alvo')
        f?.style.removeProperty('--rx')
        f?.style.removeProperty('--ry')
      }
      inclinado = col
      if (col) {
        const f = col.querySelector<HTMLElement>('.prancha-alvo')
        const r = caixa(col)
        f?.style.setProperty('--ry', `${(((px - r.left) / r.width - 0.5) * 5).toFixed(2)}deg`)
        f?.style.setProperty('--rx', `${(((py - r.top) / r.height - 0.5) * -5).toFixed(2)}deg`)
      }
    }

    const aoMover = (e: PointerEvent) => {
      px = e.clientX; py = e.clientY
      if (!pendente) { pendente = true; quadro = requestAnimationFrame(pintar) }
    }
    const sujar = () => { sujo = true }
    if (!menos) {
      addEventListener('pointermove', aoMover, { passive: true })
      addEventListener('scroll', sujar, { passive: true })
      // Redimensionar move toda caixa medida. Sem invalidar aqui, o cache só
      // se renovaria na próxima rolagem, e até lá o ímã puxaria os botões para
      // onde eles estavam antes.
      addEventListener('resize', sujar)
    }

    raiz.dataset.mov = 'sim'
    return () => {
      cliques.forEach((f) => f())
      document.removeEventListener('keydown', aoTeclar)
      removeEventListener('resize', aoRedimensionar)
      observador?.disconnect()
      removeEventListener('pointermove', aoMover)
      removeEventListener('scroll', sujar)
      removeEventListener('resize', sujar)
      // Um quadro pode estar marcado desde o último movimento do cursor.
      cancelAnimationFrame(quadro)
      delete raiz.dataset.mov
      delete raiz.dataset.anima
    }
  }, [])

  return null
}
