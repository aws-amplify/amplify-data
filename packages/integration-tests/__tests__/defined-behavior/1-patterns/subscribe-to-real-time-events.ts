import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Subscription } from 'rxjs';
import { Amplify } from 'aws-amplify';
import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data';
import { Hub } from 'aws-amplify/utils';
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

  test('set up a real-time list query', async () => {
    // #region mocking
    const { spy, subSpy, subs, generateClient } = mockedGenerateClient([
      {
        data: {
          listTodos: [sampleTodo],
        },
      },
    ]);

    // simulated amplifyconfiguration.json
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    // #endregion mocking

    // #region covers 19bebafef196be7c
    type Todo = Schema['Todo']['type'];
    const client = generateClient<Schema>();

    // function MyComponent() {
    const [todos, setTodos] = useState<Todo[]>([]);
    // useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setTodos([...items]);
      },
    });
    //   return () => sub.unsubscribe();
    // }, []);
    //   return <ul>
    //     {todos.map(todo => <li key={todo.id}>{todo.content}</li>)}
    //   </ul>
    // }

    // #endregion

    // #region assertions
    // console.log('subs', subs);
    subs.onCreateTodo.next({
      data: {
        onCreateTodo: {
          ...sampleTodo,
          id: 'some-id-2',
        },
      },
    });

    await pause(1);

    subs.onUpdateTodo.next({
      data: {
        onUpdateTodo: {
          ...sampleTodo,
          content: 'updated content',
        },
      },
    });

    await pause(1);

    subs.onDeleteTodo.next({
      data: {
        onDeleteTodo: {
          ...sampleTodo,
          content: 'updated content',
        },
      },
    });

    await pause(1);

    expect(optionsAndHeaders(spy)).toMatchSnapshot();
    expect(subOptionsAndHeaders(subSpy)).toMatchSnapshot();
    expect(setTodos.mock.calls).toMatchSnapshot();
    // #endregion assertions
  });

  test.only('Set up a real-time event subscription', async () => {
    // #region mocking
    const { spy, subSpy, subs, generateClient } = mockedGenerateClient([]);
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    // #endregion mocking

    // #region covers 837a78504eebfe1e
    const client = generateClient<Schema>();

    const collectedResults: any = [];

    // Subscribe to creation of Todo
    const createSub = client.models.Todo.onCreate().subscribe({
      next: (data) => collectedResults.push({ onCreate: data }), // console.log(data),
      error: (error) => console.warn(error),
    });

    // Subscribe to update of Todo
    const updateSub = client.models.Todo.onUpdate().subscribe({
      next: (data) => collectedResults.push({ onUpdate: data }), // console.log(data),
      error: (error) => console.warn(error),
    });

    // Subscribe to deletion of Todo
    const deleteSub = client.models.Todo.onDelete().subscribe({
      next: (data) => collectedResults.push({ onDelete: data }), // console.log(data),
      error: (error) => console.warn(error),
    });

    subs.onCreateTodo.next({
      data: {
        onCreateTodo: {
          ...sampleTodo,
          id: 'some-id-2',
        },
      },
    });

    await pause(1);

    subs.onUpdateTodo.next({
      data: {
        onUpdateTodo: {
          ...sampleTodo,
          content: 'updated content',
        },
      },
    });

    await pause(1);

    subs.onDeleteTodo.next({
      data: {
        onDeleteTodo: {
          ...sampleTodo,
          content: 'updated content',
        },
      },
    });

    await pause(1);

    // #region covers 982a132bf936968c
    // Stop receiving data updates from the subscription
    createSub.unsubscribe();
    updateSub.unsubscribe();
    deleteSub.unsubscribe();
    // #endregion

    // #endregion

    expect(collectedResults).toEqual([
      {
        onCreate: {
          ...sampleTodo,
          id: 'some-id-2',
        },
      },
      {
        onUpdate: {
          ...sampleTodo,
          content: 'updated content',
        },
      },
      {
        onDelete: {
          ...sampleTodo,
          content: 'updated content',
        },
      },
    ]);

    // these assertions just ensure that the unsubscribe calls are propagated
    // to the underlying graphql subscription mechanism. in this specific case,
    // it's our mock. in production, it's the realtime provider which is then
    // responsible for actually cancelling the graphql subscription.
    expect(subs.onCreateTodo.closed).toBe(true);
    expect(subs.onUpdateTodo.closed).toBe(true);
    expect(subs.onDeleteTodo.closed).toBe(true);
  });

  test('Set up server-side subscription filters', async () => {
    // #region mocking
    const { spy, subSpy, subs, generateClient } = mockedGenerateClient([]);
    const config = await buildAmplifyConfig(schema);
    // #endregion mocking

    // #region covers dd37adfa68dc80a8
    const client = generateClient<Schema>();

    let sub: Subscription | undefined = undefined;
    try {
      sub = client.models.Todo.onCreate({
        filter: {
          content: {
            contains: 'groceries',
          },
        },
      }).subscribe({
        next: (data) => console.log(data),
        error: (error) => console.warn(error),
      });
      // #endregion

      const variables = subOptionsAndHeaders(subSpy)[0][0].variables;
      expect(variables).toEqual({
        filter: { content: { contains: 'groceries' } },
      });
    } finally {
      sub?.unsubscribe();
    }
  });
});
