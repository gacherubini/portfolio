import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Archivo } from 'next/font/google'
import { ehIdioma } from '@/content/tipos'
import { Entrada } from '@/components/Entrada'
import { Movimento } from '@/components/Movimento'
import './../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://gacherubini.dev'),
  authors: [{ name: 'Gabriel Cherubini', url: 'https://github.com/gacherubini' }],
}

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
      <head>
        {/* Toca uma vez por sessão. Inline e antes do corpo porque precisa
            valer no primeiro quadro: em `useEffect` o véu piscaria em toda
            navegação. `try` porque navegador em modo restrito lança ao ler
            sessionStorage, e aí o certo é mostrar o véu, não quebrar. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('entrada')){document.documentElement.dataset.entrada='visto'}else{sessionStorage.setItem('entrada','1')}}catch(e){}",
          }}
        />
      </head>
      <body>
        <Entrada />
        {children}
        <Movimento />
      </body>
    </html>
  )
}
