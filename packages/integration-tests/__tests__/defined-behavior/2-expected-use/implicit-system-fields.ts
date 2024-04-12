import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  parseQuery,
  parseGraphqlSchema,
  expectSchemaModelContains,
  expectSchemaModelExcludes,
  expectSelectionSetContains,
  expectVariables,
} from '../../utils';

/**
 * Defining implicit system-level field handling end-to-end.
 *
 * ALL implicit field handling behavior should be defined in full here:
 *
 * 1. PK
 * 2. Timestamps
 *
 * At this level of testing, it may be unexpected that we care how the graphql and
 * modelIntrospection schema represent these fields, but some of these intermediate artifacts
 * are signals for how gen2 schemas are consumed by Studio. So, we'll clamp on a few levels
 * of behavior here:
 *
 * 1. types
 * 2. graphql generation
 * 3. config.modelIntrospection
 * 4. client.models.*()
 *
 * Unless it's overly onerous or verbose to do so, assertions here clamp on only the hard
 * requirements inline for readability. When this isn't possible or seems to hurt test
 * comprehension more than it helps, we'll fall back to snapshots.
 */

describe('Implicit System Field Handling. Given:', () => {
  describe('A model with no explicit PK', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.public()]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a default `id: string`', () => {
      type _IdStringIsPresent = Expect<Equal<string, Schema['Model']['id']>>;
    });

    test('the generated graphql excludes `id: ID!` PK', async () => {
      expectSchemaModelExcludes({
        schema: schema.transform().schema,
        model: 'Model',
        field: 'id',
      });
    });

    test('the generated modelIntrospection schema contains the PK field and metadata', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model'].primaryKeyInfo).toEqual(
        expect.objectContaining({
          isCustomPrimaryKey: false,
          primaryKeyFieldName: 'id',
          sortKeyFieldNames: [],
        }),
      );
      expect(modelIntrospection.models['Model']['fields']['id']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'id',
          type: 'ID',
        }),
      );
    });

    test('the client typing requires `id` in by-PK operations', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        // @ts-expect-error
        { data: null },
        // @ts-expect-error
        { data: null },
        // @ts-expect-error
        { data: null },
        // @ts-expect-error
        { data: null },
      ]);

      const client = generateClient<Schema>();

      // Allowed
      await client.models.Model.get({ id: 'asdf' });
      await client.models.Model.delete({ id: 'asdf' });

      // Disallowed (but notably no *runtime* exception for this currently)
      // @ts-expect-error
      await client.models.Model.get({});
      // @ts-expect-error
      await client.models.Model.delete({});

      // Disallowed by types and fails runtime validation
      // @ts-expect-error
      await expect(client.models.Model.get()).rejects.toThrow();
    });

    test('the client includes `id` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['id']);
    });

    test('the client can filter on `id`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          id: { eq: 'some-id' },
        },
      });
      expectVariables(spy, {
        filter: {
          id: { eq: 'some-id' },
        },
      });
    });
  });

  describe('A model with no explicit timestamp fields', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.public()]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a createdAt: string, updatedAt: string fields', () => {
      type _createAtStringIsPresent = Expect<
        Equal<string, Schema['Model']['createdAt']>
      >;
      type _updatedAtStringIsPresent = Expect<
        Equal<string, Schema['Model']['updatedAt']>
      >;
    });

    test('the generated graphql schema excludes `createdAt: AWSDateTime!`, `updatedAt: AWSDateTime!`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelExcludes({
        schema: graphqlSchema,
        model: 'Model',
        field: 'createdAt',
      });
      expectSchemaModelExcludes({
        schema: graphqlSchema,
        model: 'Model',
        field: 'updatedAt',
      });
    });

    test('the generated modelIntrospection schema contains the `createdAt`, `updatedAt` fields', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model']['fields']['createdAt']).toEqual(
        expect.objectContaining({
          isArray: false,
          // values of these two fields are important for signaling to consumers
          // the fields are present, but are managed by the server.
          isRequired: false,
          isReadOnly: true,
          name: 'createdAt',
          type: 'AWSDateTime',
        }),
      );
      expect(modelIntrospection.models['Model']['fields']['updatedAt']).toEqual(
        expect.objectContaining({
          isArray: false,
          // values of these two fields are important for signaling to consumers
          // the fields are present, but are managed by the server.
          isRequired: false,
          isReadOnly: true,
          name: 'updatedAt',
          type: 'AWSDateTime',
        }),
      );
    });

    test('the client includes `createdAt`, `updatedAt` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['createdAt', 'updatedAt']);
    });

    test('the client can filter on `createdAt`, `updatedAt`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          createdAt: {
            eq: '2022-02-02 02:02:02',
          },
          updatedAt: {
            eq: '2022-02-02 02:02:02',
          },
        },
      });
      expectVariables(spy, {
        filter: {
          createdAt: {
            eq: '2022-02-02 02:02:02',
          },
          updatedAt: {
            eq: '2022-02-02 02:02:02',
          },
        },
      });
    });
  });
});
