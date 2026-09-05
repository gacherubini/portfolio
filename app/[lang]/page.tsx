import { notFound } from 'next/navigation'
import { ehIdioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoCasca } from '@/components/CabecalhoCasca'
import { projetos } from '@/content/indice'
import { FaixaProjeto } from '@/components/FaixaProjeto'
import { Sobre } from '@/components/Sobre'
import { Fechamento } from '@/components/Fechamento'
import { curriculoDisponivel } from '@/lib/curriculo'

// Sem `generateStaticParams` aqui: quem gera o segmento `[lang]` é o layout
// raiz, e cada segmento é gerado uma vez só. Repetir a mesma chave nos dois
// níveis é ruído no melhor caso e conflito no pior.
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!ehIdioma(lang)) notFound()
  const temCurriculo = curriculoDisponivel()

  return (
    <>
      <CabecalhoCasca lang={lang} />
      <main>
        <div className="wrap abertura-home">
          <h1>{t(ui.abertura.titulo, lang, 'ui.abertura.titulo')}</h1>
          <p>{t(ui.abertura.apoio, lang, 'ui.abertura.apoio')}</p>
        </div>
        <div id="projetos">
          {projetos.map((projeto, i) => (
            <FaixaProjeto
              key={projeto.slug}
              projeto={projeto}
              lang={lang}
              // O lado do print alterna para o olho não cansar.
              espelho={i % 2 === 1}
              // Nada essencial só depois de rolar: a primeira faixa carrega no primeiro quadro.
              prioridade={i === 0}
            />
          ))}
        </div>
      </main>
      <Sobre lang={lang} />
      <Fechamento lang={lang} temCurriculo={temCurriculo} />
    </>
  )
}
