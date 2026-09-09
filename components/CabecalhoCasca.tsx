import type { Idioma } from '@/content/tipos'
import { Marca } from '@/components/Marca'
import { AlternadorIdioma } from '@/components/AlternadorIdioma'
import { NavSecoes } from '@/components/NavSecoes'

/**
 * O topo claro da home. A página do projeto usa o seu próprio, tematizado.
 *
 * Gruda no alto e marca a seção em que o visitante está — as quatro seções
 * são âncoras da mesma página, não rotas.
 */
export function CabecalhoCasca({ lang }: { lang: Idioma }) {
  return (
    <header className="casca-topo">
      <div className="wrap topo">
        <Marca variante="casca" />
        <NavSecoes lang={lang} />
        <AlternadorIdioma lang={lang} />
      </div>
    </header>
  )
}
