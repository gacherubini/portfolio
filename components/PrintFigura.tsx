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
 *
 * ## A vitrine não abre
 *
 * `nua` é a única variante que NÃO vira link. Na home o print é cartaz: quem
 * quiser ver de perto entra no projeto, onde a prancha existe com legenda e
 * com as outras telas em volta. Abrir ali levava a pessoa para um PNG cru
 * fora do site, sem volta e sem contexto — e competia com "Ver o projeto",
 * que é o caminho que a página quer que ela tome.
 *
 * Nasce com `prancha--fixa`, que é o mesmo estado que `Movimento.tsx` dá a
 * uma prancha sem resolução a revelar: o clique volta sem abrir e o cursor
 * não convida. E sem `data-largura`, `avaliar()` para na primeira linha e
 * nunca devolve o `href`.
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
  const Alvo = variante === 'nua' ? 'div' : 'a'
  const caminho = `/prints/${slug}/${print.arquivo}`
  const temNota = variante !== 'nua' && Boolean(print.legenda)
  const abre = variante !== 'nua'

  return (
    // `<figure>` + `<figcaption>` é a única construção nativa que liga a
    // legenda à imagem para a tecnologia assistiva; dois `<div>` irmãos não
    // ligam nada. O `figcaption` é o PRIMEIRO filho, que é legal e é a ordem
    // que a variante `margem` precisa no DOM — na `abaixo` quem o joga para
    // baixo é o `column-reverse` da folha, não a ordem.
    <figure
      className={`prancha prancha--${variante}${abre ? '' : ' prancha--fixa'}${className ? ` ${className}` : ''}`}
    >
      {temNota ? (
        <figcaption className="prancha-nota">
          <p>{t(print.legenda!, lang, `${campo}.legenda`)}</p>
        </figcaption>
      ) : null}

      {/* `<div>` e não `<a>` quando não abre: link sem destino é anunciado
          como link pelo leitor de tela e entra na ordem de tabulação para
          não fazer nada. */}
      <Alvo
        className="prancha-alvo"
        {...(abre ? { href: caminho, 'data-largura': print.largura } : {})}
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
      </Alvo>
    </figure>
  )
}
