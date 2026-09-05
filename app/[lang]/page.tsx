import { notFound } from 'next/navigation'
import { ehIdioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoCasca } from '@/components/CabecalhoCasca'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!ehIdioma(lang)) notFound()

  return (
    <>
      <CabecalhoCasca lang={lang} />
      <main>
        <div className="wrap abertura-home">
          <h1>{t(ui.abertura.titulo, lang, 'ui.abertura.titulo')}</h1>
          <p>{t(ui.abertura.apoio, lang, 'ui.abertura.apoio')}</p>
        </div>
      </main>
    </>
  )
}
