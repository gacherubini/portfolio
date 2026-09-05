import type { Projeto } from '@/content/tipos'

export const revy: Projeto = {
  slug: 'revy',
  nome: 'Revy',
  paraQuem: { pt: 'Revenda de veículos' },
  situacao: 'no-ar',

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
    { rotulo: { pt: 'Para quem' }, valor: { pt: 'Revenda de veículos' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'No ar, com loja real usando' } },
    { rotulo: { pt: 'Tamanho' }, valor: { pt: '7 produtos, bancos separados' } },
  ],

  resumoHome: {
    pt: 'Quem responde o cliente no WhatsApp é o sistema. Ele puxa a moto do estoque, responde preço e condição, e passa para uma pessoa quando o assunto sai do roteiro.',
  },

  chamada: {
    pt: 'Quem responde o cliente no WhatsApp é o sistema — e o dono da loja vê exatamente o que ele respondeu.',
  },

  problema: [
    {
      pt: 'Numa revenda de motos, a venda começa no WhatsApp e quase sempre passa por financiamento. Alguém da loja responde a mesma pergunta de preço trinta vezes por dia, e depois abre o site de cada banco, um por um, para simular a parcela.',
    },
    {
      pt: 'Enquanto isso o estoque vive numa planilha, o anúncio vive noutro lugar, e ninguém sabe qual campanha trouxe qual cliente.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Junta o conjunto do que a loja precisa para vender moto financiada: o atendimento no WhatsApp, o estoque com preço e situação, a simulação de financiamento nos bancos, a vitrine pública e o resultado do mês.',
    },
    {
      pt: 'Do primeiro "oi" até a venda fechada no relatório, sem sair do sistema e sem planilha no meio.',
    },
  ],

  destaque: {
    titulo: { pt: 'O agente de atendimento no WhatsApp' },
    texto: [
      {
        pt: 'Ele puxa a moto do estoque, responde preço e condição, e passa para uma pessoa quando o assunto sai do roteiro. O valor não é ter um robô: é o dono da loja ver quanto o robô resolveu sozinho, e a passagem para uma pessoa ser explícita em vez de o cliente ficar preso falando com uma máquina.',
      },
    ],
    prints: [
      {
        arquivo: '02-agente-whatsapp.png',
        largura: 1896,
        altura: 932,
        alt: {
          pt: 'Aba Agente: 96 atendimentos no mês, 72 resolvidos só com o agente, 24 transferidos, e o gráfico por dia.',
        },
        legenda: {
          pt: 'A aba Agente: 96 conversas no mês, 72 fechadas sem ninguém, 24 passadas para uma pessoa.',
        },
      },
      {
        arquivo: '04-conversa-agente.jpg',
        largura: 1568,
        altura: 772,
        alt: {
          pt: 'Uma conversa: o diálogo do agente com o cliente, mensagem a mensagem.',
        },
        legenda: {
          pt: 'A conversa por dentro, com a resposta do agente ao lado da do cliente.',
        },
      },
    ],
  },

  // SLOT. Os do comp ("96", "75%", "7") saem do seed-revy-demo.py e são
  // inventados; o levantamento proíbe que virem número de vitrine. Quando o
  // dono confirmar os reais, entram 3 ou 4 aqui e a régua reaparece sozinha.
  // Candidatos que já são fato e não dependem de confirmação: "7" produtos que
  // só conversam por HTTP, "4" bancos no motor de simulação.
  numeros: [],

  galeria: [
    {
      titulo: { pt: 'As outras telas' },
      prints: [
        {
          arquivo: '01-visao-geral.png',
          largura: 1897,
          altura: 938,
          alt: { pt: 'Painel do lojista com os indicadores de estoque e de tráfego.' },
          legenda: { pt: 'O painel do lojista.' },
        },
        {
          arquivo: '05-estoque.jpg',
          largura: 1568,
          altura: 772,
          alt: { pt: 'Estoque de motos com preço e situação de cada uma.' },
          legenda: { pt: 'Estoque: preço, custo e situação.' },
        },
        {
          arquivo: '06-resultado.jpg',
          largura: 1568,
          altura: 726,
          alt: { pt: 'Vendas confirmadas, receita e margem do mês.' },
          legenda: { pt: 'Resultado do mês.' },
        },
      ],
    },
  ],

  // O botão secundário do comp ("Ver o catálogo público") depende de uma URL
  // que ninguém confirmou. Link sem href é recusado pelo contrato, então ele
  // fica de fora até a URL existir.
  links: [
    { rotulo: { pt: 'Entrar no sistema' }, href: 'https://revyapp.com.br', primario: true },
  ],

  tecnico: {
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Playwright', 'Docker', 'Cloudflare Pages'],
    notas: [
      {
        titulo: { pt: 'Sete produtos, não um sistema' },
        texto: [
          {
            pt: 'O monorepo tem sete produtos que só conversam por HTTP. Nenhum importa Python do outro, e cada um tem banco e migrations próprios. É a decisão de engenharia mais forte do projeto, e é o que sustenta o resto: o chatbot cair não derruba o estoque.',
          },
        ],
      },
      {
        titulo: { pt: 'O motor de simulação dirige o site do banco' },
        texto: [
          {
            pt: 'Banco que não oferece API não deixa alternativa elegante. Em vez de fingir uma integração que não existe, o motor abre o site do banco no Playwright e preenche o formulário — Santander, Fontecred, Bradesco, Pan. É a solução feia que funciona, e vale contar como tal.',
          },
        ],
      },
    ],
  },
}
