describe('Navegação entre as fases', () => {
  beforeEach(() => {
    cy.iniciarCiclo();
  });

  it('CT-NAV-001: encerrar a fase manualmente não dá bônus de tempo', () => {
    cy.contains('#btnEnd', 'Encerrar ciclo de teste').click();
    cy.get('#ovCard h3').should('contain', 'Ciclo encerrado');
    cy.get('#ovCard').should('not.contain', 'bônus de tempo');
    cy.get('#ovCard .miss-list > div').should('have.length', 4);
  });

  it('CT-NAV-002: próximo build abre a fase 2 e zera o contador de bugs', () => {
    cy.fixture('fases').then(([, fase2]) => {
      cy.get('#btnEnd').click();
      cy.contains('button', 'Próximo build').click();
      cy.get('#sFase').should('have.text', '2/4');
      cy.get('#url').should('have.text', fase2.url);
      cy.get('#sTempo').should('have.text', '1:30');
      cy.get('#sBugs').should('have.text', `0/${fase2.bugs.length}`);
      cy.get('#tickets .ticket').should('not.exist');
    });
  });

  it('CT-NAV-003: os pontos acumulam de uma fase para a outra', () => {
    cy.reportarBug('senha', 'Crítica');
    cy.get('#btnEnd').click();
    cy.contains('button', 'Próximo build').click();
    cy.pontosDevemSer(150);
    cy.reportarBug('linha1', 'Alta');
    cy.pontosDevemSer(300);
  });

  it('CT-NAV-004: ver a tela fecha o resumo e mostra os bugs perdidos', () => {
    cy.get('#btnEnd').click();
    cy.contains('button', 'Ver a tela').click();
    cy.get('#ov').should('not.be.visible');
    cy.get('#screen [data-hit="senha"]').should('have.class', 'missed');
    cy.get('#btnEnd').should('have.text', 'Ir para o próximo build');
  });

  // Regressão do BUG-002 (docs/qa/bugs/BUG-002.md).
  it('CT-NAV-005: o botão lateral volta a dizer "Encerrar" na fase seguinte (BUG-002)', () => {
    cy.get('#btnEnd').click();
    cy.contains('button', 'Próximo build').click();
    cy.get('#btnEnd').should('have.text', 'Encerrar ciclo de teste');
  });

  it('CT-NAV-006: o reporte funciona pelo teclado', () => {
    cy.get('#screen [data-hit="senha"]').focus().type('{enter}');
    cy.get('#ovCard .eyebrow').should('contain', 'Bug confirmado');
    cy.escolherSeveridade('Crítica');
    cy.continuarTestando();
    cy.pontosDevemSer(150);
  });
});
