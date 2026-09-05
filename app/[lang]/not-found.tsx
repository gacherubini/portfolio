import Link from 'next/link'

export default function NaoEncontrado() {
  return (
    <main className="wrap abertura-home">
      <h1>Esta página não existe.</h1>
      <p>
        <Link href="/pt">Voltar para a home</Link>
      </p>
    </main>
  )
}
