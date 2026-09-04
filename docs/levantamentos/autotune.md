# Autotune — levantamento

Data: 2026-09-04. Matéria-prima para `content/projetos/autotune.ts`.
Parte prática do TCC de Gabriel na PUCRS, 2026.

## O que é

Um corretor automático de afinação vocal em tempo real. O que o Auto-Tune faz,
feito do zero em C++, com software livre.

Entrega em três formas: executáveis de linha de comando, um núcleo de streaming
header-only, e um **plugin VST3 / Standalone testado no Ableton Live**.

Dois repositórios:

- `TCC_autotune_cpp` — o protótipo
- `TCC-autotune-python` — o estudo comparativo de algoritmos de detecção de
  pitch que fundamentou a escolha do pYIN

## A feature de destaque: os dois motores

O sistema detecta o pitch com **pYIN** (YIN probabilístico com HMM/Viterbi) e
corrige por um de dois motores de síntese, com o mesmo deslocamento:

| Motor | O que preserva | Latência medida |
|---|---|---|
| **TD-PSOLA** (padrão) | os formantes — a voz continua soando como a pessoa | **61,72 ms** |
| **Ponteiro móvel (v3)** | a latência — 8 amostras fixas | **0,18 ms** |

Escolher entre os dois **é a principal contribuição de engenharia do TCC 2.**
Não existe motor certo: existe o que o cantor precisa naquele take. Monitorando
a própria voz ao vivo, 61 ms é intolerável. Corrigindo uma faixa já gravada, o
formante importa mais que a latência.

Isso é o que a página tem que contar, e as duas telas provam:

- `05-plugin-cantando-psola.png` — TD-PSOLA corrigindo ao vivo, Low Latency
  desmarcado, E3 na mira, cantado 154,0 Hz contra alvo 164,8 Hz, **+118 cents**,
  gráfico cheio e **latência 61,72 ms** no rodapé. Entrou em 04/09 e substituiu
  o `02` no par do destaque: com os dois motores cantando, a única diferença
  entre as duas telas passa a ser o motor e o número da latência.
- `01-plugin-cantando-v3.png` — Low Latency marcado, `pYIN -> PONTEIRO MOVEL
  (v3)` no topo, **latência 0,18 ms**, e o gráfico cheio com a voz sendo
  corrigida ao vivo (F3, cantado 170,9 Hz, alvo 174,6 Hz, **+38 cents**)

O mesmo plugin, o mesmo cantor, dois números de latência separados por um fator
de 340. É a imagem que explica o trabalho inteiro.

### Sobre o número do Auto-Tune

A documentação do projeto deduz que o Auto-Tune declara **0,84 ms** a partir de
37 amostras fixas, e a arquitetura de ponteiro móvel da patente. O v3 chega a
0,18 ms (8 amostras a 44,1 kHz).

**Cuidado no texto do site:** comparar número declarado de dois produtos não é
benchmark. O que dá para afirmar é que o v3 usa a mesma família de arquitetura
descrita na patente, e que a interface do protótipo reporta 0,18 ms de latência
fixa nesse estágio. Nada além disso sem medir os dois na mesma bancada.

## O que dá para dizer com honestidade

O README do projeto não esconde o que falhou, e isso vale mais que
esconder. **O teste de usuário reprovou dois requisitos: latência e
naturalidade** ("duro, robótico"). O v3 endereça a latência; a naturalidade foi
atacada pelo Retune Speed com fusão do Glide, tolerância em cents e humanize.

A documentação inclui uma **errata da revisão bibliográfica** e um documento
(`analise-v1-v2-v3.md`) que existe para corrigir dois números de latência errados
em outros documentos, com o aviso "leia antes de citar qualquer número".

Um TCC que documenta os próprios erros é um argumento melhor que um TCC que só
mostra o que deu certo. Vale uma linha no texto.

## Números medidos

Rodando o CLI no áudio de exemplo do repo em 04/09/2026:

