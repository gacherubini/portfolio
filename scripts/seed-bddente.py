"""Seed de dados FICTICIOS para o BDDente (uso: prints de portfolio).

Clinica, dentista, pacientes, telefones, tratamentos e agenda sao INVENTADOS.
Nenhum dado real de paciente entra aqui — e essa e a razao de o script existir:
prontuario odontologico e dado de saude, e print de producao nao vai para site.

O script e reexecutavel: limpa as tabelas de aplicacao e reescreve o mesmo
conjunto. PRNG com semente fixa, entao rodar de novo da os mesmos numeros.

Uso, a partir da pasta do dentalis:

    export DATABASE_URL="postgresql+psycopg://bddente:bddente@localhost:5434/bddente"
    ./.venv/Scripts/python.exe ../portfolio/scripts/seed-bddente.py

Pre-requisito: `alembic upgrade head` ja aplicado.
"""

from __future__ import annotations

import random
import sys
from datetime import date, datetime, time, timedelta
from decimal import Decimal

from sqlalchemy import select, text

from app.agenda.models import (
    Agendamento,
    ConfiguracaoClinica,
    ModeloMensagem,
    SituacaoAgendamento,
)
from app.auth.models import Clinica, Usuario
from app.auth.senha import gerar_hash
from app.catalogo.models import Categoria, Convenio, Preco, Procedimento
from app.clinico.models import (
    Condicao,
    Lancamento,
    LancamentoRegiao,
    Odontograma,
    PerguntaAnamnese,
    RespostaAnamnese,
)
from app.financeiro.models import Parcela
from app.pacientes.models import Paciente, PacienteEndereco, PacienteTelefone
from app.shared.db import Sessao
from app.shared.tipos import Escopo, Regiao, StatusLancamento, TipoCondicao

rnd = random.Random(20260904)

HOJE = date.today()

CLINICA = "Consultorio Odontologico Bela Vista"
DENTISTA_NOME = "Dra. Renata Sobral"
DENTISTA_EMAIL = "renata@belavista.demo"
SENHA = "portfolio-bddente-2026"

# ─── catalogo ────────────────────────────────────────────────────────────────

CATEGORIAS = [
    ("01", "Diagnostico e Prevencao", 1),
    ("02", "Dentistica", 2),
    ("03", "Endodontia", 3),
    ("04", "Protese", 4),
    ("05", "Cirurgia", 5),
    ("06", "Periodontia", 6),
]

# (codigo, nome, categoria, escopo, regioes sugeridas, duracao, preco particular)
PROCEDIMENTOS = [
    ("0101", "CONSULTA DE AVALIACAO", "01", Escopo.BOCA, [], 30, "120.00"),
    ("0102", "RADIOGRAFIA PERIAPICAL", "01", Escopo.DENTE, [], 15, "45.00"),
    ("0201", "RESTAURACAO RESINA FOTOATIVADA 1 ANGULO", "02", Escopo.REGIOES,
     [Regiao.OCLUSAL], 40, "160.00"),
    ("0202", "RESTAURACAO RESINA FOTOATIVADA 2 ANGULOS", "02", Escopo.REGIOES,
     [Regiao.MESIAL, Regiao.OCLUSAL], 50, "220.00"),
    ("0203", "FACETA EM RESINA", "02", Escopo.DENTE, [], 60, "480.00"),
    ("0301", "TRATAMENTO ENDODONTICO UNI-RADICULAR", "03", Escopo.REGIOES,
     [Regiao.CANAL_CENTRAL], 90, "780.00"),
    ("0302", "TRATAMENTO ENDODONTICO BI-RADICULAR", "03", Escopo.REGIOES,
     [Regiao.CANAL_MESIAL, Regiao.CANAL_DISTAL], 120, "980.00"),
    ("0401", "COROA METALO-CERAMICA", "04", Escopo.DENTE, [], 90, "1450.00"),
    ("0402", "NUCLEO METALICO FUNDIDO", "04", Escopo.DENTE, [], 60, "520.00"),
    ("0501", "EXTRACAO DENTE PERMANENTE", "05", Escopo.DENTE, [], 45, "290.00"),
    ("0601", "RASPAGEM SUPRA GENGIVAL E POL. CORONAL", "06", Escopo.BOCA, [], 40, "180.00"),
    ("0602", "RASPAGEM SUB GENGIVAL POR SEXTANTE", "06", Escopo.BOCA, [], 50, "240.00"),
]

