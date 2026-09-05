import { verificarTema } from '@/lib/contraste'

export const IDIOMAS = ['pt', 'en'] as const
export type Idioma = (typeof IDIOMAS)[number]

export function ehIdioma(v: string): v is Idioma {
  return (IDIOMAS as readonly string[]).includes(v)
}

/**
 * Todo texto do site nasce nos dois idiomas lado a lado. `en` pode ficar em
 * branco: `t()` cai no `pt` e a build avisa. Traduzir é preencher o campo
 * vizinho, não manter dois arquivos em sincronia.
 */
export type Texto = { pt: string; en?: string }

/**
 * A paleta do sistema. Oito hex por projeto — nove no Autotune, que declara
 * `fundo3` —, e é a única coisa que muda entre uma faixa e outra: a folha de
 * estilo é a mesma para as quatro.
 *
 * `fundo2` é a superfície do bloco de destaque — mais escura nas páginas
 * escuras, branca na única página clara. `fundo3` só existe no Autotune, para
 * as placas onde o menta dos prints não pode encostar no âmbar da página.
 */
export type Tema = {
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

export type Print = {
  /** relativo a `/public/prints/<slug>/` */
  arquivo: string
  /** obrigatório e bilíngue: descreve o que a tela mostra, não "print do sistema" */
  alt: Texto
  legenda?: Texto
  largura: number
  altura: number
  /** P4: o nome do motor no alto da placa ("TD-PSOLA") */
  etiqueta?: Texto
  /** P4: o número que acompanha a etiqueta ("61,72 ms") */
  valor?: string
  /**
   * Marca o print que abre a faixa da home. Sem marca nenhuma, a faixa usa o
   * primeiro do destaque. O Autotune precisa da marca: o comp da home mostra
   * o motor de ponteiro móvel, que é o segundo print do destaque.
   */
  naFaixa?: boolean
}

/** P3 tem duas fileiras com títulos diferentes; P1 e P2 têm uma; P4 tem zero. */
export type FileiraGaleria = { titulo: Texto; prints: Print[] }

export type Situacao = 'no-ar' | 'fechado' | 'publicado' | 'em-construcao'

export type Nota = { titulo: Texto; texto: Texto[] }

export type Projeto = {
  slug: string
  nome: string
  paraQuem: Texto
  situacao: Situacao

  /** Lista livre, 2 a 5 linhas. Cada sistema declara os rótulos que servem a ele. */
  ficha: { rotulo: Texto; valor: Texto }[]

  tema: Tema

  resumoHome: Texto
  chamada: Texto
  problema: Texto[]
  oQueFaz: Texto[]

  /** P3: um print de página inteira antes do destaque, quando o destaque não tem imagem. */
  printAbertura?: Print

  destaque?: {
    titulo: Texto
    texto: Texto[]
    /** 0, 1 ou 2. Zero é o slot do print que ainda não existe. */
    prints: Print[]
    /** P3: os 17 tools de leitura, em monoespaçada porque são nomes de função. */
    lista?: { rotulo: Texto; itens: string[] }
    /** P3: as três garantias abaixo da lista. */
    amarras?: Nota[]
    /** P4: a frase que fecha o bloco, centralizada. */
    fecho?: Texto
  }

  /** 3 ou 4. Zero significa "ainda não confirmado" e some da tela. */
  numeros: { valor: string; rotulo: Texto }[]
  galeria: FileiraGaleria[]
  links: { rotulo: Texto; href: string; primario?: boolean }[]

  /**
   * Obrigatório quando `links` está vazio: o lugar do botão diz por que não há
   * botão, em vez de virar link morto. `curto` é a linha da faixa da home;
   * `titulo` e `texto` são o cartão da página do projeto.
   */
  semLink?: { curto: Texto; titulo: Texto; texto: Texto }

  tecnico: {
    stack: string[]
    /** P4: a saída de CLI, como texto e não como print. */
    terminal?: { comando: string; saida: string; legenda: Texto }
    notas: Nota[]
  }
}

function entre(n: number, min: number, max: number): boolean {
  return n >= min && n <= max
}

/**
 * Cardinalidade e contraste. Roda no teste e na build — não é validação de
 * runtime para dado de usuário, é conferência de conteúdo escrito à mão.
 */
export function validarProjeto(p: Projeto): string[] {
  const falhas: string[] = []
  const erro = (msg: string) => falhas.push(`${p.slug}: ${msg}`)

  if (!entre(p.ficha.length, 2, 5)) {
    erro(`ficha tem ${p.ficha.length} linhas; o contrato pede de 2 a 5`)
  }

  if (p.numeros.length !== 0 && !entre(p.numeros.length, 3, 4)) {
    erro(`numeros tem ${p.numeros.length}; o contrato pede 0, 3 ou 4`)
  }

  if (p.destaque && !entre(p.destaque.prints.length, 0, 2)) {
    erro(`destaque tem ${p.destaque.prints.length} prints; o contrato pede de 0 a 2`)
  }

  if (!entre(p.tecnico.notas.length, 2, 4)) {
    erro(`tecnico.notas tem ${p.tecnico.notas.length}; o contrato pede de 2 a 4`)
  }

  const prints: Print[] = [
    ...(p.printAbertura ? [p.printAbertura] : []),
    ...(p.destaque?.prints ?? []),
    ...p.galeria.flatMap((fileira) => fileira.prints),
  ]
  for (const print of prints) {
    if (!print.alt.pt.trim()) erro(`print ${print.arquivo} está sem alt em pt`)
    if (print.largura <= 0 || print.altura <= 0) {
      erro(`print ${print.arquivo} está sem largura/altura reais`)
    }
  }

  for (const link of p.links) {
    if (!link.href.trim()) erro(`link "${link.rotulo.pt}" está sem href`)
  }

  if (p.links.length === 0 && !p.semLink) {
    erro('sem links e sem semLink: o lugar do botão precisa dizer por que não há botão')
  }

  falhas.push(...verificarTema(p.slug, p.tema))

  return falhas
}
