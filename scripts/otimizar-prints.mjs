/**
 * Assa os prints em AVIF e WebP, nas larguras que o site pede.
 *
 * Roda no build (veja o Dockerfile). O objetivo é que o servidor em produção
 * nunca encode uma imagem: ele tem 256MB e dorme quando ninguém está no site,
 * e o `next/image` fazia as duas coisas erradas ali — estourava a memória
 * encodando AVIF grande, e guardava o resultado num cache efêmero que sumia a
 * cada soneca.
 *
 * A largura vem do ARQUIVO, lida com o sharp. O componente pede a largura
 * DECLARADA no `content/`. As duas têm que bater, e é
 * `test/prints-otimizados.test.ts` quem garante isso — se divergirem, o site
 * pediria variante inexistente e o navegador comeria 404 calado.
 *
 * Idempotente: pula o que já existe e está mais novo que a origem.
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { cpus } from 'node:os'
import sharp from 'sharp'
import { largurasDe } from '../lib/prints.ts'

const ORIGEM = 'public/prints'
const DESTINO = 'public/prints-otimizados'

// `effort` baixo no AVIF é uma troca deliberada: o ganho de tamanho entre 3 e
// 6 é de poucos por cento e o custo é de minutos no build.
const AVIF = { quality: 62, effort: 3 }
const WEBP = { quality: 85, effort: 4 }

async function tarefas() {
  const lista = []
  for (const slug of await readdir(ORIGEM)) {
    const dir = join(ORIGEM, slug)
    if (!(await stat(dir)).isDirectory()) continue

    for (const arquivo of await readdir(dir)) {
      if (!/\.(png|jpe?g)$/i.test(arquivo)) continue
      const origem = join(dir, arquivo)
      const { width } = await sharp(origem).metadata()
      const base = basename(arquivo, extname(arquivo))

      for (const largura of largurasDe(width)) {
        for (const formato of ['avif', 'webp']) {
          lista.push({
            origem,
            destino: join(DESTINO, slug, `${base}-${largura}.${formato}`),
            largura,
            formato,
          })
        }
      }
    }
  }
  return lista
}

async function atual(t) {
  if (!existsSync(t.destino)) return false
  const [o, d] = await Promise.all([stat(t.origem), stat(t.destino)])
  return d.mtimeMs >= o.mtimeMs
}

async function assar(t) {
  await mkdir(join(t.destino, '..'), { recursive: true })
  // `withoutEnlargement` é a rede: `largurasDe` já não devolve largura acima do
  // original, mas ampliar print é só peso sem detalhe, e vale dizer duas vezes.
  const cano = sharp(t.origem).resize({ width: t.largura, withoutEnlargement: true })
  const bytes = await (t.formato === 'avif' ? cano.avif(AVIF) : cano.webp(WEBP)).toBuffer()
  await writeFile(t.destino, bytes)
  return bytes.length
}

const lista = await tarefas()
const pendentes = []
for (const t of lista) if (!(await atual(t))) pendentes.push(t)

console.log(
  `[prints] ${lista.length} variantes no total; ${pendentes.length} a assar, ` +
    `${lista.length - pendentes.length} já em dia.`,
)

let feitas = 0
let total = 0
const fila = pendentes[Symbol.iterator]()
await Promise.all(
  Array.from({ length: Math.max(2, cpus().length) }, async () => {
    for (const t of fila) {
      total += await assar(t)
      feitas++
      if (feitas % 25 === 0) console.log(`[prints]   ${feitas}/${pendentes.length}`)
    }
  }),
)

console.log(
  `[prints] pronto: ${feitas} variantes, ${(total / 1024 / 1024).toFixed(1)}MB escritos.`,
)
