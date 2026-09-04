#!/usr/bin/env node
/**
 * Seed de dados FICTÍCIOS para o Office Timesheet (uso: prints de portfólio).
 *
 * Empresa, pessoas, clientes e projetos são INVENTADOS. Nenhum dado real de
 * empresa ou de pessoa entra aqui. O script é idempotente: ele LIMPA todas as
 * tabelas de aplicação (menos `_migrations`) e reescreve o mesmo conjunto.
 *
 * Uso:
 *   node scripts/seed-office-timesheet.js
 *
 * Variáveis:
 *   DATABASE_URL  connection string do Postgres
 *                 (default: postgres://postgres:dev@localhost:5432/office_timesheet)
 *   OT_DIR        pasta `src/` do office-timesheet, de onde saem `pg` e `bcryptjs`
 *                 (default: ../../office-timesheet/src relativo a este arquivo)
 *
 * Pré-requisito: migrations já aplicadas (`cd office-timesheet/src && npm run migrate`).
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// `pg` e `bcryptjs` moram no node_modules do office-timesheet; este script vive
// no portfólio. createRequire ancorado lá resolve os dois sem duplicar deps.
const OT_DIR = process.env.OT_DIR
  || path.resolve(__dirname, '..', '..', 'office-timesheet', 'src')
const require = createRequire(path.join(OT_DIR, 'package.json'))
const pg = require('pg')
const bcrypt = require('bcryptjs')

const DATABASE_URL = process.env.DATABASE_URL
  || 'postgres://postgres:dev@localhost:5432/office_timesheet'

const SENHA_PADRAO = 'portfolio123'

// ─── PRNG determinístico ────────────────────────────────────────────────────
// Math.random deixaria cada rodada com números diferentes; o print do portfólio
// tem que ser reproduzível.
let _seed = 20260904
function rnd() {
  _seed |= 0
  _seed = (_seed + 0x6d2b79f5) | 0
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const pick = (arr) => arr[Math.floor(rnd() * arr.length)]
const int = (min, max) => min + Math.floor(rnd() * (max - min + 1))

// ─── Datas ──────────────────────────────────────────────────────────────────
const HOJE = new Date()
const ANO = HOJE.getFullYear()
const MES = HOJE.getMonth() // 0-based

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const ehDiaUtil = (d) => d.getDay() !== 0 && d.getDay() !== 6

/** Dias úteis de um mês. `ateHoje` corta no dia de hoje (mês corrente). */
function diasUteis(ano, mes, ateHoje = false) {
  const dias = []
  const ultimo = new Date(ano, mes + 1, 0).getDate()
  const limite = ateHoje ? Math.min(ultimo, HOJE.getDate()) : ultimo
  for (let dia = 1; dia <= limite; dia++) {
    const d = new Date(ano, mes, dia)
    if (ehDiaUtil(d)) dias.push(d)
  }
  return dias
}

/** Timestamp local no dia `d`, às `h`:`m`. */
const em = (d, h, m = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0, 0)

// ─── Empresa fictícia ───────────────────────────────────────────────────────
const DOMINIO = 'studioaurora.com.br'

