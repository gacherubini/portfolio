import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Três ou quatro números. Zero significa "ainda não confirmado" e some da tela.
 */
export function ReguaNumeros({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  if (projeto.numeros.length === 0) return null

  return (
    <section className={`wrap regua regua--${projeto.numeros.length}`}>
      {projeto.numeros.map((n, i) => (
        <div className="num" key={i}>
          <b>{t(n.valor, lang, `${projeto.slug}.numeros.${i}.valor`)}</b>
          <span>{t(n.rotulo, lang, `${projeto.slug}.numeros.${i}.rotulo`)}</span>
        </div>
      ))}
    </section>
  )
}
