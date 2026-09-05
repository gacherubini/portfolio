import type { Projeto } from '@/content/tipos'

export const bddente: Projeto = {
  slug: 'bddente',
  nome: 'BDDente',
  paraQuem: { pt: 'Consultório odontológico' },
  situacao: 'no-ar',

  // Amostrada do item ativo do menu lateral em 01-agenda-semana.png.
  // fundo2 é um roxo vizinho mais escuro: roxo cheio numa página inteira cansa.
  tema: {
    fundo: '#5A21B4',
    texto: '#F4EEFC',
    borda: '#7E4EC0',
    destaque: '#D9C4F5',
    ctaFundo: '#FFFFFF',
    ctaTexto: '#4A1A8C',
    calmo: '#CBBCE8',
    fundo2: '#451890',
  },

  ficha: [
    { rotulo: { pt: 'Para quem' }, valor: { pt: 'Consultório odontológico' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'No ar, com uma clínica real usando' } },
    { rotulo: { pt: 'Substituiu' }, valor: { pt: 'Dentalis, em FoxPro, de 1996 a 2024' } },
  ],

  resumoHome: {
    pt: 'Substituiu um FoxPro que rodou no consultório de 1996 a 2024. Trinta anos de prontuário entraram junto — migração, LGPD e backup foram escopo do primeiro dia, não fase dois.',
  },

  chamada: {
    pt: 'Trinta anos de prontuário saíram de um sistema de 1996 — e o novo se recusa a mandar mensagem para quem nunca foi perguntado.',
  },

  problema: [
    {
      pt: 'O consultório da Dra. Kátia rodou num sistema em FoxPro de 1996 a 2024. Ele parou de ser usável, e junto com ele ficaram presos o cadastro de 5.559 pacientes e 44.812 lançamentos clínicos — o que cada um tinha, o que foi feito, quando e por quanto.',
    },
    {
      pt: 'Trocar de sistema aqui não é começar do zero: é levar trinta anos de prontuário para o outro lado sem perder e sem inventar nada. Por isso migração, LGPD e backup foram escopo do primeiro dia, não fase 2 — o sistema entrou em uso real já com prontuário de gente dentro, e não existe "depois a gente arruma" nesse caso.',
    },
  ],

  oQueFaz: [
    {
      pt: 'É o consultório inteiro numa tela só: prontuário, agenda e dinheiro. O odontograma desenha a arcada completa e guarda, dente por dente e face por face, o que está planejado, o que já foi feito e o que já estava lá antes de a Dra. Kátia assumir.',
    },
    {
      pt: 'A agenda marca e atende por semana ou por mês. O financeiro separa duas coisas que costumam ser confundidas — o que foi produzido no mês e o dinheiro que de fato entrou. Anamnese, prontuário em PDF, backup com restauração testada.',
    },
  ],

  destaque: {
    titulo: { pt: 'Quem pode receber mensagem — e quem nunca foi perguntado' },
    texto: [
      {
        pt: 'A agenda diz, consulta por consulta, quem está autorizado a receber o lembrete de véspera. São três respostas, não duas: tem permissão, não tem, e — a que importa — *nunca foi perguntado*. Os 5.559 pacientes que vieram do sistema antigo entraram assim, porque o FoxPro nunca perguntou, e presumir autorização de 5.559 pessoas é exatamente o que a lei não permite. O botão "perguntar" é como isso vira sim ou não, uma pessoa por vez, com ela na cadeira.',
      },
      {
        pt: 'O envio em si está construído e desligado. A tarja no alto da tela é o próprio sistema avisando que ninguém está sendo lembrado da consulta hoje: a chave nasce fechada e só abre quando a clínica conectar o WhatsApp. Um sistema que herda 5.559 cadastros e escolhe não mandar nada para nenhum deles até perguntar.',
      },
    ],
    prints: [
      {
        arquivo: '01-agenda-semana.png',
        largura: 3200,
        altura: 2000,
        alt: {
          pt: 'Agenda da semana em grade por hora, com uma tarja amarela no topo avisando que os lembretes de WhatsApp estão desligados e ninguém está sendo avisado da consulta. Nos cartões de consulta aparecem os três estados: alguns só com nome, horário e telefone, um marcado «sem lembrete» por não ter telefone, e outros marcados «sem permissão de WhatsApp» com um botão «perguntar».',
        },
        legenda: {
          pt: 'A agenda da semana. A tarja no topo é o sistema admitindo que o lembrete está desligado; nos cartões, "sem lembrete" é paciente sem telefone cadastrado, e "sem permissão de WhatsApp · perguntar" é paciente que ainda não foi perguntado. Consulta cancelada aparece riscada.',
        },
      },
    ],
  },

  // Diferente da Revy: estes quatro saem do README do projeto, não de seed
  // inventado, então entram como fato. O levantamento ainda lista "confirmar
  // se 914 e 44.812 podem virar vitrine" — se o dono disser que não, o
  // conserto é o mesmo da Revy: `numeros: []` e a régua some sozinha.
  numeros: [
    { valor: '~30', rotulo: { pt: 'anos de histórico migrados' } },
    { valor: '5.559', rotulo: { pt: 'pacientes no cadastro histórico' } },
    { valor: '44.812', rotulo: { pt: 'lançamentos clínicos migrados' } },
    { valor: '914', rotulo: { pt: 'testes passando' } },
  ],

  galeria: [
    {
      titulo: { pt: 'As outras telas' },
      prints: [
        {
          arquivo: '02-odontograma.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Odontograma: as duas arcadas completas em numeração FDI, com dentes contornados em vermelho (planejado), verde (realizado) e azul (já existente), o painel de lançamento aberto à direita com categoria, faces da coroa e situação, e o histórico de atendimentos por data logo abaixo.',
          },
          legenda: {
            pt: 'O odontograma. Vermelho é planejado, verde é realizado, azul é o que já estava lá.',
          },
        },
        {
          arquivo: '03-pacientes.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Lista de pacientes com idade, telefone, data do último atendimento, convênio, quantos tratamentos pendentes e quanto há a fazer em reais, com filtros por ativos, com pendência e com tratamento a fazer.',
          },
          legenda: {
            pt: 'A lista de pacientes, com quem tem tratamento pendente separado de quem não tem.',
          },
        },
        {
          arquivo: '05-financeiro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Financeiro do mês com quatro cartões — recebido, produzido, a receber e tratamentos realizados — e o gráfico de barras do dinheiro recebido mês a mês no ano.',
          },
          legenda: {
            pt: 'Financeiro: recebido e produzido raramente batem no mesmo mês, e a tela diz isso em vez de esconder.',
          },
        },
      ],
    },
  ],

  // Sistema fechado. O componente mostra o motivo no lugar dos botões.
  links: [],
  semLink: {
    curto: { pt: 'Sistema fechado — prontuário de clínica real.' },
    titulo: { pt: 'Sistema fechado' },
    texto: {
      pt: 'Aqui dentro tem prontuário de gente de verdade. Não existe demonstração aberta nem tela de entrada pública — o que dá para ver do sistema são os prints desta página, feitos com pacientes inventados.',
    },
  },

  tecnico: {
    stack: ['Python', 'FastAPI', 'SQLAlchemy 2', 'Alembic', 'PostgreSQL 16', 'argon2', 'Fly.io'],
    notas: [
      {
        titulo: { pt: 'Consentimento com três estados' },
        texto: [
          {
            pt: 'O campo `aceita_whatsapp` aceita `NULL`, e `NULL` não é "não": é nunca perguntamos. Os 5.559 pacientes migrados entraram assim, e nenhum recebe mensagem nesse estado. Foi a decisão mais difícil de implementar e a mais fácil de explicar para a clínica.',
          },
        ],
      },
      {
        titulo: { pt: 'Idempotência no banco, não num `if`' },
        texto: [
          {
            pt: 'Um `UniqueConstraint(agendamento_id, tipo)` na tabela `lembrete`: a segunda linha é recusada pelo banco. Vale se o cron disparar duas vezes, se houver duas máquinas no ar durante um deploy, e se alguém clicar em "enviar agora" enquanto o cron roda.',
          },
        ],
      },
      {
        titulo: { pt: 'Dado suspeito é marcado, nunca corrigido no chute' },
        texto: [
          {
            pt: 'Trinta anos de FoxPro produzem registro ambíguo. Em vez de adivinhar, o paciente e o lançamento carregam `revisar_motivo` e ficam sinalizados. Toda escrita ainda deixa linha em `auditoria`, com o antes e o depois — é exigência de LGPD e a única forma de responder quem mudou o prontuário e quando.',
          },
        ],
      },
    ],
  },
}
