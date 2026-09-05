import type { CSSProperties } from 'react'
import Image from 'next/image'
import type { Idioma, Print } from '@/content/tipos'
import { t } from '@/lib/idioma'

/**
 * Todo print do site passa por aqui, e todo print do site é uma prancha.
 *
 * Uma prancha é: a imagem em tamanho de leitura, a legenda em corpo de leitura,
 * e — quando o arquivo tem resolução a revelar — um clique que a abre maior. A
 * decisão de abrir é do cliente (`components/Movimento.tsx`), porque depende da
 * largura em que a prancha está sendo exibida, que muda com o breakpoint.
 *
 * O que o servidor entrega é o dado que essa decisão precisa: `data-largura`,
 * a largura do ARQUIVO. Não usar `img.naturalWidth` no cliente — com
 * `next/image` ele é a largura da variante servida, não a do original.
 *
 * `variante`:
 *   `margem` — legenda na coluna ao lado (a galeria)
 *   `abaixo` — legenda embaixo (o print de abertura, as placas do Autotune)
 *   `nua`    — sem legenda (a faixa da home)
 */
export function PrintFigura({
  print,
  slug,
  lang,
  campo,
  sizes,
  prioridade = false,
  className,
  variante = 'abaixo',
}: {
  print: Print
  slug: string
  lang: Idioma
  campo: string
  sizes: string
  prioridade?: boolean
  className?: string
  variante?: 'margem' | 'abaixo' | 'nua'
}) {
  const caminho = `/prints/${slug}/${print.arquivo}`
  const temNota = variante !== 'nua' && Boolean(print.legenda)

  return (
    <div className={`prancha prancha--${variante}${className ? ` ${className}` : ''}`}>
      {temNota ? (
        <div className="prancha-nota">
          <p>{t(print.legenda!, lang, `${campo}.legenda`)}</p>
        </div>
      ) : null}

      <a
        className="prancha-alvo"
        href={caminho}
        data-largura={print.largura}
        style={{ '--nat': `${print.largura}px` } as CSSProperties}
      >
        <Image
          src={caminho}
          alt={t(print.alt, lang, `${campo}.alt`)}
          width={print.largura}
          height={print.altura}
          sizes={sizes}
          priority={prioridade}
          loading={prioridade ? undefined : 'lazy'}
        />
      </a>
    </div>
  )
}
