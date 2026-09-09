'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/** Quantos cacos por lado. 8×8 é onde o gesto lê sem virar chuvisco. */
const N = 8
/** Segundos entre o primeiro caco e o último. */
const ESPALHO = 0.7

/**
 * O PRINT QUE SE MONTA EM CACOS.
 *
 * Ideia do `RetratoFragmentado.vue` do currículo do Enzo Souto: uma grade
 * N×N de divs, cada um mostrando só a sua fatia da imagem, nascendo
 * deslocado e assentando no lugar. Aqui os cacos entram POR LINHA, de cima
 * para baixo, como um conjunto de registros chegando — a dele entra do
 * centro para fora, que é foco assentando, e o assunto aqui é outro.
 *
 * DUAS DIFERENÇAS DE CONSTRUÇÃO EM RELAÇÃO À DELE:
 *
 * 1. TUDO EM PORCENTAGEM. Ele mede em px porque a moldura dele tem tamanho
 *    fixo, e por isso precisa refazer a conta do `object-fit: cover` na mão.
 *    Print é fluido: com `background-size: N*100%` cada caco acerta a fatia
 *    sozinho em qualquer largura, e a conta de cover deixa de existir.
 *    Em `translate()` a porcentagem é do próprio caco, então o deslocamento
 *    tem o mesmo peso em qualquer tela.
 *
 * 2. QUEM JÁ ESTÁ NA TELA NÃO PASSA PELO OBSERVADOR. Passava, e era defeito
 *    visível: o primeiro callback depois de `observe()` só chega uns frames
 *    adiante — medido em ~300ms. Nesse intervalo os cacos já existem em
 *    repouso, invisíveis, e o print SUMIA por um terço de segundo antes de
 *    começar a montar. Um `requestAnimationFrame` dá o único quadro que a
 *    animação precisa para ter começo.
 *
 * O REPOUSO É O QUADRO `from`, e é o que segura tudo: sem JavaScript o
 * `<img>` do `next/image` fica visível e nada acontece; sob movimento
 * reduzido os cacos nascem montados. A animação é acréscimo, nunca
 * requisito.
 *
 * A IMAGEM CONTINUA SENDO A DO `<picture>`. O caco lê `currentSrc` — a
 * candidata que o navegador de fato escolheu —, então o AVIF e o srcset
 * assados no build continuam valendo, e a URL já está no cache: o
 * `background-image` não baixa nada de novo.
 *
 * E CONVIVE COM A PRANCHA. A grade monta dentro do `.prancha-alvo`, some
 * quando a animação termina, e o link volta a ser um link — abrir a prancha
 * continua funcionando como se os cacos não existissem.
 */
export function PrintEmCacos({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const caixa = raiz.current
    if (!caixa) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const img = caixa.querySelector('img')
    // A GRADE MORA NO `.prancha-alvo`, NÃO NO `<figure>`. O figure carrega
    // também a legenda, e uma grade absoluta sobre ele cobriria a legenda —
    // o alvo envolve exatamente a imagem, que é o que se fragmenta.
    const alvo = caixa.querySelector<HTMLElement>('.prancha-alvo') ?? caixa.querySelector('figure')
    if (!img || !alvo) return

    let obs: IntersectionObserver | undefined
    let quadro = 0
    let limpeza = 0

    function montar() {
      const fonte = img!.currentSrc || img!.src
      if (!fonte) return

      const grade = document.createElement('div')
      grade.className = 'cacos'
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const caco = document.createElement('div')
          caco.className = 'caco'
          const estilo = caco.style
          estilo.left = `${(c * 100) / N}%`
          estilo.top = `${(r * 100) / N}%`
          // +1px de sobra: sem ela a costura entre cacos vizinhos deixa
          // passar uma linha do que está atrás. `overflow: hidden` na grade
          // corta o que sobra nas bordas de fora.
          estilo.width = `calc(${100 / N}% + 1px)`
          estilo.height = `calc(${100 / N}% + 1px)`
          estilo.backgroundImage = `url("${fonte}")`
          estilo.backgroundSize = `${N * 100}% ${N * 100}%`
          estilo.backgroundPosition = `${(c * 100) / (N - 1)}% ${(r * 100) / (N - 1)}%`
          estilo.setProperty('--atraso', `${((r / (N - 1)) * ESPALHO + (c % 3) * 0.02).toFixed(3)}s`)
          estilo.setProperty('--giro', `${(r + c) % 2 === 0 ? 7 : -7}deg`)
          grade.appendChild(caco)
        }
      }
      alvo!.appendChild(grade)
      alvo!.classList.add('fragmentado')

      // OS CACOS SÃO GESTO PASSAGEIRO, e por isso saem do DOM quando acabam.
      // Ficando, cobririam o `.prancha-alvo` — que é um link — e o clique que
      // abre a prancha morreria num div sem href. E são N² nós por print,
      // pendurados para sempre por causa de meio segundo de animação.
      const desmontar = () => {
        grade.remove()
        alvo!.classList.remove('fragmentado', 'pronto')
      }
      const aparecer = () => {
        alvo!.classList.add('pronto')
        limpeza = window.setTimeout(desmontar, (ESPALHO + 0.58) * 1000 + 120)
      }
      const r = alvo!.getBoundingClientRect()
      // Sem `IntersectionObserver` o print ficaria invisível para sempre, já
      // que o `<img>` é escondido assim que a grade existe. Nesse caso ele
      // monta na hora: perde-se o gesto, nunca a imagem.
      if (!('IntersectionObserver' in window) || (r.top < innerHeight && r.bottom > 0)) {
        quadro = requestAnimationFrame(aparecer)
      } else {
        obs = new IntersectionObserver(
          (entradas) => {
            for (const e of entradas) {
              if (!e.isIntersecting) continue
              aparecer()
              obs?.disconnect()
            }
          },
          { threshold: 0.25 },
        )
        obs.observe(alvo!)
      }
    }

    // `currentSrc` só existe depois que o navegador escolheu a candidata.
    if (img.complete) montar()
    else img.addEventListener('load', montar, { once: true })

    return () => {
      obs?.disconnect()
      cancelAnimationFrame(quadro)
      clearTimeout(limpeza)
      img.removeEventListener('load', montar)
      alvo.querySelector('.cacos')?.remove()
      alvo.classList.remove('fragmentado', 'pronto')
    }
  }, [])

  return (
    <div className={className} ref={raiz}>
      {children}
    </div>
  )
}
