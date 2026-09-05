import type { CSSProperties } from 'react'
import type { Idioma, Print } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { srcsetDe } from '@/lib/prints'

/**
 * Todo print do site passa por aqui, e todo print do site é uma prancha.
 *
 * Uma prancha é: a imagem em tamanho de leitura, a legenda em corpo de leitura,
 * e — quando o arquivo tem resolução a revelar — um clique que a abre maior. A
 * decisão de abrir é do cliente (`components/Movimento.tsx`), porque depende da
 * largura em que a prancha está sendo exibida, que muda com o breakpoint.
 *
 * O que o servidor entrega é o dado que essa decisão precisa: `data-largura`,
 * a largura do ARQUIVO. Não usar `img.naturalWidth` no cliente — ele é a
 * largura da variante servida, não a do original.
 *
 * ## Por que `<picture>` e não `next/image`
 *
 * O `next/image` encoda a variante no primeiro pedido, dentro do servidor. Num
 * contêiner de 256MB que dorme quando ninguém está no site, isso é o pior dos
 * mundos: o sharp estourava a memória e derrubava a VM, e o cache dele vive em
 * `.next/cache/images`, que é efêmero — sumia a cada soneca e tudo era
 * reprocessado do zero.
 *
 * Os prints são estáticos e conhecidos no build, então são assados lá
 * (`scripts/otimizar-prints.mjs`) e aqui só se pede o arquivo. O runtime não
 * encoda nada.
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
    // `<figure>` + `<figcaption>` é a única construção nativa que liga a
    // legenda à imagem para a tecnologia assistiva; dois `<div>` irmãos não
    // ligam nada. O `figcaption` é o PRIMEIRO filho, que é legal e é a ordem
    // que a variante `margem` precisa no DOM — na `abaixo` quem o joga para
    // baixo é o `column-reverse` da folha, não a ordem.
    <figure className={`prancha prancha--${variante}${className ? ` ${className}` : ''}`}>
      {temNota ? (
        <figcaption className="prancha-nota">
          <p>{t(print.legenda!, lang, `${campo}.legenda`)}</p>
        </figcaption>
      ) : null}

      <a
        className="prancha-alvo"
        href={caminho}
        data-largura={print.largura}
        style={{ '--nat': `${print.largura}px` } as CSSProperties}
      >
        <picture>
          <source
            type="image/avif"
            srcSet={srcsetDe(slug, print.arquivo, print.largura, 'avif')}
            sizes={sizes}
          />
          <source
            type="image/webp"
            srcSet={srcsetDe(slug, print.arquivo, print.largura, 'webp')}
            sizes={sizes}
          />
          {/*
            O `src` é o original. Nenhum navegador que entende `<picture>`
            chega aqui, mas se um dia o build de imagens falhar em silêncio, o
            site serve o PNG pesado em vez de servir buraco.
          */}
          <img
            src={caminho}
            alt={t(print.alt, lang, `${campo}.alt`)}
            width={print.largura}
            height={print.altura}
            loading={prioridade ? 'eager' : 'lazy'}
            decoding={prioridade ? 'sync' : 'async'}
            fetchPriority={prioridade ? 'high' : undefined}
          />
        </picture>
      </a>
    </figure>
  )
}
