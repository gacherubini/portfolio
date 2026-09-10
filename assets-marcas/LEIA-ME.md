# As marcas de origem

Os dois JPEG que `scripts/tratar-marcas.mjs` lê para gerar
`public/marcas/*.png`. Moram aqui, e não em `~/Downloads`, porque a pasta de
downloads é lugar de passagem: um `npm run marcas` que falha porque o dono
limpou os downloads seria uma bomba-relógio boba dentro do `npm run build`.

| arquivo | o que é | medida | de onde veio | quando |
|---|---|---|---|---|
| `pucrs-origem.jpeg` | brasão + wordmark da PUCRS | 399×300 | mandado pelo dono | 09/09/2026 |
| `ambush-origem.jpeg` | wordmark + assinatura da Ambush | 200×200 | mandado pelo dono | 09/09/2026 |

**São de baixa resolução, e isso é conhecido.** Dão conta porque só o
**wordmark** é usado e ele entra a 40px de altura — sobra pixel para isso e
para uma tela retina. Não dão conta de mais nada: não estique, não use em
cabeçalho, não gere favicon a partir deles.

**Se os SVG oficiais aparecerem, é para trocar.** Um SVG oficial é melhor em
qualquer tela e dispensa `scripts/tratar-marcas.mjs` inteiro — o `mask-image`
aceita SVG direto. Refazer a Task 6 do plano
`docs/superpowers/plans/2026-09-09-portfolio-v3.md` é o caminho; está aberto
na seção "Depende do dono, não do código".

**São marcas de terceiros.** Entram monocromáticas, para conviver na mesma
coluna, e não recebem nenhum outro tratamento — distorção, corte criativo, cor
inventada, nada. O recorte que a Task 6 faz tira o brasão da PUCRS e a
assinatura da Ambush, e para por aí.
