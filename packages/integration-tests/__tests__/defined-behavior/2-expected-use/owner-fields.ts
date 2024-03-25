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
  expectVariables,
} from '../../utils';

/**
 * Defining explicit/implicit owner field handling end-to-end.
 *
 * ALL explicit/implicit field handling behavior should be defined in full here.
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

describe('Implicit owner Field Handling. Given:', () => {
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

    test('the client can filter on `owner`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          owner: { eq: 'some-body' },
        },
      });
      expectVariables(spy, {
        filter: {
          owner: { eq: 'some-body' },
        },
      });
    });
  });

  describe('A model with implicit `customOwner` field from owner auth', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.owner().inField('customOwner')]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a customOwner?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string | undefined, Schema['Model']['customOwner']>
      >;
    });

    test('the generated graphql schema contains `customOwner: String`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Model',
        field: 'customOwner',
        type: 'String',
        isArray: false,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `customOwner`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Model']['fields']['customOwner'],
      ).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'customOwner',
          type: 'String',
        }),
      );
    });

    test('the generated modelIntrospection schema contains auth rule pointing to `customOwner` field', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      const authRules = modelIntrospection.models.Model.attributes.filter(
        (attr: any) => attr.type === 'auth',
      )[0].properties.rules;
      expect(authRules[0]).toEqual(
        expect.objectContaining({
          provider: 'userPools',
          ownerField: 'customOwner',
          allow: 'owner',
          identityClaim: 'cognito:username',
          operations: ['create', 'update', 'delete', 'read'],
        }),
      );
    });

    test('the client includes `customOwner` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['customOwner']);
    });

    test('the client can filter on `customOwner`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          customOwner: { eq: 'some-body' },
        },
      });
      expectVariables(spy, {
        filter: {
          customOwner: { eq: 'some-body' },
        },
      });
    });
  });

  describe('A model with implicit `explicitOwner` field from owner auth', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
          explicitOwner: a.string(),
        }),
      })
      .authorization([a.allow.owner().inField('explicitOwner')]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a explicitOwner?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string | undefined, Schema['Model']['explicitOwner']>
      >;
    });

    test('the generated graphql schema contains `explicitOwner: String`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Model',
        field: 'explicitOwner',
        type: 'String',
        isArray: false,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `explicitOwner`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Model']['fields']['explicitOwner'],
      ).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'explicitOwner',
          type: 'String',
        }),
      );
    });

    test('the generated modelIntrospection schema contains auth rule pointing to `explicitOwner` field', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      const authRules = modelIntrospection.models.Model.attributes.filter(
        (attr: any) => attr.type === 'auth',
      )[0].properties.rules;
      expect(authRules[0]).toEqual(
        expect.objectContaining({
          provider: 'userPools',
          ownerField: 'explicitOwner',
          allow: 'owner',
          identityClaim: 'cognito:username',
          operations: ['create', 'update', 'delete', 'read'],
        }),
      );
    });

    test('the client includes `explicitOwner` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['explicitOwner']);
    });

    test('the client can filter on `explicitOwner`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          explicitOwner: { eq: 'some-body' },
        },
      });
      expectVariables(spy, {
        filter: {
          explicitOwner: { eq: 'some-body' },
        },
      });
    });
  });

  describe('A model with implicit `group` field from groupDefinedIn auth', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.groupDefinedIn('group')]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a group?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string | undefined, Schema['Model']['group']>
      >;
    });

    test('the generated graphql schema contains `group: String`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Model',
        field: 'group',
        type: 'String',
        isArray: false,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `group`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model']['fields']['group']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: false,
          name: 'group',
          type: 'String',
        }),
      );
    });

    test('the generated modelIntrospection schema contains auth rule pointing to `group` field', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      const authRules = modelIntrospection.models.Model.attributes.filter(
        (attr: any) => attr.type === 'auth',
      )[0].properties.rules;
      expect(authRules[0]).toEqual(
        expect.objectContaining({
          provider: 'userPools',
          groupField: 'groups',
          groupsField: 'group',
          allow: 'groups',
          groupClaim: 'cognito:groups',
          operations: ['create', 'update', 'delete', 'read'],
        }),
      );
    });

    test('the client includes `group` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['group']);
    });

    test('the client can filter on `group`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          group: { eq: 'some-bodies' },
        },
      });
      expectVariables(spy, {
        filter: {
          group: { eq: 'some-bodies' },
        },
      });
    });
  });

  describe('A model with implicit `groups` field from groupsDefinedIn auth', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization([a.allow.groupsDefinedIn('groups')]);
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a group?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string[] | undefined, Schema['Model']['groups']>
      >;
    });

    test('the generated graphql schema contains `groups: String`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelContains({
        schema: graphqlSchema,
        model: 'Model',
        field: 'groups',
        type: 'String',
        isArray: true,
        isRequired: false,
      });
    });

    test('the generated modelIntrospection schema contains `groups`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model']['fields']['groups']).toEqual(
        expect.objectContaining({
          isArray: true,
          isArrayNullable: true,
          isRequired: false,
          name: 'groups',
          type: 'String',
        }),
      );
    });

    test('the generated modelIntrospection schema contains auth rule pointing to `groups` field', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      const authRules = modelIntrospection.models.Model.attributes.filter(
        (attr: any) => attr.type === 'auth',
      )[0].properties.rules;
      expect(authRules[0]).toEqual(
        expect.objectContaining({
          provider: 'userPools',
          groupField: 'groups',
          groupsField: 'groups',
          allow: 'groups',
          groupClaim: 'cognito:groups',
          operations: ['create', 'update', 'delete', 'read'],
        }),
      );
    });

    test('the client includes `groups` in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['groups']);
    });

    test('the client can filter on `groups`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          groups: { eq: 'some-bodies' },
        },
      });
      expectVariables(spy, {
        filter: {
          groups: { eq: 'some-bodies' },
        },
      });
    });
  });
});
