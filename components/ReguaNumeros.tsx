import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Três ou quatro números. Zero significa "ainda não confirmado" e some da tela
 * — é o caso da Revy, cujos números de vitrine ainda vêm do seed fictício.
 */
export function ReguaNumeros({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  if (projeto.numeros.length === 0) return null

  return (
    <section className={`wrap regua regua--${projeto.numeros.length}`}>
      {projeto.numeros.map((n, i) => (
        <div className="num" key={n.valor + i}>
          <b>{n.valor}</b>
          <span>{t(n.rotulo, lang, `${projeto.slug}.numeros.${i}`)}</span>
        </div>
      ))}
    </section>
  )
}
