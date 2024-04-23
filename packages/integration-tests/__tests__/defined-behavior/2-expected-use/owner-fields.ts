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

describe('Implicit Auth Field Handling. Given:', () => {
  describe('A model with implicit owner field from owner auth', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization((allow) => allow.owner());
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a owner?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string | undefined, Schema['Model']['owner']>
      >;
    });

    test('the generated graphql schema excludes `owner`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelExcludes({
        schema: graphqlSchema,
        model: 'Model',
        field: 'owner',
      });
    });

    test('the generated modelIntrospection schema excludes `owner`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Model']['fields']['owner'],
      ).toBeUndefined();
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
      .authorization((allow) => allow.ownerDefinedIn('customOwner'));
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a customOwner?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string | undefined, Schema['Model']['customOwner']>
      >;
    });

    test('the generated graphql schema excludes `customOwner`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelExcludes({
        schema: graphqlSchema,
        model: 'Model',
        field: 'customOwner',
      });
    });

    test('the generated modelIntrospection schema excludes `customOwner`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Model']['fields']['customOwner'],
      ).toBeUndefined();
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
      .authorization((allow) => allow.ownerDefinedIn('explicitOwner'));
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
      .authorization((allow) => allow.groupDefinedIn('group'));
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a group?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string | undefined, Schema['Model']['group']>
      >;
    });

    test('the generated graphql schema excludes `group`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelExcludes({
        schema: graphqlSchema,
        model: 'Model',
        field: 'group',
      });
    });

    test('the generated modelIntrospection schema excludes `group`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Model']['fields']['group'],
      ).toBeUndefined();
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
      .authorization((allow) => allow.groupsDefinedIn('groups'));
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a group?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string[] | undefined, Schema['Model']['groups']>
      >;
    });

    test('the generated graphql schema excludes `groups`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelExcludes({
        schema: graphqlSchema,
        model: 'Model',
        field: 'groups',
      });
    });

    test('the generated modelIntrospection schema excludes `groups`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Model']['fields']['groups'],
      ).toBeUndefined();
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

  describe('A model with implicit `groups` field from groupsDefinedIn OIDC auth', () => {
    const schema = a
      .schema({
        Model: a.model({
          content: a.string(),
        }),
      })
      .authorization((allow) => allow.groupsDefinedIn('groups', 'oidc'));
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has a group?: string und fields', () => {
      type _ownerStringIsPresent = Expect<
        Equal<string[] | undefined, Schema['Model']['groups']>
      >;
    });

    test('the generated graphql schema excludes `groups`', async () => {
      const graphqlSchema = schema.transform().schema;
      expectSchemaModelExcludes({
        schema: graphqlSchema,
        model: 'Model',
        field: 'groups',
      });
    });

    test('the generated modelIntrospection schema excludes `groups`', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(
        modelIntrospection.models['Model']['fields']['groups'],
      ).toBeUndefined();
    });

    test('the generated modelIntrospection schema contains auth rule pointing to `groups` field', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      const authRules = modelIntrospection.models.Model.attributes.filter(
        (attr: any) => attr.type === 'auth',
      )[0].properties.rules;
      expect(authRules[0]).toEqual(
        expect.objectContaining({
          provider: 'oidc',
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