CONVENIOS = [("01", "Particular"), ("02", "Unimed"), ("03", "Odonto Prev")]

# ─── pacientes ───────────────────────────────────────────────────────────────
# Nomes inventados. Nenhum coincide com paciente real de consultorio nenhum.

PACIENTES = [
    # (nome, nascimento, profissao, ddd+numero ou None, aceita_whatsapp)
    ("BEATRIZ ALMEIDA CAMPOS",    "1978-03-14", "Professora",          "(51) 99614-2280", True),
    ("OTAVIO REZENDE PIRES",      "1965-11-02", "Contador",            "(51) 99871-3345", True),
    ("SOLANGE FERRAZ DUTRA",      "1954-06-28", "Aposentada",          "(51) 98220-7714", True),
    ("HENRIQUE BALDUINO NEVES",   "1991-01-19", "Engenheiro",          "(51) 99450-1102", True),
    ("MARILIA ESTEVES CAMARGO",   "1986-09-05", "Arquiteta",           "(51) 98776-9031", None),
    ("RAIMUNDO TEIXEIRA LOPES",   "1949-12-11", "Aposentado",          None,              None),
    ("CLARICE MONTENEGRO SA",     "1996-04-23", "Publicitaria",        "(51) 99302-6648", True),
    ("EVANDRO PICCOLI BARRETO",   "1972-08-30", "Comerciante",         "(51) 98105-4472", False),
    ("NEUSA GONCALVES ITURRA",    "1958-02-07", "Costureira",          "(51) 99733-8890", True),
    ("FABRICIO ANDRADE VILELA",   "1983-07-16", "Motorista",           "(51) 98449-2213", True),
    ("LUCIMAR BASTOS PEREIRA",    "1969-10-25", "Auxiliar de limpeza", None,              None),
    ("GUSTAVO KRIEGER MENDONCA",  "2001-05-09", "Estudante",           "(51) 99118-5567", True),
    ("ADRIANA VASQUES FONTOURA",  "1975-12-03", "Enfermeira",          "(51) 98663-1194", True),
    ("SEVERINO CALDAS MOURAO",    "1961-03-21", "Pedreiro",            "(51) 99027-4438", True),
    ("TEREZINHA BOFF SCHMIDT",    "1944-09-17", "Aposentada",          "(51) 98338-7726", None),
    ("RODRIGO PENNA LAVIGNE",     "1989-06-12", "Designer",            "(51) 99560-3081", True),
    ("VALQUIRIA NUNES PADILHA",   "1993-11-27", "Fisioterapeuta",      "(51) 98914-6602", True),
    ("ILDO BERNARDES ZANOTTO",    "1957-01-08", "Mecanico",            "(51) 99245-7719", True),
    ("MARISTELA COUTO ARAGAO",    "1980-04-30", "Bancaria",            "(51) 98572-2287", True),
    ("WILSON MATTOS SEIXAS",      "1967-08-14", "Vendedor",            None,              None),
    ("PATRICIA GUEDES ALENCAR",   "1998-02-19", "Veterinaria",         "(51) 99806-4453", True),
    ("BENEDITO ROCHA VIANNA",     "1951-07-06", "Aposentado",          "(51) 98157-9924", True),
    ("SIMONE DALBERTO CRUZ",      "1974-05-22", "Nutricionista",       "(51) 99691-1178", True),
    ("EDUARDO SANTIAGO BRAGA",    "1988-10-01", "Programador",         "(51) 98483-5560", True),
]

BAIRROS = ["Petropolis", "Bela Vista", "Moinhos de Vento", "Menino Deus",
           "Tristeza", "Higienopolis", "Rio Branco", "Santana"]
