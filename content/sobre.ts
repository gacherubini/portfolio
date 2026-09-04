/**
 * O "Sobre" do site. Texto curto de propósito: quem chega aqui veio ver os
 * sistemas, não ler biografia.
 *
 * Os tipos abaixo migram para `content/tipos.ts` quando o site existir.
 */

export type Idioma = 'pt' | 'en'
export type Texto = Record<Idioma, string>

export const sobre: {
  titulo: Texto
  paragrafos: Texto[]
  ficha: { rotulo: Texto; valor: Texto }[]
  /** Os dois canais diretos, em tamanho de leitura no fim da home. */
  contato: {
    email: string
    telefone: { href: string; exibicao: string; via: Texto }
    curriculo: { href: string; rotulo: Texto }
  }
  /** Perfis, secundários ao lado do contato. */
  links: { rotulo: string; href: string }[]
} = {
  titulo: {
    pt: 'Sobre',
    en: 'About',
  },

  paragrafos: [
    {
      pt: 'Sou desenvolvedor backend. Java e Spring Boot no dia a dia, Go antes disso.',
      en: "I'm a backend developer. Java and Spring Boot day to day, Go before that.",
    },
    {
      pt: 'Moro em Porto Alegre e trabalho remoto para a Ambush, em Austin, no Texas, desde 2023. Comecei numa plataforma interna de RH escrita em Go. Hoje estou no backend da Binance: carteira, saldo, depósito e saque, dados de mercado e os fluxos de compliance.',
      en: "I live in Porto Alegre, Brazil, and I've worked remotely for Ambush, in Austin, Texas, since 2023. I started on an internal HR platform written in Go. Today I'm on Binance's backend: wallets, balances, deposits and withdrawals, market data, and the compliance flows.",
    },
    {
      pt: 'Tenho 23 anos e estou terminando a faculdade de Ciência da Computação na PUC-RS.',
      en: "I'm 23, and I'm finishing my Computer Science degree at PUC-RS.",
    },
    {
      // "aqui do lado" virou "aqui de cima" em 04/09: o Sobre deixou de ser
      // página e virou o último bloco da home, depois das quatro faixas.
      pt: 'Os quatro sistemas aqui de cima são de fora do expediente. Construí cada um inteiro, sozinho, e coloquei no ar com gente usando.',
      en: 'The four systems above were built outside work hours. I built each one end to end, alone, and put it in front of real users.',
    },
  ],

  ficha: [
    {
      rotulo: { pt: 'Onde', en: 'Where' },
      valor: { pt: 'Porto Alegre, Brasil · GMT-3', en: 'Porto Alegre, Brazil · GMT-3' },
    },
    {
      rotulo: { pt: 'Trabalho', en: 'Work' },
      valor: { pt: 'Backend na Ambush · Austin, Texas · remoto', en: 'Backend at Ambush · Austin, Texas · remote' },
    },
    {
      rotulo: { pt: 'Stack', en: 'Stack' },
      valor: { pt: 'Java · Spring Boot · Go · PostgreSQL', en: 'Java · Spring Boot · Go · PostgreSQL' },
    },
    {
      rotulo: { pt: 'Inglês', en: 'English' },
      valor: { pt: 'Fluente', en: 'Full professional' },
    },
  ],

  // O telefone e o currículo entraram em 04/09, por decisão do dono, revertendo
  // a regra anterior ("número e currículo você manda para quem escolhe, site
  // público não"). O repositório é público e o histórico do git é permanente:
  // uma vez commitados, os dois ficam registrados mesmo se saírem do site.
  contato: {
    email: 'bielcheeeeee@gmail.com',
    telefone: {
      href: 'https://wa.me/5551980336365',
      exibicao: '(51) 98033-6365',
      via: { pt: 'chama no WhatsApp', en: 'message me on WhatsApp' },
    },
    // O arquivo ainda não existe. Precisa ir para public/ antes do deploy.
    curriculo: {
      href: '/curriculo-gabriel-cherubini.pdf',
      rotulo: { pt: 'Baixar o currículo', en: 'Download my résumé' },
    },
  },

  links: [
    { rotulo: 'GitHub', href: 'https://github.com/gacherubini' },
    { rotulo: 'LinkedIn', href: 'https://www.linkedin.com/in/gabrielabreuu' },
  ],
}
