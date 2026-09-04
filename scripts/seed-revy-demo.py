"""Popula a stack local da Revy com dados fictícios, só para tirar prints.

Roda dentro de cada contêiner, no mesmo espírito do bootstrap.py: cada processo
importa apenas o próprio pacote ``app``. Nada aqui toca banco de outro produto.

    python /tmp/seed_demo.py estoque
    python /tmp/seed_demo.py chatbot
    python /tmp/seed_demo.py trafego

Loja, pessoas, telefones e veículos são inventados. Nenhum dado de cliente real.
"""

from __future__ import annotations

import os
import sys
import uuid
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

sys.path.insert(0, os.getcwd())

AGORA = datetime.now(timezone.utc)
HOJE = AGORA.date()


def slug_loja() -> str:
    valor = os.getenv("LOCAL_STORE_SLUG", "").strip()
    if not valor:
        raise SystemExit("LOCAL_STORE_SLUG ausente")
    return valor


def dias_atras(n: int) -> datetime:
    return AGORA - timedelta(days=n)


# ─────────────────────────────  ESTOQUE  ─────────────────────────────

# (marca, modelo, versao, ano, km, preco, custo, cor)
MOTOS = [
    ("Honda", "CG 160", "Titan", 2023, 8_400, 16_900, 13_800, "Vermelha"),
    ("Honda", "CG 160", "Fan", 2022, 14_200, 14_500, 11_900, "Preta"),
    ("Honda", "Biz 125", "ES", 2023, 6_100, 15_400, 12_600, "Branca"),
    ("Honda", "Pop 110i", "", 2024, 2_300, 12_800, 10_500, "Vermelha"),
    ("Honda", "XRE 300", "ABS", 2022, 19_800, 27_900, 23_400, "Prata"),
    ("Honda", "CB 300F", "Twister", 2024, 4_900, 24_500, 20_800, "Cinza"),
    ("Honda", "Elite 125", "", 2023, 5_600, 14_200, 11_700, "Azul"),
    ("Honda", "PCX 160", "DLX", 2024, 3_100, 22_400, 19_100, "Preta"),
    ("Yamaha", "Factor 150", "UBS", 2023, 9_700, 16_200, 13_400, "Azul"),
    ("Yamaha", "Fazer 250", "ABS", 2022, 21_500, 22_800, 19_000, "Preta"),
    ("Yamaha", "MT-03", "ABS", 2023, 7_200, 34_900, 29_800, "Cinza"),
    ("Yamaha", "NMax 160", "ABS", 2024, 3_800, 23_600, 20_200, "Vermelha"),
    ("Yamaha", "Crosser 150", "S", 2022, 17_400, 17_900, 14_800, "Branca"),
    ("Yamaha", "Lander 250", "ABS", 2021, 28_900, 24_200, 20_400, "Azul"),
    ("Yamaha", "Neo 125", "UBS", 2023, 6_800, 15_100, 12_400, "Prata"),
    ("Suzuki", "Burgman 125", "", 2023, 7_900, 14_900, 12_200, "Preta"),
    ("Suzuki", "GSX-S 750", "", 2021, 16_300, 42_500, 36_800, "Azul"),
    ("Shineray", "Jet 50", "", 2024, 1_200, 8_900, 7_100, "Vermelha"),
    ("Haojue", "DK 150", "", 2023, 8_800, 14_700, 12_000, "Preta"),
    ("Haojue", "Chopper Road 150", "", 2022, 12_600, 13_900, 11_300, "Vinho"),
    ("Bajaj", "Dominar 400", "", 2023, 9_400, 29_800, 25_600, "Preta"),
    ("Royal Enfield", "Meteor 350", "", 2022, 11_800, 28_500, 24_300, "Vermelha"),
    ("Kawasaki", "Ninja 400", "ABS", 2021, 14_700, 38_900, 33_200, "Verde"),
    ("Honda", "Bros 160", "ESD", 2023, 10_200, 21_400, 17_900, "Prata"),
    ("Yamaha", "XTZ 150", "Crosser Z", 2024, 2_900, 20_800, 17_600, "Preta"),
    ("Honda", "CB 500F", "", 2020, 24_600, 39_500, 34_100, "Cinza"),
]


