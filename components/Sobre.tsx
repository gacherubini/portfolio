import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { sobre } from '@/content/sobre'
import { Icone, type NomeDeIcone } from '@/components/Icone'

/**
 * O Sobre abre a home, não é página — subiu para o topo em 09/09/2026, antes
 * da experiência e dos projetos: quem chega quer saber quem é a pessoa antes
 * de olhar sistema. O primeiro parágrafo é a lede, em corpo grande; os
 * outros são texto normal. Tudo sobre o neutro da casca.
 *
 * Em 09/09/2026 a faixa azul do fim da home saiu, e o contato inteiro passou
 * a morar aqui: e-mail, WhatsApp e o currículo. É o único ponto de contato do
 * site, então nada dali pode ficar sem lugar.
 */
/**
 * Um ícone por linha da ficha que nomeia alguma coisa — pino (Onde),
 * servidor (Trabalho), chaves (Stack). As demais linhas não têm forma no
 * conjunto e não ganham nenhuma: ícone que não nomeia nada é enfeite.
 */
const ICONE_DA_FICHA: NomeDeIcone[] = ['pino', 'servidor', 'chaves']

/** Qual ícone acompanha cada perfil do `sobre.links`, pelo rótulo. */
const ICONE_DO_PERFIL: Record<string, NomeDeIcone> = {
  GitHub: 'github',
  LinkedIn: 'linkedin',
}

export function Sobre({ lang, temCurriculo }: { lang: Idioma; temCurriculo: boolean }) {
  const [lede, ...resto] = sobre.paragrafos

  return (
    <section className="secao sobre wrap" id="sobre">
      <h2>{t(ui.sobreTitulo, lang, 'ui.sobreTitulo')}</h2>
      <div className="grade">
        <div className="revela">
          <p className="lede">{t(lede, lang, 'sobre.paragrafos.0')}</p>
          {resto.map((p, i) => (
            <p className="corpo" key={i}>
              {t(p, lang, `sobre.paragrafos.${i + 1}`)}
            </p>
          ))}
        </div>
        <aside className="rail revela">
          <dl>
            {sobre.ficha.map((linha, i) => (
              <div key={i}>
                <dt>
                  {ICONE_DA_FICHA[i] ? <Icone nome={ICONE_DA_FICHA[i]} tamanho={15} /> : null}
                  {t(linha.rotulo, lang, `sobre.ficha.${i}.rotulo`)}
                </dt>
                <dd>{t(linha.valor, lang, `sobre.ficha.${i}.valor`)}</dd>
              </div>
            ))}
          </dl>
          <p className="perfis">
            {sobre.links.map((l) => (
              <a key={l.rotulo} href={l.href}>
                {ICONE_DO_PERFIL[l.rotulo] ? (
                  <Icone nome={ICONE_DO_PERFIL[l.rotulo]} tamanho={17} />
                ) : null}{' '}
                {l.rotulo}
              </a>
            ))}
            <a href={`mailto:${sobre.contato.email}`}>
              <Icone nome="email" tamanho={17} />{' '}
              {t({ pt: 'E-mail', en: 'Email' }, lang, 'sobre.perfis.email')}
            </a>
            <a href={sobre.contato.telefone.href}>
              <Icone nome="telefone" tamanho={17} /> {sobre.contato.telefone.exibicao}
            </a>
          </p>
          {/* SLOT: sem o PDF em public/, nada aqui. Nunca um botão que baixa 404. */}
          {temCurriculo ? (
            <p className="curriculo-linha">
              <a className="curriculo" href={sobre.contato.curriculo.href} download>
                {t(sobre.contato.curriculo.rotulo, lang, 'sobre.contato.curriculo.rotulo')}{' '}
                <span>PDF</span>
              </a>
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  )
}
