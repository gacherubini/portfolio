import { FITA_VIEWBOX, LAMINAS } from '@/lib/fita'

/**
 * O fundo: cinco séries de preço derivando devagar, mais uma varredura.
 *
 * SÃO DUAS CAMADAS COM COMPORTAMENTOS OPOSTOS, e é de propósito. As LINHAS
 * ficam presas ao topo do DOCUMENTO e saem de cena quando a página desce —
 * elas são o desenho da primeira tela. O BRILHO é FIXO na janela e vale para
 * a página inteira, até o rodapé. Por isso ele mora fora da `.fita-fundo`:
 * dentro dela herdaria a máscara e a altura de 105vh, e morreria na
 * primeira dobra.
 *
 * NÃO ACOMPANHA A ROLAGEM. Nasceu `position: fixed` e descia grudado na
 * janela o tempo todo, o que cansa. Ancorado no topo do DOCUMENTO, ele fica
 * onde nasceu e sai de cena quando a página desce — é o que o
 * `AmbienteLiquido` do Enzo faz.
 *
 * SERVER COMPONENT, e o `d` de cada lâmina é gerado na build (ver
 * `lib/fita.ts`): zero JavaScript no cliente para um elemento que é
 * decoração pura. `aria-hidden` e sem nada focável.
 */
export function Fita() {
  return (
    <>
      {/* O brilho é camada à parte, e FIXA: as linhas ficam presas ao topo
          do documento e saem de cena, mas a varredura acompanha a janela e
          vale para a página inteira, até o rodapé. */}
      <div className="brilho" aria-hidden="true" />
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
    </>
  )
}
