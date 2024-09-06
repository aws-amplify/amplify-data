import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  expectSelectionSetContains,
  expectSelectionSetNotContains,
  expectSelectionSetEquals,
} from '../../utils';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import { Subscription } from 'rxjs';

describe('providing a custom selection set', () => {
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

  const sampleTodo = {
    id: 'some-id',
    description: 'something something',
    details: {
      content: 'some details content',
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

  /**
   * The sample todo, transformed to remove the `items` array as customers see it.
   */
  const sampleTodoFinalResult = {
    ...sampleTodo,
    steps: [...sampleTodo.steps.items],
  };

  const selectionSet = [
    'id',
    'description',
    'details.content',
    'steps.*',
  ] as const;

  const expectedSelectionSet = `
    id
    description
    details {
      content
    }
    steps {
      items {
        id description todoId createdAt updatedAt owner
      }
    }
  `;

  const expectedListSelectionSet = `
    items {
      id
      description
      details {
        content
      }
      steps {
        items {
          id description todoId createdAt updatedAt owner
        }
      }
    }
    nextToken
    __typename
  `;

  type ExpectedTodoType = {
    readonly id: string;
    readonly description: string | null;
    readonly details: {
      readonly content: string | null;
    };
    readonly steps: {
      readonly description: string;
      readonly todoId: string;
      readonly id: string;
      readonly owner: string | null;
      readonly updatedAt: string;
      readonly createdAt: string;
    }[];
  } | null;

  async function getMockedClient(
    operationName: string,
    mockedResult: object = { ...sampleTodo },
  ) {
    const { subs, spy, generateClient } = mockedGenerateClient([
      {
        data: {
          [operationName]: mockedResult,
        },
      },
    ]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();
    return { client, spy, subs };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('to `get` operations', () => {
    async function mockedOperation() {
      const { client, spy } = await getMockedClient('getTodo');
      const { data } = await client.models.Todo.get(
        {
          id: 'something',
        },
        {
          selectionSet,
        },
      );
      return { data, spy };
    }

    test('is reflected in the graphql selection set', async () => {
      const { spy } = await mockedOperation();
      expectSelectionSetEquals(spy, expectedSelectionSet);
    });

    test('returns only the selected fields, without lazy loaders', async () => {
      const { data } = await mockedOperation();
      expect(data).toEqual(sampleTodoFinalResult);
    });

    test('has a matching return type', async () => {
      const { data } = await mockedOperation();
      type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    });
  });

  describe('to `list` operations', () => {
    async function mockedOperation() {
      const { client, spy } = await getMockedClient('listTodos', {
        items: [sampleTodo],
      });
      const { data } = await client.models.Todo.list({
        selectionSet,
      });
      return { data, spy };
    }

    test('is reflected in the graphql selection set', async () => {
      const { spy } = await mockedOperation();
      expectSelectionSetEquals(spy, expectedListSelectionSet);
    });

    test('returns only the selected fields, without lazy loaders', async () => {
      const { data } = await mockedOperation();
      expect(data).toEqual([sampleTodoFinalResult]);
    });

    test('has a matching return type', async () => {
      const { data } = await mockedOperation();
      type _test = Expect<
        Equal<typeof data, Exclude<ExpectedTodoType, null>[]>
      >;
    });
  });

  describe('to `create` operations', () => {
    async function mockedOperation() {
      const { client, spy } = await getMockedClient('createTodo');
      const { data } = await client.models.Todo.create(
        {
          id: 'something',
        },
        {
          selectionSet,
        },
      );
      return { data, spy };
    }

    test('is reflected in the graphql selection set', async () => {
      const { spy } = await mockedOperation();
      expectSelectionSetEquals(spy, expectedSelectionSet);
    });

    test('returns only the selected fields, without lazy loaders', async () => {
      const { data } = await mockedOperation();
      expect(data).toEqual(sampleTodoFinalResult);
    });

    test('has a matching return type', async () => {
      const { data } = await mockedOperation();
      type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    });
  });

  describe('to `update` operations', () => {
    async function mockedOperation() {
      const { client, spy } = await getMockedClient('createUpdate');
      const { data } = await client.models.Todo.update(
        {
          id: 'something',
        },
        {
          selectionSet,
        },
      );
      return { data, spy };
    }

    test('is reflected in the graphql selection set', async () => {
      const { spy } = await mockedOperation();
      expectSelectionSetEquals(spy, expectedSelectionSet);
    });

    test('returns only the selected fields, without lazy loaders', async () => {
      const { data } = await mockedOperation();
      expect(data).toEqual(sampleTodoFinalResult);
    });

    test('has a matching return type', async () => {
      const { data } = await mockedOperation();
      type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    });
  });

  describe('to `delete` operations', () => {
    async function mockedOperation() {
      const { client, spy } = await getMockedClient('deleteTodo');
      const { data } = await client.models.Todo.delete(
        {
          id: 'something',
        },
        {
          selectionSet,
        },
      );
      return { data, spy };
    }

    test('is reflected in the graphql selection set', async () => {
      const { spy } = await mockedOperation();
      expectSelectionSetEquals(spy, expectedSelectionSet);
    });

    test('returns only the selected fields, without lazy loaders', async () => {
      const { data } = await mockedOperation();
      expect(data).toEqual(sampleTodoFinalResult);
    });

    test('has a matching return type', async () => {
      const { data } = await mockedOperation();
      type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    });
  });

  describe.only('to `onCreate` operations', () => {
    const backgroundSubs = [] as Subscription[];

    afterEach(() => {
      while (backgroundSubs.length > 0) {
        const sub = backgroundSubs.pop();
        sub?.unsubscribe();
      }
    });

    async function mockedSub() {
      const { subs, spy, client } = await getMockedClient('onCreateTodo');
      const observable = client.models.Todo.onCreate({
        selectionSet,
      });
      return { observable, spy, subs };
    }

    test('is reflected in the graphql selection set', async () => {
      const { observable, spy } = await mockedSub();
      backgroundSubs.push(observable.subscribe());
      expectSelectionSetEquals(spy, expectedSelectionSet);
    });

    test('returns only the selected fields, without lazy loaders', async () => {
      const { observable, subs } = await mockedSub();
      const data = await new Promise((resolve) => {
        backgroundSubs.push(
          observable.subscribe({
            next(item) {
              resolve(item);
            },
          }),
        );
        subs.onCreateTodo.next({
          data: {
            onCreateTodo: sampleTodo,
          },
        });
      });
      expect(data).toEqual(sampleTodoFinalResult);
    });

    test('has a matching `next()` item type', async () => {
      const { observable } = await mockedSub();
      backgroundSubs.push(
        observable.subscribe({
          next(item) {
            type _test = Expect<
              Equal<typeof item, Exclude<ExpectedTodoType, null>>
            >;
          },
        }),
      );
    });
  });
});
