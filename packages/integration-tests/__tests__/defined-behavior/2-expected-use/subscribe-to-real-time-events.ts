import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  subOptionsAndHeaders,
  useState,
  pause,
} from '../../utils';

const sampleTodo = {
  __typename: 'Todo',
  id: 'some-id',
  content: 'some content',
  description: 'something something',
  owner: 'some-body',
  done: false,
  updatedAt: '2024-03-01T19:05:44.536Z',
  createdAt: '2024-03-01T18:05:44.536Z',
};

describe('Subscribe to real-time events', () => {
  // https://docs.amplify.aws/gen2/build-a-backend/data/subscribe-data/

  // data/resource.ts
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('subscription options', async () => {
    // #region mocking
    const { subSpy, subs, generateClient } = mockedGenerateClient([]);

    // simulated amplifyconfiguration.json
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    // #endregion mocking

    type Todo = Schema['Todo']['type'];
    const client = generateClient<Schema>();
    const [todos, setTodos] = useState<Todo[]>([]);

    // Subscriptions-only `in` operator
    const sub = client.models.Todo.onCreate({
      filter: { priority: { in: ['low', 'medium', 'high'] } },
    }).subscribe({
      next: (data) => {
        setTodos([...todos, data]);
      },
    });

    subs.onCreateTodo.next({
      data: {
        onCreateTodo: {
          ...sampleTodo,
          id: 'some-id-1',
          priority: 'high',
        },
      },
    });

    expect(setTodos.mock.calls).toMatchSnapshot();
    expect(subOptionsAndHeaders(subSpy)).toMatchSnapshot();
  });

  test('observeQuery ignores subscription events with a null payload', async () => {
    const { subs, generateClient } = mockedGenerateClient([
      {
        data: {
          listTodos: { items: [sampleTodo], nextToken: null },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);

    type Todo = Schema['Todo']['type'];
    const client = generateClient<Schema>();
    const [todos, setTodos] = useState<Todo[]>([]);
    const onError = jest.fn();

    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => setTodos([...items]),
      error: onError,
    });

    await pause(1);

    const nullPayload = (type: string) => ({
      data: { [type]: null },
      errors: [
        {
          message: `Cannot return null for non-nullable type: 'String' within parent 'Todo' (/${type}/content)`,
        },
      ],
    });

    expect(() => {
      subs.onCreateTodo.next(nullPayload('onCreateTodo'));
      subs.onUpdateTodo.next(nullPayload('onUpdateTodo'));
      subs.onDeleteTodo.next(nullPayload('onDeleteTodo'));
    }).not.toThrow();

    await pause(1);

    subs.onCreateTodo.next({
      data: {
        onCreateTodo: { ...sampleTodo, id: 'some-id-2' },
      },
    });

    await pause(1);

    sub.unsubscribe();

    expect(onError).not.toHaveBeenCalled();
    const latest = setTodos.mock.calls.at(-1)![0];
    expect(latest.map((todo: Todo) => todo.id)).toEqual([
      'some-id',
      'some-id-2',
    ]);
  });

  test('subscription options - type level only', async () => {
    const { generateClient } = mockedGenerateClient([]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateClient<Schema>();

    // Type-level test only - CRUDL-only filter operator is not allowed for subs
    client.models.Todo.onCreate({
      // @ts-expect-error
      filter: { priority: { attributeExists: true } },
    });
  });
});
