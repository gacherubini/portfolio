import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OPACIDADES_DE_TEXTO, OPACIDADES_NO_AZUL } from '@/lib/contraste'

const folha = readFileSync('app/globals.css', 'utf8')

describe('a regra da folha', () => {
  it('não usa nenhuma opacity fora da lista medida', () => {
    const permitidas = new Set([...OPACIDADES_DE_TEXTO, ...OPACIDADES_NO_AZUL, 0, 1])
    const usadas = [...folha.matchAll(/opacity:\s*([\d.]+)/g)].map((m) => Number(m[1]))
    expect(usadas.length).toBeGreaterThan(0)
    expect(usadas.filter((o) => !permitidas.has(o))).toEqual([])
  })

  it('não esmaece nada pintado com --calmo', () => {
    // `calmo` reprova a 0,72 nas quatro paletas (ver test/contraste.test.ts).
    // Quem recebe opacity é `--texto`; quem usa `--calmo` fica em opacidade
    // cheia. Regra grosseira, mas pega o caso real: uma declaração de opacity
    // no mesmo bloco em que `--calmo` pinta a cor.
    const blocos = folha.split('}')
    const errados = blocos.filter(
      (b) => /color:\s*var\(--calmo\)/.test(b) && /opacity:\s*(?!1)[\d.]+/.test(b),
    )
    expect(errados).toEqual([])
  })

  it('mantém o padding lateral de .wrap no Sobre', () => {
    const regraSobre = folha.match(/\.sobre\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(regraSobre).toContain('padding-block: 84px 92px')
    expect(regraSobre).not.toMatch(/padding\s*:/)
  })

  // As classes que dividem o elemento com `.wrap`, lidas dos componentes: um
  // `.wrap` novo entra nesta lista sozinho, sem ninguém lembrar de vir aqui.
  const secoesDeWrap = [...new Set(
    ['components', 'app', 'app/[lang]', 'app/[lang]/[slug]']
      .flatMap((dir) =>
        readdirSync(dir, { withFileTypes: true })
          .filter((f) => f.isFile() && f.name.endsWith('.tsx'))
          .flatMap((f) => [...readFileSync(`${dir}/${f.name}`, 'utf8').matchAll(/className=\{?["'`]([^"'`]*\bwrap\b[^"'`]*)["'`]/g)]),
      )
      .flatMap((m) => m[1].split(/\s+/))
      .filter((c) => c && c !== 'wrap' && c !== 'revela' && c !== 'dentro' && !c.includes('$')),
  )]

  it('lê as seções de .wrap dos componentes', () => {
    // Se a leitura falhar, os dois testes abaixo passariam vazios.
    expect(secoesDeWrap).toContain('regua')
    expect(secoesDeWrap).toContain('topo')
    expect(secoesDeWrap.length).toBeGreaterThan(6)
  })

  it('nenhuma seção de .wrap disputa o atalho padding com ele', () => {
    // `.wrap` e a classe da seção têm a MESMA especificidade, (0,1,0): quem
    // vier depois na folha leva o atalho `padding` inteiro, os quatro lados.
    // Foi o que aconteceu nos dois sentidos. `.topo`, `.abertura-home`,
    // `.abertura-projeto`, `.sobre` e `.rodape-projeto` vêm ANTES do
    // `.wrap` que a media query de 560px redeclara, e no telefone perdiam o
    // padding vertical inteiro. `.regua`, `.prosa`, `.galeria` e `.tecnico`
    // vêm DEPOIS, e perdiam a goteira lateral em toda largura — no telefone,
    // com o `.wrap` do tamanho da tela, isso é texto encostado na borda.
    //
    // O acordo que desfaz a disputa: `.wrap` só mexe no eixo inline, a seção
    // só no eixo block. Nenhum atalho dos dois lados.
    const comAtalho = secoesDeWrap.filter((c) => {
      const regras = [...folha.matchAll(new RegExp(`\\.${c}\\s*\\{([^}]*)\\}`, 'g'))]
      return regras.some((r) => /(?:^|;)\s*padding\s*:/.test(r[1]))
    })
    expect(comAtalho).toEqual([])
  })

  it('sem cursor, o topo ganha alvo de dedo sem mudar de tamanho', () => {
    // Medido no telefone a 390px: a régua de idioma é um alvo de 18×14, e os
    // links do topo têm 22px de altura — abaixo dos 24×24 da WCAG 2.5.8.
    // Cresce por pseudo-elemento, e não por padding: `.topo` é um flex com
    // `space-between`, e engordar a caixa empurraria o vizinho.
    const bloco = folha.match(/@media \(hover: none\) \{([\s\S]*?)\n\}/)?.[1] ?? ''
    expect(bloco).toMatch(/\.topo a::after[\s\S]*inset:/)
  })

  it('.wrap só declara a goteira, e no eixo inline', () => {
    const regras = [...folha.matchAll(/\.wrap\s*\{([^}]*)\}/g)].map((m) => m[1])
    expect(regras.length).toBeGreaterThan(1)
    for (const r of regras) {
      expect(r).toMatch(/padding-inline:/)
      expect(r).not.toMatch(/(?:^|;)\s*padding\s*:/)
    }
  })

  it('prende .col-texto e .col-print na mesma linha na faixa espelhada', () => {
    // `grid-column` explícito avança o cursor de auto-placement em DOM order:
    // sem `grid-row` fixo, `.col-texto` (coluna 2) ocupa a linha 1 e
    // `.col-print` (coluna 1), vindo depois no DOM, não cabe mais nela — cai
    // para a linha 2 e abre uma faixa vazia da cor do sistema ao lado do texto.
    const texto = folha.match(/\.faixa\.espelho \.col-texto \{([^}]*)\}/)?.[1] ?? ''
    const print = folha.match(/\.faixa\.espelho \.col-print \{([^}]*)\}/)?.[1] ?? ''
    expect(texto).toMatch(/grid-row:\s*1\b/)
    expect(print).toMatch(/grid-row:\s*1\b/)
  })

  it('não deixa o grid-row da faixa espelhada vazar para o empilhamento mobile', () => {
    const inicio = folha.indexOf('@media (max-width: 820px) {\n  .faixa .grade')
    const fim = folha.indexOf('@media (max-width: 820px) {\n  .abertura-home')
    const blocoMobile = folha.slice(inicio, fim)
    const reset =
      blocoMobile.match(/\.faixa\.espelho \.col-texto, \.faixa\.espelho \.col-print \{([^}]*)\}/)?.[1] ?? ''
    expect(reset).not.toMatch(/grid-row:\s*1\b/)
  })

  it('toda superfície com tema declara seu próprio a:focus-visible', () => {
    // `a:focus-visible { outline: 2px solid currentColor }`, a regra global,
    // some dentro de `.faixa` e `.pagina-projeto`: lá `currentColor` é
    // `--ctaTexto`/`--texto`, pintado igual ao próprio `--fundo` em mais de
    // uma paleta (Revy e Autotune, 1.00:1) — o anel de foco existe e é
    // invisível. Cada superfície temática precisa da própria regra, presa a
    // `--destaque`, que `verificarTema` já garante ≥ 3:1 contra `--fundo`.
    for (const superficie of ['.faixa', '.pagina-projeto', '.fechamento']) {
      const escapada = superficie.replace('.', '\\.')
      const regex = new RegExp(`${escapada}\\s*a:focus-visible\\s*\\{`)
      expect(folha).toMatch(regex)
    }
  })

  it('a pílula de situação só larga a margem automática quando vem um selo antes', () => {
    // `.situacao { margin: 0 0 0 auto }` é o que encosta a pílula na borda
    // direita da ficha. Quando existe selo, quem faz esse empurrão é ele, e a
    // situação precisa zerar a margem para as duas ficarem coladas.
    const base = folha.match(/\n\.situacao \{([^}]*)\}/)?.[1] ?? ''
    expect(base).toMatch(/margin:\s*0 0 0 auto/)
    expect(folha).toMatch(/\.ficha-faixa \.selo ~ \.situacao \{[^}]*margin-left:\s*0/)
    expect(folha).toMatch(/\.ficha-faixa \.selo \{[^}]*margin-left:\s*auto/)

    // O outro sentido: BDDente e Autotune não declaram selo. Um zero sem o
    // combinador — `.ficha-faixa .situacao`, (0,2,0) — venceria a margem
    // automática de (0,1,0) também neles, e lá a pílula escorregava para o
    // meio da ficha, colada no `.paraquem`.
    expect(folha).not.toMatch(/\.ficha-faixa \.situacao \{/)
  })

  it('o véu da entrada tem cor de fundo mesmo sem color-mix', () => {
    // Sem fallback, num navegador que não conhece `color-mix` a declaração
    // inteira é inválida: `.entrada` continua `position: fixed; inset: 0` e
    // vira uma camada transparente e clicável por cima da página até a
    // animação a retirar.
    const regra = folha.match(/\n\.entrada \{([^}]*)\}/)?.[1] ?? ''
    const fundos = [...regra.matchAll(/background:\s*([^;]+);/g)].map((m) => m[1].trim())
    expect(fundos.length).toBe(2)
    expect(fundos[0]).not.toContain('color-mix')
    expect(fundos[1]).toContain('color-mix')
  })

  it('a régua da entrada corre em linear, para a cor acompanhar a largura', () => {
    // As trocas de cor são temporais (25/50/75%). Com aceleração, largura e cor
    // deixariam de andar juntas e as duas últimas cores quase não apareceriam.
    const regra = folha.match(/\.entrada-regua i \{([^}]*)\}/)?.[1] ?? ''
    expect(regra).toMatch(/ent-corre[^,]*linear/)
  })

  it('movimento reduzido não vê véu nenhum', () => {
    expect(folha).toMatch(/prefers-reduced-motion[\s\S]*?\.entrada\s*\{[^}]*display:\s*none/)
  })

  it('a prancha aberta toma a linha inteira das duas placas do destaque', () => {
    // As placas são um grid de duas colunas. Aberta, a prancha vai a 1320px e
    // transborda a coluna; sem tomar a linha, a irmã fica parada na coluna da
    // direita e é desenhada por cima dela. O seletor com `:has` é o Autotune,
    // onde o filho do grid é a `.placa` e a prancha está dentro dela.
    const regra = folha.match(/\.placas > \.prancha\.aberta,\n\.placas > :has\(\.prancha\.aberta\) \{([^}]*)\}/)?.[1] ?? ''
    expect(regra).toMatch(/grid-column:\s*1 \/ -1/)
  })
})
