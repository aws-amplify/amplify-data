import {
  SchemaModel,
  ModelIntrospectionSchema,
} from '../../src/runtime/bridge-types';
import {
  normalizeMutationInput,
  flattenItems,
  generateSelectionSet,
  customSelectionSetToIR,
  generateGraphQLDocument,
  ModelOperation,
  buildGraphQLVariables,
} from '../../src/runtime/internals/APIClient';

import config from './fixtures/modeled/amplifyconfiguration';
import customerCartConfig from './fixtures/modeled/cart-customer-schema';
import {
  personSchemaModel,
  productSchemaModel,
  userSchemaModel,
} from './fixtures/schema-models/with-custom-primary-key/models';
const modelIntroSchema = config.modelIntrospection as ModelIntrospectionSchema;

describe('APIClient', () => {
  describe('normalizeMutationInput', () => {
    // TODO: test all relationship combinations
    test('basic 1:M mutation', () => {
      const todo = {
        id: 'todo1',
        name: 'My Todo',
      };

      const note = {
        body: 'Note about Todo',
        // passing model
        todo: todo,
      };

      const expectedInput = {
        body: note.body,
        // expecting id
        todoNotesId: todo.id,
      };

      const noteModelDef = modelIntroSchema.models.Note as SchemaModel;

      const normalized = normalizeMutationInput(
        note,
        noteModelDef,
        modelIntroSchema,
      );

      expect(normalized).toEqual(expectedInput);
    });
  });
});

