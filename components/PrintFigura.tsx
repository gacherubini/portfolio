import Image from 'next/image'
import type { Idioma, Print } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Todo print do site passa por aqui. `next/image` existe no projeto por causa
 * destes arquivos: as capturas retina são 3200×2000, e resize, formato moderno
 * e lazy loading não podem ser trabalho manual.
 */
export function PrintFigura({
  print,
  slug,
  lang,
  campo,
  sizes,
  prioridade = false,
  className,
  mostrarLegenda = true,
}: {
  print: Print
  slug: string
  lang: Idioma
  campo: string
  sizes: string
  prioridade?: boolean
  className?: string
  mostrarLegenda?: boolean
}) {
  return (
    <figure className={className}>
      <Image
        src={`/prints/${slug}/${print.arquivo}`}
        alt={t(print.alt, lang, `${campo}.alt`)}
        width={print.largura}
        height={print.altura}
        sizes={sizes}
        priority={prioridade}
        // A primeira faixa precisa estar legível no primeiro quadro; o resto
        // pode chegar rolando.
        loading={prioridade ? undefined : 'lazy'}
      />
      {mostrarLegenda && print.legenda ? (
        <figcaption>{t(print.legenda, lang, `${campo}.legenda`)}</figcaption>
      ) : null}
    </figure>
  )
}
