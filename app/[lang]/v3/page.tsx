/**
 * COMPARADOR DESCARTÁVEL — não é página do site.
 *
 * Existe para uma decisão só: qual direção de identidade visual vai para o
 * código. Mesma tipografia, mesmo CSS e mesmo conteúdo dos componentes reais,
 * para que o que se compara seja o desenho e não o andaime.
 *
 * Apagar `app/[lang]/v3/` inteiro depois da decisão.
 */
import './v3.css'
import { IBM_Plex_Mono } from 'next/font/google'
import { Icone, type NomeDeIcone } from './icones'
import { FITA_VIEWBOX, LAMINAS, serie } from '@/lib/fita'
import { sobre } from '@/content/sobre'
import { experiencia } from '@/content/experiencia'
import { ui } from '@/content/ui'
import { t } from '@/lib/idioma'

export const metadata = { title: 'v3 — comparador de identidade' }

/**
 * Só o painel E usa, e só DENTRO da janela de terminal. Fora dela a página
 * continua em Archivo: numa janela de terminal a monoespaçada é requisito —
 * é o que alinha o prompt, o cursor e os `//` —, mas em quatro parágrafos de
 * prosa corrida ela vira parede. Foi o que a versão toda-mono mostrou.
 */
const plex = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--fonte-plex',
})

/* --- a fita, com as lâminas pintáveis ------------------------------------ */

type Lamina = { classe: string; d: string; cor: string; opacidade: number; espessura: number }

