/**
 * As larguras em que cada print é assado no build.
 *
 * Este arquivo é a fonte única: quem gera os arquivos
 * (`scripts/otimizar-prints.mjs`) e quem os pede no HTML
 * (`components/PrintFigura.tsx`) leem a MESMA lista. Se as duas listas
 * pudessem divergir, o site pediria variante que não existe e o navegador
 * comeria 404 sem avisar ninguém.
 *
 * O teto é 2640 porque a maior prancha do site tem 1320px de CSS
 * (`FaixaProjeto.tsx`, `Galeria.tsx`) e 2× cobre tela retina. O default do
 * Next ia até 3840, que é 2,1× mais pixel do que qualquer tela aqui mostra —
 * e era justamente essa variante que estourava a memória da máquina.
 */
export const LARGURAS_PRANCHA = [640, 960, 1320, 1920, 2640] as const

export const TETO_PRANCHA = 2640

export type FormatoPrint = 'avif' | 'webp'

/**
 * As larguras que existem em disco para um print de `larguraOriginal`.
 *
 * Nunca aumenta a imagem: um print de 639px sai em 639px e só. Ampliar não
 * acrescenta detalhe nenhum, só peso.
 */
export function largurasDe(larguraOriginal: number): number[] {
  const teto = Math.min(larguraOriginal, TETO_PRANCHA)
  return [...LARGURAS_PRANCHA.filter((l) => l < teto), teto]
}

/** `/prints-otimizados/revy/02-agente-whatsapp-1320.avif` */
export function caminhoOtimizado(
  slug: string,
  arquivo: string,
  largura: number,
  formato: FormatoPrint,
): string {
  const base = arquivo.replace(/\.[^.]+$/, '')
  return `/prints-otimizados/${slug}/${base}-${largura}.${formato}`
}

/** O `srcset` inteiro de um formato, pronto para o atributo. */
export function srcsetDe(
  slug: string,
  arquivo: string,
  larguraOriginal: number,
  formato: FormatoPrint,
): string {
  return largurasDe(larguraOriginal)
    .map((l) => `${caminhoOtimizado(slug, arquivo, l, formato)} ${l}w`)
    .join(', ')
}
