import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ehIdioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoCasca } from '@/components/CabecalhoCasca'
import { projetos } from '@/content/indice'
import { FaixaProjeto } from '@/components/FaixaProjeto'
import { Sobre } from '@/components/Sobre'
import { Experiencia } from '@/components/Experiencia'
import { Fechamento } from '@/components/Fechamento'
import { Fita } from '@/components/Fita'
import { curriculoDisponivel } from '@/lib/curriculo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // `ehIdioma`, não `lang !== 'en'`: a segunda tratava qualquer lixo como
  // português e grudava canonical de `/pt` num corpo que é 404. Segmento
  // inválido não recebe metadata nenhuma — a página ali nem é esta.
  if (!ehIdioma(lang)) return {}
  const pt = lang === 'pt'

  return {
    title: pt
      ? 'Gabriel Cherubini — os sistemas que eu construí'
      : 'Gabriel Cherubini — the systems I built',
    description: pt
      ? 'Portfólio de Gabriel Cherubini: Revy, BDDente, Office Timesheet e Autotune, cada um com prints e explicação em português comum.'
      : 'Gabriel Cherubini’s portfolio: Revy, BDDente, Office Timesheet and Autotune, each with screenshots and a plain-language explanation.',
    alternates: {
      canonical: `/${pt ? 'pt' : 'en'}`,
      languages: { 'pt-BR': '/pt', en: '/en' },
    },
  }
}

// Sem `generateStaticParams` aqui: quem gera o segmento `[lang]` é o layout
// raiz, e cada segmento é gerado uma vez só. Repetir a mesma chave nos dois
// níveis é ruído no melhor caso e conflito no pior.
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!ehIdioma(lang)) notFound()
  const temCurriculo = curriculoDisponivel()

  return (
    <>
      {/* Decoração pura, atrás de tudo e ancorada no topo do documento. */}
      <Fita />
      <CabecalhoCasca lang={lang} />
      <main>
        <div className="wrap abertura-home">
          <h1>{t(ui.abertura.titulo, lang, 'ui.abertura.titulo')}</h1>
          <p>{t(ui.abertura.apoio, lang, 'ui.abertura.apoio')}</p>
        </div>

        {/* A ORDEM DA HOME MUDOU EM 09/09/2026: quem chega quer saber quem
            é a pessoa antes de olhar sistema. Sobre, experiência, e só
            então os quatro projetos. */}
        <Sobre lang={lang} />
        <Experiencia lang={lang} />

        <section className="secao wrap" id="projetos">
          <h2>{t(ui.projetosTitulo, lang, 'ui.projetosTitulo')}</h2>
          <p className="projetos-apoio">{t(ui.projetosApoio, lang, 'ui.projetosApoio')}</p>
          <div className="cartoes">
            {projetos.map((projeto, i) => (
              <FaixaProjeto
                key={projeto.slug}
                projeto={projeto}
                lang={lang}
                // O lado do print alterna para o olho não cansar.
                espelho={i % 2 === 1}
                // O primeiro cartão está na primeira tela em telas altas.
                prioridade={i === 0}
              />
            ))}
          </div>
        </section>
      </main>
      <Fechamento lang={lang} temCurriculo={temCurriculo} />
    </>
  )
}
