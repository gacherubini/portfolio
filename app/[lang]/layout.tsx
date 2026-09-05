import type { ReactNode } from 'react'
import './../globals.css'

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
  return (
    <html lang={lang === 'en' ? 'en' : 'pt-BR'}>
      <body>{children}</body>
    </html>
  )
}
