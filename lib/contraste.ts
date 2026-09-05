/**
 * Contraste WCAG 2.x. A direção Camaleão depende de paletas fortes, e paleta
 * forte erra contraste com facilidade — por isso isto roda no `npm run build`
 * antes do `next build`, e não como conferência manual.
 */

export const MIN_TEXTO = 4.5
export const MIN_DESTAQUE = 3

/**
 * Os níveis de opacidade que `app/globals.css` usa em texto. Duas regras da
 * folha, e `test/folha.test.ts` (Tarefa 8) guarda a primeira:
 *
 * 1. Nenhuma regra usa opacity fora desta lista. 0,72 é o piso porque 0,65
 *    sobre o roxo do BDDente dá 4,22:1.
 * 2. Opacity só cai sobre `--texto`. `--calmo` fica em opacidade cheia: ele já
 *    é a tinta esmaecida do sistema, e a 0,72 as quatro paletas reprovam.
 *    Por isso o sweep abaixo roda em `tema.texto` e não em `tema.calmo` —
 *    incluir `calmo` aqui derrubaria as quatro paletas aprovadas em vez de
 *    consertar o CSS, que é onde o erro mora.
 */
export const OPACIDADES_DE_TEXTO = [0.72, 0.85, 0.88, 0.9, 0.92]

/**
 * Os níveis usados dentro do fechamento azul. O piso ali é 0,85, não 0,72:
 * branco a 72% sobre `#2A4FD7` dá 4,21:1, e a 85% sobe para 5,23:1.
 */
export const OPACIDADES_NO_AZUL = [0.85, 0.88]

/** Os neutros da casca e o azul da marca. Não mudam entre projetos. */
export const CASCA = {
  fundo: '#FAFAF7',
  tinta: '#15171A',
  regua: '#E4E4DE',
  calmo: '#585D62',
  corpoSobre: '#2A2E32',
  marca: '#0F1317',
  dev: '#2A4FD7',
} as const

type Canais = [number, number, number]

function canais(hex: string): Canais {
  const limpo = hex.trim().replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(limpo)) {
    throw new Error(`cor precisa ser #RRGGBB, veio "${hex}"`)
  }
  return [
    parseInt(limpo.slice(0, 2), 16),
    parseInt(limpo.slice(2, 4), 16),
    parseInt(limpo.slice(4, 6), 16),
  ]
}

function paraLinear(canal: number): number {
  const c = canal / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminancia(hex: string): number {
  const [r, g, b] = canais(hex)
  return 0.2126 * paraLinear(r) + 0.7152 * paraLinear(g) + 0.0722 * paraLinear(b)
}

export function razaoDeContraste(a: string, b: string): number {
  const la = luminancia(a)
  const lb = luminancia(b)
  const claro = Math.max(la, lb)
  const escuro = Math.min(la, lb)
  return (claro + 0.05) / (escuro + 0.05)
}

/** Hex resultante de `frente` desenhada com opacidade `alfa` sobre `fundo`. */
export function misturar(frente: string, fundo: string, alfa: number): string {
  const f = canais(frente)
  const t = canais(fundo)
  const oito = (n: number) =>
    Math.round(n).toString(16).padStart(2, '0').toUpperCase()
  return '#' + f.map((c, i) => oito(c * alfa + t[i] * (1 - alfa))).join('')
}

type TemaVerificavel = {
  fundo: string
  texto: string
  borda: string
  destaque: string
  ctaFundo: string
  ctaTexto: string
  calmo: string
  fundo2: string
  fundo3?: string
}

/** Lista das falhas do tema. Vazia = passou. */
export function verificarTema(nome: string, tema: TemaVerificavel): string[] {
  const falhas: string[] = []

  const exigir = (par: string, frente: string, atras: string, minimo: number) => {
    const razao = razaoDeContraste(frente, atras)
    if (razao + 1e-9 < minimo) {
      falhas.push(
        `${nome}: ${par} (${frente} sobre ${atras}) dá ${razao.toFixed(2)}:1, ` +
          `mínimo ${minimo}:1`,
      )
    }
  }

  const superficies: [string, string][] = [
    ['fundo', tema.fundo],
    ['fundo2', tema.fundo2],
  ]
  if (tema.fundo3) superficies.push(['fundo3', tema.fundo3])

  for (const [rotulo, superficie] of superficies) {
    exigir(`texto/${rotulo}`, tema.texto, superficie, MIN_TEXTO)
    exigir(`calmo/${rotulo}`, tema.calmo, superficie, MIN_TEXTO)
    exigir(`destaque/${rotulo}`, tema.destaque, superficie, MIN_DESTAQUE)

    for (const alfa of OPACIDADES_DE_TEXTO) {
      exigir(
        `texto@${alfa}/${rotulo}`,
        misturar(tema.texto, superficie, alfa),
        superficie,
        MIN_TEXTO,
      )
    }
  }

  exigir('ctaTexto/ctaFundo', tema.ctaTexto, tema.ctaFundo, MIN_TEXTO)

  return falhas
}

/**
 * A casca e o fechamento azul não são tema de projeto e escapariam de
 * `verificarTema` — mas é lá que mora a única cor fixa do site, e é lá que o
 * branco esmaecido reprova mais fácil.
 */
export function verificarCasca(): string[] {
  const falhas: string[] = []

  const exigir = (par: string, frente: string, atras: string, minimo: number) => {
    const razao = razaoDeContraste(frente, atras)
    if (razao + 1e-9 < minimo) {
      falhas.push(`casca: ${par} dá ${razao.toFixed(2)}:1, mínimo ${minimo}:1`)
    }
  }

  exigir('tinta/fundo', CASCA.tinta, CASCA.fundo, MIN_TEXTO)
  exigir('calmo/fundo', CASCA.calmo, CASCA.fundo, MIN_TEXTO)
  exigir('corpoSobre/fundo', CASCA.corpoSobre, CASCA.fundo, MIN_TEXTO)
  exigir('marca/fundo', CASCA.marca, CASCA.fundo, MIN_TEXTO)
  exigir('dev/fundo', CASCA.dev, CASCA.fundo, MIN_TEXTO)
  exigir('branco/dev', '#FFFFFF', CASCA.dev, MIN_TEXTO)

  for (const alfa of OPACIDADES_NO_AZUL) {
    exigir(`branco@${alfa}/dev`, misturar('#FFFFFF', CASCA.dev, alfa), CASCA.dev, MIN_TEXTO)
  }

  return falhas
}