describe('flattenItems', () => {
  test('no-op on get without relationships', () => {
    // Just the specific props relevant to flattening.
    const modelIntro = {
      models: {
        Post: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
          },
        },
      },
    } as any;

    const resultItem = { getPost: { id: 'myPost' } };

    const expected = { getPost: { id: 'myPost' } };

    const flattened = flattenItems(modelIntro, 'Post', resultItem);

    expect(flattened).toEqual(expected);
  });

  test('flatten list with relationships', () => {
    // Just the specific props relevant to flattening.
    const modelIntro = {
      models: {
        Post: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
            comments: {
              isArray: true,
              type: {
                model: 'Comment',
              },
            },
          },
        },
        Comment: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
            content: {
              isArray: false,
              type: 'String',
            },
            meta: {
              isArray: true,
              type: {
                model: 'Meta',
              },
            },
            post: {
              isArray: false,
              type: {
                model: 'Post',
              },
            },
          },
        },
        Meta: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
          },
        },
      },
    } as any;

    const resultItem = {
      id: 'post1',
      comments: {
        items: [
          {
            id: 'comment1',
            content: 'my comment 1',
            meta: {
              items: [{ id: 'meta1' }],
            },
            post: {
              id: 'post1',
              comments: {
                items: [
                  {
                    id: 'comment1',
                    content: 'my comment 1',
                    meta: {
                      items: [{ id: 'meta1' }],
                    },
                  },
                ],
              },
            },
          },
          {
            id: 'comment1',
            content: 'my comment 1',
            meta: {
              items: [{ id: 'meta1' }],
            },
          },
        ],
      },
    };

    const expected = {
      id: 'post1',
      comments: [
        {
          id: 'comment1',
          content: 'my comment 1',
          meta: [
            {
              id: 'meta1',
            },
          ],
          post: {
            id: 'post1',
            comments: [
              {
                id: 'comment1',
                content: 'my comment 1',
                meta: [
                  {
                    id: 'meta1',
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'comment1',
          content: 'my comment 1',
          meta: [
            {
              id: 'meta1',
            },
          ],
        },
      ],
    };

    const flattened = flattenItems(modelIntro, 'Post', resultItem);

    expect(flattened).toEqual(expected);
  });

  test('edge case', () => {
    // Just the specific props relevant to flattening.
    const modelIntro = {
      models: {
        Post: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
            comments: {
              isArray: true,
              type: {
                model: 'Comment',
              },
            },
          },
        },
        Comment: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
            items: {
              isArray: true,
              type: {
                nonModel: 'CommentItem',
              },
            },
          },
        },
      },
    } as any;

    const resultItem = {
      comments: {
        items: [
          {
            items: [
              {
                value: 'taco',
              },
              {
                value: 'cat',
              },
            ],
          },
        ],
      },
    };

    const res = flattenItems(modelIntro, 'Post', resultItem);

    const expectedRes = {
      comments: [
        {
          items: [
            {
              value: 'taco',
            },
            {
              value: 'cat',
            },
          ],
        },
      ],
    };

    expect(res).toStrictEqual(expectedRes);
  });

  test('edge case 2', () => {
    // Just the specific props relevant to flattening.
    const modelIntro = {
      models: {
        Post: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
            title: {
              isArray: false,
              type: 'String',
            },
            comments: {
              isArray: true,
              type: {
                model: 'Comment',
              },
            },
          },
        },
        Comment: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
            content: {
              isArray: false,
              type: 'String',
            },
            items: {
              isArray: true,
              type: {
                nonModel: 'Likes',
              },
            },
            post: {
              isArray: false,
              type: {
                model: 'Post',
              },
            },
          },
        },
        Likes: {
          fields: {
            id: {
              isArray: false,
              type: 'ID',
            },
            value: {
              isArray: false,
              type: 'String',
            },
          },
        },
      },
    } as any;

    const resultItem = {
      id: 'bd4eae4c-20ea-465b-bc7b-e7becfff1388',
      title: 'Hello 1715959828256',
      comments: {
        items: [
          {
            id: '4f3f03bc-055d-4bb5-ab71-bf319bae6ee4',
            content: 'Comment 1715959909804',
            items: [
              {
                value: 'taco',
              },
              {
                value: 'cat',
              },
            ],
            postId: 'bd4eae4c-20ea-465b-bc7b-e7becfff1388',
            createdAt: '2024-05-17T15:31:49.835Z',
            updatedAt: '2024-05-17T15:31:49.835Z',
          },
        ],
      },
    };

    const res = flattenItems(modelIntro, 'Post', resultItem);

    const expectedRes = {
      id: 'bd4eae4c-20ea-465b-bc7b-e7becfff1388',
      title: 'Hello 1715959828256',
      comments: [
        {
          id: '4f3f03bc-055d-4bb5-ab71-bf319bae6ee4',
          content: 'Comment 1715959909804',
          items: [
            {
              value: 'taco',
            },
            {
              value: 'cat',
            },
          ],
          postId: 'bd4eae4c-20ea-465b-bc7b-e7becfff1388',
          createdAt: '2024-05-17T15:31:49.835Z',
          updatedAt: '2024-05-17T15:31:49.835Z',
        },
      ],
    };

    expect(res).toStrictEqual(expectedRes);
  });

  test('does not flatten items property when it is string[]', () => {
    // the `data` property of a full graphql result
    const resultItem = {
      __typeName: 'Cart',
      id: 'some-cart-id',
      customerId: 'customer-id-rene',
      items: ['Tomato', 'Ice', 'Mint'],
      updatedAt: '2024-03-01T19:05:44.536Z',
      createdAt: '2024-03-01T18:05:44.536Z',
    };

    const flattenedResult = flattenItems(
      customerCartConfig.data.model_introspection as any,
      'Cart',
      resultItem,
    );

    expect(flattenedResult).toEqual({
      __typeName: 'Cart',
      id: 'some-cart-id',
      customerId: 'customer-id-rene',
      items: ['Tomato', 'Ice', 'Mint'],
      updatedAt: '2024-03-01T19:05:44.536Z',
      createdAt: '2024-03-01T18:05:44.536Z',
    });
  });

  describe('customSelectionSetToIR', () => {
    test('specific fields on the model', () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'Todo', [
        'id',
        'name',
      ]);

      const expected = {
        id: '',
        name: '',
      };

      expect(selSet).toEqual(expected);
    });

    test('specific fields on the model and related model', () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'Todo', [
        'id',
        'name',
        'notes.id',
        'notes.body',
      ]);

      const expected = {
        id: '',
        name: '',
        notes: {
          items: {
            id: '',
            body: '',
          },
        },
      };

      expect(selSet).toEqual(expected);
    });

    test('related property without any specified field in selectionSet should throw an error', () => {
      expect(() =>
        customSelectionSetToIR(modelIntroSchema, 'Todo', [
          'id',
          'name',
          'notes',
        ]),
      ).toThrow('notes must declare a wildcard (*) or a field of model Note');
    });

    test('inexistent field should throw an error', () => {
      expect(() =>
        customSelectionSetToIR(modelIntroSchema, 'Todo', [
          'id',
          'name',
          'inexistentField',
          'notes.*',
        ]),
      ).toThrow('inexistentField is not a field of model Todo');
    });

    test('related inexistent field should throw an error', () => {
      expect(() =>
        customSelectionSetToIR(modelIntroSchema, 'Todo', [
          'id',
          'name',
          'notes.inexistentField',
        ]),
      ).toThrow('inexistentField is not a field of model Note');
    });

    test('specific fields on the model; all fields on related model', () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'Todo', [
        'id',
        'name',
        'notes.*',
      ]);

      const expected = {
        id: '',
        name: '',
        notes: {
          items: {
            id: '',
            body: '',
            owner: '',
            createdAt: '',
            updatedAt: '',
            todoNotesId: '',
          },
        },
      };

      expect(selSet).toEqual(expected);
    });

    test('deeply nested on a bi-directional model', () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'Todo', [
        'id',
        'name',
        'notes.todo.notes.todo.notes.todo.notes.*',
      ]);

      const expected = {
        id: '',
        name: '',
        notes: {
          items: {
            todo: {
              notes: {
                items: {
                  todo: {
                    notes: {
                      items: {
                        todo: {
                          notes: {
                            items: {
                              id: '',
                              body: '',
                              createdAt: '',
                              updatedAt: '',
                              todoNotesId: '',
                              owner: '',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      expect(selSet).toEqual(expected);
    });

    test("subsequent wildcard doesn't overwrite existing nested object", () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'Todo', [
        'id',
        'name',
        'notes.todo.name',
        'notes.*',
      ]);

      const expected = {
        id: '',
        name: '',
        notes: {
          items: {
            id: '',
            body: '',
            createdAt: '',
            updatedAt: '',
            todoNotesId: '',
            owner: '',
            todo: {
              name: '',
            },
          },
        },
      };

      expect(selSet).toEqual(expected);
    });

    test('custom type works properly', () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'CommunityPost', [
        'metadata.type',
        'poll.question',
      ]);

      const expected = {
        metadata: {
          type: '',
        },
        poll: {
          question: '',
        },
      };

      expect(selSet).toEqual(expected);
    });

    test('custom type with wildcard works properly', () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'CommunityPost', [
        'metadata.*',
        'poll.question',
      ]);

      const expected = {
        metadata: {
          type: '',
          deleted: '',
        },
        poll: {
          question: '',
        },
      };

      expect(selSet).toEqual(expected);
    });

    test('custom type with invalid property throws an error', () => {
      expect(() =>
        customSelectionSetToIR(modelIntroSchema, 'CommunityPost', [
          'metadata.inexistentField',
          'poll.question',
        ]),
      ).toThrow(
        'inexistentField is not a field of custom type CommunityPostMetadata',
      );
    });

    test('custom type without any properties throws an error', () => {
      expect(() =>
        customSelectionSetToIR(modelIntroSchema, 'CommunityPost', [
          'metadata',
          'poll.question',
        ]),
      ).toThrow(
        'metadata must declare a wildcard (*) or a field of custom type CommunityPostMetadata',
      );
    });

    test('mix of related and non-related fields in a nested model creates a nested object with all necessary fields', () => {
      const selSet = customSelectionSetToIR(modelIntroSchema, 'CommunityPost', [
        'poll.question',
        'poll.answers.answer',
        'poll.answers.votes.id',
      ]);

      const expected = {
        poll: {
          question: '',
          answers: {
            items: {
              answer: '',
              votes: {
                items: {
                  id: '',
                },
              },
            },
          },
        },
      };

      expect(selSet).toEqual(expected);
    });

    it('generates expected default selection set for nested model and custom type', () => {
      const set = customSelectionSetToIR(modelIntroSchema, 'Warehouse', [
        'id',
        'name',
        'products.*',
      ]);

      const expected = {
        id: '',
        name: '',
        products: {
          items: {
            createdAt: '',
            updatedAt: '',
            warehouseProductsId: '',
            description: '',
            factoryId: '',
            owner: '',
            sku: '',
            trackingMeta: {
              note: '',
              productMeta: {
                deepMeta: {
                  content: '',
                },
                releaseDate: '',
                status: '',
              },
            },
          },
        },
      };

      expect(set).toEqual(expected);
    });
  });

  describe('generateSelectionSet', () => {
    test('it should generate default selection set', () => {
      const selSet = generateSelectionSet(modelIntroSchema, 'Todo');

      const expected =
        'id name description status tags createdAt updatedAt todoMetaId owner';

      expect(selSet).toEqual(expected);
    });

    it('generates default selection set for nested custom types', () => {
      const generated = generateSelectionSet(modelIntroSchema, 'Product');

      const expected =
        'sku factoryId description trackingMeta { productMeta { releaseDate status deepMeta { content } } note } warehouseProductsId createdAt updatedAt owner';

      expect(generated).toEqual(expected);
    });

    test('it should generate custom selection set - top-level fields', () => {
      const selSet = generateSelectionSet(modelIntroSchema, 'Todo', [
        'id',
        'name',
      ]);

      const expected = 'id name';

      expect(selSet).toEqual(expected);
    });

    test('it should generate custom selection set - specific nested fields', () => {
      const selSet = generateSelectionSet(modelIntroSchema, 'Todo', [
        'id',
        'name',
        'notes.id',
        'notes.createdAt',
      ]);

      const expected = 'id name notes { items { id createdAt } }';

      expect(selSet).toEqual(expected);
    });

    test('it should generate custom selection set - all nested fields', () => {
      const selSet = generateSelectionSet(modelIntroSchema, 'Todo', [
        'id',
        'name',
        'notes.*',
      ]);

      const expected =
        'id name notes { items { id body createdAt updatedAt todoNotesId owner } }';

      expect(selSet).toEqual(expected);
    });

    test('deeply nested on a bi-directional model', () => {
      const selSet = generateSelectionSet(modelIntroSchema, 'Todo', [
        'id',
        'name',
        'notes.todo.notes.todo.notes.todo.notes.*',
      ]);

      const expected =
        'id name notes { items { todo { notes { items { todo { notes { items { todo { notes { items { id body createdAt updatedAt todoNotesId owner } } } } } } } } } } }';

      expect(selSet).toEqual(expected);
    });

    it('generates custom selection set for nested custom types', () => {
      const generated = generateSelectionSet(modelIntroSchema, 'Product', [
        'sku',
        'trackingMeta.note',
        'trackingMeta.productMeta.status',
        'trackingMeta.productMeta.deepMeta.content',
      ]);

      const expected =
        'sku trackingMeta { note productMeta { status deepMeta { content } } }';

      expect(generated).toEqual(expected);
    });
  });
});

