describe('Início do ciclo de teste', () => {
  it('CT-INICIO-001: a abertura anuncia 4 builds e 22 bugs', () => {
    cy.abrirJogo();
    cy.get('#ovCard .eyebrow').should('contain', '4 builds').and('contain', '22 bugs');
    cy.contains('button', 'Começar o teste').should('be.visible');
  });

  it('CT-INICIO-002: a tela não aceita reporte antes de começar', () => {
    cy.abrirJogo();
    cy.get('#screen [data-hit="senha"]').click({ force: true });
    cy.get('#ovCard h1').should('have.text', 'Caça-Bug');
    cy.pontosDevemSer(0);
  });

  it('CT-INICIO-003: começar abre a fase 1 com os dados do build', () => {
    cy.fixture('fases').then(([fase]) => {
      cy.iniciarCiclo();
      cy.get('#url').should('have.text', fase.url);
      cy.get('#build').should('have.text', fase.build);
      cy.get('#sFase').should('have.text', '1/4');
      cy.get('#sTempo').should('have.text', '1:15');
      cy.get('#sBugs').should('have.text', `0/${fase.bugs.length}`);
      cy.get('#charter').should('contain', 'Charter:');
      cy.pontosDevemSer(0);
    });
  });
});
