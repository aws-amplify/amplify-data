describe('webpack spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.request('/main.bundle.js').then((response) => {
      cy.log('main.bundle.js content:', response.body);
    });
  });
});
