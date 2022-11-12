describe('Run google query', () => {
  it('visits Google with empty search', () => {
    cy.visit('/search?q=g').then((win) => {
      expect(win.location.href).equal('https://www.google.com/');
      cy.get('input[name="q"]').should('have.value', '');
    });
  });

  it('visits Google with the appropriate search', () => {
    const encodedQuery = encodeURIComponent('g hello world');
    cy.visit(`/search?q=${encodedQuery}`).then((win) => {
      const encodedParam = encodeURIComponent('hello world');
      expect(win.location.href).equal(
        `https://www.google.com/search?q=${encodedParam}`
      );
      cy.get('input[name="q"]').should('have.value', 'hello world');
    });
  });
});