RUAS = ["Rua Cel. Bordini", "Av. Plinio Brasil Milano", "Rua Anita Garibaldi",
        "Rua Dr. Timoteo", "Av. Nilo Pecanha", "Rua Fernandes Vieira"]

ANAMNESE = [
    ("01", "Esta em tratamento medico no momento?", "Nao"),
    ("02", "Faz uso de algum medicamento de uso continuo?", "Losartana 50mg, uso diario"),
    ("03", "Tem alergia a algum medicamento ou anestesico?", "Nao relata"),
    ("04", "E diabetico?", "Nao"),
    ("05", "Tem problema cardiaco ou pressao alta?", "Hipertensao controlada"),
    ("06", "Ja teve hemorragia apos extracao dentaria?", "Nao"),
    ("07", "Esta gravida ou amamentando?", "Nao se aplica"),
    ("08", "Range ou aperta os dentes?", "Sim, principalmente a noite"),
]

TABELAS = [
    "resposta_anamnese", "pergunta_anamnese", "observacao_clinica",
    "lancamento_regiao", "lancamento", "condicao", "odontograma",
    "parcela", "lembrete", "agendamento", "modelo_mensagem",
    "paciente_telefone", "paciente_endereco", "paciente",
    "preco", "procedimento", "categoria", "convenio",
    "configuracao_clinica", "auditoria", "usuario", "clinica",
]


def limpar(sessao) -> None:
    """Reexecutavel: derruba tudo antes de escrever. `alembic_version` fica."""
    sessao.execute(text("TRUNCATE TABLE " + ", ".join(TABELAS) + " RESTART IDENTITY CASCADE"))
    sessao.commit()


def dia_util(base: date, passos: int) -> date:
    """Anda `passos` dias uteis a partir de `base`."""
    d, andados = base, 0
    while andados < abs(passos):
        d += timedelta(days=1 if passos > 0 else -1)
        if d.weekday() < 5:
            andados += 1
    return d


