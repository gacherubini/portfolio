'use client'

import { useEffect } from 'react'

const DURACAO = 460
const CURVA = 'cubic-bezier(.22,.72,.24,1)'

/**
 * O único componente client do site, montado uma vez no layout.
 *
 * Nesta task ele faz uma coisa só: abrir e fechar prancha. A Task 9 acrescenta
 * o movimento com o mouse no mesmo arquivo.
 */
export function Movimento() {
  useEffect(() => {
    const raiz = document.documentElement
    const menos = matchMedia('(prefers-reduced-motion: reduce)').matches
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
      const alvo = p.querySelector<HTMLAnchorElement>('.prancha-alvo')
      if (!alvo) return
      const arquivo = Number(alvo.dataset.largura)
      const exibida = alvo.getBoundingClientRect().width
      if (!arquivo || !exibida) return

      const vale = arquivo >= exibida * 1.5
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
      const antes = alvo.getBoundingClientRect()

      // Dentro da faixa da home, `50%` no centramento resolve contra a coluna
      // do print, não contra a página — e a coluna não está no meio da tela.
      if (p.closest('.faixa')) alvo.style.setProperty('--esq', `${antes.left}px`)

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
      anim.finished.catch(() => {}).then(() => p.classList.remove('prancha--virando'))
    }

    function fechar() {
      if (!aberta) return
      const p = aberta
      aberta = null
      virar(p, () => {
        p.classList.remove('aberta')
        p.querySelector<HTMLElement>('.prancha-alvo')!.dataset.convite = 'ver maior'
      })
    }

    function abrir(p: HTMLElement) {
      if (aberta === p) { fechar(); return }
      if (aberta) {
        // Sem animar: duas pranchas se mexendo ao mesmo tempo é movimento
        // demais, e a rolagem iria para o lugar errado.
        aberta.classList.remove('aberta')
        aberta.querySelector<HTMLElement>('.prancha-alvo')!.dataset.convite = 'ver maior'
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
    const aoRedimensionar = () => pranchas.forEach(avaliar)
    document.addEventListener('keydown', aoTeclar)
    addEventListener('resize', aoRedimensionar)

    raiz.dataset.mov = 'sim'
    return () => {
      cliques.forEach((f) => f())
      document.removeEventListener('keydown', aoTeclar)
      removeEventListener('resize', aoRedimensionar)
      delete raiz.dataset.mov
    }
  }, [])

  return null
}
