import { a } from '@aws-amplify/data-schema';
import { DatasourceEngine } from '@aws-amplify/data-schema-types';
import { configure } from '@aws-amplify/data-schema/internals';

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
    { case: 'string', field: a.string(), fieldSupportsGeneration: false },
    { case: 'integer', field: a.integer(), fieldSupportsGeneration: true },
    { case: 'float', field: a.float(), fieldSupportsGeneration: false },
    { case: 'datetime', field: a.datetime(), fieldSupportsGeneration: false },
    { case: 'timestamp', field: a.timestamp(), fieldSupportsGeneration: false },
  ])('Generated fields and identifiers: $case', ({ field, fieldSupportsGeneration }) => {
    const postgresConfig = configure({
      database: {
        identifier: 'some-identifier',
        engine: 'postgresql',
        connectionUri: '' as any,
      },
    })


    /**
     * We allowed nullable identifiers to support SQL generated fields
     * e.g. Postgres SERIAL ... See PR: #373
     *
     * However, if a field is nullable and not indicated as DB generated (.default()),
     * we should throw.
     */
    test('Throws if identifier is nullable and has no default', async () => {
      const schema = postgresConfig.schema({
        Model: a
          .model({
            nullableFieldNoDefault: field,
          })
          .authorization((allow) => allow.publicApiKey())
          .identifier(['nullableFieldNoDefault']),
      });

      expect(() => schema.transform()).toThrowErrorMatchingSnapshot()
    });

    it.each([
      { engine: 'mysql', engineSupportsGeneration: false },
      { engine: 'dynamodb', engineSupportsGeneration: false },
      { engine: 'postgresql', engineSupportsGeneration: true }
    ])('Throws if you use `.default()` on unsupported engine', ({ engine, engineSupportsGeneration }) => {
      const schema = configure({
        database: {
          engine: engine as DatasourceEngine,
          identifier: 'some-identifier',
          connectionUri: '' as any,
        },
      })
        .schema({
          Model: a.model({
            nullableGeneratedField: field.default(),
          })
        })

      if (engineSupportsGeneration && fieldSupportsGeneration) {
        expect(() => schema.transform()).not.toThrow();
      } else {
        expect(() => schema.transform()).toThrowErrorMatchingSnapshot()
      }
    })

    test('Throws if you use `.default()` on unsupported field type', () => {
      const schema = postgresConfig.schema({
        Model: a
          .model({
            nullableGeneratedField: field.default(),
          })
          .authorization((allow) => allow.publicApiKey())
      });

      if (fieldSupportsGeneration) {
        expect(() => schema.transform()).not.toThrow();
      } else {
        expect(() => schema.transform()).toThrowErrorMatchingSnapshot()
      }
    })
  })
});
