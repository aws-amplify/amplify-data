import { a } from '@aws-amplify/data-schema';

/**
 * Things we expect customers might try that are invalid and should throw.
 */
describe('validated on execution', () => {
  test('Throws on missing auth', async () => {
    const schema = a.schema({
      Todo: a.model({
        content: a.string(),
      }),
    });

    expect(() => schema.transform()).toThrow('missing authorization rules');
  });


  describe.each([
	{ field: a.string() },
	{ field: a.integer() },
	{ field: a.float() },
	{ field: a.datetime() },
	{ field: a.timestamp() },
  ])('Generated fields and identifiers', ({field}) => {
	/**
	 * We allowed nullable identifiers to support SQL generated fields
	 * e.g. Postgres SERIAL ... See PR: #373
	 *
	 * However, if a field is nullable and not indicated as DB generated (.default()),
	 * we should throw.
	 */
	test('Throws if identifier is nullable and has no default', async () => {
	  const schema = a.schema({
		Model: a
		  .model({
			nullableFieldNoDefault: field,
		  })
		  .authorization((allow) => allow.publicApiKey())
		  .identifier(['nullableFieldNoDefault']),
	  });

	  expect(() => schema.transform()).toThrow('a nullable identifier must be generatable');
	});
  })
});
