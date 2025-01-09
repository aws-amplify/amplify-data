describe('rollup spec', () => {
    it('passes', () => {
      cy.visit('http://localhost:3000');
      cy.request('/bundle.js').then((response) => {
        cy.log('bundle.js content:', response.body);
      });
    });
  });
  