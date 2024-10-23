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
	{ case: 'string', field: a.string(), generationSupported: false },
	{ case: 'integer', field: a.integer(), generationSupported: true },
	{ case: 'float', field: a.float(), generationSupported: false },
	{ case: 'datetime', field: a.datetime(), generationSupported: false },
	{ case: 'timestamp', field: a.timestamp(), generationSupported: false },
  ])('Generated fields and identifiers: $case', ({field, generationSupported}) => {
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

	  test('Throws if you use `.default()` on unsupported field', () => {
		const schema = a.schema({
		  Model: a
			.model({
			  nullableFieldNoDefault: field.default(),
			})
			.authorization((allow) => allow.publicApiKey())
		});

		if (!generationSupported) {
		  expect(() => schema.transform()).toThrow('db generation not supported for field');
		} else {
		  expect(() => schema.transform()).not.toThrow();
		}
	  })
  })
});
