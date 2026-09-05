import type { Projeto } from '@/content/tipos'

export const autotune: Projeto = {
  slug: 'autotune',
  nome: 'Autotune',
  paraQuem: { pt: 'Trabalho de conclusão, PUCRS', en: 'Undergraduate thesis, PUCRS' },
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
    {
      rotulo: { pt: 'O que é', en: 'What it is' },
      valor: { pt: 'Parte prática do TCC, PUCRS', en: 'Practical part of the thesis, PUCRS' },
    },
    {
      rotulo: { pt: 'Situação', en: 'Status' },
      valor: { pt: 'Publicado, código aberto', en: 'Published, open source' },
    },
    {
      rotulo: { pt: 'Entrega', en: 'Delivery' },
      valor: {
        pt: 'Executáveis de linha de comando, núcleo de streaming header-only e plugin VST3 / Standalone',
        en: 'Command-line executables, a header-only streaming core, and a VST3 / Standalone plugin',
      },
    },
    {
      rotulo: { pt: 'Testado em', en: 'Tested in' },
      valor: { pt: 'Ableton Live', en: 'Ableton Live' },
    },
  ],

  resumoHome: {
    pt: 'O que o Auto-Tune faz, feito do zero em C++. Dois motores de correção com o mesmo deslocamento: um preserva a voz da pessoa, o outro preserva a latência.',
    en: "What Auto-Tune does, built from scratch in C++. Two correction engines with the same pitch shift: one preserves the singer's voice, the other preserves latency.",
  },

  chamada: {
    pt: 'Um corretor de afinação vocal em tempo real, feito do zero em C++ — com dois motores de correção que resolvem a mesma nota de dois jeitos opostos.',
    en: 'A real-time vocal pitch corrector, built from scratch in C++ — with two correction engines that solve the same note in two opposite ways.',
  },

  problema: [
    {
      pt: 'Corrigir a afinação de uma voz parece um problema só, e são dois. Quem está cantando precisa se ouvir corrigido no fone, na hora — qualquer atraso perceptível atrapalha o próprio take. Quem está mixando uma gravação antiga não tem pressa nenhuma, mas não aceita que a voz saia descaracterizada.',
      en: "Correcting a voice's pitch looks like one problem, and it's two. The person singing needs to hear themselves corrected in their headphones, right now — any perceptible delay throws off the take itself. The person mixing an old recording is in no hurry at all, but won't accept the voice coming out unrecognizable.",
    },
    {
      pt: 'Os dois pedidos puxam para lados opostos, e é comum ver o assunto tratado como se houvesse uma resposta única.',
      en: 'The two demands pull in opposite directions, and the subject is often treated as if there were a single answer.',
    },
  ],

  oQueFaz: [
    {
      pt: 'Encontra a nota que está sendo cantada com pYIN — o YIN probabilístico, com HMM e Viterbi —, compara com a escala escolhida e desloca o sinal para a nota alvo.',
      en: 'Finds the note being sung with pYIN — the probabilistic YIN, with HMM and Viterbi —, compares it against the chosen scale, and shifts the signal to the target note.',
    },
    {
      pt: 'O deslocamento é o mesmo nos dois casos; o que muda é quem executa. Assumir isso na interface, e deixar a escolha com quem está cantando, é o que o trabalho defende. Junto vêm os controles de tessitura, tônica e escala, e a correção regulada por Retune Speed, tolerância em cents, Natural Vibrato e Humanize.',
      en: "The pitch shift is the same in both cases; what changes is who performs it. Owning that in the interface, and leaving the choice to the singer, is what the thesis argues for. Alongside it come the vocal range, key, and scale controls, and correction tuned by Retune Speed, tolerance in cents, Natural Vibrato, and Humanize.",
    },
  ],

  destaque: {
    titulo: { pt: 'Dois motores para a mesma correção', en: 'Two engines for the same correction' },
    texto: [
      {
        pt: 'O sistema encontra a nota com pYIN e corrige por um de dois motores de síntese, com o mesmo deslocamento. Um deles preserva os formantes: a voz continua soando como a pessoa. O outro preserva a latência: oito amostras fixas, e o cantor se escuta corrigido enquanto canta. Escolher entre os dois é a principal contribuição de engenharia do trabalho.',
        en: "The system finds the note with pYIN and corrects it through one of two synthesis engines, with the same pitch shift. One of them preserves the formants: the voice still sounds like the person. The other preserves latency: eight fixed samples, and the singer hears themselves corrected while singing. Choosing between the two is the thesis's main engineering contribution.",
      },
    ],
    prints: [
      {
        arquivo: '05-plugin-cantando-psola.png',
        largura: 637,
        altura: 455,
        // Nome de motor é nome, não código: fica em Archivo, não em mono.
        etiqueta: { pt: 'TD-PSOLA', en: 'TD-PSOLA' },
        valor: '61,72 ms',
        alt: {
          pt: 'O plugin corrigindo ao vivo com TD-PSOLA, Low Latency desmarcado: nota-alvo E3, cantado 154,0 Hz contra alvo 164,8 Hz, correção de +118 cents, o gráfico cheio com a voz sendo corrigida, e latência de 61,72 ms no rodapé.',
          en: 'The plugin correcting live with TD-PSOLA, Low Latency unchecked: target note E3, sung at 154,0 Hz against a target of 164,8 Hz, a correction of +118 cents, the graph filled with the voice being corrected, and a latency of 61,72 ms in the footer.',
        },
        legenda: {
          pt: 'O motor padrão, corrigindo. E3 na mira: cantado a 154,0 Hz, alvo 164,8 Hz, +118 cents. Ele reconstrói o sinal preservando os formantes — a voz continua soando como a pessoa —, e cobra 61,72 ms por isso. Corrigindo uma faixa já gravada, esse é o motor certo: o formante importa mais que a latência.',
          en: "The default engine, correcting. E3 in the crosshairs: sung at 154,0 Hz, target 164,8 Hz, +118 cents. It reconstructs the signal while preserving the formants — the voice still sounds like the person —, and it charges 61,72 ms for that. Correcting a track that's already recorded, this is the right engine: the formant matters more than the latency.",
        },
      },
      {
        arquivo: '01-plugin-cantando-v3.png',
        largura: 639,
        altura: 458,
        etiqueta: { pt: 'Ponteiro móvel (v3)', en: 'Moving pointer (v3)' },
        valor: '0,18 ms',
        // O comp da home abre a faixa do Autotune com este print, não com o
        // TD-PSOLA que vem primeiro no destaque.
        naFaixa: true,
        alt: {
          pt: 'O mesmo plugin corrigindo voz ao vivo, com Low Latency marcado e o cabeçalho pYIN para ponteiro móvel (v3): nota-alvo F3, cantado 170,9 Hz contra alvo 174,6 Hz, correção de mais 38 cents, o gráfico cheio com a linha de correção ao longo do tempo e a latência de 0,18 ms.',
          en: 'The same plugin correcting voice live, with Low Latency checked and the pYIN header set to moving pointer (v3): target note F3, sung at 170,9 Hz against a target of 174,6 Hz, a correction of plus 38 cents, the graph filled with the correction line over time and a latency of 0,18 ms.',
        },
        legenda: {
          pt: 'O mesmo plugin, o mesmo cantor, com Low Latency marcado. F3 na mira: cantado a 170,9 Hz, alvo 174,6 Hz, correção de +38 cents ao vivo. São 8 amostras fixas de atraso. Monitorando a própria voz, 61 ms é intolerável — aqui esse problema some.',
          en: 'The same plugin, the same singer, with Low Latency checked. F3 in the crosshairs: sung at 170,9 Hz, target 174,6 Hz, a correction of +38 cents live. That is 8 fixed samples of delay. Monitoring your own voice, 61 ms is intolerable — here that problem disappears.',
        },
      },
    ],
    fecho: {
      pt: 'Mesmo plugin, mesmo cantor, dois números de latência separados por um fator de *340*. Não existe motor certo: existe o que o cantor precisa naquele take.',
      en: "Same plugin, same singer, two latency numbers separated by a factor of *340*. There's no right engine: there's what the singer needs for that take.",
    },
  },

  numeros: [
    {
      valor: '61,72 ms',
      rotulo: { pt: 'TD-PSOLA, preserva os formantes', en: 'TD-PSOLA, preserves the formants' },
    },
    {
      valor: '0,18 ms',
      rotulo: { pt: 'ponteiro móvel, 8 amostras fixas', en: 'moving pointer, 8 fixed samples' },
    },
    {
      valor: '340×',
      rotulo: { pt: 'de diferença entre os dois motores', en: 'difference between the two engines' },
    },
  ],

  // Sem galeria: dos quatro prints, dois estão no destaque e dois são
  // matplotlib no default e não separam nada.
  galeria: [],

  // A confirmar com o dono quais repositórios entram: TCC_autotune_cpp,
  // TCC-autotune-python, TCC-TEXT. Os dois abaixo saem do comp P4; se alguma
  // URL estiver errada, o contrato recusa href vazio e a build aponta.
  links: [
    {
      rotulo: { pt: 'Ver o protótipo em C++', en: 'See the C++ prototype' },
      href: 'https://github.com/gacherubini/TCC_autotune_cpp',
      primario: true,
    },
    {
      rotulo: { pt: 'Ver o estudo de detecção de pitch', en: 'See the pitch detection study' },
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
        en: 'The same core runs outside the plugin, from the command line. Five seconds of audio in *0,207 s* — about 24× faster than real time.',
      },
    },

    notas: [
      {
        titulo: { pt: 'Um núcleo, três entregas', en: 'One core, three deliverables' },
        texto: [
          {
            pt: 'O núcleo de streaming é header-only, e é o mesmo código nos três lugares: nos executáveis de linha de comando, no plugin VST3 e no Standalone. Build por CMake, leitura de WAV com `dr_wav`, interface e empacotamento com JUCE.',
            en: "The streaming core is header-only, and it's the same code in all three places: the command-line executables, the VST3 plugin, and the Standalone. Built with CMake, WAV reading with `dr_wav`, interface and packaging with JUCE.",
          },
          {
            pt: 'O plugin foi validado no Ableton Live, que é onde a conta de latência deixa de ser teórica.',
            en: 'The plugin was validated in Ableton Live, which is where the latency math stops being theoretical.',
          },
        ],
      },
      {
        titulo: {
          pt: 'A escolha do pYIN veio de um estudo, não de um chute',
          en: 'The choice of pYIN came from a study, not a guess',
        },
        texto: [
          {
            pt: 'O segundo repositório, em Python, compara algoritmos de detecção de pitch antes de o C++ existir. É esse estudo que fundamenta a escolha do pYIN para o protótipo.',
            en: 'The second repository, in Python, compares pitch detection algorithms from before the C++ existed. That study is what grounds the choice of pYIN for the prototype.',
          },
          {
            pt: 'É trabalho que não aparece na interface e sustenta tudo o que aparece.',
            en: "It's work that doesn't show up in the interface and props up everything that does.",
          },
        ],
      },
      {
        titulo: { pt: 'O que reprovou no teste de usuário', en: 'What failed the user test' },
        texto: [
          {
            pt: 'O teste reprovou dois requisitos: latência e naturalidade — a voz saía "dura, robótica". O motor de ponteiro móvel (v3) responde à latência; a naturalidade foi atacada pelo Retune Speed com fusão do Glide, tolerância em cents e humanize.',
            en: 'The test failed two requirements: latency and naturalness — the voice came out "stiff, robotic". The moving pointer engine (v3) addresses latency; naturalness was tackled by Retune Speed merged with Glide, tolerance in cents, and humanize.',
          },
          {
            pt: 'O README não esconde nenhum dos dois, e isso está registrado de propósito.',
            en: "The README doesn't hide either one, and that's on record on purpose.",
          },
        ],
      },
      {
        titulo: {
          pt: 'A documentação corrige a própria documentação',
          en: 'The documentation corrects its own documentation',
        },
        texto: [
          {
            pt: 'O projeto carrega uma errata da revisão bibliográfica e um documento (`analise-v1-v2-v3.md`) que existe só para corrigir dois números de latência errados em outros arquivos, aberto com o aviso "leia antes de citar qualquer número".',
            en: 'The project carries an erratum for the literature review and a document (`analise-v1-v2-v3.md`) that exists only to correct two wrong latency numbers in other files, opening with the warning "read before citing any number".',
          },
          {
            pt: 'Um trabalho que documenta os próprios erros vale mais que um que só mostra o que deu certo.',
            en: 'A thesis that documents its own mistakes is worth more than one that only shows what went right.',
          },
        ],
      },
    ],
  },
}
