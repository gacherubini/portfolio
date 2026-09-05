import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * SLOT: o PDF ainda não existe. Enquanto não existir, o fechamento não mostra
 * o botão — link morto é pior que link ausente. Basta jogar o arquivo em
 * `public/` e a próxima build o oferece.
 *
 * Roda só em tempo de build, dentro de Server Component.
 */
export function curriculoDisponivel(): boolean {
  const caminho = join(process.cwd(), 'public', 'curriculo-gabriel-cherubini.pdf')
  const existe = existsSync(caminho)
  if (!existe) {
    console.warn(
      '[currículo] public/curriculo-gabriel-cherubini.pdf não existe; ' +
        'o botão de download não vai aparecer no fechamento da home.',
    )
  }
  return existe
}
