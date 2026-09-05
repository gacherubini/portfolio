import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { PrintFigura } from '@/components/PrintFigura'
import { TextoComMarcas } from '@/components/TextoComMarcas'

/**
 * "O principal" de cada projeto: o primeiro conteúdo depois da chamada, de
 * propósito. Só existe quando o projeto tem uma coisa que se entende por
 * imagem — ou, no caso do Office Timesheet, quando o texto sozinho já explica
 * o que o assistente faz, enquanto a imagem não existe.
 */
export function Destaque({ projeto, lang }: { projeto: Projeto; lang: Idioma }) {
  const destaque = projeto.destaque
  if (!destaque) return null

  const campo = `${projeto.slug}.destaque`
  const quantos = destaque.prints.length

  return (
    <section className="destaque">
      <div className="wrap">
        <div className="cabeca">
          <h2>{t(destaque.titulo, lang, `${campo}.titulo`)}</h2>
          {destaque.texto.map((p, i) => (
            <p key={i}>
              <TextoComMarcas texto={t(p, lang, `${campo}.texto.${i}`)} />
            </p>
          ))}
        </div>

        {quantos > 0 ? (
          <div className={quantos === 2 ? 'placas' : undefined}>
            {destaque.prints.map((print, i) => {
              const figura = (
                <PrintFigura
                  key={print.arquivo}
                  print={print}
                  slug={projeto.slug}
                  lang={lang}
                  campo={`${campo}.prints.${i}`}
                  sizes={
                    quantos === 2
                      ? '(max-width: 900px) 100vw, 560px'
                      : '(max-width: 900px) 100vw, 960px'
                  }
                  className={quantos === 1 ? 'placa-larga' : undefined}
                />
              )

              // O Autotune põe cada print numa placa com nome do motor e
              // latência no alto: o menta dos prints não pode encostar no
              // âmbar da página, e a placa é o que separa os dois.
              if (!print.etiqueta) return figura

              return (
                <div className="placa" key={print.arquivo}>
                  <div className="topo-placa">
                    <span className="motor">{t(print.etiqueta, lang, `${campo}.prints.${i}.etiqueta`)}</span>
                    {print.valor ? (
                      <span className="lat">{t(print.valor, lang, `${campo}.prints.${i}.valor`)}</span>
                    ) : null}
                  </div>
                  <div className="pequeno">{figura}</div>
                </div>
              )
            })}
          </div>
        ) : null}

        {destaque.amarras ? (
          <div className="amarras">
            {destaque.amarras.map((amarra, i) => (
              <div className="amarra" key={i}>
                <h3>{t(amarra.titulo, lang, `${campo}.amarras.${i}.titulo`)}</h3>
                {amarra.texto.map((p, j) => (
                  <p key={j}>
                    <TextoComMarcas texto={t(p, lang, `${campo}.amarras.${i}.texto.${j}`)} />
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {destaque.fecho ? (
          <p className="leitura">
            <TextoComMarcas texto={t(destaque.fecho, lang, `${campo}.fecho`)} />
          </p>
        ) : null}
      </div>
    </section>
  )
}
