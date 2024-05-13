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
} from '../../../../data-schema/src/runtime/client/index';
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
import { ModelSortDirection } from '@aws-amplify/data-schema/runtime';

/**
 * Custom Identifier and Secondary Index permutations
 *
 * Implicit/default identifier ('id') is already tested in ./implicit-system-fields.ts
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

      console.log('options & headers', query, variables);
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

      console.log('options & headers', query, variables);
    });
  });
});

describe('Secondary Indexes', () => {});