def seed_estoque() -> None:
    from app import models_db, servico
    from app.db import SessionLocal

    slug = slug_loja()
    with SessionLocal() as db:
        loja = db.query(models_db.Loja).filter(models_db.Loja.slug == slug).first()
        if loja is None:
            raise SystemExit(f"loja {slug} não existe; rode o bootstrap antes")

        ja_tem = db.query(models_db.Veiculo).filter(
            models_db.Veiculo.loja_id == loja.id
        ).count()
        if ja_tem:
            print(f"estoque: {ja_tem} veículos já cadastrados, nada a fazer")
            return

        criados = []
        for i, (marca, modelo, versao, ano, km, preco, custo, cor) in enumerate(MOTOS):
            dados = {
                "tipo": "moto",
                "marca": marca,
                "modelo": modelo,
                "ano_modelo": ano,
                "km": km,
                "preco": float(preco),
                "custo": float(custo),
                "cor": cor,
                "codigo_interno": f"VM-{i + 101}",
            }
            if versao:
                dados["versao"] = versao
            criados.append(servico.criar_veiculo(db, loja.id, dados, "sistema"))

        # Espalha as datas de entrada para as faixas de idade saírem variadas.
        for i, v in enumerate(criados):
            v.criado_em = dias_atras(3 + i * 5)
            v.atualizado_em = dias_atras(max(0, 3 + i * 5 - 2))
        db.commit()

        for v in criados[:21]:
            servico.definir_publicado(db, loja.id, v.id, True, "sistema")
        for v in criados[21:23]:
            servico.reservar(db, loja.id, v.id, "sistema")
        for v in criados[23:]:
            servico.vender(db, loja.id, v.id, "sistema")

        print(f"estoque: {len(criados)} veículos, 21 publicados, 2 reservados, 3 vendidos")


# ─────────────────────────────  CHATBOT  ─────────────────────────────

NOMES = [
    "Ana Paula Ribeiro", "Bruno Tavares", "Carla Menezes", "Diego Fontes",
    "Eduarda Lima", "Felipe Andrade", "Gabriela Nunes", "Henrique Sales",
    "Isabela Cardoso", "João Vitor Peixoto", "Karina Duarte", "Leonardo Braga",
    "Mariana Coelho", "Nathan Vieira", "Olívia Prado", "Paulo Ricardo Matos",
    "Queila Santana", "Rafael Domingues", "Sabrina Correia", "Thiago Bastos",
    "Ursula Campos", "Vinícius Lemos", "Wesley Rocha", "Yasmin Teixeira",
    "Alexandre Pires", "Beatriz Moura", "Caio Fernandes", "Daniela Rosa",
    "EmersonGomes", "Fernanda Castro", "Gustavo Almeida", "Helena Barros",
    "Igor Marques", "Juliana Freitas", "Kevin Souto", "Larissa Pontes",
    "Marcelo Antunes", "Nadia Ferraz", "Otávio Bandeira", "Priscila Nogueira",
]

# (utm_campaign, quantos leads, etapa dominante)
CAMPANHAS_LEADS = [
    ("motos-seminovas-set", 18, "qualificado"),
    ("financiamento-sem-entrada", 13, "novo"),
    ("scooter-125-cidade", 9, "em_atendimento"),
]

ETAPAS = ["novo", "em_atendimento", "qualificado", "transferido"]
INTERESSES = [
    "CG 160 Titan", "Biz 125", "NMax 160", "MT-03", "Fazer 250",
    "PCX 160", "XRE 300", "Factor 150", "Dominar 400", "Ninja 400",
]


