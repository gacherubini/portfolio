import '@testing-library/jest-dom/vitest'

// jsdom não implementa nenhum dos quatro, e components/Movimento.tsx usa todos.
if (!window.matchMedia) {
  window.matchMedia = ((consulta: string) => ({
    matches: false,
    media: consulta,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    root = null
    rootMargin = ''
    thresholds: number[] = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  } as unknown as typeof window.IntersectionObserver
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {}
}

// `animate` fica de fora DE PROPÓSITO. Ausente, `virar()` cai no caminho sem
// animação e o teste exercita a mudança de estado, que é o que importa. A
// animação em si foi verificada por medição de quadro no navegador, não aqui.
