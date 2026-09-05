import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { TextoComMarcas } from '@/components/TextoComMarcas'

/**
 * A segunda plateia — tech lead, outro dev — recebe stack e decisão de
 * engenharia aqui, no fim, marcado como pulável. É o único lugar da página
 * onde o jargão é bem-vindo.
 */
export function BlocoTecnico({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const { stack, terminal, notas } = projeto.tecnico
  const campo = `${projeto.slug}.tecnico`

  return (
    <section className="wrap tecnico">
      {/* Único bloco da página sem `h2` antes desta linha: quem navega por
          heading não tinha marco nenhum na seção que o próprio texto convida
          a pular. `.aviso` continua definindo a aparência — só o elemento
          mudou de `p` para `h2`. */}
      <h2 className="aviso">{t(ui.avisoTecnico, lang, 'ui.avisoTecnico')}</h2>

      <div className="chips">
        {stack.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </div>

      {terminal ? (
        <>
          <div className="terminal">
            <pre>
              <b>$ {terminal.comando}</b>
              {'\n\n'}
              {terminal.saida}
            </pre>
          </div>
          <p className="legenda-terminal">
            <TextoComMarcas texto={t(terminal.legenda, lang, `${campo}.terminal.legenda`)} />
          </p>
        </>
      ) : null}

      <div className={`notas notas--${notas.length}`}>
        {notas.map((nota, i) => (
          <div className="nota" key={i}>
            <h3>
              <TextoComMarcas texto={t(nota.titulo, lang, `${campo}.notas.${i}.titulo`)} />
            </h3>
            {nota.texto.map((p, j) => (
              <p key={j}>
                <TextoComMarcas texto={t(p, lang, `${campo}.notas.${i}.texto.${j}`)} />
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