describe('generateGraphQLDocument()', () => {
  describe('for operation', () => {
    const mockModelDefinitions = {
      version: 1 as const,
      enums: {},
      nonModels: {},
      models: {
        User: userSchemaModel,
        Product: productSchemaModel,
        person: personSchemaModel,
      },
    };

    test.each([
      ['GET', userSchemaModel, '$userId: ID!'],
      [
        'GET',
        productSchemaModel,
        '$sku: String!,$factoryId: String!,$warehouseId: String!',
      ],
      ['GET', personSchemaModel, 'getPerson'],
      ['LIST', personSchemaModel, 'listPeople'],
      ['LIST', personSchemaModel, '$filter: ModelPersonFilterInput'],
      ['CREATE', personSchemaModel, '$input: CreatePersonInput!'],
      ['UPDATE', personSchemaModel, '$input: UpdatePersonInput!'],
      ['DELETE', personSchemaModel, '$input: DeletePersonInput!'],
      [
        'ONCREATE',
        personSchemaModel,
        '$filter: ModelSubscriptionPersonFilterInput',
      ],
      [
        'ONUPDATE',
        personSchemaModel,
        '$filter: ModelSubscriptionPersonFilterInput',
      ],
      [
        'ONDELETE',
        personSchemaModel,
        '$filter: ModelSubscriptionPersonFilterInput',
      ],
    ])(
      '%s generates operation name or arguments for model %s to contain %s',
      (modelOperation, model, expectedArgs) => {
        const document = generateGraphQLDocument(
          mockModelDefinitions,
          model,
          modelOperation as ModelOperation,
        );

        expect(document).toEqual(expect.stringContaining(expectedArgs));
      },
    );
  });

  describe('for indexed queries', () => {
    const modelOperation = 'INDEX_QUERY';
    const getIndexMeta = (
      modelName: string,
      indexName?: string,
    ): {
      queryField: string;
      pk: string;
      sk: string[];
    } => {
      const indexProperties = modelIntroSchema.models[
        modelName
      ].attributes?.find((attribute) => {
        if (indexName) {
          return (
            attribute.type === 'key' && attribute.properties?.name === indexName
          );
        }

        return attribute.type === 'key';
      })?.properties;

      if (!indexProperties) {
        fail('Test fixture contains incorrect schema for this test.');
      }

      return {
        queryField: indexProperties.queryField,
        pk: indexProperties.fields[0],
        sk: indexProperties.fields.slice(1),
      };
    };

    test.each([
      [
        modelIntroSchema.models.EnumAsIndexPartitionKey,
        '$status: EnumAsIndexPartitionKeyStatus!',
        getIndexMeta('EnumAsIndexPartitionKey'),
        { status: 'yes' },
      ],
      [
        modelIntroSchema.models.EnumAsIndexSortKey,
        '$status: ModelStringKeyConditionInput',
        getIndexMeta('EnumAsIndexSortKey'),
        { title: 'test' },
      ],
      [
        modelIntroSchema.models.RefEnumAsIndexPartitionKey,
        '$status: EnumIndexStatus!',
        getIndexMeta('RefEnumAsIndexPartitionKey'),
        { status: 'yes' },
      ],
      [
        modelIntroSchema.models.RefEnumAsIndexSortKey,
        '$status: ModelStringKeyConditionInput',
        getIndexMeta('RefEnumAsIndexSortKey'),
        { title: 'test' },
      ],
      [
        modelIntroSchema.models.SecondaryIndexModel,
        '$timestamp: ModelIntKeyConditionInput',
        getIndexMeta(
          'SecondaryIndexModel',
          'secondaryIndexModelsByDescriptionAndTimestamp',
        ),
        { description: 'test' },
      ],
    ])(
      'generates document for model %p containing input type: %p',
      (model, expectedSortKeyInputString, indexMeta, args) => {
        const document = generateGraphQLDocument(
          modelIntroSchema,
          model,
          modelOperation,
          args,
          indexMeta,
        );

        expect(document).toEqual(
          expect.stringContaining(expectedSortKeyInputString),
        );
      },
    );
  });

  describe('buildGraphQLVariables', () => {
    const defaultInput = {
      id: '1',
      name: 'Example Name',
      status: 'NOT_STARTED',
    };

    test('produces correct artifact for create mutations', () => {
      const createResult = buildGraphQLVariables(
        modelIntroSchema.models.Todo,
        'CREATE',
        defaultInput,
        modelIntroSchema,
      );

      expect(createResult).toEqual({
        input: defaultInput,
      });
    });

    test('produces correct artifact for update mutations', () => {
      const updateResult = buildGraphQLVariables(
        modelIntroSchema.models.Todo,
        'UPDATE',
        {
          ...defaultInput,
          owner: 'james',
          nonReadOnlyNonOwnerField: 'iWillTriggerGraphQLError',
          updatedAt: '2025-04-09T22:50:59.872Z',
          createdAt: '2025-04-09T22:50:59.872Z',
        },
        modelIntroSchema,
      );

      expect(updateResult).toEqual({
        input: {
          ...defaultInput,
          nonReadOnlyNonOwnerField: 'iWillTriggerGraphQLError',
        },
      });
    });

    test('does not throw type error when implicit owner field is added to update input', () => {
      expect(() => {
        // use void return type here
        buildGraphQLVariables(
          modelIntroSchema.models.Todo,
          'UPDATE',
          {
            owner: 'james',
          },
          modelIntroSchema,
        );
      }).not.toThrow();
    });

    test('produces correct artifact for delete mutations', () => {
      const deleteResult = buildGraphQLVariables(
        modelIntroSchema.models.Todo,
        'DELETE',
        defaultInput,
        modelIntroSchema,
      );

      expect(deleteResult).toEqual({
        input: { id: defaultInput.id },
      });
    });

    test('produces correct artifact for get queries', () => {
      const getResult = buildGraphQLVariables(
        modelIntroSchema.models.Todo,
        'GET',
        defaultInput,
        modelIntroSchema,
      );

      expect(getResult).toEqual({
        id: defaultInput.id,
      });
    });

    test('produces correct artifact for list queries with no pk or sk specified', () => {
      const listResult = buildGraphQLVariables(
        modelIntroSchema.models.Todo,
        'LIST',
        {
          filter: { name: { eq: 'Example Name' } },
          sortDirection: 'ASC',
          limit: 50,
          nextToken: 'my-special-next-token',
        },
        modelIntroSchema,
      );

      expect(listResult).toEqual({
        filter: { name: { eq: 'Example Name' } },
        sortDirection: 'ASC',
        limit: 50,
        nextToken: 'my-special-next-token',
      });
    });

    test('produces correct artifact for list queries with pk specified', () => {
      const listResult = buildGraphQLVariables(
        modelIntroSchema.models.Todo,
        'LIST',
        {
          id: 'sample-id',
          answer: 42,
        },
        modelIntroSchema,
      );

      expect(listResult).toEqual({
        id: 'sample-id',
      });
    });

    test('produces correct artifact for index queries', () => {
      const indexQueryResult = buildGraphQLVariables(
        modelIntroSchema.models.Product,
        'INDEX_QUERY',
        {
          sku: '1337',
          factoryId: '6844',
          filter: { description: { contains: 'LTU' } },
          sortDirection: 'DESC',
          nextToken: 'my-special-next-token',
          limit: 42,
          randomField: 'ignoreMe',
        },
        modelIntroSchema,
        {
          queryField: 'listProductsByFactory',
          pk: modelIntroSchema.models.Product.primaryKeyInfo
            .primaryKeyFieldName,
          sk: modelIntroSchema.models.Product.primaryKeyInfo.sortKeyFieldNames,
        },
      );

      expect(indexQueryResult).toEqual({
        sku: '1337',
        factoryId: '6844',
        filter: { description: { contains: 'LTU' } },
        sortDirection: 'DESC',
        nextToken: 'my-special-next-token',
        limit: 42,
      });
    });

    test('produces correct artifact for oncreate subscriptions', () => {
      const subscriptionResult = buildGraphQLVariables(
        modelIntroSchema.models.Todo,
        'ONCREATE',
        {
          filter: { name: { eq: 'Example Name' }, randomField: { eq: 42 } },
        },
        modelIntroSchema,
      );

      expect(subscriptionResult).toEqual({
        filter: { name: { eq: 'Example Name' }, randomField: { eq: 42 } },
      });
    });

    test('throws error when called with observe query', () => {
      expect(() => {
        buildGraphQLVariables(
          modelIntroSchema.models.Todo,
          'OBSERVEQUERY',
          {},
          modelIntroSchema,
        );
      }).toThrow();
    });

    test('throws error when called with unhandled operation', () => {
      expect(() => {
        buildGraphQLVariables(
          modelIntroSchema.models.Todo,
          // @ts-ignore - test unhandled input type
          'UNHANDLED_OPERATION_TYPE',
          {},
          modelIntroSchema,
        );
      }).toThrow();
    });
  });
});
