import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { TextoComMarcas } from '@/components/TextoComMarcas'

/**
 * Português comum, sem jargão: é o bloco que a primeira plateia — dono de
 * empresa, recrutador, cliente — lê para entender o que o sistema resolve.
 */
export function Prosa({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const coluna = (titulo: string, paragrafos: Projeto['problema'], campo: string) => (
    <div>
      <h2>{titulo}</h2>
      {paragrafos.map((p, i) => (
        <p key={i}>
          <TextoComMarcas texto={t(p, lang, `${campo}.${i}`)} />
        </p>
      ))}
    </div>
  )

  return (
    <section className="wrap prosa revela">
      {coluna(t(ui.prosa.problema, lang, 'ui.prosa.problema'), projeto.problema, `${projeto.slug}.problema`)}
      {coluna(t(ui.prosa.oQueFaz, lang, 'ui.prosa.oQueFaz'), projeto.oQueFaz, `${projeto.slug}.oQueFaz`)}
    </section>
  )
}
