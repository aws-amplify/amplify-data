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
      .authorization([a.allow.owner(), a.allow.public().to(['read'])]),
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

    // #region docs code
    type Todo = Schema['Todo'];
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

    // #endregion docs code

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
});
