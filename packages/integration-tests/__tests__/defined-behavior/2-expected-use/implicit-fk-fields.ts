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
  expectSelectionSetNotContains,
  expectVariables,
} from '../../utils';

/**
 * NOTE
 *
 * These scenarios have not been fully fleshed out, because I (wirej) discovered partway
 * through enumeration that this DX is changing prior to GA anyway. I'm leaving the tests
 * here for the initial rev in case they help provide a good jumping-off point for the
 * final/GA DX.
 */

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
  describe('A hasOne parent with implicit FK', () => {
    const schema = a
      .schema({
        Parent: a.model({
          content: a.string(),
          child: a.hasOne('Child'),
        }),
        Child: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.public()]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has Parent -> Child FK field', () => {
      type _parentToChildFKStringIsPresent = Expect<
        Equal<string | undefined, Schema['Parent']['parentChildId']>
      >;
    });

    test('the generated graphql schema Parent model contains `parentChildId: ID!`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Parent',
        field: 'parentChildId',
        type: 'ID',
        isArray: false,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `Parent.parentChildId`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Parent']['fields']['parentChildId'],
      ).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'parentChildId',
          type: 'ID',
        }),
      );
    });

    test('the client includes `parentChildId` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Parent.list();

      expectSelectionSetContains(spy, ['parentChildId']);
    });

    test('the client can filter on `parentChildId`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Parent.list({
        filter: {
          parentChildId: {
            eq: 'something',
          },
        },
      });
      expectVariables(spy, {
        filter: {
          parentChildId: {
            eq: 'something',
          },
        },
      });
    });
  });

  describe('A hasOne parent + belongsTo child with implicit FKs', () => {
    const schema = a
      .schema({
        Parent: a.model({
          content: a.string(),
          child: a.hasOne('Child'),
        }),
        Child: a.model({
          content: a.string(),
          parent: a.belongsTo('Parent'),
        }),
      })
      .authorization([a.allow.public()]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has Parent <-> Child FK fields', () => {
      type _parentToChildFKStringIsPresent = Expect<
        Equal<string | undefined, Schema['Parent']['parentChildId']>
      >;
      type _childToParentFKStringIsPresent = Expect<
        Equal<string | undefined, Schema['Child']['childParentId']>
      >;
    });

    test('the generated graphql schema Parent model contains `Parent { parentChildId: ID! }`, `Child { childParentId: ID!` }`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Parent',
        field: 'parentChildId',
        type: 'ID',
        isArray: false,
        isRequired: false,
      });
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Child',
        field: 'childParentId',
        type: 'ID',
        isArray: false,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `Parent.parentChildId`, `Child.childParentId`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Parent']['fields']['parentChildId'],
      ).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'parentChildId',
          type: 'ID',
        }),
      );
      expect(
        modelIntrospection.models['Child']['fields']['childParentId'],
      ).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'childParentId',
          type: 'ID',
        }),
      );
    });

    test('the client includes `parentChildId` in Parent selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Parent.list();

      expectSelectionSetContains(spy, ['parentChildId']);
    });

    test('the client includes `childParentId` in Child selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Child.list();

      expectSelectionSetContains(spy, ['childParentId']);
    });

    test('the client can filter on `Parent.parentChildId`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Parent.list({
        filter: {
          parentChildId: {
            eq: 'something',
          },
        },
      });
      expectVariables(spy, {
        filter: {
          parentChildId: {
            eq: 'something',
          },
        },
      });
    });

    test('the client can filter on `Child.childParentId`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Child.list({
        filter: {
          childParentId: {
            eq: 'some-id',
          },
        },
      });
      expectVariables(spy, {
        filter: {
          childParentId: {
            eq: 'some-id',
          },
        },
      });
    });
  });

  describe('A hasMany parent with implicit FK', () => {
    const schema = a
      .schema({
        Parent: a.model({
          content: a.string(),
          child: a.hasMany('Child'),
        }),
        Child: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.public()]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a Child -> Parent FK field', () => {
      type _childToParentFKStringIsPresent = Expect<
        Equal<string | undefined, Schema['Child']['parentChildId']>
      >;
    });

    test('the generated graphql schema Child model contains `parentChildId: ID!`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Child',
        field: 'parentChildId',
        type: 'ID',
        isArray: false,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `Parent.parentChildId`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Child']['fields']['parentChildId'],
      ).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'parentChildId',
          type: 'ID',
        }),
      );
    });

    test('the client does not include `child` in Parent selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Child.list();

      expectSelectionSetNotContains(spy, ['child']);
    });

    test('the client includes `parentChildId` in Child selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Child.list();

      expectSelectionSetContains(spy, ['parentChildId']);
    });

    test('the client can filter Child on `parentChildId`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Child.list({
        filter: {
          parentChildId: { eq: 'some-id' },
        },
      });
      expectVariables(spy, {
        filter: {
          parentChildId: {
            eq: 'some-id',
          },
        },
      });
    });
  });

  // test('hasMany-belongsTo FK', async () => {});
  // test('manyToMany', async () => {})
});
