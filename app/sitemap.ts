import type { MetadataRoute } from 'next'
import { IDIOMAS } from '@/content/tipos'
import { projetos } from '@/content/indice'

const BASE = 'https://gacherubini.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const home = IDIOMAS.map((lang) => ({ url: `${BASE}/${lang}`, priority: 1 }))
  const paginas = IDIOMAS.flatMap((lang) =>
    projetos.map((p) => ({ url: `${BASE}/${lang}/${p.slug}`, priority: 0.8 })),
  )
  return [...home, ...paginas]
}