def semear() -> None:
    with Sessao() as sessao:
        limpar(sessao)

        clinica = Clinica(nome=CLINICA)
        sessao.add(clinica)
        sessao.flush()

        dentista = Usuario(
            clinica_id=clinica.id,
            email=DENTISTA_EMAIL,
            senha_hash=gerar_hash(SENHA),
            nome=DENTISTA_NOME,
            ativo=True,
        )
        sessao.add(dentista)
        sessao.flush()

        sessao.add(ConfiguracaoClinica(
            clinica_id=clinica.id,
            # Fiel ao produto: a chave geral nasce desligada, e o seed nao liga.
            lembrete_ativo=False,
            lembrete_horas_antes=24,
            lembrete_teto_diario=20,
            whatsapp_provedor=None,
            whatsapp_estado=None,
            endereco="Rua Cel. Bordini, 840 — Bela Vista, Porto Alegre/RS",
            telefone_clinica="(51) 3333-2020",
            atualizado_em=datetime.now(),
        ))
        sessao.add(ModeloMensagem(
            clinica_id=clinica.id,
            codigo="VESPERA",
            texto=(
                "Ola, {nome}! Passando para lembrar da sua consulta amanha, "
                "{dia} as {hora}, no {clinica}. Endereco: {endereco}. "
                "Se precisar remarcar e so responder aqui."
            ),
            atualizado_por=dentista.id,
            atualizado_em=datetime.now(),
        ))

        convenios = {}
        for codigo, nome in CONVENIOS:
            c = Convenio(clinica_id=clinica.id, codigo=codigo, nome=nome)
            sessao.add(c)
            convenios[codigo] = c
        sessao.flush()

        categorias = {}
        for codigo, nome, ordem in CATEGORIAS:
            c = Categoria(clinica_id=clinica.id, codigo=codigo, nome=nome, ordem=ordem)
            sessao.add(c)
            categorias[codigo] = c
        sessao.flush()

        procs = {}
        for codigo, nome, cat, escopo, regioes, dur, valor in PROCEDIMENTOS:
            p = Procedimento(
                clinica_id=clinica.id, codigo=codigo, nome=nome,
                categoria_id=categorias[cat].id, ativo=True,
                escopo_sugerido=escopo, regioes_sugeridas=regioes, duracao_min=dur,
            )
            sessao.add(p)
            procs[codigo] = p
        sessao.flush()

        for codigo, *_rest in [(p[0],) for p in PROCEDIMENTOS]:
            base = Decimal(dict((p[0], p[6]) for p in PROCEDIMENTOS)[codigo])
            for conv_cod, fator in (("01", 1), ("02", Decimal("0.70")), ("03", Decimal("0.62"))):
                sessao.add(Preco(
                    procedimento_id=procs[codigo].id,
                    convenio_id=convenios[conv_cod].id,
                    valor=(base * fator).quantize(Decimal("0.01")),
                    vigente_desde=date(2025, 1, 1),
                ))

        perguntas = []
        for codigo, texto_p, _resp in ANAMNESE:
            q = PerguntaAnamnese(
                clinica_id=clinica.id, codigo=codigo, texto=texto_p,
                tipo_resposta=1, ordem=int(codigo), ativa=True,
            )
            sessao.add(q)
            perguntas.append(q)
        sessao.flush()

        # ─── pacientes ───────────────────────────────────────────────────────
        pacientes: list[Paciente] = []
        for i, (nome, nasc, prof, fone, zap) in enumerate(PACIENTES):
            p = Paciente(
                clinica_id=clinica.id,
                codigo_legado=str(1200 + i * 7),
                nome=nome,
                nascimento=date.fromisoformat(nasc),
                profissao=prof,
                estado_civil=rnd.choice(["Solteiro(a)", "Casado(a)", "Viuvo(a)", None]),
                indicacao=rnd.choice(["Indicacao de paciente", "Convenio", "Passou em frente", None]),
                convenio_id=convenios[rnd.choice(["01", "01", "02", "03"])].id,
                aceita_whatsapp=zap,
                cadastrado_em=date(rnd.randint(1998, 2024), rnd.randint(1, 12), rnd.randint(1, 28)),
                ultimo_atendimento=dia_util(HOJE, -rnd.randint(1, 220)),
            )
            sessao.add(p)
            sessao.flush()
            if fone:
                sessao.add(PacienteTelefone(
                    paciente_id=p.id, numero=fone, principal=True,
                ))
            sessao.add(PacienteEndereco(
                paciente_id=p.id, tipo="RESIDENCIAL",
                logradouro=f"{rnd.choice(RUAS)}, {rnd.randint(40, 1890)}",
                bairro=rnd.choice(BAIRROS), cidade="Porto Alegre", uf="RS",
                cep=f"9{rnd.randint(1000, 9999)}-{rnd.randint(100, 999)}",
            ))
            pacientes.append(p)
        sessao.flush()

        # anamnese preenchida so para a paciente em destaque
        destaque = pacientes[0]
        for q, (_c, _t, resposta) in zip(perguntas, ANAMNESE):
            sessao.add(RespostaAnamnese(
                paciente_id=destaque.id, pergunta_id=q.id,
                resposta=resposta, respondido_em=date(2024, 3, 8),
            ))

        # ─── odontograma ─────────────────────────────────────────────────────
        SUPERIORES = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
        INFERIORES = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
        TODOS = SUPERIORES + INFERIORES

        odontos = {}
        for p in pacientes:
            o = Odontograma(paciente_id=p.id, numero=1)
            sessao.add(o)
            odontos[p.id] = o
        sessao.flush()

        def lancar(odonto_id, dente, codigo, status, quando, regioes=(), obs=None):
            proc = procs[codigo]
            valor = Decimal(dict((x[0], x[6]) for x in PROCEDIMENTOS)[codigo])
            escopo = proc.escopo_sugerido
            lan = Lancamento(
                clinica_id=clinica.id,
                odontograma_id=odonto_id,
                dente=None if escopo == Escopo.BOCA else dente,
                escopo=escopo,
                procedimento_id=proc.id,
                status=status,
                data_planejada=quando if status == StatusLancamento.PLANEJADO else None,
                data_realizada=quando if status == StatusLancamento.REALIZADO else None,
                valor=valor,
                observacao=obs,
                criado_por=dentista.id,
            )
            sessao.add(lan)
            sessao.flush()
            for r in (regioes or proc.regioes_sugeridas):
                sessao.add(LancamentoRegiao(lancamento_id=lan.id, regiao=r))
            return lan

        # A paciente em destaque ganha historico longo — o argumento do produto e
        # que 30 anos de prontuario foram migrados sem perder registro.
        od = odontos[destaque.id].id
        historico = [
            (date(2009, 11, 18), 36, "0601", StatusLancamento.REALIZADO, ()),
            (date(2012, 4, 3),   26, "0201", StatusLancamento.REALIZADO, (Regiao.OCLUSAL,)),
            (date(2015, 8, 27),  22, "0301", StatusLancamento.REALIZADO, (Regiao.CANAL_CENTRAL,)),
            (date(2016, 2, 9),   22, "0401", StatusLancamento.REALIZADO, ()),
            (date(2019, 6, 14),  15, "0401", StatusLancamento.REALIZADO, ()),
            (date(2021, 9, 30),  47, "0202", StatusLancamento.REALIZADO,
             (Regiao.MESIAL, Regiao.OCLUSAL)),
            (date(2023, 5, 11),  37, "0201", StatusLancamento.REALIZADO, (Regiao.OCLUSAL,)),
            (date(2024, 10, 22), 11, "0203", StatusLancamento.REALIZADO, ()),
            (dia_util(HOJE, -12), 17, "0201", StatusLancamento.REALIZADO, (Regiao.OCLUSAL,)),
            (dia_util(HOJE, -12), 27, "0201", StatusLancamento.REALIZADO, (Regiao.MESIAL,)),
            (dia_util(HOJE, 6),  46, "0302", StatusLancamento.PLANEJADO,
             (Regiao.CANAL_MESIAL, Regiao.CANAL_DISTAL)),
            (dia_util(HOJE, 6),  46, "0401", StatusLancamento.PLANEJADO, ()),
            (dia_util(HOJE, 14), 24, "0501", StatusLancamento.PLANEJADO, ()),
        ]
        for quando, dente, codigo, status, regioes in historico:
            lancar(od, dente, codigo, status, quando, regioes)

        # camada azul: o que ja existia quando o prontuario comecou
        for dente, tipo in ((38, TipoCondicao.AUSENTE), (48, TipoCondicao.AUSENTE),
                            (16, TipoCondicao.RESTAURACAO_ANTERIOR),
                            (25, TipoCondicao.RESTAURACAO_ANTERIOR),
                            (35, TipoCondicao.COROA)):
            sessao.add(Condicao(
                odontograma_id=od, dente=dente, tipo=tipo,
                regioes=[Regiao.OCLUSAL] if tipo == TipoCondicao.RESTAURACAO_ANTERIOR else [],
            ))

        # os demais pacientes ganham historico curto, so para as listas nao ficarem vazias
        for p in pacientes[1:]:
            o = odontos[p.id].id
            for _ in range(rnd.randint(2, 7)):
                codigo = rnd.choice(["0201", "0202", "0601", "0102", "0301", "0501", "0401"])
                dente = rnd.choice(TODOS)
                atras = rnd.randint(20, 2600)
                lancar(o, dente, codigo, StatusLancamento.REALIZADO, HOJE - timedelta(days=atras))
            if rnd.random() < 0.45:
                lancar(o, rnd.choice(TODOS), rnd.choice(["0201", "0401", "0501"]),
                       StatusLancamento.PLANEJADO, dia_util(HOJE, rnd.randint(2, 40)))
            for dente in rnd.sample(TODOS, rnd.randint(0, 4)):
                sessao.add(Condicao(
                    odontograma_id=o, dente=dente,
                    tipo=rnd.choice(list(TipoCondicao)), regioes=[],
                ))

        # ─── agenda ──────────────────────────────────────────────────────────
        # Semana corrente inteira, com o dia de hoje cheio. Alguns horarios sao de
        # paciente sem telefone: e o que faz a agenda mostrar "sem lembrete", que
        # e a feature aparecendo na tela.
        segunda = HOJE - timedelta(days=HOJE.weekday())
        horarios = [time(h, m) for h in range(8, 18) for m in (0, 30)]
        marcados = 0
        for delta in range(0, 5):
            dia = segunda + timedelta(days=delta)
            quantos = rnd.randint(5, 9)
            for inicio in rnd.sample(horarios, quantos):
                pac = rnd.choice(pacientes)
                if dia < HOJE:
                    sit = rnd.choices(
                        [SituacaoAgendamento.CONFIRMADO, SituacaoAgendamento.FALTOU,
                         SituacaoAgendamento.DESMARCADO],
                        weights=[8, 1, 1],
                    )[0]
                else:
                    sit = rnd.choices(
                        [SituacaoAgendamento.MARCADO, SituacaoAgendamento.CONFIRMADO],
                        weights=[6, 4],
                    )[0]
                sessao.add(Agendamento(
                    clinica_id=clinica.id, paciente_id=pac.id,
                    dia=dia, inicio=inicio,
                    duracao_min=rnd.choice([30, 30, 30, 45, 60]),
                    situacao=sit, criado_por=dentista.id,
                ))
                marcados += 1

        # dois telefonemas avulsos: cadastro ainda nao existe, mas o horario existe
        sessao.add(Agendamento(
            clinica_id=clinica.id, paciente_id=None,
            nome_avulso="Josefa (encaminhada pela Unimed)",
            telefone_avulso="(51) 99284-6610",
            dia=dia_util(HOJE, 2), inicio=time(9, 30), duracao_min=30,
            situacao=SituacaoAgendamento.MARCADO, avisar_avulso=True,
            criado_por=dentista.id,
        ))
        sessao.add(Agendamento(
            clinica_id=clinica.id, paciente_id=None,
            nome_avulso="Ariovaldo — retorno",
            telefone_avulso=None,
            dia=dia_util(HOJE, 3), inicio=time(14, 0), duracao_min=45,
            situacao=SituacaoAgendamento.MARCADO, avisar_avulso=False,
            criado_por=dentista.id,
        ))
        marcados += 2

        # ─── financeiro ──────────────────────────────────────────────────────
        parcelas = 0
        for p in pacientes:
            for _ in range(rnd.randint(0, 4)):
                venc = HOJE - timedelta(days=rnd.randint(-60, 420))
                cobrado = Decimal(rnd.choice(["160.00", "220.00", "290.00", "480.00",
                                              "780.00", "980.00", "1450.00"]))
                pago = rnd.random() < 0.72 and venc <= HOJE
                sessao.add(Parcela(
                    clinica_id=clinica.id, paciente_id=p.id,
                    numero=f"{rnd.randint(1, 3)}/{rnd.randint(3, 6)}",
                    vencimento=venc, valor_cobrado=cobrado,
                    pago_em=venc + timedelta(days=rnd.randint(0, 9)) if pago else None,
                    valor_pago=cobrado if pago else Decimal("0.00"),
                ))
                parcelas += 1

        sessao.commit()

        total_lanc = sessao.scalar(select(text("count(*)")).select_from(text("lancamento")))
        print(f"clinica ......... {CLINICA}")
        print(f"dentista ........ {DENTISTA_NOME} <{DENTISTA_EMAIL}>")
        print(f"senha ........... {SENHA}")
        print(f"pacientes ....... {len(pacientes)}")
        print(f"lancamentos ..... {total_lanc}")
        print(f"agendamentos .... {marcados}")
        print(f"parcelas ........ {parcelas}")
        print(f"destaque ........ {destaque.nome} (id {destaque.id})")
        print("lembrete ........ DESLIGADO (fiel ao produto)")


if __name__ == "__main__":
    sys.exit(semear())
