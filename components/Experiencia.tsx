import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { experiencia } from '@/content/experiencia'

/**
 * A EXPERIÊNCIA — segunda seção da home, entre o Sobre e os projetos.
 *
 * Cada linha de um cargo é um BLOCO COM TÍTULO, não um bullet: quem varre a
 * página lê só os títulos e decide onde parar. Lista de frases soltas do
 * mesmo tamanho obriga a ler tudo ou nada. A peça é a `atividades:
 * { title, desc }` do currículo do Enzo Souto.
 *
 * A formação entra na mesma linha do tempo — não em seção própria. Ela é uma
 * linha e meia; seção inteira para uma linha e meia é cabeçalho a mais para
 * o leitor atravessar.
 */
export function Experiencia({ lang }: { lang: Idioma }) {
  return (
    <section className="secao wrap" id="experiencia">
      <h2>{t(ui.experienciaTitulo, lang, 'ui.experienciaTitulo')}</h2>

      {experiencia.map((cargo) => {
        const campo = `experiencia.${cargo.id}`
        return (
          <article
            className={`posto${cargo.tipo === 'formacao' ? ' formacao' : ''}`}
            key={cargo.id}
          >
            <p className="quando">{t(cargo.periodo, lang, `${campo}.periodo`)}</p>
            <div>
              <h3>{cargo.empresa}</h3>
              <p className="papel">{t(cargo.cargo, lang, `${campo}.cargo`)}</p>
              <p className="onde">{t(cargo.local, lang, `${campo}.local`)}</p>

              {cargo.blocos.length > 0 ? (
                <dl className="blocos">
                  {cargo.blocos.map((b, i) => (
                    <div key={i}>
                      <dt>{t(b.titulo, lang, `${campo}.blocos.${i}.titulo`)}</dt>
                      <dd>{t(b.texto, lang, `${campo}.blocos.${i}.texto`)}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {cargo.pilha ? (
                <p className="pilha">
                  {cargo.pilha.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </p>
              ) : null}
            </div>
          </article>
        )
      })}
    </section>
  )
}
