/**
 * O logotipo é a palavra inteira. Na casca clara o `.dev` é o azul da marca;
 * dentro de uma faixa colorida ou de uma página de projeto o azul some ou
 * vibra, então a marca vira monocromática. No fechamento azul ela vai branca.
 */
export function Marca({ variante }: { variante: 'casca' | 'mono' | 'branca' }) {
  return (
    <span className={`marca marca--${variante}`}>
      gacherubini<span className="marca-dev">.dev</span>
    </span>
  )
}