const PESSOAS = [
  { nome: 'Helena Vasconcelos', email: `helena.vasconcelos@${DOMINIO}`, role: 'admin', cargo: 'Diretora de Operações', rate: 180, salario: 16500, meta: 22000, nasc: '1985-03-12', admissao: '2019-02-04', fone: '(11) 98812-4471' },
  { nome: 'Rafael Toledo', email: `rafael.toledo@${DOMINIO}`, role: 'project_manager', cargo: 'Coordenador de Projetos', rate: 135, salario: 12200, meta: 16000, nasc: '1989-09-08', admissao: '2020-07-13', fone: '(11) 99143-2208' },
  { nome: 'Mariana Duarte', email: `mariana.duarte@${DOMINIO}`, role: 'employee', cargo: 'Arquiteta Sênior', rate: 120, salario: 10800, meta: 14000, nasc: '1990-11-25', admissao: '2021-03-01', fone: '(11) 99620-1187' },
  { nome: 'Thiago Nakamura', email: `thiago.nakamura@${DOMINIO}`, role: 'employee', cargo: 'Arquiteto Pleno', rate: 95, salario: 8400, meta: 11000, nasc: '1993-06-30', admissao: '2022-01-17', fone: '(11) 98455-7719' },
  { nome: 'Camila Bastos', email: `camila.bastos@${DOMINIO}`, role: 'employee', cargo: 'Designer de Interiores', rate: 88, salario: 7900, meta: 10500, nasc: '1994-09-14', admissao: '2022-05-09', fone: '(11) 99087-3364' },
  { nome: 'Gustavo Peçanha', email: `gustavo.pecanha@${DOMINIO}`, role: 'employee', cargo: 'Modelador 3D', rate: 76, salario: 6800, meta: 9000, nasc: '1996-01-19', admissao: '2023-02-06', fone: '(11) 98730-5512' },
  { nome: 'Larissa Andrade', email: `larissa.andrade@${DOMINIO}`, role: 'employee', cargo: 'Arquiteta Júnior', rate: 62, salario: 5200, meta: 7000, nasc: '1998-09-22', admissao: '2024-01-15', fone: '(11) 99512-8830' },
  { nome: 'Bruno Sampaio', email: `bruno.sampaio@${DOMINIO}`, role: 'employee', cargo: 'Projetista de Detalhamento', rate: 70, salario: 6100, meta: 8200, nasc: '1992-04-03', admissao: '2023-08-21', fone: '(11) 98266-4093' },
  { nome: 'Isabela Moreira', email: `isabela.moreira@${DOMINIO}`, role: 'administrative_intern', cargo: 'Estagiária Administrativa', rate: 32, salario: 2100, meta: 2500, nasc: '2002-09-27', admissao: '2025-02-10', fone: '(11) 99378-1046' },
]

const CLIENTES = [
  { nome: 'Construtora Vale Verde', tipo: 'pj', razao: 'Vale Verde Empreendimentos Imobiliários Ltda.', fantasia: 'Construtora Vale Verde', cnpj: '18.442.907/0001-63', email: 'contato@valeverde.com.br', fone: '(11) 3288-4410', cidade: 'Av. Brigadeiro Faria Lima, 2180 — Jardim Paulistano, São Paulo/SP' },
  { nome: 'Rede Bonsai Cafés', tipo: 'pj', razao: 'Bonsai Alimentos e Bebidas S.A.', fantasia: 'Rede Bonsai Cafés', cnpj: '30.115.688/0001-04', email: 'obras@bonsaicafes.com.br', fone: '(11) 3644-9021', cidade: 'Rua Fidalga, 431 — Vila Madalena, São Paulo/SP' },
  { nome: 'Instituto Cardeal', tipo: 'pj', razao: 'Instituto Cardeal de Educação', fantasia: 'Instituto Cardeal', cnpj: '42.808.310/0001-77', email: 'diretoria@institutocardeal.org.br', fone: '(11) 3901-2265', cidade: 'Rua Cardeal Arcoverde, 1290 — Pinheiros, São Paulo/SP' },
  { nome: 'Eduardo Lacerda', tipo: 'pf', cpf: '318.774.902-55', email: 'eduardo.lacerda@email.com', fone: '(11) 99814-2276', nasc: '1978-05-16', cidade: 'Rua Harmonia, 88 — Vila Madalena, São Paulo/SP' },
  { nome: 'Patrícia Yamaguchi', tipo: 'pf', cpf: '405.226.183-91', email: 'patricia.yamaguchi@email.com', fone: '(11) 99460-7783', nasc: '1983-12-02', cidade: 'Alameda Lorena, 1455 — Jardins, São Paulo/SP' },
  { nome: 'Clínica Vitrine Odontologia', tipo: 'pj', razao: 'Vitrine Serviços Odontológicos Ltda.', fantasia: 'Clínica Vitrine', cnpj: '25.660.443/0001-18', email: 'adm@clinicavitrine.com.br', fone: '(11) 3277-6650', cidade: 'Rua Pamplona, 704 — Jardim Paulista, São Paulo/SP' },
]