# Diálogos do agente. Cada tupla é (direcao, texto); "saida" é o bot falando.
ROTEIROS = [
    [
        ("entrada", "Oi, vi a {moto} no anúncio. Ainda tem?"),
        ("saida", "Oi, {primeiro}! Tenho sim. A {moto} está {ano}, com {km} km. Quer ver as fotos?"),
        ("entrada", "Quero. Dá pra financiar?"),
        ("saida", "Dá. Pra simular eu preciso de duas coisas: valor de entrada e em quantas parcelas você pensa."),
        ("entrada", "Uns 3 mil de entrada, 36 vezes"),
        ("saida", "Anotado. Vou passar para um vendedor fechar os números com você agora."),
    ],
    [
        ("entrada", "bom dia, qual o valor da {moto}?"),
        ("saida", "Bom dia, {primeiro}! A {moto} {ano} está por R$ {preco}, com {km} km rodados."),
        ("entrada", "tem desconto à vista?"),
        ("saida", "Nisso quem manda é o vendedor. Te transfiro agora pra ele te dar a melhor condição."),
    ],
    [
        ("entrada", "vcs aceitam moto na troca?"),
        ("saida", "Aceitamos, {primeiro}. Qual moto você tem hoje, e mais ou menos quantos km ela tem?"),
        ("entrada", "uma Fan 160 2019, uns 30 mil km"),
        ("saida", "Perfeito. Já registrei aqui. Um vendedor vai avaliar a sua e te passar o valor de troca."),
    ],
    [
        ("entrada", "Olá, queria saber sobre a {moto}"),
        ("saida", "Olá, {primeiro}! A {moto} {ano} está disponível, R$ {preco}. Posso te mandar as fotos?"),
        ("entrada", "manda sim"),
        ("saida", "Mandei. Qualquer dúvida sobre documentação ou entrega é só chamar."),
    ],
    [
        ("entrada", "ainda tem a {moto}?"),
        ("saida", "Tem sim, {primeiro}. Quer que eu já reserve uma visita pra você ver de perto?"),
    ],
]

# Conversas por dia do mês corrente. Sobe até hoje; o gráfico do agente é diário.
CONVERSAS_POR_DIA = [21, 28, 25, 22, 19, 24, 27, 23, 20, 26]


