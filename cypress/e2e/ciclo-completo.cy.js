describe('Ciclo completo', () => {
  const avancarAteOFinal = () => {
    for (let i = 0; i < 3; i += 1) {
      cy.get('#btnEnd').click();
      cy.contains('button', 'Próximo build').click();
    }
    cy.get('#btnEnd').click();
    cy.contains('#ovCard button', 'Ver resultado final').click();
  };

  it('CT-FINAL-001: achar os 22 bugs sem erro dá cobertura total e o título máximo', () => {
    cy.fixture('fases').then((fases) => {
      const totalBugs = fases.reduce((soma, fase) => soma + fase.bugs.length, 0);
      const bonus = fases.reduce((soma, fase) => soma + fase.tempo * 2, 0);
      const esperado = totalBugs * 150 + bonus;

      cy.iniciarCiclo();
      fases.forEach((fase, indice) => {
        cy.get('#sFase').should('have.text', `${indice + 1}/4`);
        cy.get('#build').should('have.text', fase.build);
        cy.concluirFase(fase);
        cy.get('#ovCard').should('contain', 'Nenhum bug escapou');
        const ultima = indice === fases.length - 1;
        cy.contains('#ovCard button', ultima ? 'Ver resultado final' : 'Próximo build').click();
      });

      cy.get('#ovCard .bigscore').should('have.text', String(esperado));
      cy.get('#ovCard .rank').should('have.text', 'Caçador de Bugs Lendário');
      cy.get('#ovCard').should('contain', `${totalBugs} de ${totalBugs}`).and('contain', 'Cobertura total');
      cy.get('#ovCard .phase-table tr').should('have.length', fases.length);
    });
  });

  it('CT-FINAL-002: não achar nada dá o título mais baixo e 22 bugs em produção', () => {
    cy.iniciarCiclo();
    avancarAteOFinal();
    cy.get('#ovCard .bigscore').should('have.text', '0');
    cy.get('#ovCard .rank').should('have.text', 'Estagiário de QA');
    cy.get('#ovCard').should('contain', '0 de 22').and('contain', '22 foram para produção');
  });

  it('CT-FINAL-003: testar de novo volta à fase 1 com tudo zerado', () => {
    cy.iniciarCiclo();
    cy.reportarBug('senha', 'Crítica');
    avancarAteOFinal();
    cy.contains('button', 'Testar de novo').click();
    cy.get('#sFase').should('have.text', '1/4');
    cy.get('#sTempo').should('have.text', '1:15');
    cy.get('#btnEnd').should('have.text', 'Encerrar ciclo de teste');
    cy.pontosDevemSer(0);
    cy.reportarBug('senha', 'Crítica');
    cy.get('#tickets .tid').first().should('contain', 'BUG-001');
  });

  it('CT-RECORDE-001: o recorde fica salvo e aparece na abertura', () => {
    cy.iniciarCiclo();
    cy.reportarBug('senha', 'Crítica');
    avancarAteOFinal();
    cy.get('#ovCard').should('contain', 'Novo recorde');
    cy.abrirJogo();
    cy.get('#ovCard').should('contain', 'Seu recorde: 150 pontos');
  });

  it('CT-RECORDE-002: uma pontuação menor não substitui o recorde', () => {
    cy.visit('', {
      onBeforeLoad(janela) {
        janela.localStorage.setItem('cacabug-best', '500');
      },
    });
    cy.contains('button', 'Começar o teste').click();
    cy.reportarBug('senha', 'Crítica');
    avancarAteOFinal();
    cy.get('#ovCard').should('not.contain', 'Novo recorde').and('contain', 'Recorde: 500');
    cy.window().then((janela) => {
      expect(janela.localStorage.getItem('cacabug-best')).to.eq('500');
    });
  });
});
