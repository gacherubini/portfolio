/**
 * A EXPERIÊNCIA — a segunda seção da home, entre o Sobre e os projetos.
 *
 * O texto sai do currículo em PDF (set/2026), mas não é o currículo: lá cada
 * bullet precisa provar competência para um filtro automático, aqui a página
 * já tem os quatro sistemas embaixo fazendo essa prova. Então cada bloco é
 * UMA FRASE. Quem quiser a lista inteira de tecnologia baixa o PDF.
 *
 * CADA LINHA É UM BLOCO COM TÍTULO. É a peça `atividades: { title, desc }`
 * do currículo do Enzo, e ela funciona porque o olho que varre a página lê
 * só os títulos e decide onde parar. Lista de frases soltas do mesmo
 * tamanho obriga a ler tudo ou nada.
 *
 * A AMBUSH SÃO DOIS CARGOS, o mais recente primeiro — igual ao currículo e ao
 * LinkedIn: Backend Developer (fev 2024 — atual) e Junior Backend Developer
 * (fev 2023 — fev 2024). Não há divisão por linguagem nem "Go até <mês>": o Go
 * foi usado em mais de um projeto lá, sem ano exato.
 *
 * NÃO CITAR O NOME DO CLIENTE DA AMBUSH (NDA não confirmado): "uma grande
 * exchange de cripto dos EUA".
 *
 * O ESTÁGIO DE SUPORTE FICOU DE FORA, por decisão do dono em 09/09. Ele
 * estava no currículo e chegou a entrar aqui; a lista é curta de propósito,
 * e três meses de suporte não sustentam uma linha ao lado da Ambush.
 */
import type { Texto } from '@/content/tipos'

/** Um bloco: o assunto na frente, uma frase atrás. */
export type Bloco = { titulo: Texto; texto: Texto }

export type Cargo = {
  id: string
  /** Nome próprio: não muda de idioma. */
  empresa: string
  cargo: Texto
  periodo: Texto
  local: Texto
  /** Formação entra na mesma linha do tempo, marcada. */
  tipo: 'trabalho' | 'formacao'
  /** O cargo de hoje. Só um pode ter. */
  atual?: boolean
  blocos: Bloco[]
  /** Só onde há pilha declarada — a formação não tem. */
  pilha?: string[]
  /**
   * A marca na coluna da data, pintada por `mask-image` + `currentColor` —
   * nunca presa num hex. `largura`/`altura` são a CAIXA ÓTICA de exibição
   * (não o PNG): "PUCRS" é caixa-alta e ocupa o recorte inteiro, "ambush" é
   * minúsculo e gasta parte com as ascendentes — nos mesmos 20px a PUCRS
   * pareceria maior. O `alt` é o nome da instituição e não muda de idioma.
   */
  marca?: { arquivo: string; largura: number; altura: number; alt: string }
}

export const experiencia: Cargo[] = [
  {
    id: 'ambush',
    empresa: 'Ambush',
    cargo: { pt: 'Desenvolvedor backend', en: 'Backend Developer' },
    periodo: { pt: 'fev 2024 — atual', en: 'Feb 2024 — present' },
    local: { pt: 'Austin, Texas, EUA · remoto', en: 'Austin, Texas, USA · remote' },
    tipo: 'trabalho',
    atual: true,
    pilha: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis'],
    marca: { arquivo: 'ambush.png', largura: 91, altura: 20, alt: 'Ambush' },
    blocos: [
      {
        titulo: { pt: 'Carteira e mercado', en: 'Wallets and market data' },
        texto: {
          pt: 'Java e Spring Boot em carteiras digitais, contas, depósitos, saques, dados de ativos e mercado, cálculos de portfólio e workflows de KYC e compliance de uma grande exchange de cripto dos EUA.',
          en: 'Java and Spring Boot on digital wallets, accounts, deposits, withdrawals, asset and market data, portfolio calculations and KYC and compliance workflows for a large U.S. crypto exchange.',
        },
      },
      {
        titulo: { pt: 'Contratos de API', en: 'API contracts' },
        texto: {
          pt: 'Contratos REST e gRPC (OpenAPI e Protobuf) definidos antes do código.',
          en: 'REST and gRPC contracts (OpenAPI and Protobuf) defined before the code.',
        },
      },
      {
        titulo: { pt: 'O que acontece depois do deploy', en: 'What happens after the deploy' },
        texto: {
          pt: 'Cache em Redis, correção em lote com erro isolado por item, e painel que mostra a causa antes de o suporte perguntar.',
          en: 'Redis caching, batch fixes with per-item error isolation, and dashboards that show the cause before support asks.',
        },
      },
      {
        titulo: { pt: 'Agentes de código, todo dia', en: 'Coding agents, every day' },
        texto: {
          pt: 'Uso agentes de código (Claude Code, Codex, OpenCode) todo dia no fluxo spec-driven: implementar, testar e revisar.',
          en: 'I use coding agents (Claude Code, Codex, OpenCode) every day within the spec-driven workflow to implement, test and review changes.',
        },
      },
    ],
  },

  {
    id: 'ambush-junior',
    empresa: 'Ambush',
    cargo: { pt: 'Desenvolvedor backend júnior', en: 'Junior Backend Developer' },
    periodo: { pt: 'fev 2023 — fev 2024', en: 'Feb 2023 — Feb 2024' },
    local: { pt: 'Austin, Texas, EUA · remoto', en: 'Austin, Texas, USA · remote' },
    tipo: 'trabalho',
    pilha: ['Go', 'PostgreSQL', 'GCP Pub/Sub'],
    marca: { arquivo: 'ambush.png', largura: 91, altura: 20, alt: 'Ambush' },
    blocos: [
      {
        titulo: { pt: 'Plataforma interna de RH', en: 'Internal HR platform' },
        texto: {
          pt: 'Em Go: perfis, filtro de skills e agendamento de entrevistas, com PostgreSQL e GCP Pub/Sub.',
          en: 'In Go: profiles, skills filtering and interview scheduling, with PostgreSQL and GCP Pub/Sub.',
        },
      },
    ],
  },

  {
    id: 'pucrs',
    empresa: 'PUC-RS',
    cargo: { pt: 'Bacharelado em Ciência da Computação', en: 'BSc in Computer Science' },
    periodo: { pt: 'mar 2022 — dez 2026', en: 'Mar 2022 — Dec 2026' },
    local: { pt: 'Porto Alegre, Brasil', en: 'Porto Alegre, Brazil' },
    tipo: 'formacao',
    blocos: [],
    marca: { arquivo: 'pucrs.png', largura: 61, altura: 17, alt: 'PUCRS' },
  },
]
