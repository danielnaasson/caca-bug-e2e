describe('Tempo', () => {
  beforeEach(() => {
    cy.iniciarCiclo();
  });

  it('CT-TEMPO-001: o cronômetro desconta um segundo por vez', () => {
    cy.tick(5000);
    cy.get('#sTempo').should('have.text', '1:10');
  });

  it('CT-TEMPO-002: o cronômetro fica em alerta nos últimos 15 segundos', () => {
    cy.tick(59000);
    cy.get('#sTempoBox').should('not.have.class', 'warn');
    cy.tick(1000);
    cy.get('#sTempo').should('have.text', '0:15');
    cy.get('#sTempoBox').should('have.class', 'warn');
  });

  it('CT-TEMPO-003: o cronômetro para enquanto o jogador escolhe a severidade', () => {
    cy.clicarNaTela('senha');
    cy.tick(30000);
    cy.get('#sTempo').should('have.text', '1:15');
    cy.escolherSeveridade('Crítica');
    cy.continuarTestando();
    cy.tick(1000);
    cy.get('#sTempo').should('have.text', '1:14');
  });

  it('CT-TEMPO-004: o tempo esgotado encerra a fase e lista o que escapou', () => {
    cy.reportarBug('senha', 'Crítica');
    cy.tick(75000);
    cy.get('#ovCard h3').should('contain', 'Tempo esgotado');
    cy.get('#ovCard .miss-list > div').should('have.length', 3);
    cy.get('#ovCard').should('not.contain', 'bônus de tempo');
    cy.get('#ovCard .rules').should('contain', '150');
  });

  it('CT-TEMPO-005: a tela não aceita reporte depois que o tempo acaba', () => {
    cy.tick(75000);
    cy.contains('button', 'Ver a tela').click();
    cy.get('#screen').should('have.class', 'locked');
    // A tela bloqueia o mouse via CSS; o force confere também a trava do JavaScript.
    cy.get('#screen [data-hit="senha"]').first().click({ force: true });
    cy.get('#ov').should('not.be.visible');
    cy.pontosDevemSer(0);
  });
});
