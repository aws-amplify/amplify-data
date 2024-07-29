import { a, ClientSchema } from '@aws-amplify/data-schema';
import type { Expect, Equal, Prettify } from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  expectSchemaModelContains,
  expectSchemaModelExcludes,
  expectSelectionSetContains,
  expectVariables,
} from '../../utils';
import type {
  ModelPrimaryCompositeKeyInput,
  StringFilter,
} from '../../../../data-schema/src/util';

/**
 * Custom Identifier and Secondary Index permutations
 *
 * Implicit/default identifier ('id') is already covered in ./implicit-system-fields.ts
 *
 * TK
 *
 */

// TODO: migrate exhaustive PK type tests from ./integration-tests/__tests__/operation-params.test-d.ts

describe('Primary Indexes', () => {
  describe('Custom identifier single field SK', () => {
    const schema = a
      .schema({
        Model: a
          .model({
            pk: a.string().required(),
            sk1: a.string().required(),
          })
          .identifier(['pk', 'sk1']),
      })
      .authorization((allow) => allow.publicApiKey());

    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has the expected identifier', () => {
      type ResolvedIdentifier = Schema['Model']['identifier'];
      type ExpectedIdentifier = {
        pk: string;
        sk1: string;
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedIdentifier, ExpectedIdentifier>
      >;
    });

    test('the generated graphql excludes `id: ID!` PK', async () => {
      expectSchemaModelExcludes({
        schema: schema.transform().schema,
        model: 'Model',
        field: 'id',
      });
    });

    test('the generated modelIntrospection schema contains the expected PK and SK fields and metadata', async () => {
      expect.assertions(3);

      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model'].primaryKeyInfo).toEqual(
        expect.objectContaining({
          isCustomPrimaryKey: true,
          primaryKeyFieldName: 'pk',
          sortKeyFieldNames: ['sk1'],
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['pk']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'pk',
          type: 'String',
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['sk1']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'sk1',
          type: 'String',
        }),
      );
    });

    test('the runtime graphql document has expected types for PK and SK fields', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        pk: 'abc',
        sk1: {
          gt: 'a',
        },
      });

      const [[{ query, variables }]] = optionsAndHeaders(spy);

      expect(query).toEqual(
        expect.stringContaining(
          '$pk: String,$sortDirection: ModelSortDirection,$sk1: ModelStringKeyConditionInput',
        ),
      );

      expect(variables).toStrictEqual({
        pk: 'abc',
        sk1: {
          gt: 'a',
        },
      });
    });
  });

  describe('Custom identifier with composite SK', () => {
    const schema = a
      .schema({
        Model: a
          .model({
            pk: a.string().required(),
            sk1: a.string().required(),
            sk2: a.integer().required(),
          })
          .identifier(['pk', 'sk1', 'sk2']),
      })
      .authorization((allow) => allow.publicApiKey());

    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has the expected identifier IR shape', () => {
      type ResolvedIdentifier = Schema['Model']['identifier'];
      type ExpectedIdentifier = {
        pk: string;
        sk1: string;
        sk2: number;
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedIdentifier, ExpectedIdentifier>
      >;
    });

    test('the generated graphql excludes `id: ID!` PK', async () => {
      expectSchemaModelExcludes({
        schema: schema.transform().schema,
        model: 'Model',
        field: 'id',
      });
    });

    test('the generated modelIntrospection schema contains the expected PK and SK fields and metadata', async () => {
      expect.assertions(4);

      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model'].primaryKeyInfo).toEqual(
        expect.objectContaining({
          isCustomPrimaryKey: true,
          primaryKeyFieldName: 'pk',
          sortKeyFieldNames: ['sk1', 'sk2'],
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['pk']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'pk',
          type: 'String',
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['sk1']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'sk1',
          type: 'String',
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['sk2']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'sk2',
          type: 'Int',
        }),
      );
    });

    test('the runtime graphql document has expected types for PK and SK fields', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        pk: 'abc',
        sk1Sk2: {
          gt: {
            sk1: 'a',
            sk2: 1,
          },
        },
      });

      const [[{ query, variables }]] = optionsAndHeaders(spy);

      expect(query).toEqual(
        expect.stringContaining(
          '$pk: String,$sortDirection: ModelSortDirection,$sk1Sk2: ModelModelPrimaryCompositeKeyConditionInput',
        ),
      );

      expect(variables).toStrictEqual({
        pk: 'abc',
        sk1Sk2: {
          gt: {
            sk1: 'a',
            sk2: 1,
          },
        },
      });
    });
  });

  // Outstanding bug in graphql schema generation.
  describe.skip('A model with custom identifier, enum PK', () => {
    const schema = a
      .schema({
        Category: a.enum(['cats', 'dogs']),
        Model: a
          .model({
            category: a.ref('Category').required(),
            name: a.string().required(),
            content: a.string(),
          })
          .identifier(['category', 'name']),
      })
      .authorization((allow) => allow.publicApiKey());
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has all PK fields', () => {
      type _PKStringIsPresent = Expect<
        Equal<'cats' | 'dogs', Schema['Model']['type']['category']>
      >;
      type _SKStringIsPresent = Expect<
        Equal<string, Schema['Model']['type']['name']>
      >;
    });

    test('the generated graphql includes custom PK fields', async () => {
      console.log(schema.transform().schema);
      expectSchemaModelContains({
        schema: schema.transform().schema,
        model: 'Model',
        field: 'category',
        type: { enum: 'Category' } as any,
        isArray: false,
        isRequired: true,
      });
      expectSchemaModelContains({
        schema: schema.transform().schema,
        model: 'Model',
        field: 'name',
        type: 'String',
        isArray: false,
        isRequired: true,
      });
    });

    test('the generated modelIntrospection schema contains the PK field and metadata', async () => {
      const { modelIntrospection } = await buildAmplifyConfig(schema);
      expect(modelIntrospection.models['Model'].primaryKeyInfo).toEqual(
        expect.objectContaining({
          isCustomPrimaryKey: true,
          primaryKeyFieldName: 'category',
          sortKeyFieldNames: ['name'],
        }),
      );
      expect(modelIntrospection.models['Model']['fields']['category']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'customPK',
          type: { enum: 'Category' },
        }),
      );
      expect(modelIntrospection.models['Model']['fields']['name']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'name',
          type: 'String',
        }),
      );
    });

    test('the client typing requires all identifier fields in by-PK operations', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: null }, // 1
        { data: null }, // 2
        { data: null }, // 3
        { data: null }, // 4
        { data: null }, // 5
      ]);

      const client = generateClient<Schema>();

      // Allowed
      await client.models.Model.get({
        category: 'cats',
        name: 'Garfield',
      }); // 1
      await client.models.Model.delete({
        category: 'dogs',
        name: 'Odie',
      }); // 2

      // Missing field is disallowed (but notably no *runtime* exception for this currently)

      // @ts-expect-error
      await client.models.Model.get({}); // 3
      // @ts-expect-error
      await client.models.Model.delete({}); // 4

      // RED HERRING. We don't currently throw at runtime.
      // Disallowed by types and fails runtime validation
      // // @ts-expect-error
      // await expect(client.models.Model.get()).rejects.toThrow(); // 5
    });

    test('the client includes all identifier fields in selection sets', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list();

      expectSelectionSetContains(spy, ['category', 'name']);
    });

    test('the client can filter on `customId`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.list({
        filter: {
          category: { eq: 'dogs' },
          name: { eq: 'Odie' },
        },
      });
      expectVariables(spy, {
        filter: {
          category: { eq: 'dogs' },
          name: { eq: 'Odie' },
        },
      });
    });
  });
});

