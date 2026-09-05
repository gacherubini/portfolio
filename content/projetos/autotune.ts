import type { Projeto } from '@/content/tipos'

export const autotune: Projeto = {
  slug: 'autotune',
  nome: 'Autotune',
  paraQuem: { pt: 'Trabalho de conclusão, PUCRS' },
  situacao: 'publicado',

  // A ÚNICA paleta atribuída do site. O plugin real é menta #2EE6A0 sobre
  // #0D1512, que repetia a dupla da Revy; os gráficos do TCC são o azul default
  // do matplotlib. O âmbar não existe em print nenhum — foi atribuído em
  // 04/09/2026, e a seção 2 da spec foi reescrita para permitir isso.
  // fundo3 é a placa onde os prints ficam: o menta deles não encosta no âmbar.
  tema: {
    fundo: '#10312F',
    texto: '#E4F2F0',
    borda: '#2A5A56',
    destaque: '#F3B843',
    ctaFundo: '#F3B843',
    ctaTexto: '#10312F',
    calmo: '#9FBCB8',
    fundo2: '#0D2827',
    fundo3: '#0A211F',
  },

  ficha: [
    { rotulo: { pt: 'O que é' }, valor: { pt: 'Parte prática do TCC, PUCRS' } },
    { rotulo: { pt: 'Situação' }, valor: { pt: 'Publicado, código aberto' } },
    {
      rotulo: { pt: 'Entrega' },
      valor: {
        pt: 'Executáveis de linha de comando, núcleo de streaming header-only e plugin VST3 / Standalone',
      },
    },
    { rotulo: { pt: 'Testado em' }, valor: { pt: 'Ableton Live' } },
  ],

  resumoHome: {
    pt: 'O que o Auto-Tune faz, feito do zero em C++. Dois motores de correção com o mesmo deslocamento: um preserva a voz da pessoa, o outro preserva a latência.',
  },

  chamada: {
    pt: 'Um corretor de afinação vocal em tempo real, feito do zero em C++ — com dois motores de correção que resolvem a mesma nota de dois jeitos opostos.',
  },

  problema: [
    {
      pt: 'Corrigir a afinação de uma voz parece um problema só, e são dois. Quem está cantando precisa se ouvir corrigido no fone, na hora — qualquer atraso perceptível atrapalha o próprio take. Quem está mixando uma gravação antiga não tem pressa nenhuma, mas não aceita que a voz saia descaracterizada.',
    },
    {
      pt: 'Os dois pedidos puxam para lados opostos, e é comum ver o assunto tratado como se houvesse uma resposta única.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Encontra a nota que está sendo cantada com pYIN — o YIN probabilístico, com HMM e Viterbi —, compara com a escala escolhida e desloca o sinal para a nota alvo.',
    },
    {
      pt: 'O deslocamento é o mesmo nos dois casos; o que muda é quem executa. Assumir isso na interface, e deixar a escolha com quem está cantando, é o que o trabalho defende. Junto vêm os controles de tessitura, tônica e escala, e a correção regulada por Retune Speed, tolerância em cents, Natural Vibrato e Humanize.',
    },
  ],

  destaque: {
    titulo: { pt: 'Dois motores para a mesma correção' },
    texto: [
      {
        pt: 'O sistema encontra a nota com pYIN e corrige por um de dois motores de síntese, com o mesmo deslocamento. Um deles preserva os formantes: a voz continua soando como a pessoa. O outro preserva a latência: oito amostras fixas, e o cantor se escuta corrigido enquanto canta. Escolher entre os dois é a principal contribuição de engenharia do trabalho.',
      },
    ],
    prints: [
      {
        arquivo: '05-plugin-cantando-psola.png',
        largura: 637,
        altura: 455,
        // Nome de motor é nome, não código: fica em Archivo, não em mono.
        etiqueta: { pt: 'TD-PSOLA' },
        valor: '61,72 ms',
        alt: {
          pt: 'O plugin corrigindo ao vivo com TD-PSOLA, Low Latency desmarcado: nota-alvo E3, cantado 154,0 Hz contra alvo 164,8 Hz, correção de +118 cents, o gráfico cheio com a voz sendo corrigida, e latência de 61,72 ms no rodapé.',
        },
        legenda: {
          pt: 'O motor padrão, corrigindo. E3 na mira: cantado a 154,0 Hz, alvo 164,8 Hz, +118 cents. Ele reconstrói o sinal preservando os formantes — a voz continua soando como a pessoa —, e cobra 61,72 ms por isso. Corrigindo uma faixa já gravada, esse é o motor certo: o formante importa mais que a latência.',
        },
      },
      {
        arquivo: '01-plugin-cantando-v3.png',
        largura: 639,
        altura: 458,
        etiqueta: { pt: 'Ponteiro móvel (v3)' },
        valor: '0,18 ms',
        // O comp da home abre a faixa do Autotune com este print, não com o
        // TD-PSOLA que vem primeiro no destaque.
        naFaixa: true,
        alt: {
          pt: 'O mesmo plugin corrigindo voz ao vivo, com Low Latency marcado e o cabeçalho pYIN para ponteiro móvel (v3): nota-alvo F3, cantado 170,9 Hz contra alvo 174,6 Hz, correção de mais 38 cents, o gráfico cheio com a linha de correção ao longo do tempo e a latência de 0,18 ms.',
        },
        legenda: {
          pt: 'O mesmo plugin, o mesmo cantor, com Low Latency marcado. F3 na mira: cantado a 170,9 Hz, alvo 174,6 Hz, correção de +38 cents ao vivo. São 8 amostras fixas de atraso. Monitorando a própria voz, 61 ms é intolerável — aqui esse problema some.',
        },
      },
    ],
    fecho: {
      pt: 'Mesmo plugin, mesmo cantor, dois números de latência separados por um fator de *340*. Não existe motor certo: existe o que o cantor precisa naquele take.',
    },
  },

  numeros: [
    { valor: '61,72 ms', rotulo: { pt: 'TD-PSOLA, preserva os formantes' } },
    { valor: '0,18 ms', rotulo: { pt: 'ponteiro móvel, 8 amostras fixas' } },
    { valor: '340×', rotulo: { pt: 'de diferença entre os dois motores' } },
  ],

  // Sem galeria: dos quatro prints, dois estão no destaque e dois são
  // matplotlib no default e não separam nada.
  galeria: [],

  // A confirmar com o dono quais repositórios entram: TCC_autotune_cpp,
  // TCC-autotune-python, TCC-TEXT. Os dois abaixo saem do comp P4; se alguma
  // URL estiver errada, o contrato recusa href vazio e a build aponta.
  links: [
    {
      rotulo: { pt: 'Ver o protótipo em C++' },
      href: 'https://github.com/gacherubini/TCC_autotune_cpp',
      primario: true,
    },
    {
      rotulo: { pt: 'Ver o estudo de detecção de pitch' },
      href: 'https://github.com/gacherubini/TCC-autotune-python',
    },
  ],

  tecnico: {
    stack: ['C++', 'JUCE', 'VST3', 'pYIN', 'TD-PSOLA', 'dr_wav', 'CMake', 'Python'],

    // O CLI vai como texto, não como print: fica nítido em qualquer tela, dá
    // para selecionar, e o leitor de tela lê.
    terminal: {
      comando: 'autotune.exe exemplo-antes.wav saida.wav 1.0 Am tol=15 glide=40',
      saida: [
        'Sinal: 5.00 s | 44100 Hz | mix=1.00',
        'Escala: Am  (notas alvo: C D E F G A B )',
        'tol=15 ct | retune=40 ms | vibrato=1.00 | humanize=0.00',
        '',
        'Correcao planejada (1 leitura por segundo):',
        '  t=  1.0s   376.2 Hz -> G4   ( 388.6 Hz)  correcao   +56 ct',
        '  t=  2.0s   371.9 Hz -> G4   ( 388.6 Hz)  correcao   +76 ct',
        '  t=  3.0s   278.6 Hz -> D4   ( 291.1 Hz)  correcao   +76 ct',
        '  t=  4.0s   194.7 Hz -> G3   ( 194.7 Hz)  correcao    +0 ct',
        '',
        'real  0m0.207s',
      ].join('\n'),
      legenda: {
        pt: 'O mesmo núcleo roda fora do plugin, por linha de comando. Cinco segundos de áudio em *0,207 s* — cerca de 24× mais rápido que o tempo real.',
      },
    },

    notas: [
      {
        titulo: { pt: 'Um núcleo, três entregas' },
        texto: [
          {
            pt: 'O núcleo de streaming é header-only, e é o mesmo código nos três lugares: nos executáveis de linha de comando, no plugin VST3 e no Standalone. Build por CMake, leitura de WAV com `dr_wav`, interface e empacotamento com JUCE.',
          },
          {
            pt: 'O plugin foi validado no Ableton Live, que é onde a conta de latência deixa de ser teórica.',
          },
        ],
      },
      {
        titulo: { pt: 'A escolha do pYIN veio de um estudo, não de um chute' },
        texto: [
          {
            pt: 'O segundo repositório, em Python, compara algoritmos de detecção de pitch antes de o C++ existir. É esse estudo que fundamenta a escolha do pYIN para o protótipo.',
          },
          { pt: 'É trabalho que não aparece na interface e sustenta tudo o que aparece.' },
        ],
      },
      {
        titulo: { pt: 'O que reprovou no teste de usuário' },
        texto: [
          {
            pt: 'O teste reprovou dois requisitos: latência e naturalidade — a voz saía "dura, robótica". O motor de ponteiro móvel (v3) responde à latência; a naturalidade foi atacada pelo Retune Speed com fusão do Glide, tolerância em cents e humanize.',
          },
          { pt: 'O README não esconde nenhum dos dois, e isso está registrado de propósito.' },
        ],
      },
      {
        titulo: { pt: 'A documentação corrige a própria documentação' },
        texto: [
          {
            pt: 'O projeto carrega uma errata da revisão bibliográfica e um documento (`analise-v1-v2-v3.md`) que existe só para corrigir dois números de latência errados em outros arquivos, aberto com o aviso "leia antes de citar qualquer número".',
          },
          {
            pt: 'Um trabalho que documenta os próprios erros vale mais que um que só mostra o que deu certo.',
          },
        ],
      },
    ],
  },
}
