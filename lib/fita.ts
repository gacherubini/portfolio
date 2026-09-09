/**
 * A FITA — as séries de preço que derivam atrás da primeira tela.
 *
 * A construção é a do `AcqMar` do currículo do Enzo Souto, com a forma
 * trocada: onde ele desenha senoide (o assunto dele é água), aqui é uma
 * caminhada aleatória (o assunto é dado de mercado). O que veio de lá e é
 * regra, não gosto:
 *
 * · CINCO LÂMINAS, CADA UMA COM CARÁTER PRÓPRIO. Com uma o olho lê uma curva
 *   parada; com duas lê padrão repetido, porque as duas cruzam sempre nos
 *   mesmos pontos. Lâminas com a mesma amplitude e o mesmo ruído viram uma
 *   massa só. Ele para em três porque as dele são ÁREAS preenchidas, que
 *   empilham opacidade na região inteira; fio de 1px só soma no cruzamento,
 *   e por isso aqui cabem cinco.
 *
 * · VELOCIDADES SEM DIVISOR COMUM (41, 29, 19, 53, 37 — primos). Com divisor
 *   comum o arranjo se recompõe em intervalo curto e o laço ganha batida.
 *
 * · O LAÇO FECHA SEM EMENDA. O `d` repete o mesmo ciclo quatro vezes, e o
 *   deslocamento para em múltiplo do ciclo: o quadro final é igual ao
 *   inicial. Emenda visível é o defeito clássico de fundo em laço.
 *
 * SORTEIO DETERMINÍSTICO, NÃO `Math.random()`. Isto roda no servidor, na
 * geração estática — um valor aleatório daria um `d` diferente a cada build,
 * sujando o diff sem nada ter mudado. Mesma doutrina do `AcqBolhas`.
 */

/** Uma volta completa do desenho, em unidades do viewBox. */
const CICLO = 1440
/** Quantas voltas cabem no `d`. Quatro dão folga para os dois deslocamentos. */
const VOLTAS = 4
const ALTURA = 200

export const FITA_VIEWBOX = `0 0 ${CICLO * VOLTAS} ${ALTURA}`

export type Perfil = {
  semente: number
  /** Distância entre amostras. Menor = linha mais nervosa. */
  passo: number
  /** Quanto da velocidade anterior sobrevive. Maior = curva mais lisa. */
  inercia: number
  ruido: number
  salto: number
  /** Força com que a série volta para o meio. Sem isso ela encosta na borda
   *  e vira régua — foi o que aconteceu na primeira tentativa. */
  puxao: number
}

export function serie({ semente, passo, inercia, ruido, salto, puxao }: Perfil): string {
  let s = semente
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648

  const n = CICLO / passo
  const CENTRO = 75
  let y = CENTRO
  let v = 0
  const ys: number[] = []
  for (let i = 0; i < n; i++) {
    v = v * inercia + (CENTRO - y) * puxao + (rnd() - 0.5) * ruido
    if (i % 11 === 0) v += (rnd() - 0.5) * salto
    y += v
    ys.push(y)
  }

  // A costura: as últimas amostras voltam para a primeira, senão o ponto em
  // que o ciclo reinicia é um degrau.
  const COSTURA = 10
  for (let i = 0; i < COSTURA; i++) {
    const k = ys.length - COSTURA + i
    const t = (i + 1) / COSTURA
    ys[k] = ys[k] * (1 - t) + ys[0] * t
  }

  const lo = Math.min(...ys)
  const hi = Math.max(...ys)
  const alto = (valor: number) => (ALTURA - 14 - ((valor - lo) / (hi - lo)) * (ALTURA - 40)).toFixed(1)

  const pontos: string[] = []
  for (let volta = 0; volta < VOLTAS; volta++) {
    for (let i = 0; i < n; i++) pontos.push(`${volta * CICLO + i * passo} ${alto(ys[i])}`)
  }
  pontos.push(`${VOLTAS * CICLO} ${alto(ys[0])}`)
  return 'M' + pontos.join(' L')
}

export type Lamina = {
  /** `l1` é a da frente. */
  classe: string
  d: string
  opacidade: number
  espessura: number
}

/** Da mais apagada para a mais forte: a ordem do DOM é a ordem de pintura. */
export const LAMINAS: Lamina[] = [
  { classe: 'l5', opacidade: 0.13, espessura: 1, d: serie({ semente: 62831, passo: 48, inercia: 0.81, ruido: 6, salto: 9, puxao: 0.035 }) },
  { classe: 'l4', opacidade: 0.18, espessura: 1, d: serie({ semente: 51413, passo: 30, inercia: 0.74, ruido: 8, salto: 13, puxao: 0.048 }) },
  { classe: 'l3', opacidade: 0.24, espessura: 1, d: serie({ semente: 90210, passo: 60, inercia: 0.84, ruido: 5, salto: 8, puxao: 0.03 }) },
  { classe: 'l2', opacidade: 0.3, espessura: 1.1, d: serie({ semente: 31337, passo: 36, inercia: 0.78, ruido: 7, salto: 11, puxao: 0.04 }) },
  { classe: 'l1', opacidade: 0.4, espessura: 1.3, d: serie({ semente: 7717, passo: 24, inercia: 0.7, ruido: 9, salto: 15, puxao: 0.055 }) },
]
