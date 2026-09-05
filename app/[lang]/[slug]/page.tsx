import { notFound } from 'next/navigation'
import { ehIdioma } from '@/content/tipos'
import { projetos, projetoPorSlug } from '@/content/indice'
import { estiloDoTema } from '@/lib/tema'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoProjeto } from '@/components/CabecalhoProjeto'
import { AberturaProjeto } from '@/components/AberturaProjeto'

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
        {/* Destaque, régua, prosa, galeria e técnico entram nas Tarefas 12 a 15. */}
      </main>
      <footer className="wrap rodape-projeto">
        <span>{t(ui.rodape.lugar, lang, 'ui.rodape.lugar')}</span>
        <span>{t(ui.rodape.dominio, lang, 'ui.rodape.dominio')}</span>
      </footer>
    </div>
  )
}
