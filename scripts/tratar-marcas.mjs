/**
 * Trata as marcas da Ambush e da PUCRS para a coluna da experiência.
 *
 * Roda no build (`npm run marcas`, encadeado em `build`). Só o canal ALFA vai
 * para `public/marcas/`: a cor vem de `currentColor` via `mask-image`, e a
 * marca nunca fica presa num hex. Ver `components/Experiencia.tsx`.
 *
 * NIVELAMENTO EXPLÍCITO, E NÃO UMA INVERSÃO CRUA. Os dois JPEG têm fundo
 * sujo. No Ambush, o `#2E2E2E` do fundo viraria alfa de 18% e desenharia um
 * retângulo cinza em volta do wordmark. Na PUCRS, "PUC" é azul escuro (cinza
 * médio 110) e "RS" é azul claro (187) — numa inversão crua o "RS" sairia
 * semitransparente, e num monocromático isso leria como defeito de
 * renderização, não como as duas cores do original. O corte achata os dois
 * para a mesma tinta: `alfa = (v − fundo) / (traço − fundo)`, com corte em
 * 0 e 1. As medidas do recorte e dos níveis estão na spec da v3, conferidas
 * no protótipo com o sharp — não são estimadas.
 *
 * Idempotente: pula o que já existe e está mais novo que a origem.
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

/** Altura de saída dos dois PNG, em px. A largura sai da proporção. */
const ALTURA = 40

const MARCAS = [
  {
    origem: 'assets-marcas/pucrs-origem.jpeg',
    destino: join('public', 'marcas', 'pucrs.png'),
    // Só o wordmark — o brasão termina em x ~118 e sai. Medido no arquivo:
    // P começa em 142, S termina em 387, barra vertical em 100–160
    // (o subtítulo começa em 180). Margem de ~6px em cada lado.
    recorte: { left: 136, top: 94, width: 257, height: 72 },
    fundo: 245,
    traco: 200,
  },
  {
    origem: 'assets-marcas/ambush-origem.jpeg',
    destino: join('public', 'marcas', 'ambush.png'),
    // Só o wordmark — a assinatura fica em `y 116–125` e sai.
    recorte: { left: 24, top: 74, width: 150, height: 33 },
    fundo: 60,
    traco: 235,
  },
]

async function atual(marca) {
  if (!existsSync(marca.destino)) return false
  const [o, d] = await Promise.all([stat(marca.origem), stat(marca.destino)])
  return d.mtimeMs >= o.mtimeMs
}

async function tratar(marca) {
  // Largura explícita nos dois eixos e SEM `fit` — e, crucial, SEM resize em
  // nada que venha de buffer raw ou de `joinChannel`: nesse sharp, resize de
  // raw 1-canal devolve 3 canais zerados, resize com uma dimensão só mantém a
  // outra, e `fit: 'fill'` vira no-op, cada caso num tamanho diferente. O
  // único caminho que funciona em todos os tamanhos é resize no pipeline de
  // decode (JPEG → recorte → cinza → resize) e `joinChannel` sem resize
  // depois — os dois conferidos isoladamente, padrão contra padrão. A caixa
  // tem a proporção do recorte, então o `cover` padrão não corta nada.
  const largura = Math.round((marca.recorte.width * ALTURA) / marca.recorte.height)

  const { data, info } = await sharp(marca.origem)
    .extract(marca.recorte)
    .toColourspace('b-w')
    .resize({ width: largura, height: ALTURA, kernel: sharp.kernel.lanczos3 })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const alfa = Buffer.alloc(width * height)
  const faixa = marca.traco - marca.fundo
  for (let i = 0; i < width * height; i++) {
    const v = data[i * channels]
    const nivelado = Math.round(((v - marca.fundo) / faixa) * 255)
    alfa[i] = Math.min(255, Math.max(0, nivelado))
  }

  await mkdir(join(marca.destino, '..'), { recursive: true })
  // O PNG carrega o nivelamento no canal ALFA (é o que `mask-image` lê): o
  // RGB é branco sólido e irrelevante.
  await sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .joinChannel(alfa, { raw: { width, height, channels: 1 } })
    .png()
    .toFile(marca.destino)

  const saida = await sharp(marca.destino).metadata()
  return `${marca.destino}: ${saida.width}×${saida.height}`
}

const pendentes = []
for (const marca of MARCAS) if (!(await atual(marca))) pendentes.push(marca)

const assadas = []
for (const marca of pendentes) assadas.push(await tratar(marca))

console.log(
  `[marcas] ${MARCAS.length} marcas no total; ${pendentes.length} a tratar` +
    (assadas.length > 0 ? `: ${assadas.join(', ')}` : ', tudo em dia'),
)
