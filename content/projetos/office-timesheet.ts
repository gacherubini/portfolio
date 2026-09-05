import type { Projeto } from '@/content/tipos'

export const officeTimesheet: Projeto = {
  slug: 'office-timesheet',
  nome: 'Office Timesheet',
  paraQuem: { pt: 'Escritório de arquitetura', en: 'Architecture studio' },
  situacao: 'fechado',
  selo: { pt: 'IA · assistente embutido', en: 'AI · built-in assistant' },

  // Amostrada de 03-tarefas-kanban.png: fundo cinza claro, topo verde-escuro,
  // laranja queimado nos marcadores. Este sistema não é azul — o #2563EB que a
  // versão anterior da spec trazia não existe no produto.
  // Única página clara do site, então fundo2 sobe para o branco.
  tema: {
    fundo: '#ECECEC',
    texto: '#1D2724',
    borda: '#C9CFCC',
    destaque: '#CB6D31',
    ctaFundo: '#2E3D38',
    ctaTexto: '#FFFFFF',
    calmo: '#55605C',
    fundo2: '#FFFFFF',
  },

  ficha: [
    { rotulo: { pt: 'Para quem', en: 'For whom' }, valor: { pt: 'Escritório de arquitetura', en: 'Architecture studio' } },
    { rotulo: { pt: 'Situação', en: 'Status' }, valor: { pt: 'Sistema fechado, interno do escritório', en: 'Private system, internal to the studio' } },
    { rotulo: { pt: 'Tamanho', en: 'Size' }, valor: { pt: '26 páginas, 4 papéis de acesso', en: '26 pages, 4 access roles' } },
  ],

  resumoHome: {
    pt: 'Saber onde o tempo da equipe foi parar e quanto cada projeto custou. Tem um assistente que responde as perguntas chatas de segunda-feira sem ninguém abrir sete telas.',
    en: "Know where the team's time went and what each project cost. There's an assistant that answers Monday's tedious questions without anyone opening seven screens.",
  },

  chamada: {
    pt: 'O escritório de arquitetura descobre onde o tempo da equipe foi parar — e quanto cada projeto custou — sem depender de planilha.',
    en: "The architecture studio finds out where the team's time went — and what each project cost — without depending on a spreadsheet.",
  },

  problema: [
    {
      pt: 'Num escritório de arquitetura, a hora trabalhada é o que se vende. Só que ela fica espalhada: cada pessoa em vários projetos no mesmo dia, cada projeto em várias etapas, e o registro disso vivendo numa planilha.',
      en: "In an architecture studio, the hour worked is what gets sold. Except it's scattered: each person on several projects the same day, each project across several phases, and the record of it living in a spreadsheet.",
    },
    {
      pt: 'No fim do mês, ninguém consegue responder com segurança as duas perguntas que importam — onde o tempo da equipe foi parar, e quanto cada projeto custou de verdade.',
      en: "At the end of the month, nobody can answer with any confidence the two questions that matter — where the team's time went, and what each project actually cost.",
    },
  ],

  oQueFaz: [
    {
      pt: 'Marcar hora por projeto sem planilha: abre o projeto, clica em apontar horas, o cronômetro roda, pausa no almoço, retoma, encerra.',
      en: 'Log hours per project without a spreadsheet: open the project, click log hours, the timer runs, pause for lunch, resume, stop.',
    },
    {
      pt: 'Tocar os projetos: cada um tem as quatro etapas — Levantamento, Estudo Preliminar, Anteprojeto, Projeto Executivo — e um quadro de tarefas com responsável, prazo e cronômetro por tarefa.',
      en: 'Run the projects: each one has the four phases — Survey, Preliminary Study, Schematic Design, Executive Design — and a task board with an owner, a due date and a timer per task.',
    },
    {
      pt: 'E fechar o mês: o admin vê quanto a equipe trabalhou e quanto cada projeto custou, e resolve numa fila só as três coisas que precisam de gente — correção de ponto, reembolso de despesa e pedido de férias. Em volta disso, um cadastro que junta colaboradores, clientes e fornecedores, e uma agenda com férias, feriados, prazos e o Google Calendar de cada um.',
      en: "And close out the month: the admin sees how much the team worked and what each project cost, and clears in a single queue the three things that need a human — time entry corrections, expense reimbursements and time-off requests. Around that, a registry that brings together staff, clients and vendors, and a calendar with time off, holidays, due dates and everyone's Google Calendar.",
    },
  ],

  // O destaque desta página não tem imagem, então o quadro de tarefas abre a
  // página logo abaixo da chamada. É também de onde a cor foi amostrada.
  printAbertura: {
    arquivo: '03-tarefas-kanban.png',
    largura: 3200,
    altura: 2000,
    alt: {
      pt: 'Quadro de tarefas com cinco colunas — A fazer, Fazendo, Falta info, Em revisão e Concluído. Cada cartão traz o projeto, a etapa, o responsável, as horas já contadas, o prazo e um botão Contar horas.',
      en: 'Task board with five columns — To do, Doing, Missing info, In review and Done. Each card shows the project, the phase, the owner, the hours logged so far, the due date and a Log hours button.',
    },
    legenda: {
      pt: 'O quadro de tarefas, com todas as tarefas de todos os projetos. O marcador laranja de cada cartão é de onde saiu a cor desta página.',
      en: "The task board, with every task from every project. The orange marker on each card is where this page's color came from.",
    },
  },

  destaque: {
    titulo: {
      pt: 'O assistente que vive dentro do sistema',
      en: 'The assistant that lives inside the system',
    },
    texto: [
      {
        pt: 'Um chat dentro do próprio sistema, construído sobre um modelo de linguagem, a DeepSeek. Em vez de abrir sete telas para montar a resposta, a pessoa pergunta em português.',
        en: 'A chat inside the system itself, built on a language model, DeepSeek. Instead of opening seven screens to piece the answer together, the person just asks in plain language.',
      },
      {
        pt: 'Ele não adivinha: responde *chamando funções do sistema*, o function calling. Cada pergunta vira uma ou mais chamadas, ele decide quais precisa, junta o que voltou e escreve a resposta. É o mesmo dado que a pessoa veria navegando, só que sem navegar.',
        en: 'It does not guess: it answers by *calling functions in the system*, function calling. Each question turns into one or more calls, it decides which ones it needs, puts together what came back and writes the answer. It is the same data the person would see browsing, minus the browsing.',
      },
    ],
    // SLOT: a AGENT_API_KEY do .env local responde 403, então não há captura da
    // tela /assistente. Com a chave válida, um Print entra aqui e preenche o
    // vazio que a saída da lista deixou à direita do bloco.
    prints: [],
    amarras: [
      {
        titulo: { pt: 'Ele propõe, não executa', en: "It proposes, it doesn't execute" },
        texto: [
          {
            pt: 'Nada é escrito no sistema pelo assistente. Ele monta a proposta, e a pessoa aprova ou descarta.',
            en: 'Nothing gets written to the system by the assistant. It puts together the proposal, and the person approves or discards it.',
          },
        ],
      },
      {
        titulo: { pt: 'Não é um canal privilegiado', en: "It's not a privileged channel" },
        texto: [
          {
            pt: 'Cada pessoa alcança pelo assistente exatamente o que alcançaria navegando o site. A mesma régua de permissão vale nos dois caminhos.',
            en: "Each person reaches through the assistant exactly what they'd reach browsing the site. The same permission rule applies to both paths.",
          },
        ],
      },
      {
        titulo: { pt: 'Cada resposta declara suas fontes', en: 'Every answer declares its sources' },
        texto: [
          {
            pt: 'No rodapé da resposta vai a lista de quais leituras a produziram. Dá para conferir em vez de acreditar.',
            en: 'The footer of the answer carries the list of which reads produced it. You can check instead of just taking it on faith.',
          },
        ],
      },
    ],
  },

  numeros: [
    { valor: { pt: '1.452', en: '1,452' }, rotulo: { pt: 'casos de teste, contra Postgres real no CI', en: 'test cases, against real Postgres in CI' } },
    { valor: { pt: '148', en: '148' }, rotulo: { pt: 'endpoints HTTP', en: 'HTTP endpoints' } },
    { valor: { pt: '40', en: '40' }, rotulo: { pt: 'tabelas no banco', en: 'tables in the database' } },
    // Era "tools no assistente, dos quais 17 de leitura e 15 de escrita — o
    // resto é SQL avulso e meta". O rótulo comprido quebrava a régua em duas
    // linhas na faixa da home; agora esta régua só existe na página, e o
    // rótulo curto serve melhor nas duas.
    { valor: { pt: '34', en: '34' }, rotulo: { pt: 'funções que o assistente pode chamar', en: 'functions the assistant can call' } },
  ],

  // PENDENTE, BLOQUEADO NO DONO. As três métricas escolhidas são: horas
  // apontadas no sistema, projetos acompanhados, e pessoas apontando hora todo
  // dia. Os valores são do escritório real e ninguém os tem aqui — os do seed
  // são inventados e não servem. Vazio, a régua da faixa some sozinha, que é o
  // comportamento certo. Não preencher com estimativa.
  numerosHome: [],

  galeria: [
    {
      titulo: { pt: 'O dia de quem aponta', en: 'The day of the person logging hours' },
      prints: [
        {
          arquivo: '02-registro-horas-projetos.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Lista de projetos em cartões, cada um com o cliente, a contagem de tarefas por coluna e o botão Apontar horas; num deles o cronômetro está rodando, com pausar e encerrar ao lado.',
            en: 'List of projects as cards, each one with the client, the task count per column and a Log hours button; on one of them the timer is running, with pause and stop next to it.',
          },
          legenda: { pt: 'Os projetos da pessoa, e o cronômetro rodando num deles.', en: "The person's projects, with the timer running on one of them." },
        },
        {
          arquivo: '04-projeto-etapas-e-quadro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Página de um projeto: as quatro etapas em régua no topo, cada uma com prazo e horas acumuladas, o briefing, o quadro de tarefas do projeto e, na coluna da direita, contratante e horas do mês.',
            en: "A project's page: the four phases in a ruler across the top, each with a due date and accumulated hours, the brief, the project's own task board and, in the right-hand column, the client and the month's hours.",
          },
          legenda: { pt: 'Um projeto por dentro: etapas, briefing e o quadro só dele.', en: 'Inside a project: phases, brief and its own board.' },
        },
        {
          arquivo: '07-agenda-equipe.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Agenda em vista de mês com férias da equipe, feriados, prazos de tarefa e quem está no escritório; à esquerda, a conexão com o Google Calendar e as agendas ligadas.',
            en: "Calendar in month view with the team's time off, holidays, task due dates and who's in the studio; on the left, the Google Calendar connection and the linked calendars.",
          },
          legenda: { pt: 'A agenda junta férias, feriados, prazos e o Google Calendar.', en: 'The calendar brings together time off, holidays, due dates and Google Calendar.' },
        },
      ],
    },
    {
      titulo: { pt: 'O fechamento do mês', en: 'Closing out the month' },
      prints: [
        {
          arquivo: '08-dashboard-admin.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Visão geral da operação: horas da equipe no período, quem está com cronômetro rodando agora, a lista da equipe com horas e número de projetos, e a coluna Precisa de você com os pedidos e os botões aprovar e rejeitar.',
            en: "Overview of the operation: the team's hours for the period, who has a timer running right now, the team list with hours and project count, and the Needs you column with the requests and the approve and reject buttons.",
          },
          legenda: { pt: 'A visão do admin, com quem está trabalhando agora.', en: "The admin's view, with who's working right now." },
        },
        {
          arquivo: '11-aprovacoes.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Tela de aprovações em três colunas: correções de apontamento, despesas e pedidos de férias, cada item com a justificativa de quem pediu e os botões aprovar e rejeitar.',
            en: "Approvals screen in three columns: time entry corrections, expenses and time-off requests, each item with the requester's justification and the approve and reject buttons.",
          },
          legenda: { pt: 'A fila única: ponto, despesa e férias no mesmo lugar.', en: 'The single queue: time, expense and time off all in one place.' },
        },
        {
          arquivo: '13-relatorio-financeiro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Relatório financeiro por período: total a pagar, custo de horas, despesas aprovadas e bônus, com as tabelas de maiores pagamentos por colaborador e de projetos com maior custo, em horas e em reais.',
            en: 'Financial report by period: total payable, cost of hours, approved expenses and bonuses, with tables of the highest payments by staff member and the highest-cost projects, in hours and in reais.',
          },
          legenda: { pt: 'Quanto custou o período, por pessoa e por projeto.', en: 'What the period cost, by person and by project.' },
        },
      ],
    },
  ],

  links: [],
  semLink: {
    curto: { pt: 'Sistema fechado — interno do escritório.', en: 'Private system — internal to the studio.' },
    titulo: { pt: 'Sem link para entrar', en: 'No link to log in' },
    texto: {
      pt: 'É um sistema interno: não tem área pública nem conta de visitante. O que dá para mostrar aqui são os prints.',
      en: "It's an internal system: no public area, no visitor account. What can be shown here are the screenshots.",
    },
  },

  tecnico: {
    stack: [
      'Node 20',
      'Express 5',
      'PostgreSQL 16',
      'React 19',
      'Vite 6',
      'Tailwind',
      'DeepSeek',
      'Fly.io',
      'GitHub Actions',
    ],
    notas: [
      {
        titulo: { pt: 'Os quinze tools de escrita começam com `propor`', en: 'The fifteen write tools start with `propor`' },
        texto: [
          {
            pt: 'Nenhum se chama `criar` ou `aprovar`: `proporCriarTask`, `proporAprovarDespesa`, `proporPedirFerias`, e assim os quinze. A regra não está num comentário nem numa checagem solta — está no nome de cada função que o modelo pode chamar. Escrever direto é uma coisa que não existe para ele.',
            en: "None is called `criar` or `aprovar`: `proporCriarTask`, `proporAprovarDespesa`, `proporPedirFerias`, and so on for all fifteen. The rule isn't in a comment or a loose check — it's in the name of every function the model is allowed to call. Writing directly is simply not a thing that exists for it.",
          },
        ],
      },
      {
        titulo: { pt: 'A regra vive no banco, não só no código', en: 'The rule lives in the database, not just in the code' },
        texto: [
          {
            pt: 'Índice único parcial garantindo um apontamento aberto por pessoa, `EXCLUDE` barrando férias sobrepostas, um pedido pendente por apontamento e `ON DELETE RESTRICT` entre apontamento e projeto. Onde não dá para burlar.',
            en: "A partial unique index guaranteeing one open time entry per person, `EXCLUDE` blocking overlapping time off, one pending request per time entry, and `ON DELETE RESTRICT` between time entry and project. Where there's no way around it.",
          },
        ],
      },
      {
        titulo: { pt: 'O valor/hora congela no apontamento', en: 'The hourly rate freezes into the time entry' },
        texto: [
          {
            pt: 'O custo de uma hora é gravado no momento em que ela é apontada. Aumento de salário depois não reescreve o custo do que já passou, e o relatório de um mês fechado continua dando o mesmo número no ano que vem.',
            en: "The cost of an hour is recorded the moment it's logged. A raise granted later doesn't rewrite the cost of what already happened, and a closed month's report keeps giving the same number next year.",
          },
        ],
      },
    ],
  },
}
