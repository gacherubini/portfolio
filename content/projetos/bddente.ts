import type { Projeto } from '@/content/tipos'

export const bddente: Projeto = {
  slug: 'bddente',
  nome: 'BDDente',
  paraQuem: { pt: 'Consultório odontológico', en: 'Dental practice' },
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
    {
      rotulo: { pt: 'Para quem', en: 'For whom' },
      valor: { pt: 'Consultório odontológico', en: 'Dental practice' },
    },
    {
      rotulo: { pt: 'Situação', en: 'Status' },
      valor: { pt: 'No ar, com uma clínica real usando', en: 'Live, in use by a real practice' },
    },
    {
      rotulo: { pt: 'Substituiu', en: 'Replaced' },
      valor: { pt: 'Dentalis, em FoxPro, de 1996 a 2024', en: 'Dentalis, in FoxPro, from 1996 to 2024' },
    },
  ],

  resumoHome: {
    pt: 'Substituiu um FoxPro que rodou no consultório de 1996 a 2024. Trinta anos de prontuário entraram junto — migração, LGPD e backup foram escopo do primeiro dia, não fase dois.',
    en: 'Replaced a FoxPro system that ran at the practice from 1996 to 2024. Thirty years of patient records came with it — migration, LGPD compliance, and backup were day-one scope, not phase two.',
  },

  chamada: {
    pt: 'Trinta anos de prontuário saíram de um sistema de 1996 — e o novo se recusa a mandar mensagem para quem nunca foi perguntado.',
    en: 'Thirty years of patient records came out of a system from 1996 — and the new one refuses to message anyone who was never asked.',
  },

  problema: [
    {
      pt: 'O consultório da Dra. Kátia rodou num sistema em FoxPro de 1996 a 2024. Ele parou de ser usável, e junto com ele ficaram presos o cadastro de 5.559 pacientes e 44.812 lançamentos clínicos — o que cada um tinha, o que foi feito, quando e por quanto.',
      en: "Dr. Kátia's practice ran on a FoxPro system from 1996 to 2024. It stopped being usable, and trapped inside it were the records of 5.559 patients and 44.812 clinical entries — what each one had, what was done, when, and for how much.",
    },
    {
      pt: 'Trocar de sistema aqui não é começar do zero: é levar trinta anos de prontuário para o outro lado sem perder e sem inventar nada. Por isso migração, LGPD e backup foram escopo do primeiro dia, não fase 2 — o sistema entrou em uso real já com prontuário de gente dentro, e não existe "depois a gente arruma" nesse caso.',
      en: "Switching systems here isn't starting from zero: it's carrying thirty years of patient records across without losing or inventing anything. That's why migration, LGPD compliance, and backup were day-one scope, not phase 2 — the system went into real use already holding people's records, and there's no \"we'll fix it later\" in this case.",
    },
  ],

  oQueFaz: [
    {
      pt: 'É o consultório inteiro numa tela só: prontuário, agenda e dinheiro. O odontograma desenha a arcada completa e guarda, dente por dente e face por face, o que está planejado, o que já foi feito e o que já estava lá antes de a Dra. Kátia assumir.',
      en: "It's the whole practice on one screen: patient records, scheduling, and money. The odontogram draws the full arch and tracks, tooth by tooth and surface by surface, what's planned, what's already been done, and what was already there before Dr. Kátia took over.",
    },
    {
      pt: 'A agenda marca e atende por semana ou por mês. O financeiro separa duas coisas que costumam ser confundidas — o que foi produzido no mês e o dinheiro que de fato entrou. Anamnese, prontuário em PDF, backup com restauração testada.',
      en: 'The schedule books and handles appointments by week or by month. The finance view separates two things that tend to get mixed up — what was produced in the month and the money that actually came in. Medical history intake, patient records as PDF, backup with tested restore.',
    },
  ],

  destaque: {
    titulo: {
      pt: 'Quem pode receber mensagem — e quem nunca foi perguntado',
      en: 'Who can be messaged — and who was never asked',
    },
    texto: [
      {
        pt: 'A agenda diz, consulta por consulta, quem está autorizado a receber o lembrete de véspera. São três respostas, não duas: tem permissão, não tem, e — a que importa — *nunca foi perguntado*. Os 5.559 pacientes que vieram do sistema antigo entraram assim, porque o FoxPro nunca perguntou, e presumir autorização de 5.559 pessoas é exatamente o que a lei não permite. O botão "perguntar" é como isso vira sim ou não, uma pessoa por vez, com ela na cadeira.',
        en: "The schedule tells you, appointment by appointment, who is authorized to get the day-before reminder. There are three answers, not two: has consent, doesn't, and — the one that matters — *was never asked*. The 5.559 patients who came from the old system arrived this way, because FoxPro never asked, and assuming consent for 5.559 people is exactly what the law doesn't allow. The \"ask\" button is how that turns into a yes or a no, one person at a time, with them in the chair.",
      },
      {
        pt: 'O envio em si está construído e desligado. A tarja no alto da tela é o próprio sistema avisando que ninguém está sendo lembrado da consulta hoje: a chave nasce fechada e só abre quando a clínica conectar o WhatsApp. Um sistema que herda 5.559 cadastros e escolhe não mandar nada para nenhum deles até perguntar.',
        en: 'Sending itself is built and switched off. The banner at the top of the screen is the system itself admitting that no one is being reminded about their appointment today: the switch is born closed and only opens once the practice connects WhatsApp. A system that inherits 5.559 records and chooses to send nothing to any of them until it asks.',
      },
    ],
    prints: [
      {
        arquivo: '01-agenda-semana.png',
        largura: 3200,
        altura: 2000,
        alt: {
          pt: 'Agenda da semana em grade por hora, com uma tarja amarela no topo avisando que os lembretes de WhatsApp estão desligados e ninguém está sendo avisado da consulta. Nos cartões de consulta aparecem os três estados: alguns só com nome, horário e telefone, um marcado «sem lembrete» por não ter telefone, e outros marcados «sem permissão de WhatsApp» com um botão «perguntar».',
          en: 'Week view of the schedule in an hour-by-hour grid, with a yellow banner at the top warning that WhatsApp reminders are turned off and no one is being notified about their appointment. The appointment cards show the three states: some with just name, time, and phone number, one marked "no reminder" for having no phone number on file, and others marked "no WhatsApp consent" with an "ask" button.',
        },
        legenda: {
          pt: 'A agenda da semana. A tarja no topo é o sistema admitindo que o lembrete está desligado; nos cartões, "sem lembrete" é paciente sem telefone cadastrado, e "sem permissão de WhatsApp · perguntar" é paciente que ainda não foi perguntado. Consulta cancelada aparece riscada.',
          en: "The week view of the schedule. The banner at the top is the system admitting the reminder is turned off; on the cards, \"no reminder\" means a patient with no phone number on file, and \"no WhatsApp consent · ask\" means a patient who hasn't been asked yet. A cancelled appointment shows struck through.",
        },
      },
    ],
  },

  // Diferente da Revy: estes quatro saem do README do projeto, não de seed
  // inventado, então entram como fato. O levantamento ainda lista "confirmar
  // se 914 e 44.812 podem virar vitrine" — se o dono disser que não, o
  // conserto é o mesmo da Revy: `numeros: []` e a régua some sozinha.
  numeros: [
    { valor: '~30', rotulo: { pt: 'anos de histórico migrados', en: 'years of history migrated' } },
    { valor: '5.559', rotulo: { pt: 'pacientes no cadastro histórico', en: 'patients in the historical records' } },
    { valor: '44.812', rotulo: { pt: 'lançamentos clínicos migrados', en: 'clinical entries migrated' } },
    { valor: '914', rotulo: { pt: 'testes passando', en: 'tests passing' } },
  ],

  galeria: [
    {
      titulo: { pt: 'As outras telas', en: 'The other screens' },
      prints: [
        {
          arquivo: '02-odontograma.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Odontograma: as duas arcadas completas em numeração FDI, com dentes contornados em vermelho (planejado), verde (realizado) e azul (já existente), o painel de lançamento aberto à direita com categoria, faces da coroa e situação, e o histórico de atendimentos por data logo abaixo.',
            en: 'Odontogram: both full arches in FDI numbering, with teeth outlined in red (planned), green (done), and blue (pre-existing), the entry panel open on the right with category, crown surfaces, and status, and the visit history by date just below.',
          },
          legenda: {
            pt: 'O odontograma. Vermelho é planejado, verde é realizado, azul é o que já estava lá.',
            en: 'The odontogram. Red is planned, green is done, blue is what was already there.',
          },
        },
        {
          arquivo: '03-pacientes.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Lista de pacientes com idade, telefone, data do último atendimento, convênio, quantos tratamentos pendentes e quanto há a fazer em reais, com filtros por ativos, com pendência e com tratamento a fazer.',
            en: 'Patient list with age, phone number, date of last visit, insurance plan, how many treatments are pending, and how much is owed in reais, with filters for active, with pending items, and with treatment to do.',
          },
          legenda: {
            pt: 'A lista de pacientes, com quem tem tratamento pendente separado de quem não tem.',
            en: "The patient list, with those who have pending treatment separated from those who don't.",
          },
        },
        {
          arquivo: '05-financeiro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Financeiro do mês com quatro cartões — recebido, produzido, a receber e tratamentos realizados — e o gráfico de barras do dinheiro recebido mês a mês no ano.',
            en: 'Monthly finance view with four cards — received, produced, to receive, and treatments completed — and the bar chart of money received month by month over the year.',
          },
          legenda: {
            pt: 'Financeiro: recebido e produzido raramente batem no mesmo mês, e a tela diz isso em vez de esconder.',
            en: 'Finance: received and produced rarely match in the same month, and the screen says so instead of hiding it.',
          },
        },
      ],
    },
  ],

  // Sistema fechado. O componente mostra o motivo no lugar dos botões.
  links: [],
  semLink: {
    curto: {
      pt: 'Sistema fechado — prontuário de clínica real.',
      en: 'Private system — real practice patient records.',
    },
    titulo: { pt: 'Sistema fechado', en: 'Private system' },
    texto: {
      pt: 'Aqui dentro tem prontuário de gente de verdade. Não existe demonstração aberta nem tela de entrada pública — o que dá para ver do sistema são os prints desta página, feitos com pacientes inventados.',
      en: "This holds real people's patient records. There's no open demo and no public login screen — what you can see of the system is the screenshots on this page, made with invented patients.",
    },
  },

  tecnico: {
    stack: ['Python', 'FastAPI', 'SQLAlchemy 2', 'Alembic', 'PostgreSQL 16', 'argon2', 'Fly.io'],
    notas: [
      {
        titulo: { pt: 'Consentimento com três estados', en: 'Consent with three states' },
        texto: [
          {
            pt: 'O campo `aceita_whatsapp` aceita `NULL`, e `NULL` não é "não": é nunca perguntamos. Os 5.559 pacientes migrados entraram assim, e nenhum recebe mensagem nesse estado. Foi a decisão mais difícil de implementar e a mais fácil de explicar para a clínica.',
            en: "The `aceita_whatsapp` field accepts `NULL`, and `NULL` doesn't mean \"no\": it means we never asked. The 5.559 migrated patients arrived in this state, and none of them get messaged while they're in it. It was the hardest decision to implement and the easiest to explain to the practice.",
          },
        ],
      },
      {
        titulo: { pt: 'Idempotência no banco, não num `if`', en: 'Idempotency in the database, not in an `if`' },
        texto: [
          {
            pt: 'Um `UniqueConstraint(agendamento_id, tipo)` na tabela `lembrete`: a segunda linha é recusada pelo banco. Vale se o cron disparar duas vezes, se houver duas máquinas no ar durante um deploy, e se alguém clicar em "enviar agora" enquanto o cron roda.',
            en: 'A `UniqueConstraint(agendamento_id, tipo)` on the `lembrete` table: the second row gets rejected by the database. It holds whether the cron fires twice, whether two machines are live during a deploy, or whether someone clicks "send now" while the cron is running.',
          },
        ],
      },
      {
        titulo: {
          pt: 'Dado suspeito é marcado, nunca corrigido no chute',
          en: 'Suspect data gets flagged, never fixed by guessing',
        },
        texto: [
          {
            pt: 'Trinta anos de FoxPro produzem registro ambíguo. Em vez de adivinhar, o paciente e o lançamento carregam `revisar_motivo` e ficam sinalizados. Toda escrita ainda deixa linha em `auditoria`, com o antes e o depois — é exigência de LGPD e a única forma de responder quem mudou o prontuário e quando.',
            en: "Thirty years of FoxPro produce ambiguous records. Instead of guessing, the patient and the entry carry a `revisar_motivo` flag and get marked for review. Every write still leaves a row in `auditoria`, with the before and after — it's an LGPD requirement and the only way to answer who changed the patient record and when.",
          },
        ],
      },
    ],
  },
}