def seed_chatbot() -> None:
    from app import models_db
    from app.db import SessionLocal

    slug = slug_loja()
    with SessionLocal() as db:
        loja = db.query(models_db.Loja).filter(models_db.Loja.slug == slug).first()
        if loja is None:
            raise SystemExit(f"loja {slug} não existe; rode o bootstrap antes")

        # Reexecutável: limpa o que este script criou antes de recriar.
        db.query(models_db.Mensagem).filter(
            models_db.Mensagem.loja_id == loja.id
        ).delete(synchronize_session=False)
        db.query(models_db.Conversa).filter(
            models_db.Conversa.loja_id == loja.id
        ).delete(synchronize_session=False)
        db.query(models_db.Lead).filter(
            models_db.Lead.loja_id == loja.id
        ).delete(synchronize_session=False)
        db.commit()

        canal = db.query(models_db.WhatsAppCanal).filter(
            models_db.WhatsAppCanal.loja_id == loja.id
        ).first()
        if canal is None:
            canal = models_db.WhatsAppCanal(
                id=str(uuid.uuid4()),
                loja_id=loja.id,
                e164_or_label="+55 51 99812-4470",
                evolution_instance=f"{slug}-demo",
                ativo=True,
                estado="conectado",
                principal_estoque=True,
                criado_em=dias_atras(40),
            )
            db.add(canal)
            db.flush()

        telefones: list[tuple[str, str]] = []  # (telefone, nome)
        n = 0
        for campanha, quantos, etapa_dominante in CAMPANHAS_LEADS:
            for i in range(quantos):
                nome = NOMES[n % len(NOMES)]
                telefone = f"5551{90000000 + n * 137:08d}"[:13]
                telefones.append((telefone, nome))
                # Concentra no período de 7 dias que o painel abre por padrão.
                idade = i % 7
                etapa = etapa_dominante if i % 3 else ETAPAS[i % len(ETAPAS)]
                db.add(
                    models_db.Lead(
                        id=str(uuid.uuid4()),
                        loja_id=loja.id,
                        telefone=telefone,
                        nome=nome,
                        interesse=INTERESSES[n % len(INTERESSES)],
                        etapa=etapa,
                        origem="meta",
                        canal="whatsapp",
                        utm_source="facebook",
                        utm_medium="cpc",
                        utm_campaign=campanha,
                        utm_source_last="facebook",
                        utm_medium_last="cpc",
                        utm_campaign_last=campanha,
                        utm_source_first="facebook",
                        utm_medium_first="cpc",
                        utm_campaign_first=campanha,
                        origem_first="meta",
                        origem_last="meta",
                        canal_first="whatsapp",
                        canal_last="whatsapp",
                        consentimento_em=dias_atras(idade),
                        criada_em=dias_atras(idade),
                        atualizada_em=dias_atras(max(0, idade - 1)),
                    )
                )
                n += 1

        # ── Conversas do agente, no mês corrente (é a janela do resumo) ──
        # Uma conversa por (canal, telefone): a unique do modelo não deixa repetir.
        # Por isso o volume vem de telefones novos, gerados fora da lista de leads.
        dias_do_mes = min(HOJE.day, len(CONVERSAS_POR_DIA))
        atendimentos = transferidos = 0
        seq = 0
        for dia in range(1, dias_do_mes + 1):
            quantos = CONVERSAS_POR_DIA[dia - 1]
            for j in range(quantos):
                if seq < len(telefones):
                    telefone, nome = telefones[seq]
                else:
                    # Conversa que entrou fora de campanha (orgânico). Ganha lead
                    # próprio para o Atendimento mostrar contato e interesse.
                    k = seq - len(telefones)
                    telefone = f"5551{97000000 + k * 91:08d}"[:13]
                    nome = NOMES[seq % len(NOMES)]
                    db.add(
                        models_db.Lead(
                            id=str(uuid.uuid4()),
                            loja_id=loja.id,
                            telefone=telefone,
                            nome=nome,
                            interesse=INTERESSES[seq % len(INTERESSES)],
                            etapa=ETAPAS[seq % len(ETAPAS)],
                            origem="organico",
                            canal="whatsapp",
                            origem_first="organico",
                            origem_last="organico",
                            canal_first="whatsapp",
                            canal_last="whatsapp",
                            consentimento_em=datetime(
                                HOJE.year, HOJE.month, dia, 9, 0, tzinfo=timezone.utc
                            ),
                            criada_em=datetime(
                                HOJE.year, HOJE.month, dia, 9, 0, tzinfo=timezone.utc
                            ),
                            atualizada_em=datetime(
                                HOJE.year, HOJE.month, dia, 9, 30, tzinfo=timezone.utc
                            ),
                        )
                    )
                    n += 1
                seq += 1

                # ~24% viram handoff: o agente coletou e passou pro vendedor.
                handoff = j % 4 == 1
                abertura = datetime(
                    HOJE.year, HOJE.month, dia, 9 + (j % 9), (j * 7) % 60,
                    tzinfo=timezone.utc,
                )
                conversa = models_db.Conversa(
                    id=str(uuid.uuid4()),
                    loja_id=loja.id,
                    canal_id=canal.id,
                    telefone=telefone,
                    bot_ativo=not handoff,
                    status="handoff" if handoff else "encerrada",
                    responsavel="Vendedor 1" if handoff else None,
                    criada_em=abertura,
                    atualizada_em=abertura + timedelta(minutes=12),
                )
                db.add(conversa)
                atendimentos += 1
                transferidos += 1 if handoff else 0

                moto = MOTOS[seq % len(MOTOS)]
                contexto = {
                    "primeiro": nome.split()[0],
                    "moto": f"{moto[0]} {moto[1]}",
                    "ano": moto[3],
                    "km": f"{moto[4]:,}".replace(",", "."),
                    "preco": f"{moto[5]:,}".replace(",", "."),
                }
                roteiro = ROTEIROS[seq % len(ROTEIROS)]
                for ordem, (direcao, molde) in enumerate(roteiro):
                    db.add(
                        models_db.Mensagem(
                            id=str(uuid.uuid4()),
                            loja_id=loja.id,
                            canal_id=canal.id,
                            conversa_id=conversa.id,
                            direcao=direcao,
                            provider_message_id=f"demo-{conversa.id[:8]}-{ordem}",
                            texto=molde.format(**contexto),
                            criada_em=abertura + timedelta(minutes=ordem * 2),
                        )
                    )

        db.commit()
        print(
            f"chatbot: {n} leads, {atendimentos} conversas no mês "
            f"({transferidos} transferidas para vendedor), 1 canal conectado"
        )


