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

const sampleTodo = {
  id: 'some-id',
  description: 'something something',
  details: {
    content: 'some details content',
  },
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
};

describe('custom selection', () => {
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
    selectionSet: readonly string[],
  ) {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          [operationName]: { ...sampleTodo },
        },
      },
    ]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();
    return { client, spy };
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('in `get` operations', () => {
    async function mockedGetOperation() {
      const { client, spy } = await getMockedClient('createTodo', selectionSet);
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
      const { spy } = await mockedGetOperation();
      expectSelectionSetEquals(spy, expectedSelectionSet);
    });

    test('returns only the selected fields, without lazy loaders', async () => {
      const { data } = await mockedGetOperation();
      expect(data).toEqual(sampleTodo);
    });

    test('has a matching return type', async () => {
      const { data } = await mockedGetOperation();
      type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    });
  });

  test('get', async () => {
    const { client, spy } = await getMockedClient('createTodo', selectionSet);
    const { data } = await client.models.Todo.get(
      {
        id: 'something',
      },
      {
        selectionSet,
      },
    );
    type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    expectSelectionSetEquals(spy, expectedSelectionSet);
  });

  test('list', async () => {
    const { client, spy } = await getMockedClient('createTodo', selectionSet);
    const { data } = await client.models.Todo.list({
      selectionSet,
    });
    type _test = Expect<Equal<typeof data, Exclude<ExpectedTodoType, null>[]>>;
    expectSelectionSetEquals(spy, expectedListSelectionSet);
  });

  test('for create', async () => {
    const { client, spy } = await getMockedClient('createTodo', selectionSet);
    const { data } = await client.models.Todo.create(
      {
        id: 'something',
      },
      {
        selectionSet,
      },
    );
    type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    expectSelectionSetEquals(spy, expectedSelectionSet);
  });

  test('update', async () => {
    const { client, spy } = await getMockedClient('updateTodo', selectionSet);
    const { data } = await client.models.Todo.update(
      {
        id: 'something',
      },
      {
        selectionSet,
      },
    );
    type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    expectSelectionSetEquals(spy, expectedSelectionSet);
  });

  test('delete', async () => {
    const { client, spy } = await getMockedClient('deleteTodo', selectionSet);
    const { data } = await client.models.Todo.delete(
      {
        id: 'something',
      },
      {
        selectionSet,
      },
    );
    type _test = Expect<Equal<typeof data, ExpectedTodoType>>;
    expectSelectionSetEquals(spy, expectedSelectionSet);
  });
});
