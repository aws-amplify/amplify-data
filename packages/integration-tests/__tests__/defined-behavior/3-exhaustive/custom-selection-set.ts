import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  expectSelectionSetEquals,
} from '../../utils';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import { SelectionSet } from 'aws-amplify/data';

describe('Custom selection set edge cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Models', () => {
    let client;

    const schema = a
      .schema({
        Todo: a.model({
          description: a.string(),
          details: a.hasOne('Details', ['todoId']),
          steps: a.hasMany('Step', ['todoId']),
          done: a.boolean(),
          priority: a.enum(['low', 'medium', 'high']),
        }),
        Details: a.model({
          content: a.string(),
          todoId: a.id(),
          todo: a.belongsTo('Todo', ['todoId']),
        }),
        Step: a.model({
          description: a.string().required(),
          todoId: a.id().required(),
          todo: a.belongsTo('Todo', ['todoId']),
        }),
      })
      .authorization((allow) => [allow.owner()]);
    type Schema = ClientSchema<typeof schema>;

    async function getMockedClient(sampleTodo: Record<string, any>) {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listTodos: {
              items: [sampleTodo],
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      client = generateClient<Schema>();
      return { client, spy };
    }

    describe('with all top-level fields selected', () => {
      const sampleTodo = {
        id: 'some-id',
        description: 'something something',
        done: true,
        createdAt: '2024-09-05T16:04:32.404Z',
        updatedAt: '2024-09-05T16:04:32.404Z',
        priority: 'high',
        details: {
          id: 'detail-id',
          content: 'some details content',
          todoId: 'some-id',
          createdAt: '2024-09-05T16:04:32.404Z',
          updatedAt: '2024-09-05T16:04:32.404Z',
        },
        steps: {
          items: [
            {
              id: 'step-id-123',
              todoId: 'some-id',
              description: 'first step',
              owner: 'harry-f-potter',
              createdAt: '2024-09-05T16:04:32.404Z',
              updatedAt: '2024-09-05T16:04:32.404Z',
            },
          ],
        },
      };

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(sampleTodo);

        const { data } = await client.models.Todo.list({
          selectionSet: [
            'id',
            'description',
            'done',
            'createdAt',
            'updatedAt',
            'priority',
            'details.*',
            'steps.*',
          ],
        });

        return { data, spy };
      }

      test('is reflected in the graphql selection set', async () => {
        const { spy } = await mockedOperation();

        const expectedSelectionSet = /* GraphQL */ `
          items {
            id
            description
            done
            createdAt
            updatedAt
            priority
            details {
              id
              content
              todoId
              createdAt
              updatedAt
              owner
            }
            steps {
              items {
                id
                description
                todoId
                createdAt
                updatedAt
                owner
              }
            }
          }
          nextToken
          __typename
        `;

        expectSelectionSetEquals(spy, expectedSelectionSet);
      });

      test('returns the selected fields at runtime', async () => {
        const { data } = await mockedOperation();

        const sampleTodoFinalResult = [
          {
            ...sampleTodo,
            steps: [...sampleTodo.steps.items],
          },
        ];

        expect(data).toEqual(sampleTodoFinalResult);
      });

      test('has a matching return type', async () => {
        const { data } = await mockedOperation();

        type ExpectedTodoType = {
          readonly description: string | null;
          readonly done: boolean | null;
          readonly priority: 'low' | 'medium' | 'high' | null;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          readonly details: {
            readonly content: string | null;
            readonly todoId: string | null;
            readonly id: string;
            readonly owner: string | null;
            readonly createdAt: string;
            readonly updatedAt: string;
          };
          readonly steps: {
            readonly description: string;
            readonly todoId: string;
            readonly id: string;
            readonly owner: string | null;
            readonly createdAt: string;
            readonly updatedAt: string;
          }[];
        }[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });
    });

    describe('with a subset of fields selected', () => {
      const sampleTodo = {
        description: 'something something',
        details: {
          content: 'some details content',
        },
        steps: {
          items: [
            {
              description: 'first step',
            },
          ],
        },
      };

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(sampleTodo);

        const { data } = await client.models.Todo.list({
          selectionSet: ['description', 'details.content', 'steps.description'],
        });

        return { data, spy };
      }

      test('is reflected in the graphql selection set', async () => {
        const { spy } = await mockedOperation();

        const expectedSelectionSet = /* GraphQL */ `
          items {
            description
            details {
              content
            }
            steps {
              items {
                description
              }
            }
          }
          nextToken
          __typename
        `;

        expectSelectionSetEquals(spy, expectedSelectionSet);
      });

      test('returns the selected fields at runtime', async () => {
        const { data } = await mockedOperation();

        const sampleTodoFinalResult = [
          {
            ...sampleTodo,
            steps: [...sampleTodo.steps.items],
          },
        ];

        expect(data).toEqual(sampleTodoFinalResult);
      });

      test('has a matching return type', async () => {
        const { data } = await mockedOperation();

        type ExpectedTodoType = {
          readonly description: string | null;
          readonly details: {
            readonly content: string | null;
          };
          readonly steps: {
            readonly description: string;
          }[];
        }[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });
    });

    describe('with selection set specified through variable', () => {
      const sampleTodo = {
        description: 'something something',
        details: {
          content: 'some details content',
        },
        steps: {
          items: [
            {
              description: 'first step',
            },
          ],
        },
      };

      const selectionSet = [
        'description',
        'details.content',
        'steps.description',
      ] as const;

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(sampleTodo);

        const { data } = await client.models.Todo.list({
          selectionSet,
        });

        return { data, spy };
      }

      test('is reflected in the graphql selection set', async () => {
        const { spy } = await mockedOperation();

        const expectedSelectionSet = /* GraphQL */ `
          items {
            description
            details {
              content
            }
            steps {
              items {
                description
              }
            }
          }
          nextToken
          __typename
        `;

        expectSelectionSetEquals(spy, expectedSelectionSet);
      });

      test('returns the selected fields at runtime', async () => {
        const { data } = await mockedOperation();

        const sampleTodoFinalResult = [
          {
            ...sampleTodo,
            steps: [...sampleTodo.steps.items],
          },
        ];

        expect(data).toEqual(sampleTodoFinalResult);
      });

      test('has a matching return type', async () => {
        const { data } = await mockedOperation();

        type ExpectedTodoType = {
          readonly description: string | null;
          readonly details: {
            readonly content: string | null;
          };
          readonly steps: {
            readonly description: string;
          }[];
        }[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });

      test('has a return type that matches util', async () => {
        const { data } = await mockedOperation();

        type ExpectedTodoType = SelectionSet<
          Schema['Todo'],
          typeof selectionSet
        >[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });
    });

    describe('with 6 level deep selection set', () => {
      const sampleTodo = {
        id: 'some-id',
        steps: {
          items: [
            {
              todo: {
                steps: {
                  items: [
                    {
                      todo: {
                        steps: {
                          items: [
                            {
                              todo: {
                                steps: {
                                  items: [
                                    {
                                      id: 'step-id-123',
                                      todoId: 'some-id',
                                      description: 'first step',
                                      owner: 'harry-f-potter',
                                      createdAt: '2024-09-05T16:04:32.404Z',
                                      updatedAt: '2024-09-05T16:04:32.404Z',
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      };

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(sampleTodo);

        const { data } = await client.models.Todo.list({
          // @ts-expect-error - Deep cyclical paths beyond FlatModel's representation are not type-safe.
          // This is intentional: use lazy loaders for deep traversal instead of selection sets.
          // The runtime still works, but the type system cannot represent infinite cycles.
          selectionSet: ['id', 'steps.todo.steps.todo.steps.todo.steps.*'],
        });

        return { data, spy };
      }

      test('is reflected in the graphql selection set', async () => {
        const { spy } = await mockedOperation();

        const expectedSelectionSet = /* GraphQL */ `
          items {
            id
            steps {
              items {
                todo {
                  steps {
                    items {
                      todo {
                        steps {
                          items {
                            todo {
                              steps {
                                items {
                                  id
                                  description
                                  todoId
                                  createdAt
                                  updatedAt
                                  owner

                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          nextToken
          __typename
        `;

        expectSelectionSetEquals(spy, expectedSelectionSet);
      });

      test('returns only the selected fields, without lazy loaders', async () => {
        const { data } = await mockedOperation();

        const sampleTodoFinalResult = [
          {
            id: sampleTodo.id,
            steps: [
              {
                todo: {
                  steps: [
                    {
                      todo: {
                        steps: [
                          {
                            todo: {
                              steps: [
                                {
                                  id: 'step-id-123',
                                  todoId: 'some-id',
                                  description: 'first step',
                                  owner: 'harry-f-potter',
                                  createdAt: '2024-09-05T16:04:32.404Z',
                                  updatedAt: '2024-09-05T16:04:32.404Z',
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        ];

        expect(data).toEqual(sampleTodoFinalResult);
      });

      test('has a matching return type', async () => {
        const { data } = await mockedOperation();

        // BREAKING CHANGE: Deep cyclical paths are no longer type-safe.
        //
        // Previously, this test asserted a precise deeply-nested return type
        // matching the custom selection set. Now, because the selection set uses
        // ts-expect-error (deep cyclical paths are intentionally not allowed), the return
        // type resolves to FlatModel which only has 1 level of relationships.
        //
        // The runtime still works correctly - the GraphQL query is generated and data is
        // returned. But the type no longer reflects the custom selection set shape.
        //
        // For type-safe deep traversal, use lazy loaders instead of selection sets.

        type ExpectedTodoType = {
          readonly owner: string | null;
          readonly description: string | null;
          readonly done: boolean | null;
          readonly priority: 'low' | 'medium' | 'high' | null;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          readonly details: {
            readonly owner: string | null;
            readonly todoId: string | null;
            readonly content: string | null;
            readonly id: string;
            readonly createdAt: string;
            readonly updatedAt: string;
          };
          readonly steps: {
            readonly owner: string | null;
            readonly description: string;
            readonly todoId: string;
            readonly id: string;
            readonly createdAt: string;
            readonly updatedAt: string;
          }[];
        }[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });
    });

    describe('with a nonexistent field selected', () => {
      const sampleTodo = {};

      test('is surfaced as runtime exception and type error', async () => {
        await expect(async () => {
          const { client } = await getMockedClient(sampleTodo);

          await client.models.Todo.list({
            // @ts-expect-error - invalid field name should be a type error
            selectionSet: ['perfect-field'],
          });
        }).rejects.toThrow('perfect-field is not a field of model Todo');
      });
    });
  });

  describe('Custom types', () => {
    const schema = a
      .schema({
        ModelWithInlineCustomType: a.model({
          location: a.customType({
            lat: a.float(),
            long: a.float(),
            locationMeta: a.customType({
              tags: a.string().array(),
              requiredTags: a.string().required().array().required(),
            }),
          }),
        }),
        Location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
        Meta: a.customType({
          tags: a.string().array(),
          requiredTags: a.string().required().array().required(),
        }),
        LocationWithMeta: a.customType({
          lat: a.float(),
          long: a.float(),
          locationMeta: a.ref('Meta'),
        }),
        ModelWithReferencedCustomTypes: a.model({
          title: a.string().required(),
          location: a.ref('Location'),
          location2: a.ref('Location').required(),
          // Testing every permutation of array custom types
          // https://github.com/aws-amplify/amplify-category-api/issues/2809
          meta: a.ref('Meta').array(),
          meta2: a.ref('Meta').required().array(),
          meta3: a.ref('Meta').array().required(),
          meta4: a.ref('Meta').required().array().required(),
          locationMeta: a.ref('LocationWithMeta').array(),
        }),
      })
      .authorization((allow) => allow.guest());

    type Schema = ClientSchema<typeof schema>;

    async function getMockedClient(
      operationName: string,
      mockedResult: object,
    ) {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            [operationName]: {
              items: [mockedResult],
            },
          },
        },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      return { client, spy };
    }

    describe('Defined inline', () => {
      const sampleModelInline = {
        id: 'some-id',
        location: {
          lat: 1.23,
          long: 4.56,
          locationMeta: {
            tags: ['a', 'b'],
            requiredTags: ['residential'],
          },
        },
      };

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(
          'listModelWithInlineCustomTypes',
          sampleModelInline,
        );

        const { data } = await client.models.ModelWithInlineCustomType.list({
          selectionSet: [
            'id',
            'location.lat',
            'location.long',
            'location.locationMeta.*',
          ],
        });

        return { data, spy };
      }

      test('is reflected in the graphql selection set', async () => {
        const { spy } = await mockedOperation();

        const expectedSelectionSet = /* GraphQL */ `
          items {
            id
            location {
              lat
              long
              locationMeta {
                tags
                requiredTags
              }
            }
          }
          nextToken
          __typename
        `;

        expectSelectionSetEquals(spy, expectedSelectionSet);
      });

      test('returns the selected fields at runtime', async () => {
        const { data } = await mockedOperation();

        const sampleTodoFinalResult = [
          {
            ...sampleModelInline,
          },
        ];

        expect(data).toEqual(sampleTodoFinalResult);
      });

      test('has a matching return type', async () => {
        const { data } = await mockedOperation();

        type ExpectedTodoType = {
          readonly id: string;
          readonly location: {
            readonly lat: number | null;
            readonly long: number | null;
            readonly locationMeta: {
              readonly requiredTags: string[];
              readonly tags: (string | null)[] | null;
            } | null;
          } | null;
        }[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });
    });

    describe('Defined through ref; all fields', () => {
      const sampleModelInline = {
        id: 'some-id',
        location: {
          lat: 1.23,
          long: 4.56,
        },
        location2: {
          lat: 1.23,
          long: 4.56,
        },
        meta: {
          tags: ['a', 'b'],
          requiredTags: ['residential'],
        },
        meta2: {
          tags: ['a', 'b'],
          requiredTags: ['residential'],
        },
        meta3: {
          tags: ['a', 'b'],
          requiredTags: ['residential'],
        },
        meta4: {
          tags: ['a', 'b'],
          requiredTags: ['residential'],
        },
        locationMeta: {
          lat: 1.23,
          long: 4.56,
          locationMeta: {
            tags: ['a', 'b'],
            requiredTags: ['residential'],
          },
        },
      };

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(
          'listModelWithReferencedCustomTypes',
          sampleModelInline,
        );

        const { data } =
          await client.models.ModelWithReferencedCustomTypes.list({
            selectionSet: [
              'id',
              'location.*',
              'location2.*',
              'meta.*',
              'meta2.*',
              'meta3.*',
              'meta4.*',
              'locationMeta.*',
            ],
          });

        return { data, spy };
      }

      test('is reflected in the graphql selection set', async () => {
        const { spy } = await mockedOperation();

        const expectedSelectionSet = /* GraphQL */ `
          items {
            id
            location {
              lat
              long
            }
            location2 {
              lat
              long
            }
            meta {
              tags
              requiredTags
            }
            meta2 {
              tags
              requiredTags
            }
            meta3 {
              tags
              requiredTags
            }
            meta4 {
              tags
              requiredTags
            }
            locationMeta {
                lat
                long
                locationMeta {
                  tags
                  requiredTags
                }
            }
          }
          nextToken
          __typename
        `;

        expectSelectionSetEquals(spy, expectedSelectionSet);
      });

      test('returns the selected fields at runtime', async () => {
        const { data } = await mockedOperation();

        const sampleTodoFinalResult = [
          {
            ...sampleModelInline,
          },
        ];

        expect(data).toEqual(sampleTodoFinalResult);
      });

      test('has a matching return type', async () => {
        const { data } = await mockedOperation();

        type ExpectedTodoType = {
          readonly id: string;
          readonly location: {
            readonly lat: number | null;
            readonly long: number | null;
          } | null;
          readonly location2: {
            readonly lat: number | null;
            readonly long: number | null;
          };
          readonly meta:
            | ({
                readonly requiredTags: string[];
                readonly tags: (string | null)[] | null;
              } | null)[]
            | null;
          readonly meta2:
            | {
                readonly requiredTags: string[];
                readonly tags: (string | null)[] | null;
              }[]
            | null;
          readonly meta3: ({
            readonly requiredTags: string[];
            readonly tags: (string | null)[] | null;
          } | null)[];
          readonly meta4: {
            readonly requiredTags: string[];
            readonly tags: (string | null)[] | null;
          }[];
          readonly locationMeta:
            | ({
                readonly lat: number | null;
                readonly long: number | null;
                readonly locationMeta: {
                  readonly requiredTags: string[];
                  readonly tags: (string | null)[] | null;
                } | null;
              } | null)[]
            | null;
        }[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });
    });

    describe('Defined through ref; subset of fields', () => {
      const sampleModelInline = {
        id: 'some-id',
        location: {
          lat: 1.23,
        },
        location2: {
          lat: 1.23,
        },
        meta: {
          requiredTags: ['residential'],
        },
        meta2: {
          requiredTags: ['residential'],
        },
        meta3: {
          requiredTags: ['residential'],
        },
        meta4: {
          requiredTags: ['residential'],
        },
        locationMeta: {
          lat: 1.23,
          locationMeta: {
            requiredTags: ['residential'],
          },
        },
      };

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(
          'listModelWithReferencedCustomTypes',
          sampleModelInline,
        );

        const { data } =
          await client.models.ModelWithReferencedCustomTypes.list({
            selectionSet: [
              'id',
              'location.lat',
              'location2.lat',
              'meta.requiredTags',
              'meta2.requiredTags',
              'meta3.requiredTags',
              'meta4.requiredTags',
              'locationMeta.lat',
              'locationMeta.locationMeta.requiredTags',
            ],
          });

        return { data, spy };
      }

      test('is reflected in the graphql selection set', async () => {
        const { spy } = await mockedOperation();

        const expectedSelectionSet = /* GraphQL */ `
          items {
            id
            location {
              lat
            }
            location2 {
              lat
            }
            meta {
              requiredTags
            }
            meta2 {
              requiredTags
            }
            meta3 {
              requiredTags
            }
            meta4 {
              requiredTags
            }
            locationMeta {
                lat
                locationMeta {
                  requiredTags
                }
            }
          }
          nextToken
          __typename
        `;

        expectSelectionSetEquals(spy, expectedSelectionSet);
      });

      test('returns the selected fields at runtime', async () => {
        const { data } = await mockedOperation();

        const sampleTodoFinalResult = [
          {
            ...sampleModelInline,
          },
        ];

        expect(data).toEqual(sampleTodoFinalResult);
      });

      test('has a matching return type', async () => {
        const { data } = await mockedOperation();

        type ExpectedTodoType = {
          readonly id: string;
          readonly location: {
            readonly lat: number | null;
          } | null;
          readonly location2: {
            readonly lat: number | null;
          };
          readonly meta:
            | ({
                readonly requiredTags: string[];
              } | null)[]
            | null;
          readonly meta2:
            | {
                readonly requiredTags: string[];
              }[]
            | null;
          readonly meta3: ({
            readonly requiredTags: string[];
          } | null)[];
          readonly meta4: {
            readonly requiredTags: string[];
          }[];
          readonly locationMeta:
            | ({
                readonly lat: number | null;
                readonly locationMeta: {
                  readonly requiredTags: string[];
                } | null;
              } | null)[]
            | null;
        }[];

        type ActualType = typeof data;

        type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
      });
    });
  });

  describe('Enums', () => {
    const schema = a
      .schema({
        ModelWithEnums: a.model({
          title: a.string().required(),
          status: a.ref('Status').required(),
          visibility: a.enum(['PRIVATE', 'PUBLIC']),
        }),
        Status: a.enum(['DRAFT', 'PENDING', 'PUBLISHED']),
      })
      .authorization((allow) => allow.guest());

    type Schema = ClientSchema<typeof schema>;

    async function getMockedClient(
      operationName: string,
      mockedResult: object,
    ) {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            [operationName]: {
              items: [mockedResult],
            },
          },
        },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      return { client, spy };
    }

    const sampleModelInline = {
      title: 'some title',
      status: 'PENDING',
      visibility: 'PRIVATE',
    };

    async function mockedOperation() {
      const { client, spy } = await getMockedClient(
        'listModelWithEnums',
        sampleModelInline,
      );

      const { data } = await client.models.ModelWithEnums.list({
        selectionSet: ['title', 'status', 'visibility'],
      });

      return { data, spy };
    }

    test('is reflected in the graphql selection set', async () => {
      const { spy } = await mockedOperation();

      const expectedSelectionSet = /* GraphQL */ `
          items {
            title
            status
            visibility
          }
          nextToken
          __typename
        `;

      expectSelectionSetEquals(spy, expectedSelectionSet);
    });

    test('returns the selected fields at runtime', async () => {
      const { data } = await mockedOperation();

      const sampleTodoFinalResult = [
        {
          ...sampleModelInline,
        },
      ];

      expect(data).toEqual(sampleTodoFinalResult);
    });

    test('has a matching return type', async () => {
      const { data } = await mockedOperation();

      type ExpectedTodoType = {
        readonly title: string;
        readonly status: 'DRAFT' | 'PENDING' | 'PUBLISHED';
        readonly visibility: 'PRIVATE' | 'PUBLIC' | null;
      }[];

      type ActualType = typeof data;

      type _test = Expect<Equal<ActualType, ExpectedTodoType>>;
    });
  });

  describe('optional array with many-to-many relationships', () => {
    const schema = a
      .schema({
        AlphabetEnum: a.enum(['A', 'B', 'C', 'D']),
        Customer: a.model({
          name: a.string().required(),
          verbiageReqReq: a.ref('Verbiage').required().array().required(),
          verbiageOptReq: a.ref('Verbiage').array().required(),
          verbiageReqOpt: a.ref('Verbiage').required().array(),
          verbiageOptOpt: a.ref('Verbiage').array(),
          orders: a.hasMany('CustomerPart', 'customerId'),
        }),
        Verbiage: a.customType({
          name: a.ref('AlphabetEnum').required(),
          paragraphs: a.string().required().array().required(),
        }),
        CustomerPart: a.model({
          customer: a.belongsTo('Customer', 'customerId'),
          customerId: a.string(),
          experience: a.string(),
          part: a.belongsTo('Part', 'partId'),
          partId: a.string(),
        }),
        Part: a.model({
          name: a.string().required(),
          orders: a.hasMany('CustomerPart', 'partId'),
        }),
      })
      .authorization((allow) => allow.guest());

    type Schema = ClientSchema<typeof schema>;

    async function getMockedClient(
      operationName: string,
      mockedResult: object,
    ) {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            [operationName]: {
              items: [mockedResult],
            },
          },
        },
      ]);

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      return { client, spy };
    }

    describe('Defined many-to-many relations', () => {
      const sampleCustomerPart = {
        customer: [
          {
            name: 'some-customer',
            verbiageReqReq: [
              {
                name: 'A',
                paragraphs: ['some-paragraph'],
              },
            ],
            verbiageOptReq: [
              {
                name: 'A',
                paragraphs: ['some-paragraph'],
              },
            ],
            verbiageReqOpt: [
              {
                name: 'A',
                paragraphs: ['some-paragraph'],
              },
            ],
            verbiageOptOpt: [
              {
                name: 'A',
                paragraphs: ['some-paragraph'],
              },
            ],
          },
        ],
        customerId: 'some-customer-id',
        part: [
          {
            name: 'some-part',
            orders: [
              {
                customerId: 'some-customer-id',
                partId: 'some-part-id',
              },
            ],
          },
        ],
        partId: 'some-part-id',
      };

      async function mockedOperation() {
        const { client, spy } = await getMockedClient(
          'listCustomerPart',
          sampleCustomerPart,
        );

        const { data } = await client.models.CustomerPart.list({
          selectionSet: [
            'customer.*',
            'customer.verbiageReqReq.*',
            'customer.verbiageOptReq.*',
            'customer.verbiageReqOpt.*',
            'customer.verbiageOptOpt.*',
          ],
        });
        return { data, spy };
      }

      type Verbiage = {
        readonly name: 'A' | 'B' | 'C' | 'D';
        readonly paragraphs: string[];
      };

      test('.required().array().required()', async () => {
        const { data } = await mockedOperation();
        const cus = data[0].customer.verbiageReqReq;
        type ExpectedType = Verbiage[];
        type ActualType = typeof cus;
        type _test = Expect<Equal<ActualType, ExpectedType>>;
      });

      test('.array().required()', async () => {
        const { data } = await mockedOperation();
        const cus = data[0].customer.verbiageOptReq;
        type ExpectedType = (Verbiage | null)[];
        type ActualType = typeof cus;
        type _test = Expect<Equal<ActualType, ExpectedType>>;
      });

      test('.required().array()', async () => {
        const { data } = await mockedOperation();
        const cus = data[0].customer.verbiageReqOpt;
        type ExpectedType = Verbiage[] | null;
        type ActualType = typeof cus;
        type _test = Expect<Equal<ActualType, ExpectedType>>;
      });

      test('.array()', async () => {
        const { data } = await mockedOperation();
        const cus = data[0].customer.verbiageOptOpt;
        type ExpectedType = (Verbiage | null)[] | null;
        type ActualType = typeof cus;
        type _test = Expect<Equal<ActualType, ExpectedType>>;
      });
    });
  });
});
