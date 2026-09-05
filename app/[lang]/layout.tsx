import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Archivo } from 'next/font/google'
import { ehIdioma } from '@/content/tipos'
import './../globals.css'

// Archivo sozinha, e nada além dela. Monoespaçada, onde aparece, é a pilha do
// sistema — nenhuma segunda fonte é baixada.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--fonte-archivo',
})

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }]
}

export default async function LayoutRaiz({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!ehIdioma(lang)) notFound()

  return (
    <html lang={lang === 'en' ? 'en' : 'pt-BR'} className={archivo.variable}>
      <body>{children}</body>
    </html>
  )
}