# ─────────────────────────────  TRÁFEGO  ─────────────────────────────

# (nome, utm_campaign, canal, gasto por dia, dias)
CAMPANHAS_TRAFEGO = [
    ("Motos seminovas — setembro", "motos-seminovas-set", "meta", "82.50", 7),
    ("Financiamento sem entrada", "financiamento-sem-entrada", "meta", "61.00", 7),
    ("Scooter 125 para cidade", "scooter-125-cidade", "google", "44.90", 7),
]

# (utm_campaign, preco_venda, custo_veiculo, dias atrás)
VENDAS = [
    ("motos-seminovas-set", "16900.00", "13800.00", 1),
    ("motos-seminovas-set", "23600.00", "20200.00", 3),
    ("motos-seminovas-set", "21400.00", "17900.00", 5),
    ("financiamento-sem-entrada", "27900.00", "23400.00", 2),
    ("financiamento-sem-entrada", "14500.00", "11900.00", 6),
    ("scooter-125-cidade", "15400.00", "12600.00", 4),
]


def seed_trafego() -> None:
    from app import models
    from app.db import SessionLocal

    slug = slug_loja()
    email = os.getenv("LOCAL_ADMIN_EMAIL", "admin@revy.local").lower()

    with SessionLocal() as db:
        loja = db.query(models.Loja).filter(models.Loja.slug == slug).first()
        loja_id = loja.id if loja is not None else None

        ja_tem = db.query(models.Campanha).filter(
            models.Campanha.loja_slug == slug
        ).count()
        if ja_tem:
            print(f"tráfego: {ja_tem} campanhas já cadastradas, nada a fazer")
            return

        por_utm: dict[str, str] = {}
        gasto_total = Decimal("0")
        for nome, utm, canal, valor_dia, dias in CAMPANHAS_TRAFEGO:
            campanha = models.Campanha(
                id=str(uuid.uuid4()),
                loja_slug=slug,
                loja_id=loja_id,
                nome=nome,
                canal=canal,
                status="ativa",
                utm_source="facebook" if canal == "meta" else "google",
                utm_medium="cpc",
                utm_campaign=utm,
                utm_campaign_norm=utm.casefold(),
                periodo_inicio=HOJE - timedelta(days=dias),
                periodo_fim=HOJE,
                criada_em=dias_atras(dias),
                atualizada_em=AGORA,
                criada_por_email=email,
            )
            db.add(campanha)
            db.flush()
            por_utm[utm] = campanha.id

            for d in range(dias):
                referencia = HOJE - timedelta(days=d)
                db.add(
                    models.CampanhaGasto(
                        id=str(uuid.uuid4()),
                        campanha_id=campanha.id,
                        loja_slug=slug,
                        loja_id=loja_id,
                        valor=Decimal(valor_dia),
                        referencia=referencia,
                        origem="manual",
                        external_key=f"demo-{utm}-{referencia.isoformat()}",
                        nota="lançamento fictício de demonstração",
                        criada_em=dias_atras(d),
                        criada_por=email,
                    )
                )
                gasto_total += Decimal(valor_dia)

        faturamento = Decimal("0")
        for utm, preco, custo, atras in VENDAS:
            db.add(
                models.VendaProjetada(
                    id=str(uuid.uuid4()),
                    loja_slug=slug,
                    loja_id=loja_id,
                    lead_ref=None,
                    preco_venda=Decimal(preco),
                    custo_veiculo=Decimal(custo),
                    custos_diretos_total=Decimal("0"),
                    status="confirmada",
                    criada_em=dias_atras(atras),
                    confirmada_em=dias_atras(atras),
                    atualizada_em=dias_atras(atras),
                    campanha_id_first=por_utm[utm],
                    campanha_id_last=por_utm[utm],
                    utm_campaign_first=utm,
                    utm_campaign_last=utm,
                )
            )
            faturamento += Decimal(preco)

        db.commit()
        print(
            f"tráfego: 3 campanhas, gasto R$ {gasto_total}, "
            f"{len(VENDAS)} vendas, faturamento R$ {faturamento}"
        )