/** A ordem do DOM é a ordem de pintura: a última entrada é a lâmina da frente. */
function Fita({ laminas, ancora }: { laminas: Lamina[]; ancora: 'fundo' | 'cheia' }) {
  return (
    <div className={`v3-fita v3-fita--${ancora}`} aria-hidden="true">
      {laminas.map((l) => (
        <div className={`pista ${l.classe}`} key={l.classe}>
          <svg viewBox={FITA_VIEWBOX} preserveAspectRatio="none" fill="none">
            <path
              d={l.d}
              stroke={l.cor}
              strokeOpacity={l.opacidade}
              strokeWidth={l.espessura}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

/**
 * As séries de hoje têm `passo` entre 24 e 60, e numa abertura de 380px de
 * altura elas leem como onda decorativa, não como dado de mercado. Estas são
 * as mesmas séries com o passo curto e o ruído alto: mais detalhe por tela,
 * que é o que faz a linha parecer preço e não enfeite.
 *
 * `CICLO` e `VOLTAS` continuam os de `lib/fita.ts` — é deles que depende o
 * laço fechar sem emenda contra o `translateX(-100%)` da animação.
 */
const DENSAS = [
  serie({ semente: 62831, passo: 26, inercia: 0.8, ruido: 8, salto: 12, puxao: 0.04 }),
  serie({ semente: 51413, passo: 16, inercia: 0.68, ruido: 11, salto: 17, puxao: 0.052 }),
  serie({ semente: 90210, passo: 20, inercia: 0.72, ruido: 10, salto: 15, puxao: 0.046 }),
  serie({ semente: 31337, passo: 12, inercia: 0.6, ruido: 13, salto: 21, puxao: 0.062 }),
  serie({ semente: 7717, passo: 14, inercia: 0.64, ruido: 12, salto: 19, puxao: 0.058 }),
]

/** `l5` é a do fundo e `l1` a da frente — a ordem de pintura é a do array. */
const CLASSES = ['l5', 'l4', 'l3', 'l2', 'l1']

const MINT = '#7FBFA3'
const ROXO = '#5A21B4'
const LARANJA_PROJETO = '#CB6D31'
const AMBAR = '#F3B843'
const AZUL = '#2A4FD7'
const LARANJA = '#FF5A00'

/**
 * A — quatro lâminas, uma por sistema. O âmbar leva a opacidade mais alta
 * porque é a única das quatro que quase some sobre a casca clara.
 */
const QUATRO: Lamina[] = [
  { classe: 'l4', d: DENSAS[1], cor: AMBAR, opacidade: 0.78, espessura: 1.1 },
  { classe: 'l3', d: DENSAS[2], cor: MINT, opacidade: 0.62, espessura: 1.2 },
  { classe: 'l2', d: DENSAS[3], cor: LARANJA_PROJETO, opacidade: 0.5, espessura: 1.3 },
  { classe: 'l1', d: DENSAS[4], cor: ROXO, opacidade: 0.46, espessura: 1.4 },
]

/** B — as cinco em azul, em força cheia. */
const AZUL_CHEIO: Lamina[] = CLASSES.map((classe, i) => ({
  classe,
  d: DENSAS[i],
  cor: AZUL,
  opacidade: [0.2, 0.28, 0.36, 0.46, 0.6][i],
  espessura: [1, 1, 1.1, 1.2, 1.4][i],
}))

/**
 * D — a B com o laranja do manual no lugar do azul.
 *
 * As opacidades são MAIS ALTAS que as da B, e é contraintuitivo: `#FF5A00` é
 * o mais saturado dos dois, mas saturação não é o que decide aqui — é
 * luminância. O laranja é claro (L ≈ 0,27) e o azul é escuro (L ≈ 0,10), então
 * sobre a casca `#FAFAF7` o azul contrasta quase o dobro. Nos mesmos valores
 * da B a fita laranja quase sumia.
 */
const LARANJA_CHEIO: Lamina[] = CLASSES.map((classe, i) => ({
  classe,
  d: DENSAS[i],
  cor: LARANJA,
  opacidade: [0.24, 0.32, 0.42, 0.54, 0.7][i],
  espessura: [1, 1, 1.1, 1.2, 1.4][i],
}))

/** E — a mesma fita da D. A janela preta passa por cima, e ela corre atrás. */
const LARANJA_E: Lamina[] = LARANJA_CHEIO

/** C — exatamente o que está no ar hoje. */
const HOJE: Lamina[] = LAMINAS.map((l) => ({
  classe: l.classe,
  d: l.d,
  cor: AZUL,
  opacidade: l.opacidade,
  espessura: l.espessura,
}))

/* --- as duas marcas ------------------------------------------------------ */
/**
 * PROVISÓRIAS. As imagens que chegaram eram de 400×300 e 200×200, e não
 * sobrevivem a uma tela retina nem a 20px. Isto aqui é tipografia no lugar
 * do arquivo, só para decidir tamanho, peso e posição na coluna.
 */
const MARCAS: Record<string, string> = { ambush: 'ambush', pucrs: 'PUCRS' }

/* --- um painel ----------------------------------------------------------- */

type Painel = {
  id: 'a' | 'b' | 'c' | 'd' | 'e'
  titulo: string
  nota: string
  laminas: Lamina[]
  ancora: 'fundo' | 'cheia'
  /** A abertura vira janela de terminal. */
  terminal?: boolean
  /** Os ícones do manual entram — na pilha, na ficha, nos blocos e nos perfis. */
  icones?: boolean
}

const PAINEIS: Painel[] = [
  {
    id: 'e',
    titulo: 'E — O terminal na fita',
    nota:
      'A identidade da D com o terminal de volta e os ícones do manual. A fita continua correndo, em cinco lâminas, e a janela se assenta nela em vez de flutuar no vazio. Plex Mono só dentro do terminal; a prosa fica em Archivo.',
    laminas: LARANJA_E,
    ancora: 'cheia',
    terminal: true,
    icones: true,
  },
  {
    id: 'b',
    titulo: 'B — A fita, em azul',
    nota:
      'Abertura com a fita em força cheia no #2A4FD7 e o azul da casa promovido a cor da casca: fio de seção, marcador, foco. Com os mesmos ícones da E, no azul — que a 6,28:1 contra a casca não precisa do segundo tom que o laranja exigiu.',
    laminas: AZUL_CHEIO,
    ancora: 'cheia',
    icones: true,
  },
  {
    id: 'd',
    titulo: 'D — A fita, em laranja',
    nota:
      'A B inteira, trocando o #2A4FD7 pelo #FF5A00 do manual de marca. Mesma Archivo, mesmo layout, mesma abertura: mudam a fita, o .dev da marca, o fio de seção, o marcador da experiência e a régua da ficha.',
    laminas: LARANJA_CHEIO,
    ancora: 'cheia',
  },
  {
    id: 'a',
    titulo: 'A — Os quatro',
    nota:
      'A fita em quatro linhas, uma por sistema, nas cores que hoje só aparecem por 1,05s no loader. Cada seção herda uma das quatro cores no fio.',
    laminas: QUATRO,
    ancora: 'cheia',
  },
  {
    id: 'c',
    titulo: 'C — Só arrumar',
    nota:
      'A direção visual de hoje, intacta. Muda só o que está quebrado: 29 tamanhos de fonte viram 7, números ficam tabulares, o corpo sobe de 15px para 16px e sobra menos fio de 1px.',
    laminas: HOJE,
    ancora: 'fundo',
  },
]

/** As linhas de dentro do terminal saem da ficha real do Sobre. */
const LINHAS_TERMINAL = [
  'Backend developer',
  'Java | Spring Boot | Go | PostgreSQL',
  'Backend da Binance, na Ambush · Austin, TX',
  'agent loops | skills | function calling',
]

/**
 * A pilha embaixo da janela. SEM CAIXA: uma fileira de ícones em molduras
 * iguais é o kit de cartões que aparece em todo portfólio gerado. Aqui o
 * ícone e o rótulo ficam soltos na casca, no mesmo peso ótico do texto, e
 * quem separa é o espaço.
 *
 * Cada um nomeia algo que está escrito na experiência — nenhum entrou por
 * ser bonito.
 */
const PILHA: { icone: NomeDeIcone; rotulo: string }[] = [
  { icone: 'servidor', rotulo: 'Microsserviços' },
  { icone: 'banco', rotulo: 'PostgreSQL · Redis' },
  { icone: 'chaves', rotulo: 'REST e gRPC' },
  { icone: 'docker', rotulo: 'Docker' },
  { icone: 'nuvem', rotulo: 'Deploy e painéis' },
]

/** Um ícone por bloco da Ambush, na ordem em que os blocos aparecem. */
const ICONE_DO_BLOCO: NomeDeIcone[] = ['banco', 'chaves', 'nuvem', 'git']

/** Um por linha da ficha do Sobre. */
const ICONE_DA_FICHA: NomeDeIcone[] = ['pino', 'servidor', 'chaves']

const PERFIS: { icone: NomeDeIcone; rotulo: string; href: string }[] = [
  { icone: 'github', rotulo: 'GitHub', href: 'https://github.com/gacherubini' },
  { icone: 'linkedin', rotulo: 'LinkedIn', href: 'https://www.linkedin.com/in/gabrielabreuu' },
  { icone: 'email', rotulo: 'E-mail', href: 'mailto:bielche2009@hotmail.com' },
]

function PilhaIcones() {
  return (
    <p className="v3-pilha-icones">
      {PILHA.map((x) => (
        <span key={x.rotulo}><Icone nome={x.icone} /> {x.rotulo}</span>
      ))}
    </p>
  )
}

function AberturaTerminal() {
  return (
      <div className={`v3-term ${plex.variable}`}>
        <div className="v3-term-barra">
          <span className="v3-term-luzes" aria-hidden="true"><i /><i /><i /></span>
          <span className="v3-term-caminho">gabriel@dev:~</span>
        </div>
        <div className="v3-term-corpo">
          <p className="v3-term-marca" aria-hidden="true">&gt;_</p>
          <h1>{t(ui.abertura.titulo, 'pt', 'ui.abertura.titulo')}</h1>
          <ul className="v3-term-linhas">
            {LINHAS_TERMINAL.map((linha) => (
              <li key={linha}><span aria-hidden="true">//</span> {linha}</li>
            ))}
          </ul>
          <p className="v3-term-cursor">gabriel@dev:~$ <i aria-hidden="true" /></p>
        </div>
      </div>
  )
}

function Tela({ painel }: { painel: Painel }) {
  const [lede, ...resto] = sobre.paragrafos
  const term = painel.terminal === true
  const ic = painel.icones === true

  return (
    <article className={`v3-painel v3-${painel.id}`}>
      <header className="v3-rotulo">
        <h2>{painel.titulo}</h2>
        <p>{painel.nota}</p>
      </header>

      <div className="v3-tela">
        <div className="v3-topo">
          <span className="marca marca--casca">
            gacherubini<span className="marca-dev">.dev</span>
          </span>
          <nav>
            <a href="#" aria-current="page">Sobre</a>
            <a href="#">Experiência</a>
            <a href="#">Projetos</a>
            <a href="#">Contato</a>
          </nav>
          <p className="idioma"><span aria-current="true">PT</span> / <a href="#">EN</a></p>
        </div>

        <div className="v3-hero">
          <Fita laminas={painel.laminas} ancora={painel.ancora} />
          <div className="v3-hero-texto">
            {term ? (
              <AberturaTerminal />
            ) : (
              <>
                <h1>{t(ui.abertura.titulo, 'pt', 'ui.abertura.titulo')}</h1>
                <p>{t(ui.abertura.apoio, 'pt', 'ui.abertura.apoio')}</p>
              </>
            )}
            {ic ? <PilhaIcones /> : null}
          </div>
        </div>

        <section className="v3-secao v3-secao--sobre">
          <h3 className="v3-titulo-secao"><span>Sobre</span></h3>
          <div className="v3-sobre">
            <div>
              <p className="v3-lede">{t(lede, 'pt', 'sobre.paragrafos.0')}</p>
              <p className="v3-corpo">{t(resto[0], 'pt', 'sobre.paragrafos.1')}</p>
            </div>
            <aside className="v3-rail">
              <dl>
                {sobre.ficha.slice(0, 3).map((linha, i) => (
                  <div key={i}>
                    <dt>
                      {ic ? <Icone nome={ICONE_DA_FICHA[i]} tamanho={15} /> : null}
                      {t(linha.rotulo, 'pt', `sobre.ficha.${i}.rotulo`)}
                    </dt>
                    <dd>{t(linha.valor, 'pt', `sobre.ficha.${i}.valor`)}</dd>
                  </div>
                ))}
              </dl>
              {ic ? (
                <p className="v3-perfis">
                  {PERFIS.map((x) => (
                    <a key={x.rotulo} href={x.href}>
                      <Icone nome={x.icone} tamanho={17} /> {x.rotulo}
                    </a>
                  ))}
                </p>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="v3-secao v3-secao--exp">
          <h3 className="v3-titulo-secao"><span>Experiência</span></h3>
          {experiencia.map((cargo) => {
            const campo = `experiencia.${cargo.id}`
            const marca = MARCAS[cargo.id]
            return (
              <div
                className={`v3-posto${cargo.tipo === 'formacao' ? ' v3-posto--formacao' : ''}`}
                key={cargo.id}
              >
                <div className="v3-coluna-marca">
                  {marca ? <span className={`v3-logo v3-logo--${cargo.id}`}>{marca}</span> : null}
                  <p className="v3-quando">{t(cargo.periodo, 'pt', `${campo}.periodo`)}</p>
                </div>
                <div>
                  <h4>{cargo.empresa}</h4>
                  <p className="v3-papel">{t(cargo.cargo, 'pt', `${campo}.cargo`)}</p>
                  <p className="v3-onde">{t(cargo.local, 'pt', `${campo}.local`)}</p>

                  {cargo.blocos.length > 0 ? (
                    <dl className="v3-blocos">
                      {cargo.blocos.slice(0, 2).map((b, i) => (
                        <div key={i}>
                          <dt>
                            {ic ? <Icone nome={ICONE_DO_BLOCO[i]} tamanho={16} /> : null}
                            {t(b.titulo, 'pt', `${campo}.blocos.${i}.titulo`)}
                          </dt>
                          <dd>{t(b.texto, 'pt', `${campo}.blocos.${i}.texto`)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {cargo.pilha ? (
                    <p className="v3-pilha">
                      {cargo.pilha.map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                    </p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </article>
  )
}

export default function Comparador() {
  return (
    <main className="v3-folha">
      <div className="v3-cabecalho">
        <h1>Quatro direções de identidade</h1>
        <p>
          Mesma fonte, mesmo CSS e mesmo texto: o que muda é só o desenho. As
          quatro trazem a escala tipográfica corrigida e as duas marcas na coluna
          da data. Os cartões de projeto não entram — eles ficam como estão hoje
          em qualquer uma das direções.
        </p>
      </div>
      {PAINEIS.map((p) => (
        <Tela key={p.id} painel={p} />
      ))}
    </main>
  )
}
