describe('Data-Client Gen2', () => {
	const testCases = [
		'create-post',
		'get-post',
		'update-post',
		'delete-post',
		'create-two-posts',
		'create-author',
		'create-comments-for-post-and-author',
		'create-profile-for-author',
		'get-author',
		'list-post-unauthed',
		'create-post-unauthed',
		'delete-all',
	];

	describe('generateServerClientUsingCookies CRUDL', () => {
		beforeEach(() => {
			cy.visit('/test-cookies');
			cy.get('[data-cy="test-cases"]').should('exist');
		});

		for (const testCase of testCases) {
			it(`${testCase}`, () => {
				cy.get(`[data-cy=test-case-${testCase}]`).click();
				cy.get('[data-cy=status]')
					.invoke('attr', 'title')
					.should('eq', 'Success');
			});
		}
	});

	describe('generateServerClientUsingReqRes CRUDL', () => {
		beforeEach(() => {
			cy.visit('/test-req');
			cy.get('[data-cy="test-cases"]').should('exist');
		});

		for (const testCase of testCases) {
			it(`${testCase}`, () => {
				cy.get(`[data-cy=test-case-${testCase}]`).click();
				cy.get('[data-cy=status]')
					.invoke('attr', 'title')
					.should('eq', 'Success');
			});
		}
	});
});
