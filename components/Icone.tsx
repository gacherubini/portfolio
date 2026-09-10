import type { ReactNode } from 'react'

/**
 * Os doze ícones do site, desenhados à mão em monolinha.
 *
 * SVG inline e `currentColor` em tudo: uma biblioteca inteira para doze
 * formas pequenas pesaria mais que o site todo de tipografia. Traço de 1,6
 * e cantos redondos. As formas vieram do comparador descartável
 * (`app/[lang]/v3/icones.tsx`) sem mudar um ponto.
 *
 * `aria-hidden` sem exceção. Nenhum destes carrega informação que o texto ao
 * lado já não diga — quando o ícone estiver sozinho, quem nomeia é o rótulo
 * visível ou o link em volta.
 *
 * A regra que decide se um ícone entra: ele tem de nomear alguma coisa que
 * já está escrita no conteúdo. Nenhum entra por ser bonito.
 */
export type NomeDeIcone =
  | 'terminal' | 'servidor' | 'banco' | 'git' | 'nuvem' | 'chaves'
  | 'github' | 'linkedin' | 'email' | 'monitor' | 'pino' | 'docker'

const TRACO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const FORMAS: Record<NomeDeIcone, ReactNode> = {
  terminal: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" {...TRACO} />
      <polyline points="7,9.5 10.5,12 7,14.5" {...TRACO} />
      <line x1="12.5" y1="15" x2="17" y2="15" {...TRACO} />
    </>
  ),
  servidor: (
    <>
      <rect x="3" y="4" width="18" height="6.5" rx="1.8" {...TRACO} />
      <rect x="3" y="13.5" width="18" height="6.5" rx="1.8" {...TRACO} />
      <line x1="6.5" y1="7.25" x2="6.6" y2="7.25" {...TRACO} strokeWidth={2.4} />
      <line x1="6.5" y1="16.75" x2="6.6" y2="16.75" {...TRACO} strokeWidth={2.4} />
    </>
  ),
  banco: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" {...TRACO} />
      <path d="M4.5 5.5v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" {...TRACO} />
      <path d="M4.5 11.5v7c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-7" {...TRACO} />
    </>
  ),
  git: (
    <>
      <circle cx="6.5" cy="5.5" r="2.5" {...TRACO} />
      <circle cx="6.5" cy="18.5" r="2.5" {...TRACO} />
      <circle cx="17.5" cy="9.5" r="2.5" {...TRACO} />
      <line x1="6.5" y1="8" x2="6.5" y2="16" {...TRACO} />
      <path d="M15 11.2a6 6 0 0 1-8.5 5.2" {...TRACO} />
    </>
  ),
  nuvem: (
    <path
      d="M7 18.5h10.2a3.8 3.8 0 0 0 .5-7.56A5.6 5.6 0 0 0 7.3 9.6 4.45 4.45 0 0 0 7 18.5Z"
      {...TRACO}
    />
  ),
  chaves: (
    <>
      <path d="M9.5 4.5C7.8 4.5 7.5 5.6 7.5 7v2.4c0 1.3-.9 2.1-2 2.6 1.1.5 2 1.3 2 2.6V17c0 1.4.3 2.5 2 2.5" {...TRACO} />
      <path d="M14.5 4.5c1.7 0 2 1.1 2 2.5v2.4c0 1.3.9 2.1 2 2.6-1.1.5-2 1.3-2 2.6V17c0 1.4-.3 2.5-2 2.5" {...TRACO} />
    </>
  ),
  /* Só os contêineres, sem a baleia. A 18px o casco vira borrão e come os
     quadrados junto; empilhados sobre a linha d'água eles ainda leem, e quem
     nomeia é o rótulo ao lado. */
  docker: (
    <>
      <rect x="3.2" y="11" width="4" height="4" {...TRACO} />
      <rect x="8.4" y="11" width="4" height="4" {...TRACO} />
      <rect x="13.6" y="11" width="4" height="4" {...TRACO} />
      <rect x="8.4" y="6" width="4" height="4" {...TRACO} />
      <line x1="2" y1="18.4" x2="22" y2="18.4" {...TRACO} />
    </>
  ),
  github: (
    <path
      d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.47.09.64-.2.64-.45v-1.6c-2.64.58-3.2-1.27-3.2-1.27-.43-1.1-1.05-1.4-1.05-1.4-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.85 1.45 2.23 1.03 2.77.79.09-.62.33-1.03.6-1.27-2.1-.24-4.32-1.05-4.32-4.68 0-1.03.37-1.88.97-2.54-.1-.24-.42-1.2.09-2.51 0 0 .8-.25 2.6.97a9.06 9.06 0 0 1 4.74 0c1.8-1.22 2.6-.97 2.6-.97.51 1.3.19 2.27.09 2.51.6.66.97 1.51.97 2.54 0 3.64-2.22 4.44-4.34 4.67.34.3.65.87.65 1.76v2.6c0 .26.17.55.65.45A9.5 9.5 0 0 0 12 2.5Z"
      fill="currentColor"
    />
  ),
  linkedin: (
    <>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="3" {...TRACO} />
      <line x1="7.4" y1="10.5" x2="7.4" y2="16.6" {...TRACO} />
      <line x1="7.4" y1="7.4" x2="7.4" y2="7.5" {...TRACO} strokeWidth={2.4} />
      <path d="M11.3 16.6v-3.4a2.2 2.2 0 0 1 4.4 0v3.4" {...TRACO} />
      <line x1="11.3" y1="10.5" x2="11.3" y2="16.6" {...TRACO} />
    </>
  ),
  email: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.4" {...TRACO} />
      <polyline points="3.4,6.6 12,13 20.6,6.6" {...TRACO} />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2.2" {...TRACO} />
      <line x1="8.5" y1="20" x2="15.5" y2="20" {...TRACO} />
      <line x1="12" y1="16.5" x2="12" y2="20" {...TRACO} />
    </>
  ),
  pino: (
    <>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" {...TRACO} />
      <circle cx="12" cy="10.2" r="2.6" {...TRACO} />
    </>
  ),
}

export function Icone({ nome, tamanho = 18 }: { nome: NomeDeIcone; tamanho?: number }) {
  return (
    <svg
      className="icone"
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      aria-hidden="true"
      focusable="false"
    >
      {FORMAS[nome]}
    </svg>
  )
}
