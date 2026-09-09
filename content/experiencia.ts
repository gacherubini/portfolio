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
 * OS DOIS PROJETOS DA AMBUSH SÃO FASES, NÃO EMPREGOS. Um cartão só, com a
 * fase antiga carregando a própria data no último bloco. Dois cartões
 * repetiriam o nome da empresa e sugeririam duas contratações.
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
}

export const experiencia: Cargo[] = [
  {
    id: 'ambush',
    empresa: 'Ambush',
    cargo: { pt: 'Desenvolvedor backend', en: 'Backend developer' },
    periodo: { pt: 'fev 2023 — atual', en: 'Feb 2023 — present' },
    local: { pt: 'Austin, Texas · remoto', en: 'Austin, Texas · remote' },
    tipo: 'trabalho',
    atual: true,
    pilha: ['Java', 'Spring Boot', 'Go', 'PostgreSQL', 'Redis'],
    blocos: [
      {
        titulo: { pt: 'Carteira e mercado', en: 'Wallets and market data' },
        texto: {
          pt: 'Microsserviços em Java e Spring Boot no backend da Binance: saldo, depósito, saque, preço e cálculo de portfólio.',
          en: 'Java and Spring Boot microservices on Binance’s backend: balances, deposits, withdrawals, pricing and portfolio calculations.',
        },
      },
      {
        titulo: { pt: 'Contratos de API', en: 'API contracts' },
        texto: {
          pt: 'REST e gRPC entre vários times consumindo os mesmos serviços. Documentação primeiro, código depois.',
          en: 'REST and gRPC across several teams consuming the same services. Documentation first, code after.',
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
        titulo: { pt: 'Go, antes disso · fev 2023 — jun 2024', en: 'Go, before that · Feb 2023 — Jun 2024' },
        texto: {
          pt: 'A plataforma interna de RH da empresa, sobre PostgreSQL. Foi por onde entrei.',
          en: 'The company’s internal HR platform, over PostgreSQL. It’s how I came in.',
        },
      },
    ],
  },

  {
    id: 'prefeitura',
    empresa: 'Prefeitura de Porto Alegre',
    cargo: { pt: 'Estágio em suporte técnico', en: 'Technical support intern' },
    periodo: { pt: 'dez 2022 — fev 2023', en: 'Dec 2022 — Feb 2023' },
    local: { pt: 'Porto Alegre, Brasil', en: 'Porto Alegre, Brazil' },
    tipo: 'trabalho',
    blocos: [
      {
        titulo: { pt: 'Onde eu comecei', en: 'Where I started' },
        texto: {
          pt: 'Três meses do outro lado do balcão, que é de onde se aprende que sistema quebrado tem gente esperando.',
          en: 'Three months on the other side of the counter, which is where you learn that a broken system has someone waiting.',
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
  },
]
