# 🧪 Testes E2E do Caça-Bug

[![Testes E2E](https://github.com/danielnaasson/caca-bug-e2e/actions/workflows/e2e.yml/badge.svg)](https://github.com/danielnaasson/caca-bug-e2e/actions/workflows/e2e.yml)

Suíte de testes de ponta a ponta com Cypress para o [Caça-Bug](https://danielnaasson.github.io/caca-bug/), um jogo em que o jogador faz o papel de QA. Os testes rodam contra o jogo publicado.

![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## Resultado

**29 casos: 27 passando e 2 marcados como bug conhecido.**

A suíte encontrou 3 defeitos reais no jogo:

| Bug | Problema | Severidade | Status |
|---|---|---|---|
| [BUG-001](docs/qa/bugs/BUG-001.md) | A tela de abertura não fechava, e o jogo não começava | S1 | ✅ Corrigido |
| [BUG-002](docs/qa/bugs/BUG-002.md) | O botão lateral promete avançar, mas encerra a fase | S3 | 🔴 Aberto |
| [BUG-003](docs/qa/bugs/BUG-003.md) | O placar mostra o dobro dos pontos quando a fase termina | S3 | 🔴 Aberto |

Os casos dos bugs abertos estão com `it.skip`, porque a pipeline deve avisar sobre defeitos novos. Quando um bug for corrigido, basta trocar para `it`.

## O que é testado

| Arquivo | Casos | Cobertura |
|---|---|---|
| [`inicio.cy.js`](cypress/e2e/inicio.cy.js) | 3 | Abertura, bloqueio da tela e dados do build |
| [`pontuacao.cy.js`](cypress/e2e/pontuacao.cy.js) | 10 | Pontos por severidade, falso positivo, duplicidade e bônus de tempo |
| [`tempo.cy.js`](cypress/e2e/tempo.cy.js) | 5 | Cronômetro, alerta, pausa e tempo esgotado |
| [`navegacao.cy.js`](cypress/e2e/navegacao.cy.js) | 6 | Troca de fase, pontos acumulados e uso pelo teclado |
| [`ciclo-completo.cy.js`](cypress/e2e/ciclo-completo.cy.js) | 5 | As 4 fases, títulos, reinício e recorde |

## Decisões

- **Relógio controlado:** com `cy.clock()` e `cy.tick()`, um teste de 75 segundos de jogo roda em menos de 1 segundo, e o resultado não depende da velocidade da máquina.
- **Resultado esperado fora do jogo:** [`fases.json`](cypress/fixtures/fases.json) foi escrito à parte. Um teste que lê a resposta da própria aplicação nunca acusa erro nela.
- **Um teste por regra:** cada caso tem um ID (`CT-AREA-NNN`) e verifica uma coisa só.
- **Comandos reutilizáveis:** as ações do jogo ficam em [`support/e2e.js`](cypress/support/e2e.js), como `cy.reportarBug()`.
- **Pipeline:** cada push roda a suíte no GitHub Actions e guarda os prints quando algo falha.

## Como rodar

```bash
npm install
npm test
```

Para ver os testes rodando na tela:

```bash
npm run test:open
```
