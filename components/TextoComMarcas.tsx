import { Fragment } from 'react'

/**
 * A spec fecha a tipografia em Archivo sozinha, com uma exceção estreita:
 * código e saída de terminal vão em monoespaçada, porque nome de função lê como
 * prosa em fonte proporcional. O conteúdo marca esses trechos com crase.
 *
 * `*assim*` é ênfase — usada em três lugares dos comps aprovados, sempre para
 * a palavra que o parágrafo inteiro está construindo.
 */
export function TextoComMarcas({ texto }: { texto: string }) {
  const pedacos = texto.split(/(`[^`]+`|\*[^*]+\*)/g)

  return (
    <>
      {pedacos.map((pedaco, i) => {
        if (pedaco.startsWith('`') && pedaco.endsWith('`') && pedaco.length > 2) {
          return <code key={i}>{pedaco.slice(1, -1)}</code>
        }
        if (pedaco.startsWith('*') && pedaco.endsWith('*') && pedaco.length > 2) {
          return <b key={i}>{pedaco.slice(1, -1)}</b>
        }
        return <Fragment key={i}>{pedaco}</Fragment>
      })}
    </>
  )
}