const PROJETOS = [
  { nome: 'Residencial Alto da Serra', cliente: 'Construtora Vale Verde', valor: 285000, status: 'active', inicio: `${ANO - 1}-11-04`, endereco: 'Rua Alto da Serra, 320 — Santana, São Paulo/SP', briefing: 'Projeto executivo de 42 unidades residenciais em 3 torres. Entrega do detalhamento por pavimento-tipo e compatibilização com estrutural e hidráulica.' },
  { nome: 'Bonsai Cafés — Flagship Vila Madalena', cliente: 'Rede Bonsai Cafés', valor: 96500, status: 'active', inicio: `${ANO}-02-17`, endereco: 'Rua Fidalga, 431 — Vila Madalena, São Paulo/SP', briefing: 'Loja-conceito de 180 m² com marcenaria sob medida, luminotécnico próprio e manual de implantação para replicar em 12 unidades da rede.' },
  { nome: 'Instituto Cardeal — Biblioteca', cliente: 'Instituto Cardeal', valor: 148000, status: 'active', inicio: `${ANO}-04-08`, endereco: 'Rua Cardeal Arcoverde, 1290 — Pinheiros, São Paulo/SP', briefing: 'Retrofit da biblioteca e do auditório anexo, com acessibilidade plena, tratamento acústico e mobiliário especificado.' },
  { nome: 'Casa Lacerda — Reforma Integral', cliente: 'Eduardo Lacerda', valor: 72000, status: 'active', inicio: `${ANO}-06-02`, endereco: 'Rua Harmonia, 88 — Vila Madalena, São Paulo/SP', briefing: 'Reforma de sobrado de 240 m²: ampliação do térreo, novo layout dos dormitórios e paisagismo do quintal.' },
  { nome: 'Apartamento Jardins — Yamaguchi', cliente: 'Patrícia Yamaguchi', valor: 54800, status: 'completed', inicio: `${ANO}-01-13`, endereco: 'Alameda Lorena, 1455 — Jardins, São Paulo/SP', briefing: 'Interiores de apartamento de 165 m². Escopo entregue: projeto executivo, marcenaria e acompanhamento de obra.' },
  { nome: 'Clínica Vitrine — Nova Sede', cliente: 'Clínica Vitrine Odontologia', valor: 119400, status: 'active', inicio: `${ANO}-05-19`, endereco: 'Rua Pamplona, 704 — Jardim Paulista, São Paulo/SP', briefing: 'Sete consultórios, centro cirúrgico e recepção. Projeto sujeito à aprovação da vigilância sanitária.' },
]

const ETAPAS_CATALOGO = [
  { nome: 'Levantamento', desc: 'Medição, fotos e leitura do briefing com o cliente.' },
  { nome: 'Estudo Preliminar', desc: 'Partido, zoneamento e primeiras plantas para validação.' },
  { nome: 'Anteprojeto', desc: 'Solução consolidada, com imagens e memorial descritivo.' },
  { nome: 'Projeto Executivo', desc: 'Detalhamento completo para obra.' },
  { nome: 'Detalhamento e Marcenaria', desc: 'Desenhos de fabricação e especificação de acabamentos.' },
  { nome: 'Aprovações Legais', desc: 'Prefeitura, bombeiros e vigilância sanitária.' },
  { nome: 'Acompanhamento de Obra', desc: 'Visitas periódicas e resolução de pendências em campo.' },
]

const TITULOS_TAREFA = [
  'Compatibilizar planta baixa com o projeto estrutural',
  'Detalhar marcenaria da cozinha',
  'Revisar caderno de acabamentos',
  'Montar prancha de apresentação para o cliente',
  'Levantar quantitativos de piso e revestimento',
  'Atualizar modelo 3D com as alterações da reunião',
  'Especificar luminárias e circuitos',
  'Redesenhar layout do pavimento-tipo',
  'Preparar memorial descritivo',
  'Conferir cotas do executivo antes do envio',
  'Solicitar orçamento de esquadrias',
  'Ajustar acessibilidade do banheiro PCD',
  'Fazer visita técnica e registrar pendências',
  'Renderizar vistas da fachada',
  'Protocolar aprovação na prefeitura',
  'Compilar as-built pós-obra',
]

const DESPESAS = [
  { titulo: 'Uber para visita técnica', desc: 'Ida e volta ao canteiro em Santana.', valor: 68.4 },
  { titulo: 'Plotagem de pranchas A1', desc: '12 pranchas do executivo para a reunião de obra.', valor: 214.0 },
  { titulo: 'Almoço com o cliente', desc: 'Reunião de fechamento do anteprojeto.', valor: 187.5 },
  { titulo: 'Estacionamento — vistoria', desc: 'Vistoria na Pamplona, 4 horas.', valor: 42.0 },
  { titulo: 'Material de maquete', desc: 'Papel paraná, cola e lâminas.', valor: 156.9 },
  { titulo: 'Assinatura de biblioteca 3D', desc: 'Blocos de mobiliário para o mês.', valor: 129.0 },
  { titulo: 'Taxa de protocolo na prefeitura', desc: 'Aprovação do Instituto Cardeal.', valor: 320.75 },
]

