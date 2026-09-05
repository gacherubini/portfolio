import type { CSSProperties } from 'react'
import type { Tema } from '@/content/tipos'

/**
 * A paleta vive no dado, não no CSS. Cada faixa e cada página de projeto
 * recebe o tema como custom properties inline, e uma folha só serve as quatro.
 * Cor de projeto novo = oito hex num arquivo.
 */
export function estiloDoTema(tema: Tema): CSSProperties {
  const estilo: Record<string, string> = {
    '--fundo': tema.fundo,
    '--texto': tema.texto,
    '--borda': tema.borda,
    '--destaque': tema.destaque,
    '--ctaFundo': tema.ctaFundo,
    '--ctaTexto': tema.ctaTexto,
    '--calmo': tema.calmo,
    '--fundo2': tema.fundo2,
  }
  if (tema.fundo3) estilo['--fundo3'] = tema.fundo3
  return estilo as CSSProperties
}
