/**
 * O "Sobre" do site. Texto curto de propósito: quem chega aqui veio ver os
 * sistemas, não ler biografia.
 */
import type { Texto } from '@/content/tipos'
export type { Idioma, Texto } from '@/content/tipos'

export const sobre: {
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
  paragrafos: [
    {
      pt: 'Sou desenvolvedor backend. Java e Spring Boot no dia a dia, Go antes disso.',
      en: "I'm a backend developer. Java and Spring Boot day to day, Go before that.",
    },
    {
      // "desde 2023" saiu de propósito, a pedido do dono em 05/09: o tempo de
      // ofício não envelhece, a data de entrada envelhece sozinha todo ano.
      pt: 'Programo há mais de 5 anos. Moro em Porto Alegre e trabalho remoto para a Ambush, em Austin, no Texas. Comecei em Go e hoje trabalho no backend da Binance, em Java.',
      en: "I've been programming for more than 5 years. I live in Porto Alegre, Brazil, and work remotely for Ambush, in Austin, Texas. I started in Go and today I work on Binance's backend, in Java.",
    },
    {
      pt: 'Os quatro sistemas aqui de cima são de fora do expediente. Construí cada um inteiro, sozinho, e coloquei no ar com gente usando.',
      en: 'The four systems above were built outside work hours. I built each one end to end, alone, and put it in front of real users.',
    },
    {
      pt: 'IA é onde minha atenção está hoje, e não como quem usa chat. Construo por dentro: agentes que chamam funções do próprio produto, skills, loops de agente que tocam a tarefa inteira e param exatamente onde precisam de uma pessoa. O assistente do Office Timesheet e o agente de WhatsApp da Revy saíram daí. Este site também.',
      en: "AI is where my attention is right now, and not as someone who uses a chat window. I build the inside of it: agents that call functions in the product itself, skills, agent loops that carry a task all the way and stop exactly where a person is needed. The Office Timesheet assistant and Revy's WhatsApp agent came out of that. So did this site.",
    },
  ],

  ficha: [
    {
      rotulo: { pt: 'Onde', en: 'Where' },
      valor: { pt: 'Porto Alegre, Brasil · GMT−3', en: 'Porto Alegre, Brazil · GMT−3' },
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
      rotulo: { pt: 'IA', en: 'AI' },
      // "modelos" saiu: a coluna da ficha tem 285px e a linha quebrava em duas.
      valor: {
        pt: 'agent loops · skills · function calling',
        en: 'agent loops · skills · function calling',
      },
    },
    {
      rotulo: { pt: 'Inglês', en: 'English' },
      valor: { pt: 'Fluente', en: 'Fluent' },
    },
  ],

  // O telefone e o currículo entraram em 04/09, por decisão do dono, revertendo
  // a regra anterior ("número e currículo você manda para quem escolhe, site
  // público não"). O repositório é público e o histórico do git é permanente:
  // uma vez commitados, os dois ficam registrados mesmo se saírem do site.
  contato: {
    email: 'bielche2009@hotmail.com',
    telefone: {
      href: 'https://wa.me/5551980336365',
      exibicao: '(51) 98033-6365',
      via: { pt: 'chama no WhatsApp', en: 'message me on WhatsApp' },
    },
    // O arquivo entrou em public/ em 05/09/2026. `curriculoDisponivel()`
    // ainda checa: se ele sumir, o botão some junto, em vez de baixar 404.
    curriculo: {
      href: '/curriculo-gabriel-cherubini.pdf',
      rotulo: { pt: 'Baixar o currículo', en: 'Download my resume' },
    },
  },

  links: [
    { rotulo: 'GitHub', href: 'https://github.com/gacherubini' },
    { rotulo: 'LinkedIn', href: 'https://www.linkedin.com/in/gabrielabreuu' },
  ],
}
