import { FITA_VIEWBOX, LAMINAS } from '@/lib/fita'

/**
 * A fita: cinco séries de preço derivando devagar, presa na abertura.
 *
 * É filha da `.abertura` (ver `app/[lang]/page.tsx`) e preenche ela em
 * `inset: 0` — não é mais um bloco de 105vh ancorado no documento. O texto
 * da abertura sobe para `z-index: 1` por conta própria, senão a fita, que é
 * posicionada, pintaria por cima do `h1`.
 *
 * O BRILHO NÃO MORA AQUI. Ele é fixo na janela e vale para a página
 * inteira, até o rodapé — dentro da `.fita-fundo` herdaria a máscara e a
 * altura da abertura, e morreria na primeira dobra. Ver `Brilho` abaixo.
 *
 * SERVER COMPONENT, e o `d` de cada lâmina é gerado na build (ver
 * `lib/fita.ts`): zero JavaScript no cliente para um elemento que é
 * decoração pura. `aria-hidden` e sem nada focável.
 *
 * As opacidades são atributo `strokeOpacity` do SVG, em JSX — nunca `opacity:`
 * na folha, que `test/folha.test.ts` derruba a build com razão.
 */
export function Fita() {
  return (
    <div className="fita-fundo" aria-hidden="true">
      <div className="fita">
        {LAMINAS.map((l) => (
          <div className={`pista ${l.classe}`} key={l.classe}>
            <svg viewBox={FITA_VIEWBOX} preserveAspectRatio="none" fill="none">
              <path
                d={l.d}
                stroke="currentColor"
                strokeOpacity={l.opacidade}
                strokeWidth={l.espessura}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * A varredura larga e lenta. Camada à parte e FIXA na janela: as linhas ficam
 * presas na abertura e saem de cena quando a página desce, mas a varredura
 * acompanha a rolagem e vale para a página inteira, até o rodapé.
 */
export function Brilho() {
  return <div className="brilho" aria-hidden="true" />
}
