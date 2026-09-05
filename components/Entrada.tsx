import { Marca } from '@/components/Marca'

/**
 * O véu que cobre a home enquanto a marca se revela e uma régua atravessa as
 * quatro cores dos quatro sistemas. Ensina a ideia do site — não tenho cor,
 * visto a de cada sistema — antes de o site aparecer.
 *
 * **Server component, de propósito.** Como componente client ele só existiria
 * depois da hidratação, e o visitante veria a home por um quadro antes de o
 * véu cobrir. Toda a animação é `@keyframes` com `forwards`: zero JavaScript
 * no caminho feliz.
 *
 * `aria-hidden` e sem nada focável: a home inteira está no DOM atrás dele, e o
 * véu nunca prende o teclado nem é narrado.
 */
export function Entrada() {
  return (
    <div className="entrada" aria-hidden="true">
      <div className="entrada-centro">
        <Marca variante="casca" />
        <div className="entrada-regua">
          <i />
        </div>
      </div>
    </div>
  )
}
