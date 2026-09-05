import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextoComMarcas } from '@/components/TextoComMarcas'

describe('TextoComMarcas', () => {
  it('deixa texto comum em paz', () => {
    render(<p><TextoComMarcas texto="Só prosa." /></p>)
    expect(screen.getByText('Só prosa.')).toBeInTheDocument()
  })

  it('crase vira code — nome de função não lê como prosa', () => {
    const { container } = render(<p><TextoComMarcas texto="O campo `aceita_whatsapp` aceita `NULL`." /></p>)
    const codes = container.querySelectorAll('code')
    expect([...codes].map((c) => c.textContent)).toEqual(['aceita_whatsapp', 'NULL'])
  })

  it('asterisco vira ênfase', () => {
    const { container } = render(<p><TextoComMarcas texto="fator de *340*" /></p>)
    expect(container.querySelector('b')).toHaveTextContent('340')
  })

  it('não engole o texto em volta', () => {
    const { container } = render(<p><TextoComMarcas texto="antes `meio` depois" /></p>)
    expect(container.textContent).toBe('antes meio depois')
  })
})