```
$ autotune.exe exemplo-antes.wav saida.wav 1.0 Am tol=15 glide=40

Sinal: 5.00 s | 44100 Hz | mix=1.00
Escala: Am  (notas alvo: C D E F G A B )
tol=15 ct | retune=40 ms | vibrato=1.00 | humanize=0.00

Correcao planejada (1 leitura por segundo):
  t=  1.0s   376.2 Hz -> G4   ( 388.6 Hz)  correcao   +56 ct
  t=  2.0s   371.9 Hz -> G4   ( 388.6 Hz)  correcao   +76 ct
  t=  3.0s   278.6 Hz -> D4   ( 291.1 Hz)  correcao   +76 ct
  t=  4.0s   194.7 Hz -> G3   ( 194.7 Hz)  correcao    +0 ct

real  0m0.207s
```

**5 segundos de áudio em 0,207 s.** Roda ~24× mais rápido que o tempo real.

Esse bloco é bom conteúdo, mas **não como imagem** — vale renderizar como texto
na página, em fonte monoespaçada e na paleta do projeto. Texto de verdade é mais
nítido que print de texto, e dá para selecionar e ler no leitor de tela.

## Controles do plugin

**Escala**: tessitura (Alto-Tenor C3-F5), tônica, escala (cromática, menor
natural, maior). **Correção**: Retune Speed em ms, Natural Vibrato, Humanize.
**Motor**: Low Latency, Look-ahead, Mix. Mostrador de nota-alvo com desvio em
cents e gráfico de correção ao longo do tempo.

## Stack

C++ com JUCE (plugin e standalone) e `dr_wav` (leitura de WAV). Núcleo de
streaming header-only. Build por CMake. Plugin VST3 validado no Ableton Live.

## Prints

Em `public/prints/autotune/`:

| Arquivo | O que é | Serve? |
|---|---|---|
| `01-plugin-cantando-v3.png` | plugin corrigindo voz ao vivo, v3, 0,18 ms | **sim, é o principal** |
| `05-plugin-cantando-psola.png` | plugin corrigindo ao vivo, TD-PSOLA, 61,72 ms | **sim, faz o par** |
| `02-plugin-parado-psola.png` | plugin em repouso, TD-PSOLA, 61,72 ms | não — o `05` mostra o mesmo motor em uso e ganha dele |
| `03-comparativo-rpa.png` | RPA por algoritmo, dataset vocadito | **fraco** |
| `04-comparativo-gpe.png` | GPE por algoritmo, dataset vocadito | **fraco** |

Os dois comparativos são matplotlib no default: barras azuis em fundo branco,
que vão brigar com a faixa escura do projeto. Pior: no RPA os quatro algoritmos
ficam todos perto de 0,99 e o gráfico não separa nada — só o `swipe` cai, e com
barra de erro enorme. Prova acadêmica boa, imagem de vitrine ruim.

Duas saídas: redesenhar os dois na paleta do projeto (o dado está em
`TCC_autotune/results/`), ou deixar de fora e viver com os dois prints do
plugin, que já contam a história. **Recomendo deixar de fora.**

Os dois prints do plugin são capturas nativas da janela (639×458 e 642×488).
Numa faixa de 1600 px vão ficar moles. Se der para recapturar em tela de maior
densidade, vale.

## Decisão em aberto: a paleta

A spec deu ao Autotune fundo `#10312F` e destaque **âmbar `#F3B843`**, com a
origem descrita como "âmbar da curva de pitch".

**Os prints desmentem isso.** A interface real é verde quase preto com verde
menta — e menta é exatamente o destaque da Revy (`#7CE0A8`). Duas faixas com o
mesmo acento quebram a direção Camaleão, que só funciona porque cada cor é a do
sistema.

Três saídas:

1. **Fundo teal profundo `#10312F` + menta real.** O fundo é visivelmente mais
   verde e mais claro que o preto da Revy (`#0C0D0C`), e isso separa as duas
   faixas mesmo com acentos parecidos. É a que eu recomendo.
2. Manter o âmbar, assumindo que é cor inventada — quebra a premissa de que as
   cores são reais.
3. Puxar um segundo acento da interface e usar menta só em detalhe.

Precisa da decisão do dono antes de escrever `content/projetos/autotune.ts`.

## Links no site

O TCC está publicado. Confirmar com o dono quais repositórios entram como link:
`TCC_autotune_cpp`, `TCC-autotune-python`, `TCC-TEXT` (o texto em LaTeX).
