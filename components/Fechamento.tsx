import type { Idioma } from '@/content/tipos'
import { t } from '@/lib/idioma'
import { ui } from '@/content/ui'
import { sobre } from '@/content/sobre'
import { Marca } from '@/components/Marca'

/**
 * A última faixa da página é a cor da casa. E-mail e telefone vão em tamanho
 * de leitura porque são a informação, não botão — dá para copiar com o olho.
 * O currículo é o único item que o visitante leva embora. O rodapé mora aqui
 * dentro.
 */
export function Fechamento({ lang, temCurriculo }: { lang: Idioma; temCurriculo: boolean }) {
  return (
    <section className="fechamento">
      <div className="wrap">
        <div className="linha">
          <div className="canais">
            <p className="canal">
              <a href={`mailto:${sobre.contato.email}`}>{sobre.contato.email}</a>
            </p>
            <p className="canal">
              <a href={sobre.contato.telefone.href}>{sobre.contato.telefone.exibicao}</a>
              <span className="via">
                {t(sobre.contato.telefone.via, lang, 'sobre.contato.telefone.via')}
              </span>
            </p>
          </div>

          <div className="perfis">
            {/* SLOT: sem o PDF em public/, nada aqui. */}
            {temCurriculo ? (
              <a className="curriculo" href={sobre.contato.curriculo.href} download>
                {t(sobre.contato.curriculo.rotulo, lang, 'sobre.contato.curriculo.rotulo')}{' '}
                <span>PDF</span>
              </a>
            ) : null}
            {sobre.links.map((l) => (
              <a key={l.rotulo} href={l.href} rel="me noopener">
                {l.rotulo}
              </a>
            ))}
          </div>
        </div>

        <div className="assinatura">
          <span>{t(ui.rodape.lugar, lang, 'ui.rodape.lugar')}</span>
          <Marca variante="branca" />
        </div>
      </div>
    </section>
  )
}