describe('Secondary Indexes', () => {
  describe('Secondary index with single field SK', () => {
    const schema = a
      .schema({
        Model: a
          .model({
            gsiPk: a.string().required(),
            gsiSk: a.string().required(),
          })
          .secondaryIndexes((index) => [index('gsiPk').sortKeys(['gsiSk'])]),
      })
      .authorization((allow) => allow.publicApiKey());

    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has the expected index query input params', () => {
      type ResolvedGsi = Prettify<Schema['Model']['secondaryIndexes']>;

      type ExpectedIndexQueryInput = {
        listModelByGsiPkAndGsiSk: {
          input: {
            gsiPk: string;
            gsiSk?: StringFilter;
          };
        };
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedGsi, ExpectedIndexQueryInput>
      >;
    });

    test('the generated modelIntrospection schema contains the expected index fields and key metadata', async () => {
      expect.assertions(3);

      const { modelIntrospection } = await buildAmplifyConfig(schema);

      const indexKeyAttribute = modelIntrospection.models[
        'Model'
      ].attributes.find(
        (attr: Record<string, any>) =>
          attr.type === 'key' &&
          attr.properties.queryField === 'listModelByGsiPkAndGsiSk',
      );

      expect(indexKeyAttribute).toEqual(
        expect.objectContaining({
          type: 'key',
          properties: {
            name: 'modelsByGsiPkAndGsiSk',
            queryField: 'listModelByGsiPkAndGsiSk',
            fields: ['gsiPk', 'gsiSk'],
          },
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['gsiPk']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'gsiPk',
          type: 'String',
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['gsiSk']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'gsiSk',
          type: 'String',
        }),
      );
    });

    test('the runtime graphql document has expected types for GSI PK and SK fields', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.listModelByGsiPkAndGsiSk({
        gsiPk: 'abc',
        gsiSk: { beginsWith: '...' },
      });

      const [[{ query, variables }]] = optionsAndHeaders(spy);

      expect(query).toEqual(
        expect.stringContaining(
          '$gsiPk: String!,$gsiSk: ModelStringKeyConditionInput',
        ),
      );
      expect(query).toEqual(
        expect.stringContaining('$sortDirection: ModelSortDirection,'),
      );

      expect(variables).toStrictEqual({
        gsiPk: 'abc',
        gsiSk: { beginsWith: '...' },
      });
    });
  });
  describe('Secondary index with composite SK', () => {
    const schema = a
      .schema({
        Model: a
          .model({
            gsiPk: a.string().required(),
            gsiSk1: a.string().required(),
            gsiSk2: a.integer().required(),
          })
          .secondaryIndexes((index) => [
            index('gsiPk').sortKeys(['gsiSk1', 'gsiSk2']),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('the client schema type has the expected index query input params', () => {
      type ResolvedGsi = Prettify<Schema['Model']['secondaryIndexes']>;

      type ExpectedIndexQueryInput = {
        listModelByGsiPkAndGsiSk1AndGsiSk2: {
          input: {
            gsiPk: string;
            gsiSk1GsiSk2?: ModelPrimaryCompositeKeyInput<{
              gsiSk1: string;
              gsiSk2: number;
            }>;
          };
        };
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedGsi, ExpectedIndexQueryInput>
      >;
    });

    test('the generated modelIntrospection schema contains the expected index fields and key metadata', async () => {
      expect.assertions(4);

      const { modelIntrospection } = await buildAmplifyConfig(schema);

      const indexKeyAttribute = modelIntrospection.models[
        'Model'
      ].attributes.find(
        (attr: Record<string, any>) =>
          attr.type === 'key' &&
          attr.properties.queryField === 'listModelByGsiPkAndGsiSk1AndGsiSk2',
      );

      expect(indexKeyAttribute).toEqual(
        expect.objectContaining({
          type: 'key',
          properties: {
            name: 'modelsByGsiPkAndGsiSk1AndGsiSk2',
            queryField: 'listModelByGsiPkAndGsiSk1AndGsiSk2',
            fields: ['gsiPk', 'gsiSk1', 'gsiSk2'],
          },
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['gsiPk']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'gsiPk',
          type: 'String',
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['gsiSk1']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'gsiSk1',
          type: 'String',
        }),
      );

      expect(modelIntrospection.models['Model']['fields']['gsiSk2']).toEqual(
        expect.objectContaining({
          isArray: false,
          isRequired: true,
          name: 'gsiSk2',
          type: 'Int',
        }),
      );
    });

    test('the runtime graphql document has expected types for GSI PK and SK fields', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { spy, generateClient } = mockedGenerateClient([
        { data: { listModels: { items: [] } } },
      ]);
      const client = generateClient<Schema>();
      await client.models.Model.listModelByGsiPkAndGsiSk1AndGsiSk2(
        {
          gsiPk: 'abc',
          gsiSk1GsiSk2: { beginsWith: { gsiSk1: '...', gsiSk2: 0 } },
        },
        { sortDirection: 'ASC' },
      );

      const [[{ query, variables }]] = optionsAndHeaders(spy);

      expect(query).toEqual(
        expect.stringContaining(
          '$gsiPk: String!,$gsiSk1GsiSk2: ModelModelModelsByGsiPkAndGsiSk1AndGsiSk2CompositeKeyConditionInput',
        ),
      );
      expect(query).toEqual(
        expect.stringContaining('$sortDirection: ModelSortDirection,'),
      );

      expect(variables).toStrictEqual({
        gsiPk: 'abc',
        gsiSk1GsiSk2: { beginsWith: { gsiSk1: '...', gsiSk2: 0 } },
        sortDirection: 'ASC',
      });
    });
  });
});
