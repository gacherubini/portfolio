import type { Projeto } from '@/content/tipos'

export const officeTimesheet: Projeto = {
  slug: 'office-timesheet',
  nome: 'Office Timesheet',
  paraQuem: { pt: 'Escritório de arquitetura' },
  situacao: 'fechado',

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
    { rotulo: { pt: 'Para quem' }, valor: { pt: 'Escritório de arquitetura' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'Sistema fechado, interno do escritório' } },
    { rotulo: { pt: 'Tamanho' }, valor: { pt: '26 páginas, 4 papéis de acesso' } },
  ],

  resumoHome: {
    pt: 'Saber onde o tempo da equipe foi parar e quanto cada projeto custou. Tem um assistente que responde as perguntas chatas de segunda-feira sem ninguém abrir sete telas.',
  },

  chamada: {
    pt: 'O escritório de arquitetura descobre onde o tempo da equipe foi parar — e quanto cada projeto custou — sem depender de planilha.',
  },

  problema: [
    {
      pt: 'Num escritório de arquitetura, a hora trabalhada é o que se vende. Só que ela fica espalhada: cada pessoa em vários projetos no mesmo dia, cada projeto em várias etapas, e o registro disso vivendo numa planilha.',
    },
    {
      pt: 'No fim do mês, ninguém consegue responder com segurança as duas perguntas que importam — onde o tempo da equipe foi parar, e quanto cada projeto custou de verdade.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Marcar hora por projeto sem planilha: abre o projeto, clica em apontar horas, o cronômetro roda, pausa no almoço, retoma, encerra.',
    },
    {
      pt: 'Tocar os projetos: cada um tem as quatro etapas — Levantamento, Estudo Preliminar, Anteprojeto, Projeto Executivo — e um quadro de tarefas com responsável, prazo e cronômetro por tarefa.',
    },
    {
      pt: 'E fechar o mês: o admin vê quanto a equipe trabalhou e quanto cada projeto custou, e resolve numa fila só as três coisas que precisam de gente — correção de ponto, reembolso de despesa e pedido de férias. Em volta disso, um cadastro que junta colaboradores, clientes e fornecedores, e uma agenda com férias, feriados, prazos e o Google Calendar de cada um.',
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
    },
    legenda: {
      pt: 'O quadro de tarefas, com todas as tarefas de todos os projetos. O marcador laranja de cada cartão é de onde saiu a cor desta página.',
    },
  },

  destaque: {
    titulo: { pt: 'O assistente, e as 17 perguntas que ele sabe responder' },
    texto: [
      {
        pt: 'Um assistente construído com DeepSeek, dentro do sistema. Em vez de abrir sete telas para montar a resposta, a pessoa pergunta.',
      },
      {
        pt: 'A lista dos tools de leitura explica melhor do que qualquer descrição para que ele serve: são as perguntas chatas de segunda-feira, cada uma virada função.',
      },
    ],
    // SLOT: a AGENT_API_KEY do .env local responde 403, então não há captura da
    // tela /assistente. Com a chave válida, um Print entra aqui e o componente
    // passa a mostrar imagem sem mais nenhuma mudança.
    prints: [],
    lista: {
      rotulo: { pt: 'O que ele lê' },
      itens: [
        'quemNaoApontou',
        'tasksTravadas',
        'cargaEquipe',
        'feriasEConflitos',
        'custoPorProjeto',
        'aprovacoesPendentes',
        'apontamentosAbertos',
        'andamentoDeProjeto',
        'despesasDoPeriodo',
        'agendaDoPeriodo',
        'simulacaoPerformance',
        'gerarRelatorio',
        'statusProjeto',
        'listarEquipe',
        'bonusDoPeriodo',
        'meusBonus',
        'aniversariantes',
      ],
    },
    amarras: [
      {
        titulo: { pt: 'Ele propõe, não executa' },
        texto: [
          {
            pt: 'Nada é escrito no sistema pelo assistente. Ele monta a proposta, e a pessoa aprova ou descarta.',
          },
        ],
      },
      {
        titulo: { pt: 'Não é um canal privilegiado' },
        texto: [
          {
            pt: 'Cada pessoa alcança pelo assistente exatamente o que alcançaria navegando o site. A mesma régua de permissão vale nos dois caminhos.',
          },
        ],
      },
      {
        titulo: { pt: 'Cada resposta declara suas fontes' },
        texto: [
          {
            pt: 'No rodapé da resposta vai a lista de quais leituras a produziram. Dá para conferir em vez de acreditar.',
          },
        ],
      },
    ],
  },

  numeros: [
    { valor: '1.452', rotulo: { pt: 'casos de teste, contra Postgres real no CI' } },
    { valor: '148', rotulo: { pt: 'endpoints HTTP' } },
    { valor: '40', rotulo: { pt: 'tabelas no banco' } },
    // O comp P3 escreve "34 · 17 de leitura, 15 de escrita", e 17+15 dá 32.
    // O levantamento explica o resto: 34 = 17 leitura + 15 escrita + SQL
    // ad-hoc + meta. Conta errada na tela é pior que rótulo comprido.
    { valor: '34', rotulo: { pt: 'tools no assistente, 17 deles só de leitura' } },
  ],

  galeria: [
    {
      titulo: { pt: 'O dia de quem aponta' },
      prints: [
        {
          arquivo: '02-registro-horas-projetos.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Lista de projetos em cartões, cada um com o cliente, a contagem de tarefas por coluna e o botão Apontar horas; num deles o cronômetro está rodando, com pausar e encerrar ao lado.',
          },
          legenda: { pt: 'Os projetos da pessoa, e o cronômetro rodando num deles.' },
        },
        {
          arquivo: '04-projeto-etapas-e-quadro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Página de um projeto: as quatro etapas em régua no topo, cada uma com prazo e horas acumuladas, o briefing, o quadro de tarefas do projeto e, na coluna da direita, contratante e horas do mês.',
          },
          legenda: { pt: 'Um projeto por dentro: etapas, briefing e o quadro só dele.' },
        },
        {
          arquivo: '07-agenda-equipe.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Agenda em vista de mês com férias da equipe, feriados, prazos de tarefa e quem está no escritório; à esquerda, a conexão com o Google Calendar e as agendas ligadas.',
          },
          legenda: { pt: 'A agenda junta férias, feriados, prazos e o Google Calendar.' },
        },
      ],
    },
    {
      titulo: { pt: 'O fechamento do mês' },
      prints: [
        {
          arquivo: '08-dashboard-admin.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Visão geral da operação: horas da equipe no período, quem está com cronômetro rodando agora, a lista da equipe com horas e número de projetos, e a coluna Precisa de você com os pedidos e os botões aprovar e rejeitar.',
          },
          legenda: { pt: 'A visão do admin, com quem está trabalhando agora.' },
        },
        {
          arquivo: '11-aprovacoes.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Tela de aprovações em três colunas: correções de apontamento, despesas e pedidos de férias, cada item com a justificativa de quem pediu e os botões aprovar e rejeitar.',
          },
          legenda: { pt: 'A fila única: ponto, despesa e férias no mesmo lugar.' },
        },
        {
          arquivo: '13-relatorio-financeiro.png',
          largura: 3200,
          altura: 2000,
          alt: {
            pt: 'Relatório financeiro por período: total a pagar, custo de horas, despesas aprovadas e bônus, com as tabelas de maiores pagamentos por colaborador e de projetos com maior custo, em horas e em reais.',
          },
          legenda: { pt: 'Quanto custou o período, por pessoa e por projeto.' },
        },
      ],
    },
  ],

  links: [],
  semLink: {
    curto: { pt: 'Sistema fechado — interno do escritório.' },
    titulo: { pt: 'Sem link para entrar' },
    texto: {
      pt: 'É um sistema interno: não tem área pública nem conta de visitante. O que dá para mostrar aqui são os prints.',
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
        titulo: { pt: 'Os quinze tools de escrita começam com `propor`' },
        texto: [
          {
            pt: 'Nenhum se chama `criar` ou `aprovar`: `proporCriarTask`, `proporAprovarDespesa`, `proporPedirFerias`, e assim os quinze. A regra não está num comentário nem numa checagem solta — está no nome de cada função que o modelo pode chamar. Escrever direto é uma coisa que não existe para ele.',
          },
        ],
      },
      {
        titulo: { pt: 'A regra vive no banco, não só no código' },
        texto: [
          {
            pt: 'Índice único parcial garantindo um apontamento aberto por pessoa, `EXCLUDE` barrando férias sobrepostas, um pedido pendente por apontamento e `ON DELETE RESTRICT` entre apontamento e projeto. Onde não dá para burlar.',
          },
        ],
      },
      {
        titulo: { pt: 'O valor/hora congela no apontamento' },
        texto: [
          {
            pt: 'O custo de uma hora é gravado no momento em que ela é apontada. Aumento de salário depois não reescreve o custo do que já passou, e o relatório de um mês fechado continua dando o mesmo número no ano que vem.',
          },
        ],
      },
    ],
  },
}
