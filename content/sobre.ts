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
      pt: 'Os sistemas aqui do lado são de fora do expediente. Construí cada um inteiro, sozinho, e coloquei no ar com gente usando.',
      en: 'The systems next to this were built outside work hours. I built each one end to end, alone, and put it in front of real users.',
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

  // Sem telefone: o número do currículo é pessoal, e currículo você manda para
  // quem escolhe. Site público, não.
  links: [
    { rotulo: 'GitHub', href: 'https://github.com/gacherubini' },
    { rotulo: 'LinkedIn', href: 'https://www.linkedin.com/in/gabrielabreuu' },
    { rotulo: 'E-mail', href: 'mailto:bielcheeeeee@gmail.com' },
  ],
}
