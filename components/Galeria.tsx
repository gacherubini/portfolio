import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { PrintFigura } from '@/components/PrintFigura'

/**
 * As outras telas, em pranchas.
 *
 * Era uma grade de três selos de 357px por fileira, e eles eram ilegíveis. A
 * prancha é larga, a legenda vai para a margem em corpo de leitura, e o lado
 * alterna a cada uma — que é a mesma língua que as faixas da home já falam com
 * `espelho`. Nenhum dispositivo novo foi inventado para isto.
 *
 * O Office Timesheet tem duas fileiras porque as telas dele contam duas
 * histórias diferentes. O Autotune não tem galeria.
 */
export function Galeria({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  if (projeto.galeria.length === 0) return null

  return (
    <section className="wrap galeria">
      {projeto.galeria.map((fileira, f) => (
        <div key={f}>
          <h2>{t(fileira.titulo, lang, `${projeto.slug}.galeria.${f}.titulo`)}</h2>
          <div className="pranchas">
            {fileira.prints.map((print, i) => (
              <PrintFigura
                key={print.arquivo}
                print={print}
                slug={projeto.slug}
                lang={lang}
                campo={`${projeto.slug}.galeria.${f}.prints.${i}`}
                variante="margem"
                className="revela"
                // Fechada a prancha tem 880px; aberta vai a 1320. `sizes`
                // precisa cobrir os dois, senão o next/image serve a variante
                // pequena e a abertura mostra uma imagem borrada.
                sizes="(max-width: 900px) 100vw, 1320px"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
