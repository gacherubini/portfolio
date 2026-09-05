import type { Projeto } from '@/content/tipos'
import { revy } from '@/content/projetos/revy'
import { bddente } from '@/content/projetos/bddente'
import { officeTimesheet } from '@/content/projetos/office-timesheet'
import { autotune } from '@/content/projetos/autotune'

/**
 * A ordem das faixas na home, fechada em 04/09/2026. O lado do print alterna
 * faixa a faixa para o olho não cansar — quem faz isso é o índice do array,
 * não um campo do projeto.
 */
export const projetos: Projeto[] = [revy, bddente, officeTimesheet, autotune]

export function projetoPorSlug(slug: string): Projeto | undefined {
  return projetos.find((p) => p.slug === slug)
}
