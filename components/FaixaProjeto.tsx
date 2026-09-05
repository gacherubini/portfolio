import Link from 'next/link'
import type { Idioma, Projeto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { estiloDoTema } from '@/lib/tema'
import { PrintFigura } from '@/components/PrintFigura'

/**
 * O print que abre a faixa: o marcado com `naFaixa`, senão o primeiro do
 * destaque, senão o de abertura — que é o caso do Office Timesheet, cujo
 * destaque não tem imagem.
 */
function printDaFaixa(projeto: Projeto) {
  const doDestaque = projeto.destaque?.prints
  return (
    doDestaque?.find((p) => p.naFaixa) ??
    doDestaque?.[0] ??
    projeto.printAbertura ??
    projeto.galeria[0]?.prints[0]
  )
}

export function FaixaProjeto({
  projeto,
  lang,
  espelho,
  prioridade = false,
}: {
  projeto: Projeto
  lang: Idioma
  espelho: boolean
  prioridade?: boolean
}) {
  const print = printDaFaixa(projeto)
  // A régua da vitrine pode ser diferente da régua da página: o Office
  // Timesheet mostra operação aqui e engenharia lá dentro.
  const numeros = projeto.numerosHome ?? projeto.numeros
  const primario = projeto.links.find((l) => l.primario) ?? projeto.links[0]
  const campo = `${projeto.slug}.faixa`

  return (
    <section
      className={`faixa${espelho ? ' espelho' : ''}`}
      style={estiloDoTema(projeto.tema)}
      aria-labelledby={`faixa-${projeto.slug}`}
    >
      <div className="wrap grade">
        <div className="col-texto">
          <div className="ficha-faixa">
            <h2 className="nome" id={`faixa-${projeto.slug}`}>
              {projeto.nome}
            </h2>
            <p className="paraquem">{t(projeto.paraQuem, lang, `${campo}.paraQuem`)}</p>
            <p className="situacao">
              {t(ui.situacao[projeto.situacao], lang, `ui.situacao.${projeto.situacao}`)}
            </p>
            {projeto.selo ? (
              <p className="selo">{t(projeto.selo, lang, `${campo}.selo`)}</p>
            ) : null}
          </div>

          <p className="resumo">{t(projeto.resumoHome, lang, `${campo}.resumoHome`)}</p>

          {numeros.length > 0 ? (
            <div className="numeros">
              {numeros.map((n, i) => (
                <div className="num" key={i}>
                  <b>{t(n.valor, lang, `${campo}.numeros.${i}.valor`)}</b>
                  <span>{t(n.rotulo, lang, `${campo}.numeros.${i}.rotulo`)}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="botoes">
            {primario ? (
              <a className="cta" href={primario.href}>
                {t(primario.rotulo, lang, `${campo}.link`)}
              </a>
            ) : projeto.semLink ? (
              <p className="fechado">{t(projeto.semLink.curto, lang, `${campo}.semLink.curto`)}</p>
            ) : null}
            <Link className="cta fantasma" href={`/${lang}/${projeto.slug}`}>
              {t(ui.verOProjeto, lang, 'ui.verOProjeto')}
            </Link>
          </div>
        </div>

        <div className={`col-print${print && print.largura < 900 ? ' pequeno' : ''}`}>
          {print ? (
            <PrintFigura
              print={print}
              slug={projeto.slug}
              lang={lang}
              campo={`${campo}.print`}
              sizes="(max-width: 820px) 100vw, 620px"
              prioridade={prioridade}
              mostrarLegenda={false}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
