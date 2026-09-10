'use client'

import { useEffect, useState } from 'react'
import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'

// Sem `contato`: a faixa azul do fim da home saiu em 09/09/2026 e o contato
// mora dentro do Sobre. Um segundo item apontando para a mesma âncora acenderia
// dois links de uma vez.
const SECOES = ['sobre', 'experiencia', 'projetos'] as const

/**
 * A navegação do topo, marcando a seção em que o visitante está.
 *
 * Client component porque precisa de `IntersectionObserver` — e é o único
 * motivo. A margem recorta a tela numa faixa fina no terço de cima: sem ela
 * duas seções ficam "visíveis" ao mesmo tempo o tempo todo e a marcação
 * pisca entre as duas.
 *
 * SEM JAVASCRIPT OS LINKS CONTINUAM LINKS. A âncora funciona por HTML; o que
 * o observador acrescenta é só saber onde você está.
 */
export function NavSecoes({ lang }: { lang: Idioma }) {
  const [ativa, setAtiva] = useState<string | null>(null)

  useEffect(() => {
    const alvos = SECOES.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (alvos.length === 0) return

    // GUARDAR O CONJUNTO, NÃO A ÚLTIMA. Reagir só a quem ENTRA deixa a
    // marcação presa: no topo da página nenhuma seção está na faixa, e o
    // menu continuava apontando a última por onde se passou — voltar ao
    // início mostrava "Projetos" aceso. Com o conjunto, sair também conta,
    // e conjunto vazio é nenhuma seção marcada, que é a verdade ali.
    const dentro = new Set<string>()
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) dentro.add(e.target.id)
          else dentro.delete(e.target.id)
        }
        // Duas na faixa ao mesmo tempo: vale a de cima, que é para onde a
        // pessoa está indo.
        setAtiva(SECOES.find((id) => dentro.has(id)) ?? null)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    for (const el of alvos) obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <nav>
      {SECOES.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={ativa === id ? 'true' : undefined}
        >
          {t(ui.nav[id], lang, `ui.nav.${id}`)}
        </a>
      ))}
    </nav>
  )
}
