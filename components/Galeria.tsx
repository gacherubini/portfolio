import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { PrintFigura } from '@/components/PrintFigura'

/**
 * As outras telas, em tiras de três. O Office Timesheet tem duas fileiras
 * porque as telas dele contam duas histórias diferentes — o dia de quem aponta
 * e o fechamento do mês —, e uma fileira só apagaria essa divisão.
 *
 * O Autotune não tem galeria: o peso dele vai para o destaque e para o bloco
 * técnico.
 */
export function Galeria({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  if (projeto.galeria.length === 0) return null

  return (
    <section className="wrap galeria">
      {projeto.galeria.map((fileira, f) => (
        <div key={f}>
          <h2>{t(fileira.titulo, lang, `${projeto.slug}.galeria.${f}.titulo`)}</h2>
          <div className="tiras">
            {fileira.prints.map((print, i) => (
              <PrintFigura
                key={print.arquivo}
                print={print}
                slug={projeto.slug}
                lang={lang}
                campo={`${projeto.slug}.galeria.${f}.prints.${i}`}
                sizes="(max-width: 900px) 100vw, 372px"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
