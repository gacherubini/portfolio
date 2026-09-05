import type { Metadata } from 'next'
import './globals.css'

// Este `not-found.tsx` vive na raiz porque o notFound() de `app/[lang]/layout.tsx`
// resolve fora do segmento `[lang]` quando `lang` nem é um segmento válido —
// é o caso de `/es` ou `/a/b/c`, onde o roteador nunca chega a montar o
// layout raiz do idioma. Sem este arquivo o Next cai no boundary embutido,
// que não usa nada da folha do site: página em branco, sem `<html>` visível.
// Por não ter layout acima, ele monta `<html>`/`<body>` e importa o CSS
// sozinho — e por não saber qual idioma o visitante queria, é bilíngue: uma
// linha em cada idioma, com link para as duas homes.
export const metadata: Metadata = {
  title: 'Página não encontrada · Page not found',
}

export default function NaoEncontradoRaiz() {
  return (
    <html lang="pt-BR">
      <body>
        <main className="wrap abertura-home">
          <h1>Página não encontrada. Page not found.</h1>
          <p lang="pt">
            Esta página não existe. <a href="/pt">Voltar para a home</a>.
          </p>
          <p lang="en">
            This page doesn&apos;t exist. <a href="/en">Back to the home page</a>.
          </p>
        </main>
      </body>
    </html>
  )
}
