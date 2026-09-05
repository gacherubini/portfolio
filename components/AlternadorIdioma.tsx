import Link from 'next/link'
import type { Idioma } from '@/content/tipos'
import { OUTRO_IDIOMA } from '@/content/ui'

/**
 * `caminho` é o que vem depois do idioma: '' na home, '/revy' na página do
 * projeto. Trocar de idioma mantém a página.
 */
export function AlternadorIdioma({ lang, caminho = '' }: { lang: Idioma; caminho?: string }) {
  const outro = OUTRO_IDIOMA[lang]
  const rotulo = (i: Idioma) => i.toUpperCase()

  return (
    <p className="idioma">
      <span aria-current="true">{rotulo(lang)}</span>
      {' / '}
      <Link href={`/${outro}${caminho}`} hrefLang={outro}>
        {rotulo(outro)}
      </Link>
    </p>
  )
}
