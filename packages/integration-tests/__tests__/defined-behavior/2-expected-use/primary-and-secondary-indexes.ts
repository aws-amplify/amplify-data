import { a, ClientSchema } from '@aws-amplify/data-schema';
import type {
  Expect,
  Equal,
  ExtractModelMeta,
  Prettify,
} from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import type {
  ListPkOptions,
  ModelPrimaryCompositeKeyInput,
  StringFilter,
  IndexQueryInput,
} from '../../../../data-schema/src/runtime/client/index';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  expectSchemaModelExcludes,
} from '../../utils';
import { ModelSortDirection } from '@aws-amplify/data-schema/runtime';

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

    test('the client schema type has the expected identifier IR shape', () => {
      type ResolvedIdentifierMeta = Prettify<
        ExtractModelMeta<Schema>['Model']['identifier']
      >;
      type ExpectedIdentifier = {
        pk: {
          pk: string;
        };
        sk: {
          sk1: string;
        };
        compositeSk: never;
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedIdentifierMeta, ExpectedIdentifier>
      >;
    });

    test('the client schema type has the expected list PK params', () => {
      type ModelMeta = ExtractModelMeta<Schema>['Model'];

      type ListPk = ListPkOptions<ModelMeta, Record<string, string>>;

      type ExpectedPkParams = {
        pk?: string;
        sk1?: StringFilter;
        sortDirection?: ModelSortDirection | undefined;
      };

      type _AssertIdentifierType = Expect<Equal<ListPk, ExpectedPkParams>>;
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
      type ResolvedIdentifierMeta = Prettify<
        ExtractModelMeta<Schema>['Model']['identifier']
      >;
      type ExpectedIdentifier = {
        pk: {
          pk: string;
        };
        sk: {
          sk1: string;
          sk2: number;
        };
        compositeSk: 'sk1Sk2';
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedIdentifierMeta, ExpectedIdentifier>
      >;
    });

    test('the client schema type has the expected list PK params', () => {
      type ModelMeta = ExtractModelMeta<Schema>['Model'];

      type ListPk = ListPkOptions<ModelMeta, Record<string, string>>;

      type ExpectedPkParams = {
        pk?: string;
        sk1Sk2?: ModelPrimaryCompositeKeyInput<{ sk1: string; sk2: number }>;
        sortDirection?: ModelSortDirection | undefined;
      };

      type _AssertIdentifierType = Expect<Equal<ListPk, ExpectedPkParams>>;
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

    test('the client schema type has the expected secondary index IR shape', () => {
      type ResolvedGsiMeta = Prettify<
        ExtractModelMeta<Schema>['Model']['secondaryIndexes']
      >;
      type ExpectedGsiMeta = [
        {
          defaultQueryFieldSuffix: 'GsiPkAndGsiSk';
          queryField: never;
          pk: {
            gsiPk: string;
          };
          sk: {
            gsiSk: string;
          };
          compositeSk: never;
        },
      ];

      type _AssertIdentifierType = Expect<
        Equal<ResolvedGsiMeta, ExpectedGsiMeta>
      >;
    });

    test('the client schema type has the expected index query input params', () => {
      type ModelName = 'Model';
      type ModelMeta = ExtractModelMeta<Schema>[ModelName];

      type ResolvedIndexQueryInput = Prettify<
        IndexQueryInput<
          ModelMeta['secondaryIndexes'][0],
          Record<string, string>
        >
      >;

      type ExpectedIndexQueryInput = {
        gsiPk: string;
        gsiSk?: StringFilter;
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedIndexQueryInput, ExpectedIndexQueryInput>
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

    test('the client schema type has the expected secondary index IR shape', () => {
      type ResolvedGsiMeta = Prettify<
        ExtractModelMeta<Schema>['Model']['secondaryIndexes']
      >;
      type ExpectedGsiMeta = [
        {
          defaultQueryFieldSuffix: 'GsiPkAndGsiSk1AndGsiSk2';
          queryField: never;
          pk: {
            gsiPk: string;
          };
          sk: {
            gsiSk1: string;
            gsiSk2: number;
          };
          compositeSk: 'gsiSk1GsiSk2';
        },
      ];

      type _AssertIdentifierType = Expect<
        Equal<ResolvedGsiMeta, ExpectedGsiMeta>
      >;
    });

    test('the client schema type has the expected index query input params', () => {
      type ModelName = 'Model';
      type ModelMeta = ExtractModelMeta<Schema>[ModelName];

      type ResolvedIndexQueryInput = Prettify<
        IndexQueryInput<
          ModelMeta['secondaryIndexes'][0],
          Record<string, string>
        >
      >;

      type ExpectedIndexQueryInput = {
        gsiPk: string;
        gsiSk1GsiSk2?: ModelPrimaryCompositeKeyInput<{
          gsiSk1: string;
          gsiSk2: number;
        }>;
      };

      type _AssertIdentifierType = Expect<
        Equal<ResolvedIndexQueryInput, ExpectedIndexQueryInput>
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
      await client.models.Model.listModelByGsiPkAndGsiSk1AndGsiSk2({
        gsiPk: 'abc',
        gsiSk1GsiSk2: { beginsWith: { gsiSk1: '...', gsiSk2: 0 } },
      });

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
      });
    });
  });
});