# ─────────────────────────────  PORTAL  ─────────────────────────────

# (descricao, preco, custo, utm_campaign, dias atrás) — espelha VENDAS do tráfego.
VENDAS_PORTAL = [
    ("Honda CG 160 Titan 2023", "16900.00", "13800.00", "motos-seminovas-set", 1),
    ("Yamaha NMax 160 2024", "23600.00", "20200.00", "motos-seminovas-set", 3),
    ("Honda Bros 160 2023", "21400.00", "17900.00", "motos-seminovas-set", 5),
    ("Honda XRE 300 2022", "27900.00", "23400.00", "financiamento-sem-entrada", 2),
    ("Honda CG 160 Fan 2022", "14500.00", "11900.00", "financiamento-sem-entrada", 6),
    ("Honda Biz 125 ES 2023", "15400.00", "12600.00", "scooter-125-cidade", 4),
]


def seed_portal() -> None:
    from app import models
    from app.db import SessionLocal

    slug = slug_loja()
    email = os.getenv("LOCAL_ADMIN_EMAIL", "admin@revy.local").lower()

    with SessionLocal() as db:
        ja_tem = db.query(models.Venda).filter(models.Venda.loja_slug == slug).count()
        if ja_tem:
            print(f"portal: {ja_tem} vendas já cadastradas, nada a fazer")
            return

        por_utm = {
            c.utm_campaign: c.id
            for c in db.query(models.Campanha).filter(
                models.Campanha.loja_slug == slug
            )
        }

        faturamento = Decimal("0")
        for descricao, preco, custo, utm, atras in VENDAS_PORTAL:
            quando = dias_atras(atras)
            db.add(
                models.Venda(
                    id=str(uuid.uuid4()),
                    loja_slug=slug,
                    vendedor_email=email,
                    descricao=descricao,
                    preco_venda=Decimal(preco),
                    custo_veiculo=Decimal(custo),
                    status="confirmada",
                    criada_em=quando,
                    atualizada_em=quando,
                    confirmada_por=email,
                    confirmada_em=quando,
                    campanha_id_first=por_utm.get(utm),
                    campanha_id_last=por_utm.get(utm),
                    utm_campaign_first=utm,
                    utm_campaign_last=utm,
                )
            )
            faturamento += Decimal(preco)

        # As 24 conversas que o agente passou para uma pessoa viram atribuição.
        for i in range(24):
            inicio = dias_atras(i % 4)
            db.add(
                models.AtendimentoAtribuicao(
                    id=str(uuid.uuid4()),
                    loja_slug=slug,
                    telefone_hmac=f"{i:064x}",
                    vendedor_email=email,
                    origem="handoff_portal",
                    iniciada_em=inicio,
                    encerrada_em=inicio + timedelta(hours=2) if i % 3 else None,
                    ativa=bool(i % 3 == 0),
                )
            )

        db.commit()
        print(
            f"portal: {len(VENDAS_PORTAL)} vendas confirmadas "
            f"(R$ {faturamento}), 24 atendimentos atribuídos"
        )


MODOS = {
    "estoque": seed_estoque,
    "chatbot": seed_chatbot,
    "trafego": seed_trafego,
    "portal": seed_portal,
}

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in MODOS:
        raise SystemExit(f"uso: seed_demo.py [{'|'.join(MODOS)}]")
    MODOS[sys.argv[1]]()
