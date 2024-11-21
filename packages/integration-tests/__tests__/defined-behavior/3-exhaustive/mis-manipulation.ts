import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
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

function manipulateMis(config: Awaited<ReturnType<typeof buildAmplifyConfig>>) {
  const todoDef = { ...config.modelIntrospection.models['Todo'] };
  const notTodoDef = { ...config.modelIntrospection.models['NotTodo'] };

  // swap definitions
  config.modelIntrospection.models['Todo'] = notTodoDef;
  config.modelIntrospection.models['NotTodo'] = todoDef;

  return config;
}

describe('Manipulated MIS cannot be used to call the wrong model', () => {
  const schema = a
    .schema({
      Todo: a.model({
        content: a.string(),
      }),
      NotTodo: a.model({
        content: a.string(),
      }),
    })
    .authorization((allow) => [allow.publicApiKey()]);
  type Schema = ClientSchema<typeof schema>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create an item', async () => {
    // #region mocking
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          createTodo: sampleTodo,
        },
      },
    ]);

    // simulated amplifyconfiguration.json
    const original = await buildAmplifyConfig(schema);
    const config = manipulateMis(original);
    // #endregion mocking

    // App.tsx
    Amplify.configure(config);
    const client = generateClient<Schema>();
    const { errors, data: newTodo } = await client.models.Todo.create({
      content: 'My new todo',
    });
    // #endregion

    // #region assertions
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
    expect(errors).toBeUndefined();
    expect(newTodo).toEqual(sampleTodo);
    // #endregion assertions
  });

  test('update an item', async () => {
    // #region mocking
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          updateTodo: sampleTodo,
        },
      },
    ]);

    // simulated amplifyconfiguration.json
    const original = await buildAmplifyConfig(schema);
    const config = manipulateMis(original);
    // #endregion mocking

    Amplify.configure(config);
    const client = generateClient<Schema>();
    const { data: updatedTodo, errors } = await client.models.Todo.update({
      id: 'some_id',
      content: 'Updated content',
    });
    // #endregion

    // #region assertions
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
    expect(errors).toBeUndefined();
    expect(updatedTodo).toEqual(sampleTodo);
    // #endregion assertions
  });

  test('delete an item', async () => {
    // #region mocking
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          deleteTodo: sampleTodo,
        },
      },
    ]);

    // simulated amplifyconfiguration.json
    const original = await buildAmplifyConfig(schema);
    const config = manipulateMis(original);
    // #endregion mocking

    // #region
    Amplify.configure(config);
    const client = generateClient<Schema>();
    const toBeDeletedTodo = {
      id: '123123213',
    };
    const { data: deletedTodo, errors } =
      await client.models.Todo.delete(toBeDeletedTodo);
    // #endregion

    // #region assertions
    expect(optionsAndHeaders(spy)).toMatchSnapshot();
    expect(errors).toBeUndefined();
    expect(deletedTodo).toEqual(sampleTodo);
    // #endregion assertions
  });
});
