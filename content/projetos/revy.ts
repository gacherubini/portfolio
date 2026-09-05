import type { Projeto } from '@/content/tipos'

export const revy: Projeto = {
  slug: 'revy',
  nome: 'Revy',
  paraQuem: { pt: 'Revenda de veículos', en: 'Vehicle dealership' },
  situacao: 'no-ar',
  selo: { pt: 'IA · agente no WhatsApp', en: 'AI · WhatsApp agent' },

  // Cores amostradas do menu lateral e da barra do agente em
  // 02-agente-whatsapp.png, em 04/09/2026.
  tema: {
    fundo: '#111111',
    texto: '#EAF0EA',
    borda: '#2A322C',
    destaque: '#7FBFA3',
    ctaFundo: '#7FBFA3',
    ctaTexto: '#111111',
    calmo: '#9AA39D',
    fundo2: '#171917',
  },

  // "Desde" ficou de fora de propósito: ninguém confirmou a data, e o contrato
  // prefere a linha ausente a uma linha escrita "a confirmar".
  ficha: [
    {
      rotulo: { pt: 'Para quem', en: 'For whom' },
      valor: { pt: 'Revenda de veículos', en: 'Vehicle dealership' },
    },
    {
      rotulo: { pt: 'Situação', en: 'Status' },
      valor: { pt: 'No ar, com loja real usando', en: 'Live, used by a real store' },
    },
    {
      rotulo: { pt: 'Tamanho', en: 'Size' },
      valor: { pt: '7 produtos, bancos separados', en: '7 products, separate databases' },
    },
  ],

  resumoHome: {
    pt: 'Quem responde o cliente no WhatsApp é o sistema. Ele puxa a moto do estoque, responde preço e condição, e passa para uma pessoa quando o assunto sai do roteiro.',
    en: "The system is what answers the customer on WhatsApp. It pulls the bike from inventory, answers price and condition, and hands off to a person when the conversation strays from the script.",
  },

  chamada: {
    pt: 'Quem responde o cliente no WhatsApp é o sistema — e o dono da loja vê exatamente o que ele respondeu.',
    en: 'The system is what answers the customer on WhatsApp — and the store owner sees exactly what it said.',
  },

  problema: [
    {
      pt: 'Numa revenda de motos, a venda começa no WhatsApp e quase sempre passa por financiamento. Alguém da loja responde a mesma pergunta de preço trinta vezes por dia, e depois abre o site de cada banco, um por um, para simular a parcela.',
      en: "At a motorcycle dealership, the sale starts on WhatsApp and almost always goes through financing. Someone at the store answers the same price question thirty times a day, then opens each bank's website, one by one, to simulate the installment.",
    },
    {
      pt: 'Enquanto isso o estoque vive numa planilha, o anúncio vive noutro lugar, e ninguém sabe qual campanha trouxe qual cliente.',
      en: 'Meanwhile the inventory lives in a spreadsheet, the listing lives somewhere else, and nobody knows which campaign brought which customer.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Junta o conjunto do que a loja precisa para vender moto financiada: o atendimento no WhatsApp, o estoque com preço e situação, a simulação de financiamento nos bancos, a vitrine pública e o resultado do mês.',
      en: "Brings together everything the store needs to sell a financed bike: the WhatsApp service, the inventory with price and status, the bank financing simulation, the public showcase, and the month's results.",
    },
    {
      pt: 'Do primeiro "oi" até a venda fechada no relatório, sem sair do sistema e sem planilha no meio.',
      en: 'From the first "hi" to the closed sale on the report, without leaving the system and without a spreadsheet in between.',
    },
  ],

  destaque: {
    titulo: { pt: 'O agente de atendimento no WhatsApp', en: 'The WhatsApp service agent' },
    texto: [
      {
        pt: 'Ele puxa a moto do estoque, responde preço e condição, e passa para uma pessoa quando o assunto sai do roteiro. O valor não é ter um robô: é o dono da loja ver quanto o robô resolveu sozinho, e a passagem para uma pessoa ser explícita em vez de o cliente ficar preso falando com uma máquina.',
        en: "It pulls the bike from inventory, answers price and condition, and hands off to a person when the conversation strays from the script. The value isn't having a bot: it's the store owner seeing how much the bot handled on its own, and the handoff to a person being explicit instead of leaving the customer stuck talking to a machine.",
      },
    ],
    prints: [
      {
        arquivo: '02-agente-whatsapp.png',
        largura: 1896,
        altura: 932,
        alt: {
          pt: 'Aba Agente: 96 atendimentos no mês, 72 resolvidos só com o agente, 24 transferidos, e o gráfico por dia.',
          en: 'Agent tab: 96 conversations in the month, 72 resolved by the agent alone, 24 transferred, and the daily chart.',
        },
        legenda: {
          pt: 'A aba Agente: 96 conversas no mês, 72 fechadas sem ninguém, 24 passadas para uma pessoa.',
          en: 'The Agent tab: 96 conversations in the month, 72 closed with no one involved, 24 handed off to a person.',
        },
      },
      {
        arquivo: '04-conversa-agente.jpg',
        largura: 1568,
        altura: 772,
        alt: {
          pt: 'Uma conversa: o diálogo do agente com o cliente, mensagem a mensagem.',
          en: "A conversation: the agent's dialogue with the customer, message by message.",
        },
        legenda: {
          pt: 'A conversa por dentro, com a resposta do agente ao lado da do cliente.',
          en: "The conversation from the inside, with the agent's reply next to the customer's.",
        },
      },
    ],
  },

  // Confirmados pelo dono em 05/09/2026, da loja real que usa o sistema.
  // Substituem o slot que existia desde 04/09; os do seed continuam proibidos.
  numeros: [
    {
      valor: { pt: '120', en: '120' },
      rotulo: { pt: 'pessoas atendidas por dia no WhatsApp', en: 'people served per day on WhatsApp' },
    },
    {
      valor: { pt: '~80%', en: '~80%' },
      rotulo: {
        pt: 'das conversas o agente resolve sozinho',
        en: 'of conversations the agent handles on its own',
      },
    },
    {
      valor: { pt: '75', en: '75' },
      rotulo: { pt: 'motos no estoque da loja', en: "bikes in the store's inventory" },
    },
  ],

  galeria: [
    {
      titulo: { pt: 'As outras telas', en: 'The other screens' },
      prints: [
        {
          arquivo: '01-visao-geral.png',
          largura: 1897,
          altura: 938,
          alt: {
            pt: 'Painel do lojista com os indicadores de estoque e de tráfego.',
            en: "The store owner's dashboard with inventory and traffic metrics.",
          },
          legenda: { pt: 'O painel do lojista.', en: "The store owner's dashboard." },
        },
        {
          arquivo: '05-estoque.jpg',
          largura: 1568,
          altura: 772,
          alt: {
            pt: 'Estoque de motos com preço e situação de cada uma.',
            en: 'Motorcycle inventory with the price and status of each one.',
          },
          legenda: { pt: 'Estoque: preço, custo e situação.', en: 'Inventory: price, cost, and status.' },
        },
        {
          arquivo: '06-resultado.jpg',
          largura: 1568,
          altura: 726,
          alt: {
            pt: 'Vendas confirmadas, receita e margem do mês.',
            en: "Confirmed sales, revenue, and margin for the month.",
          },
          legenda: { pt: 'Resultado do mês.', en: "The month's results." },
        },
      ],
    },
  ],

  // O botão secundário do comp ("Ver o catálogo público") depende de uma URL
  // que ninguém confirmou. Link sem href é recusado pelo contrato, então ele
  // fica de fora até a URL existir.
  links: [
    {
      rotulo: { pt: 'Entrar no sistema', en: 'Log into the system' },
      href: 'https://revyapp.com.br',
      primario: true,
    },
  ],

  tecnico: {
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Playwright', 'Docker', 'Cloudflare Pages'],
    notas: [
      {
        titulo: { pt: 'Sete produtos, não um sistema', en: 'Seven products, not one system' },
        texto: [
          {
            pt: 'O monorepo tem sete produtos que só conversam por HTTP. Nenhum importa Python do outro, e cada um tem banco e migrations próprios. É a decisão de engenharia mais forte do projeto, e é o que sustenta o resto: o chatbot cair não derruba o estoque.',
            en: "The monorepo has seven products that only talk to each other over HTTP. None imports Python from another, and each has its own database and migrations. It's the strongest engineering decision in the project, and it's what holds up the rest: the chatbot going down doesn't take inventory with it.",
          },
        ],
      },
      {
        titulo: {
          pt: 'O motor de simulação dirige o site do banco',
          en: "The simulation engine drives the bank's website",
        },
        texto: [
          {
            pt: 'Banco que não oferece API não deixa alternativa elegante. Em vez de fingir uma integração que não existe, o motor abre o site do banco no Playwright e preenche o formulário — Santander, Fontecred, Bradesco, Pan. É a solução feia que funciona, e vale contar como tal.',
            en: "A bank that doesn't offer an API leaves no elegant alternative. Instead of pretending an integration exists when it doesn't, the engine opens the bank's website in Playwright and fills out the form — Santander, Fontecred, Bradesco, Pan. It's the ugly solution that works, and it's worth telling it like that.",
          },
        ],
      },
    ],
  },
}
