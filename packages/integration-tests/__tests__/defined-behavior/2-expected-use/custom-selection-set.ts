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
  content: 'some content',
  description: 'something something',
  owner: 'some-body',
  done: false,
  updatedAt: '2024-03-01T19:05:44.536Z',
  createdAt: '2024-03-01T18:05:44.536Z',
};

function makeSampleTodo<T extends (keyof typeof sampleTodo)[]>(
  fields: T,
): Pick<typeof sampleTodo, T[number]> {
  return Object.fromEntries(
    Object.entries(sampleTodo).filter(([k, v]) => fields.includes(k as any)),
  ) as any;
}

describe('custom selection sets are reflected in the graphql and return only non-lazy/eagerly loaded fields', () => {
  const schema = a.schema({
    Todo: a
      .model({
        content: a.string(),
        description: a.string(),
        done: a.boolean(),
        priority: a.enum(['low', 'medium', 'high']),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.publicApiKey().to(['read']),
      ]),
  });
  type Schema = ClientSchema<typeof schema>;

  type ExpectedTodoType = {
    readonly id: string;
    readonly content: string | null;
    readonly description: string | null;
  } | null;

  const selectionSet = ['id', 'content', 'description'] as const;

  async function getMockedClient(
    operationName: string,
    selectionSet: readonly string[],
  ) {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          [operationName]: makeSampleTodo([...selectionSet] as any), // type doesn't matter here.
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
    expectSelectionSetEquals(spy, selectionSet);
  });

  test('list', async () => {
    const { client, spy } = await getMockedClient('createTodo', selectionSet);
    const { data } = await client.models.Todo.list({
      selectionSet,
    });
    type _test = Expect<Equal<typeof data, Exclude<ExpectedTodoType, null>[]>>;
    expectSelectionSetEquals(spy, selectionSet);
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
    expectSelectionSetEquals(spy, selectionSet);
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
    expectSelectionSetEquals(spy, selectionSet);
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
    expectSelectionSetEquals(spy, selectionSet);
  });
});
