import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { sobre } from '@/content/sobre'

/**
 * O Sobre é o último bloco da home, não uma página — decidido em 04/09 depois
 * de três comps. O primeiro parágrafo é a lede, em corpo grande; os outros
 * são texto normal. Tudo sobre o neutro da casca.
 */
export function Sobre({ lang }: { lang: Idioma }) {
  const [lede, ...resto] = sobre.paragrafos

  return (
    <section className="sobre wrap" id="sobre">
      <h2>{t(ui.sobreTitulo, lang, 'ui.sobreTitulo')}</h2>
      <div className="grade">
        <div>
          <p className="lede">{t(lede, lang, 'sobre.paragrafos.0')}</p>
          {resto.map((p, i) => (
            <p className="corpo" key={i}>
              {t(p, lang, `sobre.paragrafos.${i + 1}`)}
            </p>
          ))}
        </div>
        <aside className="rail">
          <dl>
            {sobre.ficha.map((linha, i) => (
              <div key={i}>
                <dt>{t(linha.rotulo, lang, `sobre.ficha.${i}.rotulo`)}</dt>
                <dd>{t(linha.valor, lang, `sobre.ficha.${i}.valor`)}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