const BONUS = [
  { titulo: 'Entrega antecipada do executivo', desc: 'Residencial Alto da Serra entregue 8 dias antes do prazo.', valor: 1200 },
  { titulo: 'Bônus de indicação', desc: 'Indicou a Clínica Vitrine, que virou contrato.', valor: 900 },
  { titulo: 'Horas extras de aprovação', desc: 'Mutirão do protocolo na prefeitura.', valor: 650 },
  { titulo: 'Reconhecimento trimestral', desc: 'Melhor avaliação de cliente no trimestre.', valor: 1500 },
]

// ─── Helpers de SQL ─────────────────────────────────────────────────────────
const { Pool } = pg

async function limpar(client) {
  const { rows } = await client.query(`
    SELECT tablename FROM pg_tables
     WHERE schemaname = 'public' AND tablename <> '_migrations'
  `)
  const nomes = rows.map((r) => `public."${r.tablename}"`).join(', ')
  await client.query(`TRUNCATE ${nomes} RESTART IDENTITY CASCADE`)
  return rows.length
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL })
  const client = await pool.connect()
  const contagem = {}

  try {
    await client.query('BEGIN')

    const limpas = await limpar(client)
    console.log(`Limpou ${limpas} tabelas (todas menos _migrations).`)

    // ── Usuários ────────────────────────────────────────────────────────────
    const hash = await bcrypt.hash(SENHA_PADRAO, 10)
    const users = {}
    for (const p of PESSOAS) {
      // Aniversário sempre no ano corrente para o calendário de aniversariantes
      // do dashboard mostrar gente perto de hoje.
      const { rows } = await client.query(
        `INSERT INTO users (email, password_hash, name, role, hourly_rate, fixed_salary,
                            monthly_income_goal, position, birth_date, phone,
                            admission_date, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true)
         RETURNING id`,
        [p.email, hash, p.nome, p.role, p.rate, p.salario, p.meta, p.cargo, p.nasc, p.fone, p.admissao],
      )
      users[p.nome] = { id: rows[0].id, ...p }
    }
    contagem.usuarios = PESSOAS.length

    // ── Clientes ────────────────────────────────────────────────────────────
    const clientes = {}
    for (const c of CLIENTES) {
      const { rows } = await client.query(
        `INSERT INTO clients (name, email, phone, person_type, cpf, cnpj, razao_social,
                              nome_fantasia, birth_date, address, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        [c.nome, c.email, c.fone, c.tipo, c.cpf || null, c.cnpj || null,
          c.razao || null, c.fantasia || null, c.nasc || null, c.cidade,
          'Cliente fictício — base de demonstração.'],
      )
      clientes[c.nome] = rows[0].id
      await client.query(
        `INSERT INTO person_emails (client_id, label, value, is_primary, position)
         VALUES ($1, 'Principal', $2, true, 0)`, [rows[0].id, c.email],
      )
      await client.query(
        `INSERT INTO person_phones (client_id, label, value, is_primary, position)
         VALUES ($1, 'Comercial', $2, true, 0)`, [rows[0].id, c.fone],
      )
    }
    contagem.clientes = CLIENTES.length

    // ── Catálogo de etapas ──────────────────────────────────────────────────
    const catalogo = {}
    for (let i = 0; i < ETAPAS_CATALOGO.length; i++) {
      const e = ETAPAS_CATALOGO[i]
      const { rows } = await client.query(
        `INSERT INTO stage_catalog (name, description, position) VALUES ($1,$2,$3) RETURNING id`,
        [e.nome, e.desc, i],
      )
      catalogo[e.nome] = rows[0].id
    }
    contagem.etapas_catalogo = ETAPAS_CATALOGO.length

    // ── Projetos + etapas + contratantes ────────────────────────────────────
    const donos = ['Rafael Toledo', 'Mariana Duarte', 'Thiago Nakamura', 'Camila Bastos']
    const statusEtapa = ['aprovada', 'entregue', 'em_andamento', 'nao_iniciada']
    const projetos = []
    for (const pr of PROJETOS) {
      const { rows } = await client.query(
        `INSERT INTO projects (name, client, client_id, status, sale_value, start_date, address, briefing)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [pr.nome, pr.cliente, clientes[pr.cliente], pr.status, pr.valor, pr.inicio, pr.endereco, pr.briefing],
      )
      const projectId = rows[0].id
      await client.query(
        `INSERT INTO project_clients (project_id, client_id, role, is_primary)
         VALUES ($1,$2,'contratante_principal',true)`,
        [projectId, clientes[pr.cliente]],
      )

      // 4 a 6 etapas por projeto, progredindo de aprovada → não iniciada.
      const quantas = pr.status === 'completed' ? ETAPAS_CATALOGO.length : int(4, 6)
      const etapas = []
      for (let i = 0; i < quantas; i++) {
        const e = ETAPAS_CATALOGO[i]
        const st = pr.status === 'completed'
          ? 'aprovada'
          : statusEtapa[Math.min(statusEtapa.length - 1, Math.floor(i / Math.max(1, quantas / statusEtapa.length)))]
        const venc = new Date(ANO, MES, int(-20, 35))
        const { rows: er } = await client.query(
          `INSERT INTO project_stages (project_id, catalog_id, name, position, due_date, owner_id, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [projectId, catalogo[e.nome], e.nome, i, iso(venc), users[pick(donos)].id, st],
        )
        etapas.push(er.rows ? er.rows[0].id : er[0].id)
      }
      projetos.push({ id: projectId, nome: pr.nome, status: pr.status, etapas })
    }
    contagem.projetos = PROJETOS.length
    contagem.etapas_de_projeto = projetos.reduce((s, p) => s + p.etapas.length, 0)

    // ── Tarefas (kanban) ────────────────────────────────────────────────────
    const executores = PESSOAS.filter((p) => p.role !== 'administrative_intern').map((p) => p.nome)
    const statusTask = ['todo', 'in_progress', 'in_review', 'blocked', 'done']
    const prioridades = ['low', 'medium', 'medium', 'high']
    let nTasks = 0
    for (const proj of projetos) {
      const quantas = proj.status === 'completed' ? 5 : int(7, 11)
      for (let i = 0; i < quantas; i++) {
        const st = proj.status === 'completed' ? 'done' : pick(statusTask)
        const venc = new Date(ANO, MES, int(-8, 28))
        await client.query(
          `INSERT INTO tasks (project_id, stage_id, title, description, status, assignee_id,
                              due_date, position, priority, created_by, completed_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [
            proj.id,
            pick(proj.etapas),
            pick(TITULOS_TAREFA),
            'Tarefa de demonstração gerada pelo seed do portfólio.',
            st,
            users[pick(executores)].id,
            iso(venc),
            i,
            pick(prioridades),
            users['Rafael Toledo'].id,
            st === 'done' ? new Date(ANO, MES, int(-10, 0)).toISOString() : null,
          ],
        )
        nTasks++
      }
    }
    contagem.tarefas = nTasks

    // ── Apontamentos de hora ────────────────────────────────────────────────
    // Mês corrente até hoje + os dois meses anteriores completos, para os
    // gráficos de histórico mensal terem série.
    const apontadores = PESSOAS.filter((p) => p.role !== 'administrative_intern')
    const projetosAtivos = projetos.filter((p) => p.status === 'active')
    const janelas = [
      { ano: ANO, mes: MES - 2, ateHoje: false },
      { ano: ANO, mes: MES - 1, ateHoje: false },
      { ano: ANO, mes: MES, ateHoje: true },
    ]

    let nEntries = 0
    let minutosMesCorrente = 0
    for (const j of janelas) {
      const dias = diasUteis(j.ano, j.mes, j.ateHoje)
      const ehMesCorrente = j.mes === MES
      for (const dia of dias) {
        for (const p of apontadores) {
          // Nem todo mundo aponta todo dia — 12% de ausência deixa o
          // "quem não apontou" com conteúdo real.
          if (rnd() < 0.12) continue
          const blocos = int(1, 3)
          let horaAtual = int(8, 10)
          for (let b = 0; b < blocos && horaAtual < 19; b++) {
            const dur = int(45, 210) // minutos
            const inicio = em(dia, horaAtual, pick([0, 15, 30, 45]))
            const fim = new Date(inicio.getTime() + dur * 60000)
            if (fim.getHours() >= 20) break
            const custo = Number(((dur / 60) * p.rate).toFixed(2))
            await client.query(
              `INSERT INTO time_entries (user_id, project_id, started_at, ended_at, status,
                                         duration_minutes, cost_snapshot, created_by_admin)
               VALUES ($1,$2,$3,$4,'completed',$5,$6,false)`,
              [users[p.nome].id, pick(projetosAtivos).id, inicio.toISOString(), fim.toISOString(), dur, custo],
            )
            nEntries++
            if (ehMesCorrente) minutosMesCorrente += dur
            horaAtual = fim.getHours() + 1
          }
        }
      }
    }

    // Três timers abertos AGORA (o índice único permite no máximo um por
    // pessoa): dois rodando e um pausado, para a tela "Ao vivo" ter conteúdo.
    const agora = new Date()
    const abertos = [
      { pessoa: 'Mariana Duarte', minutosAtras: 74, pausado: false },
      { pessoa: 'Thiago Nakamura', minutosAtras: 128, pausado: false },
      { pessoa: 'Camila Bastos', minutosAtras: 41, pausado: true },
    ]
    for (const a of abertos) {
      const inicio = new Date(agora.getTime() - a.minutosAtras * 60000)
      const { rows } = await client.query(
        `INSERT INTO time_entries (user_id, project_id, started_at, status, created_by_admin)
         VALUES ($1,$2,$3,$4,false) RETURNING id`,
        [users[a.pessoa].id, pick(projetosAtivos).id, inicio.toISOString(), a.pausado ? 'paused' : 'running'],
      )
      if (a.pausado) {
        await client.query(
          `INSERT INTO time_entry_pauses (time_entry_id, paused_at)
           VALUES ($1, $2)`,
          [rows[0].id, new Date(agora.getTime() - 12 * 60000).toISOString()],
        )
      }
      nEntries++
    }
    contagem.apontamentos = nEntries
    contagem.horas_no_mes_corrente = Math.round(minutosMesCorrente / 60)

    // ── Pedidos de correção de ponto (fila "Precisa de você") ───────────────
    // O índice único só admite um pendente por apontamento, então cada pedido
    // pega um apontamento diferente.
    const { rows: candidatos } = await client.query(
      `SELECT id, user_id, project_id, started_at, ended_at
         FROM time_entries
        WHERE status = 'completed'
          AND started_at >= date_trunc('month', now())
        ORDER BY started_at DESC
        LIMIT 4`,
    )
    const motivosCorrecao = [
      'Esqueci de encerrar o apontamento na hora que saí para a visita.',
      'Comecei antes de abrir o sistema; o horário certo é o do pedido.',
      'Lancei no projeto errado — era o Bonsai, não o Alto da Serra.',
      'O intervalo do almoço entrou por engano dentro do apontamento.',
    ]
    for (let i = 0; i < candidatos.length; i++) {
      const c = candidatos[i]
      const novoInicio = new Date(new Date(c.started_at).getTime() - 30 * 60000)
      const novoFim = new Date(new Date(c.ended_at).getTime() + 45 * 60000)
      await client.query(
        `INSERT INTO time_entry_change_requests
           (time_entry_id, user_id, requested_project_id, requested_started_at,
            requested_ended_at, reason, status)
         VALUES ($1,$2,$3,$4,$5,$6,'pending')`,
        [c.id, c.user_id, c.project_id, novoInicio.toISOString(), novoFim.toISOString(), motivosCorrecao[i]],
      )
    }
    contagem.pedidos_de_correcao = candidatos.length

    // ── Despesas ────────────────────────────────────────────────────────────
    const statusDespesa = ['pending', 'pending', 'approved', 'approved', 'rejected']
    let nDespesas = 0
    for (let i = 0; i < 14; i++) {
      const d = DESPESAS[i % DESPESAS.length]
      const st = pick(statusDespesa)
      const quem = pick(apontadores).nome
      const data = new Date(ANO, MES, int(-25, 0))
      await client.query(
        `INSERT INTO expense_requests (user_id, title, description, amount, expense_date,
                                       status, admin_note, decided_by, decided_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          users[quem].id, d.titulo, d.desc, d.valor, iso(data), st,
          st === 'rejected' ? 'Sem nota fiscal anexada.' : null,
          st === 'pending' ? null : users['Helena Vasconcelos'].id,
          st === 'pending' ? null : new Date(data.getTime() + 86400000).toISOString(),
        ],
      )
      nDespesas++
    }
    contagem.despesas = nDespesas

    // ── Bônus ───────────────────────────────────────────────────────────────
    let nBonus = 0
    for (let i = 0; i < 6; i++) {
      const b = BONUS[i % BONUS.length]
      const quem = pick(apontadores).nome
      await client.query(
        `INSERT INTO bonuses (user_id, title, description, amount, bonus_date, created_by)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [users[quem].id, b.titulo, b.desc, b.valor, iso(new Date(ANO, MES, int(-40, 0))), users['Helena Vasconcelos'].id],
      )
      nBonus++
    }
    contagem.bonus = nBonus

    // ── Férias ──────────────────────────────────────────────────────────────
    // O EXCLUDE da migration 032 barra sobreposição por pessoa, então cada uma
    // ganha no máximo um pedido, em janelas que não colidem.
    const pedidosFerias = [
      { pessoa: 'Gustavo Peçanha', ini: new Date(ANO, MES + 1, 6), dias: 10, st: 'pending', motivo: 'Viagem em família programada desde o começo do ano.' },
      { pessoa: 'Larissa Andrade', ini: new Date(ANO, MES + 1, 20), dias: 5, st: 'pending', motivo: 'Recesso curto entre as entregas.' },
      { pessoa: 'Bruno Sampaio', ini: new Date(ANO, MES - 1, 10), dias: 15, st: 'approved', motivo: 'Férias regulares do período aquisitivo.' },
      { pessoa: 'Camila Bastos', ini: new Date(ANO, MES + 2, 3), dias: 20, st: 'approved', motivo: 'Férias acumuladas do ano passado.' },
      { pessoa: 'Thiago Nakamura', ini: new Date(ANO, MES, 22), dias: 7, st: 'rejected', motivo: 'Semana de entrega do executivo do Alto da Serra.' },
    ]
    for (const f of pedidosFerias) {
      const fim = new Date(f.ini.getTime() + (f.dias - 1) * 86400000)
      await client.query(
        `INSERT INTO vacation_requests (user_id, start_date, end_date, days_count, reason,
                                        status, admin_note, decided_by, decided_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          users[f.pessoa].id, iso(f.ini), iso(fim), f.dias, f.motivo, f.st,
          f.st === 'rejected' ? 'Conflita com a entrega do executivo. Remarcar para o mês seguinte.' : null,
          f.st === 'pending' ? null : users['Helena Vasconcelos'].id,
          f.st === 'pending' ? null : new Date().toISOString(),
        ],
      )
    }
    contagem.pedidos_de_ferias = pedidosFerias.length

    // ── Presenças de hoje e amanhã ──────────────────────────────────────────
    let nPresencas = 0
    for (const offset of [0, 1]) {
      const dia = new Date(ANO, MES, HOJE.getDate() + offset)
      if (!ehDiaUtil(dia)) continue
      for (const p of PESSOAS) {
        const ausente = rnd() < 0.18
        await client.query(
          `INSERT INTO presences (user_id, date, status, arrival_time, reason)
           VALUES ($1,$2,$3,$4,$5)`,
          [
            users[p.nome].id, iso(dia),
            ausente ? 'absent' : 'coming',
            ausente ? null : pick(['08:30', '09:00', '09:30', '10:00']),
            ausente ? pick(['Visita técnica em obra', 'Consulta médica', 'Home office']) : null,
          ],
        )
        nPresencas++
      }
    }
    contagem.presencas = nPresencas

    await client.query('COMMIT')

    console.log('\n─── Seed concluído ───')
    for (const [k, v] of Object.entries(contagem)) {
      console.log(`  ${k.padEnd(24)} ${v}`)
    }
    console.log('\n─── Credenciais (todas com a mesma senha) ───')
    console.log(`  senha: ${SENHA_PADRAO}`)
    for (const p of PESSOAS) {
      console.log(`  ${p.role.padEnd(22)} ${p.email}`)
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
