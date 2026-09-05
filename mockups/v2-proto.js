/* =========================================================================
   PROTÓTIPO — não é código do site. Descartável.

   Todo o JS novo da proposta v2, junto num arquivo só para dar para ler de
   uma vez. Na implementação real isto vira dois componentes client
   (`Visor` e `Movimento`) mais um script inline de 8 linhas para o véu.
   ========================================================================= */
(() => {
  const raiz = document.documentElement
  const params = new URLSearchParams(location.search)
  const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ======================================================================
     1 · TELA DE ENTRADA
     ====================================================================== */

  const veu = document.querySelector('.entrada')
  let variante = params.get('entrada') || 'camaleao'

  function montarVeu() {
    if (!veu) return
    veu.className = 'entrada entrada--' + variante
    veu.hidden = false
    // Reinicia as animações CSS: sem isto, remontar não repete nada.
    // O próprio véu tem animação (a saída), então ele entra na lista.
    ;[veu, ...veu.querySelectorAll('*')].forEach((n) => {
      n.style.animation = 'none'
      void n.offsetWidth
      n.style.animation = ''
    })
    // Some do fluxo quando a animação de saída termina, para não engolir clique.
    clearTimeout(montarVeu.t)
    montarVeu.t = setTimeout(() => { veu.hidden = true }, menosMovimento ? 0 : 1600)
  }

  montarVeu()

  /* ======================================================================
     2 · MOVIMENTO
     Um listener de pointermove só, limitado a requestAnimationFrame.
     ====================================================================== */

  let intensidade = params.get('mov') || 'discreta'
  const rotulo = document.querySelector('.cursor-rotulo')

  function aplicarIntensidade() {
    if (intensidade === 'off' || menosMovimento) {
      raiz.removeAttribute('data-mov')
      document.querySelectorAll('.revela').forEach((n) => n.classList.add('dentro'))
    } else {
      raiz.dataset.mov = intensidade
    }
  }

  let px = 0, py = 0, pendente = false, alvoPrint = null

  // As caixas dos botões e das faixas ficam num cache. Medir `.cta` a cada
  // quadro obrigava o navegador a recalcular layout a cada movimento do
  // cursor, e é a maior fonte de engasgo da página inteira — não só da
  // imagem. Rolagem e redimensionamento invalidam o cache; nada mais mexe
  // nessas caixas.
  let botoes = []
  let caixas = new WeakMap()
  let cacheSujo = true

  function medir() {
    botoes = [...document.querySelectorAll('.cta')]
    caixas = new WeakMap()
    for (const el of [...botoes, ...document.querySelectorAll('[data-brilho], .col-print')]) {
      caixas.set(el, el.getBoundingClientRect())
    }
    cacheSujo = false
  }

  const sujar = () => { cacheSujo = true }
  addEventListener('scroll', sujar, { passive: true })
  addEventListener('resize', sujar)

  function caixa(el) {
    const r = caixas.get(el)
    if (r) return r
    const novo = el.getBoundingClientRect()
    caixas.set(el, novo)
    return novo
  }

  function pintar() {
    pendente = false
    if (!raiz.dataset.mov) return
    if (cacheSujo) medir()

    const sob = document.elementFromPoint(px, py)

    // 2a · brilho na faixa sob o cursor
    const brilho = sob && sob.closest('[data-brilho]')
    if (brilho) {
      const r = caixa(brilho)
      brilho.style.setProperty('--mx', ((px - r.left) / r.width) * 100 + '%')
      brilho.style.setProperty('--my', ((py - r.top) / r.height) * 100 + '%')
    }

    // 2b · botões magnéticos — no máximo 5px, e só de perto
    botoes.forEach((b) => {
      const r = caixa(b)
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const d = Math.hypot(px - cx, py - cy)
      if (d < 110) {
        b.style.setProperty('--dx', Math.max(-5, Math.min(5, (px - cx) * 0.16)) + 'px')
        b.style.setProperty('--dy', Math.max(-5, Math.min(5, (py - cy) * 0.16)) + 'px')
      } else {
        b.style.removeProperty('--dx')
        b.style.removeProperty('--dy')
      }
    })

    // 2c · o print inclina — no máximo 2,5°
    // Prancha aberta não inclina: ela já é o assunto da tela, e um segundo
    // `transform` brigaria com o da abertura.
    let col = sob && sob.closest('.col-print')
    if (col && col.classList.contains('aberta')) col = null
    if (col !== alvoPrint && alvoPrint) {
      const f = alvoPrint.querySelector('.prancha-alvo')
      if (f) { f.style.removeProperty('--rx'); f.style.removeProperty('--ry'); f.style.removeProperty('--py') }
    }
    alvoPrint = col
    if (col) {
      const f = col.querySelector('.prancha-alvo')
      const r = caixa(col)
      if (f) {
        f.style.setProperty('--ry', (((px - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg')
        f.style.setProperty('--rx', (((py - r.top) / r.height - 0.5) * -5).toFixed(2) + 'deg')
        f.style.setProperty('--py', '-4px')
      }
    }

    // 2d · rótulo no cursor (só na intensidade "média")
    if (rotulo) {
      const amp = sob && sob.closest('.prancha-alvo')
      rotulo.style.transform = `translate(${px}px, ${py}px) translate(-50%,-50%)`
      rotulo.classList.toggle('visivel', !!amp)
    }
  }

  addEventListener('pointermove', (e) => {
    px = e.clientX; py = e.clientY
    if (!pendente) { pendente = true; requestAnimationFrame(pintar) }
  }, { passive: true })

  // 2e · entrada na rolagem
  //  Os elementos nascem visíveis no HTML. Só depois que o JS confirma que
  //  sabe animá-los é que eles são escondidos — quem está sem JS vê tudo.
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('dentro'); observador.unobserve(e.target) }
    })
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 })

  document.querySelectorAll('.revela').forEach((n) => observador.observe(n))
  aplicarIntensidade()

  /* ======================================================================
     3 · AS PRANCHAS — abrir em largura total, no lugar
     ====================================================================== */

  const pranchas = [...document.querySelectorAll('.prancha')]
  let aberta = null
  let forca = params.get('abrir') || 'medio'
  raiz.dataset.abrir = forca

  const DURACAO = 460
  const CURVA = 'cubic-bezier(.22,.72,.24,1)'

  /**
   * FLIP. Mede onde a imagem está, muda o layout de uma vez só, mede de novo,
   * e devolve a imagem visualmente para o lugar antigo com um `transform` —
   * daí anima esse transform até zero.
   *
   * Por que não animar `width` direto: largura é propriedade de layout. O
   * navegador refaz o layout da página e reescala um bitmap de 3200×2000 a
   * cada quadro, e é isso que engasgava. `transform` roda no compositor, sem
   * tocar em layout nenhum.
   */
  function virar(p, mudar) {
    const alvo = p.querySelector('.prancha-alvo')
    const antes = alvo.getBoundingClientRect()
    // Ver o comentário de `.faixa .prancha.aberta` na folha: dentro da faixa
    // o centramento precisa saber onde o print começa na tela.
    if (p.closest('.faixa')) alvo.style.setProperty('--esq', antes.left + 'px')

    if (menosMovimento || !alvo.getAnimations) { mudar(); return }

    p.classList.add('prancha--virando')
    mudar()

    // O reposicionamento da rolagem entra ANTES da segunda medição, então o
    // transform absorve os dois movimentos de uma vez: o visitante vê um
    // deslocamento só, em vez de a página rolar por baixo de uma imagem que
    // cresce.
    if (p.classList.contains('aberta')) {
      p.scrollIntoView({ block: 'start', behavior: 'auto' })
    }

    const depois = alvo.getBoundingClientRect()
    // Escala uniforme: a altura acompanha a largura porque a imagem é
    // `height: auto`. Usar sx e sy separados distorceria o print num quadro
    // em que a medição arredondasse diferente.
    const escala = depois.width ? antes.width / depois.width : 1

    const anim = alvo.animate(
      [
        {
          transformOrigin: '0 0',
          transform: `translate(${antes.left - depois.left}px, ${antes.top - depois.top}px) scale(${escala})`,
        },
        { transformOrigin: '0 0', transform: 'none' },
      ],
      { duration: DURACAO, easing: CURVA }
    )
    anim.finished.catch(() => {}).then(() => p.classList.remove('prancha--virando'))
  }

  function fechar() {
    if (!aberta) return
    const p = aberta
    aberta = null
    virar(p, () => {
      p.classList.remove('aberta')
      p.querySelector('.prancha-alvo').dataset.convite = 'ver maior'
    })
  }

  function abrir(p) {
    if (aberta === p) { fechar(); return }
    if (aberta) {
      // Fecha a anterior sem animar: duas pranchas se mexendo ao mesmo tempo
      // é movimento demais, e a rolagem iria para o lugar errado.
      aberta.classList.remove('aberta')
      aberta.querySelector('.prancha-alvo').dataset.convite = 'ver maior'
      aberta = null
    }
    aberta = p
    virar(p, () => {
      p.classList.add('aberta')
      const alvo = p.querySelector('.prancha-alvo')
      alvo.dataset.convite = 'fechar'
      // A inclinação do mouse deixou variáveis inline no elemento; se ficarem,
      // elas voltam a valer no quadro seguinte ao fim da animação.
      alvo.style.removeProperty('--rx')
      alvo.style.removeProperty('--ry')
      alvo.style.removeProperty('--py')
    })
  }

  /**
   * Decide se vale abrir. Vale quando o arquivo tem pelo menos 1,5× mais
   * resolução do que o espaço em que está sendo mostrado — aí abrir revela
   * detalhe que não estava lá. Um print já exibido no tamanho nativo não tem
   * nada a revelar, e esticá-lo só borra.
   *
   * Concretamente: os prints dos três sistemas são retina 3200px mostrados a
   * 880 (3,6×), então abrem. Os do Autotune são capturas nativas de 639px de
   * uma janela de plugin, mostradas a 520 (1,2×): não abrem, e não fingem que
   * abrem.
   */
  function avaliar(p) {
    const alvo = p.querySelector('.prancha-alvo')
    const img = alvo.querySelector('img')
    const largura = alvo.getBoundingClientRect().width
    if (!img.naturalWidth || !largura) return

    alvo.style.setProperty('--nat', img.naturalWidth + 'px')
    const vale = img.naturalWidth >= largura * 1.5
    p.classList.toggle('prancha--fixa', !vale)

    if (vale) {
      alvo.dataset.convite = 'ver maior'
    } else {
      // Sem href a prancha deixa de ser link: sem cursor de mão, sem clique
      // morto, sem anúncio de uma coisa que não acontece.
      delete alvo.dataset.convite
      alvo.removeAttribute('href')
    }
  }

  pranchas.forEach((p) => {
    const alvo = p.querySelector('.prancha-alvo')
    if (!alvo) return
    const img = alvo.querySelector('img')

    if (img.complete && img.naturalWidth) avaliar(p)
    else img.addEventListener('load', () => avaliar(p), { once: true })

    alvo.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      if (p.classList.contains('prancha--fixa')) return
      e.preventDefault()
      abrir(p)
    })
  })

  // Redimensionar muda a largura exibida, e com ela a conta.
  addEventListener('resize', () => pranchas.forEach(avaliar))

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aberta) fechar()
  })

  /* ======================================================================
     4 · A BARRA DO PROTÓTIPO (some na implementação real)
     ====================================================================== */

  const barra = document.querySelector('.proto-barra')
  if (!barra) return

  const url = (chave, valor) => {
    const p = new URLSearchParams(location.search)
    p.set(chave, valor)
    history.replaceState(null, '', '?' + p)
  }

  barra.querySelectorAll('[data-entrada]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.entrada === variante))
    b.addEventListener('click', () => {
      variante = b.dataset.entrada
      url('entrada', variante)
      barra.querySelectorAll('[data-entrada]').forEach((o) =>
        o.setAttribute('aria-pressed', String(o.dataset.entrada === variante)))
      montarVeu()
    })
  })

  barra.querySelectorAll('[data-mov-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.movBtn === intensidade))
    b.addEventListener('click', () => {
      intensidade = b.dataset.movBtn
      url('mov', intensidade)
      barra.querySelectorAll('[data-mov-btn]').forEach((o) =>
        o.setAttribute('aria-pressed', String(o.dataset.movBtn === intensidade)))
      aplicarIntensidade()
    })
  })

  barra.querySelectorAll('[data-abrir-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.abrirBtn === forca))
    b.addEventListener('click', () => {
      forca = b.dataset.abrirBtn
      raiz.dataset.abrir = forca
      url('abrir', forca)
      barra.querySelectorAll('[data-abrir-btn]').forEach((o) =>
        o.setAttribute('aria-pressed', String(o.dataset.abrirBtn === forca)))
    })
  })

  const rever = barra.querySelector('[data-rever]')
  if (rever) rever.addEventListener('click', montarVeu)
})()
