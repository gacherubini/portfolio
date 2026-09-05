import { notFound } from 'next/navigation'
import { ehIdioma } from '@/content/tipos'
import { projetos, projetoPorSlug } from '@/content/indice'
import { estiloDoTema } from '@/lib/tema'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoProjeto } from '@/components/CabecalhoProjeto'
import { AberturaProjeto } from '@/components/AberturaProjeto'
import { PrintFigura } from '@/components/PrintFigura'
import { Destaque } from '@/components/Destaque'
import { ReguaNumeros } from '@/components/ReguaNumeros'
import { Prosa } from '@/components/Prosa'

// Só o segmento desta rota: o layout raiz já gera `[lang]`, e o Next chama
// esta função uma vez por `lang` que ele gerou. Devolver `{ lang, slug }`
// daqui repetiria uma chave que o pai já resolveu.
export function generateStaticParams() {
  return projetos.map((p) => ({ slug: p.slug }))
}

export default async function PaginaProjeto({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!ehIdioma(lang)) notFound()

  const projeto = projetoPorSlug(slug)
  if (!projeto) notFound()

  return (
    // A página inteira veste a paleta do sistema — spec §8.
    <div className="pagina-projeto" style={estiloDoTema(projeto.tema)}>
      <CabecalhoProjeto lang={lang} slug={projeto.slug} />
      <main>
        <AberturaProjeto projeto={projeto} lang={lang} />
        {projeto.printAbertura ? (
          <section className="wrap abre">
            <PrintFigura
              print={projeto.printAbertura}
              slug={projeto.slug}
              lang={lang}
              campo={`${projeto.slug}.printAbertura`}
              sizes="(max-width: 900px) 100vw, 1116px"
              prioridade
            />
          </section>
        ) : null}
        <Destaque projeto={projeto} lang={lang} />
        <ReguaNumeros projeto={projeto} lang={lang} />
        <Prosa projeto={projeto} lang={lang} />
        {/* Galeria e técnico entram nas Tarefas 14 e 15. */}
      </main>
      <footer className="wrap rodape-projeto">
        <span>{t(ui.rodape.lugar, lang, 'ui.rodape.lugar')}</span>
        <span>{t(ui.rodape.dominio, lang, 'ui.rodape.dominio')}</span>
      </footer>
    </div>
  )
}
