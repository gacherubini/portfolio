import Link from 'next/link'
import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { Marca } from '@/components/Marca'
import { AlternadorIdioma } from '@/components/AlternadorIdioma'

/**
 * O topo da página do projeto já vem na cor do sistema. A marca sai do neutro
 * da casca e entra numa faixa colorida, então aqui ela é monocromática.
 */
export function CabecalhoProjeto({ lang, slug }: { lang: Idioma; slug: string }) {
  return (
    <header className="projeto-topo">
      <div className="wrap topo">
        <Link href={`/${lang}`} className="marca-link">
          <Marca variante="mono" />
        </Link>
        <Link className="voltar" href={`/${lang}`}>
          {t(ui.voltar, lang, 'ui.voltar')}
        </Link>
        <AlternadorIdioma lang={lang} caminho={`/${slug}`} />
      </div>
    </header>
  )
}
