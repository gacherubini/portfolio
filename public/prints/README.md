# Prints

Uma pasta por projeto, arquivos nomeados com número e descrição
(`01-visao-geral.png`, `02-agente-whatsapp.png`).

## A regra

**Nenhum print aqui pode conter dado real de cliente, de paciente ou de empresa.**

Sistema em produção se fotografa a partir de instância local populada com dados
inventados, pelos scripts em `../../scripts/`. Print vindo de produção não entra,
mesmo com a intenção de borrar depois: borrão vaza, e nome de paciente é dado de
saúde.

Se você precisar guardar um print real como referência do que reproduzir, ponha
em `_referencia-privada/` — o `.gitignore` bloqueia essa pasta e qualquer arquivo
com `REAL` no nome.

## Estado

| Projeto | Prints | Origem |
|---|---|---|
| `revy/` | 6 | stack local, loja fictícia "Garagem Vale Motos" |
| `office-timesheet/` | 3 | instância local, escritório fictício |
| `bddente/` | faltam | precisa de instância local com pacientes inventados |
| `autotune/` | faltam | usar os gráficos de `TCC_autotune/results/figures/` |
| `gastos/` | faltam | o app está em construção |
