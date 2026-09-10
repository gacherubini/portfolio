import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ehIdioma, type Texto } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { CabecalhoCasca } from '@/components/CabecalhoCasca'
import { Icone, type NomeDeIcone } from '@/components/Icone'
import { projetos } from '@/content/indice'
import { FaixaProjeto } from '@/components/FaixaProjeto'
import { Sobre } from '@/components/Sobre'
import { Experiencia } from '@/components/Experiencia'
import { Fechamento } from '@/components/Fechamento'
import { Brilho, Fita } from '@/components/Fita'
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

/**
 * A pilha embaixo do parágrafo de apoio. Sem moldura, sem cartão: só ícone,
 * rótulo e ar — uma fileira de ícones em caixas iguais é o kit de cartões
 * que aparece em todo portfólio gerado. Cada um nomeia algo que está escrito
 * na experiência; nenhum entrou por ser bonito. Rótulos em PT e EN.
 */
const PILHA: { icone: NomeDeIcone; rotulo: Texto }[] = [
  { icone: 'servidor', rotulo: { pt: 'Microsserviços', en: 'Microservices' } },
  { icone: 'banco', rotulo: { pt: 'PostgreSQL · Redis', en: 'PostgreSQL · Redis' } },
  { icone: 'chaves', rotulo: { pt: 'REST e gRPC', en: 'REST and gRPC' } },
  { icone: 'docker', rotulo: { pt: 'Docker', en: 'Docker' } },
  { icone: 'nuvem', rotulo: { pt: 'Deploy e painéis', en: 'Deploy and dashboards' } },
]
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!ehIdioma(lang)) notFound()
  const temCurriculo = curriculoDisponivel()

  return (
    <>
      {/* O brilho é fixo na janela e vale para a página inteira — mora no
          nível da página, fora da fita, para não herdar a máscara dela. */}
      <Brilho />
      <CabecalhoCasca lang={lang} />
      <main>
        {/* A abertura é full-bleed e a fita preenche ela em `inset: 0`: dentro
            da coluna `.wrap` a fita cliparia e as margens esvaziariam, que é
            onde a folha diz que ela mora. */}
        <section className="abertura">
          <Fita />
          <div className="wrap abertura-home">
            <h1>{t(ui.abertura.titulo, lang, 'ui.abertura.titulo')}</h1>
            <p>{t(ui.abertura.apoio, lang, 'ui.abertura.apoio')}</p>
            <p className="pilha-icones">
              {PILHA.map((x, i) => (
                <span key={x.icone}>
                  <Icone nome={x.icone} /> {t(x.rotulo, lang, `pilha.${i}.rotulo`)}
                </span>
              ))}
            </p>
          </div>
        </section>

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
