import Link from 'next/link'
import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { Marca } from '@/components/Marca'
import { AlternadorIdioma } from '@/components/AlternadorIdioma'

/** O topo claro da home. A página do projeto usa o seu próprio, tematizado. */
export function CabecalhoCasca({ lang }: { lang: Idioma }) {
  return (
    <header className="casca-topo">
      <div className="wrap topo">
        <Marca variante="casca" />
        <nav>
          {/* "Sobre" é âncora, não rota: o Sobre é o último bloco da home. */}
          <Link href={`/${lang}#projetos`}>{t(ui.nav.projetos, lang, 'ui.nav.projetos')}</Link>
          <Link href="#sobre">{t(ui.nav.sobre, lang, 'ui.nav.sobre')}</Link>
        </nav>
        <AlternadorIdioma lang={lang} />
      </div>
    </header>
  )
}
