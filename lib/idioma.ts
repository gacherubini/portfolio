import type { Idioma, Texto } from '@/content/tipos'

const faltando = new Set<string>()

/**
 * Texto no idioma pedido, com queda para o português.
 *
 * Um projeto novo pode nascer só em português e ser traduzido depois — por isso
 * a falta de `en` avisa em vez de falhar. `campo` é o caminho do dado
 * ("revy.chamada"), e é o que o aviso imprime: aviso que não nomeia o campo
 * não conserta nada.
 */
export function t(texto: Texto, lang: Idioma, campo: string): string {
  if (lang === 'pt') return texto.pt

  const traduzido = texto.en?.trim()
  if (traduzido) return traduzido

  faltando.add(campo)
  return texto.pt
}

export function avisosDeTraducao(): string[] {
  return [...faltando].sort()
}

export function limparAvisosDeTraducao(): void {
  faltando.clear()
}

/** Chamado no fim da geração de cada página em inglês. */
export function imprimirAvisosDeTraducao(): void {
  const campos = avisosDeTraducao()
  if (campos.length === 0) return
  console.warn(
    `[i18n] ${campos.length} campo(s) sem tradução em inglês; caíram no ` +
      `português:\n  ${campos.join('\n  ')}`,
  )
}
