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
  expectSelectionSetContains,
} from '../../utils';

/**
 * Defining implicit FK field handling end-to-end.
 *
 * ALL implicit FK field handling behavior should be defined in full here:
 *
 * 1. hasOne
 * 2. hasOne-belongsTo
 * 3. hasMany
 * 4. hasMany-BelongsTo
 * 5. manyToMany
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

    test('the generated graphql contains `id: ID!` PK', async () => {
      expectSchemaModelContains({
        schema: schema.transform().schema,
        model: 'Model',
        field: 'id',
        type: 'ID',
        isArray: false,
        isRequired: true,
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
        { data: null },
        { data: null },
        { data: null },
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

    test('the generated graphql schema contains `createdAt: AWSDateTime!`, `updatedAt: AWSDateTime!`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Model',
        field: 'createdAt',
        type: 'AWSDateTime',
        isArray: false,
        isRequired: true,
      });
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Model',
        field: 'updatedAt',
        type: 'AWSDateTime',
        isArray: false,
        isRequired: true,
      });
    });

    test('the generated modelIntrospection schema contains the `createdAt`, `updatedAt` fields', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model']['fields']['createdAt']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'createdAt',
          type: 'AWSDateTime',
        }),
      );
      expect(modelIntrospection.models['Model']['fields']['updatedAt']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
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
  });

  describe('A model with implicit owner field from owner auth', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.owner()]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a owner?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string | undefined, Schema['Model']['owner']>
      >;
    });

    test('the generated graphql schema contains `owner: String`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Model',
        field: 'owner',
        type: 'String',
        isArray: false,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `owner`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model']['fields']['owner']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'owner',
          type: 'String',
        }),
      );
    });

    test('the generated modelIntrospection schema contains auth rule pointing to `owner` field', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      const authRules = modelIntrospection.models.Model.attributes.filter(
        (attr: any) => attr.type === 'auth',
      )[0].properties.rules;
      expect(authRules[0]).toEqual(
        expect.objectContaining({
          provider: 'userPools',
          ownerField: 'owner',
          allow: 'owner',
          identityClaim: 'cognito:username',
          operations: ['create', 'update', 'delete', 'read'],
        }),
      );
    });

    test('the client includes `owner` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['owner']);
    });
  });
});
