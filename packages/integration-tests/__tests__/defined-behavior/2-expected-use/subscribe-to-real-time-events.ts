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
