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

Prontuário é o caso mais duro da regra, e vale dizer por quê: os prints de
produção do BDDente traziam nome completo de paciente, telefone e histórico de
tratamento. Dado de saúde, repositório público, histórico de git permanente.
Os 8 prints que estão aqui saíram de instância local e são melhores que os
originais — retina, sem barra de rolagem, e mostrando estados que os de
produção não mostravam.

## Estado

| Projeto | Prints | Origem |
|---|---|---|
| `revy/` | 6 | stack local, loja fictícia "Garagem Vale Motos" |
| `office-timesheet/` | 13 | instância local, escritório fictício |
| `bddente/` | 8 | instância local, "Consultório Bela Vista" fictício |
| `autotune/` | 4 | plugin Standalone capturado da janela + 2 gráficos do repo Python |
