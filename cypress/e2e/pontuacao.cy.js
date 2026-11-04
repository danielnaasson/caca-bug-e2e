describe('Pontuação', () => {
  beforeEach(() => {
    cy.iniciarCiclo();
  });

  // "senha" é Crítica e "entrar" é Baixa: juntos cobrem as quatro distâncias da severidade.
  [
    { caso: 'CT-PONTOS-001', id: 'senha', escolha: 'Crítica', pontos: 150, regra: 'severidade exata' },
    { caso: 'CT-PONTOS-002', id: 'senha', escolha: 'Alta', pontos: 120, regra: 'errar por um nível' },
    { caso: 'CT-PONTOS-003', id: 'senha', escolha: 'Média', pontos: 100, regra: 'errar por dois níveis' },
    { caso: 'CT-PONTOS-004', id: 'entrar', escolha: 'Crítica', pontos: 100, regra: 'errar por três níveis' },
  ].forEach(({ caso, id, escolha, pontos, regra }) => {
    it(`${caso}: ${regra} vale ${pontos} pontos`, () => {
      cy.clicarNaTela(id);
      cy.escolherSeveridade(escolha);
      cy.get('#ovCard .eyebrow').should('contain', `BUG-001 aberto · +${pontos}`);
      cy.continuarTestando();
      cy.pontosDevemSer(pontos);
      cy.get('#sBugs').should('have.text', '1/4');
    });
  });

  it('CT-PONTOS-005: o ticket mostra a severidade certa, mesmo se o jogador errar', () => {
    cy.reportarBug('senha', 'Baixa');
    cy.get('#tickets .ticket').should('have.length', 1);
    cy.get('#tickets .ticket .sev').should('have.text', 'Crítica');
    cy.get('#logCount').should('have.text', '1');
  });

  it('CT-PONTOS-006: falso positivo tira 40 pontos e avisa', () => {
    cy.clicarNaTela('titulo');
    cy.get('#toast').should('be.visible').and('contain', 'Falso positivo');
    cy.pontosDevemSer(-40);
  });

  it('CT-PONTOS-007: o mesmo falso positivo não é cobrado duas vezes', () => {
    cy.clicarNaTela('titulo');
    cy.clicarNaTela('titulo');
    cy.get('#toast').should('contain', 'funciona como esperado');
    cy.pontosDevemSer(-40);
  });

  it('CT-PONTOS-008: o mesmo bug não pontua duas vezes', () => {
    cy.reportarBug('senha', 'Crítica');
    cy.clicarNaTela('senha');
    cy.get('#toast').should('contain', 'já está reportado');
    cy.pontosDevemSer(150);
    cy.get('#tickets .ticket').should('have.length', 1);
  });

  it('CT-PONTOS-009: achar tudo paga 2 pontos por segundo restante', () => {
    cy.fixture('fases').then(([fase]) => {
      cy.tick(10000);
      cy.concluirFase(fase);
      const pontosDaFase = fase.bugs.length * 150 + 65 * 2;
      cy.get('#ovCard').should('contain', '+130').and('contain', 'bônus de tempo');
      cy.get('#ovCard .rules').should('contain', String(pontosDaFase));
      cy.contains('#ovCard button', 'Próximo build').click();
      cy.pontosDevemSer(pontosDaFase);
    });
  });

  // Regressão do BUG-003 (docs/qa/bugs/BUG-003.md).
  it('CT-PONTOS-010: o placar não dobra quando a fase termina (BUG-003)', () => {
    cy.reportarBug('senha', 'Crítica');
    cy.get('#btnEnd').click();
    cy.pontosDevemSer(150);
  });
});
