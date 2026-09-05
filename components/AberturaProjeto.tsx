import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Nome, chamada e a ficha lateral. Os rótulos da ficha são por projeto e não
 * fixos: campo fixo obrigava o BDDente a esconder "Substituiu — Dentalis, em
 * FoxPro, de 1996 a 2024", que é o dado mais forte que ele tem.
 */
export function AberturaProjeto({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const campo = projeto.slug

  return (
    <section className="wrap abertura-projeto">
      <div className="revela">
        <h1>{projeto.nome}</h1>
        <p className="chamada">{t(projeto.chamada, lang, `${campo}.chamada`)}</p>
      </div>

      <aside className="ficha revela">
        <dl>
          {projeto.ficha.map((linha, i) => (
            <div key={i}>
              <dt>{t(linha.rotulo, lang, `${campo}.ficha.${i}.rotulo`)}</dt>
              <dd>{t(linha.valor, lang, `${campo}.ficha.${i}.valor`)}</dd>
            </div>
          ))}
        </dl>

        {projeto.links.length > 0 ? (
          <div className="acoes">
            {projeto.links.map((link, i) => (
              <a
                key={link.href}
                className={`cta${link.primario || i === 0 ? '' : ' fantasma'}`}
                href={link.href}
              >
                {t(link.rotulo, lang, `${campo}.links.${i}`)}
              </a>
            ))}
          </div>
        ) : projeto.semLink ? (
          <div className="semlink">
            <b>{t(projeto.semLink.titulo, lang, `${campo}.semLink.titulo`)}</b>
            <p>{t(projeto.semLink.texto, lang, `${campo}.semLink.texto`)}</p>
          </div>
        ) : null}
      </aside>
    </section>
  )
}
