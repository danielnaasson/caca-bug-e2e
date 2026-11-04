// O relógio fica congelado em todos os testes. O tempo só anda com cy.tick(),
// então nenhuma pontuação depende da velocidade da máquina.
beforeEach(() => {
  cy.clock();
});

Cypress.Commands.add('abrirJogo', () => {
  cy.visit('');
  cy.get('#ovCard h1').should('have.text', 'Caça-Bug');
});

Cypress.Commands.add('iniciarCiclo', () => {
  cy.abrirJogo();
  cy.contains('button', 'Começar o teste').click();
  cy.get('#ov').should('not.be.visible');
});

Cypress.Commands.add('clicarNaTela', (id) => {
  cy.get(`#screen [data-hit="${id}"]`).first().click();
});

Cypress.Commands.add('escolherSeveridade', (severidade) => {
  cy.contains('#ovCard .sevbtn', severidade).click();
});

Cypress.Commands.add('continuarTestando', () => {
  cy.contains('button', 'Continuar testando').click();
});

Cypress.Commands.add('reportarBug', (id, severidade) => {
  cy.clicarNaTela(id);
  cy.escolherSeveridade(severidade);
  cy.continuarTestando();
});

Cypress.Commands.add('pontosDevemSer', (pontos) => {
  cy.get('#sPts').should('have.text', String(pontos));
});

Cypress.Commands.add('concluirFase', (fase) => {
  fase.bugs.forEach((bug) => cy.reportarBug(bug.id, bug.severidade));
  cy.get('#ovCard h3').should('contain', 'Build aprovado');
});
