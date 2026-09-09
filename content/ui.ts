import type { Idioma, Situacao, Texto } from '@/content/tipos'

export const ui = {
  // A ordem aqui é a ordem da home: sobre, experiência, projetos, contato.
  nav: {
    sobre: { pt: 'Sobre', en: 'About' },
    experiencia: { pt: 'Experiência', en: 'Experience' },
    projetos: { pt: 'Projetos', en: 'Projects' },
    contato: { pt: 'Contato', en: 'Contact' },
  },
  abertura: {
    titulo: { pt: 'Os sistemas que eu construí.', en: 'The systems I built.' },
    apoio: {
      pt: 'Cada um com print, explicação em português comum e, quando o sistema é público, link para entrar e clicar.',
      en: 'Each one with screenshots, an explanation in plain language and, when the system is public, a link to go in and click around.',
    },
  },
  situacao: {
    'no-ar': { pt: 'no ar', en: 'live' },
    fechado: { pt: 'fechado', en: 'private' },
    publicado: { pt: 'publicado', en: 'published' },
    'em-construcao': { pt: 'em construção', en: 'in progress' },
  } satisfies Record<Situacao, Texto>,
  verOProjeto: { pt: 'Ver o projeto', en: 'See the project' },
  voltar: { pt: '← Todos os projetos', en: '← All projects' },
  sobreTitulo: { pt: 'Sobre', en: 'About' },
  experienciaTitulo: { pt: 'Experiência', en: 'Experience' },
  projetosTitulo: { pt: 'Projetos', en: 'Projects' },
  projetosApoio: {
    pt: 'Quatro sistemas construídos fora do expediente, cada um inteiro e sozinho.',
    en: 'Four systems built outside work hours, each one end to end and alone.',
  },
  avisoTecnico: {
    pt: 'Esta parte é pra quem é da área. Se não for o seu caso, pode pular — acabou aqui.',
    en: "This part is for the technical crowd. If that's not you, feel free to stop here.",
  },
  prosa: {
    problema: { pt: 'O problema', en: 'The problem' },
    oQueFaz: { pt: 'O que o sistema faz', en: 'What the system does' },
  },
  rodape: {
    lugar: { pt: 'Gabriel Cherubini · Porto Alegre · GMT−3', en: 'Gabriel Cherubini · Porto Alegre, Brazil · GMT−3' },
    dominio: { pt: 'gacherubini.dev', en: 'gacherubini.dev' },
  },
} as const

export const OUTRO_IDIOMA: Record<Idioma, Idioma> = { pt: 'en', en: 'pt' }
