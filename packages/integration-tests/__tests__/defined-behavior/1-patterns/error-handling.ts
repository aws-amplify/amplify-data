import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';
import { GraphQLError } from 'graphql';

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

describe('CRUD error handling', () => {
  const authError1 = {
    message: 'Unauthorized',
  } as GraphQLError;

  const authError2 = {
    message: 'Not Authorized to access additionalInfo on type Todo',
  } as GraphQLError;

  /**
   * The following tests demonstrate an error response with an empty `data`
   * result (e.g. `data: {}`).
   * This will occur when, for instance, a customer passes incorrect options
   * when generating the API client.
   * Errors here are caught by the runtime.
   */
  describe('error response with "empty" `data` result', () => {
    // data/resource.ts
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          description: a.string(),
          done: a.boolean(),
          priority: a.enum(['low', 'medium', 'high']),
        })
        .authorization([a.allow.owner()]),
    });
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('create an item', async () => {
      // #region mocking
      const { spy, innerSpy, generateClient } = mockedGenerateClient([
        {
          data: null,
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // App.tsx
      Amplify.configure(config);

      /**
       * Representing an error case where the app is not configured to use IAM,
       * but the customer incorrectly supplies the config anyway. This results
       * in us hitting the following util:
       * https://github.com/aws-amplify/amplify-js/blob/main/packages/api-graphql/src/utils/errors/createGraphQLResultWithError.ts
       */
      const client = generateClient<Schema>({ authMode: 'iam' });

      const { data: newTodo, errors } = await client.models.Todo.create({
        content: 'My new todo',
        done: true,
      });

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(newTodo).toBeNull();
      // #endregion assertions
    });

    test('get an item', async () => {
      // #region mocking
      const { spy, innerSpy, generateClient } = mockedGenerateClient([
        {
          data: null,
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // App.tsx
      Amplify.configure(config);

      /**
       * Representing an error case where the app is not configured to use IAM,
       * but the customer incorrectly supplies the config anyway. This results
       * in us hitting the following util:
       * https://github.com/aws-amplify/amplify-js/blob/main/packages/api-graphql/src/utils/errors/createGraphQLResultWithError.ts
       */
      const client = generateClient<Schema>({ authMode: 'iam' });

      const { data: todo, errors } = await client.models.Todo.get({
        id: 'some-id',
      });

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(todo).toBeNull();
      // #endregion assertions
    });

    test('update an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: null,
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // App.tsx
      Amplify.configure(config);

      /**
       * Representing an error case where the app is not configured to use IAM,
       * but the customer incorrectly supplies the config anyway. This results
       * in us hitting the following util:
       * https://github.com/aws-amplify/amplify-js/blob/main/packages/api-graphql/src/utils/errors/createGraphQLResultWithError.ts
       */
      const client = generateClient<Schema>({ authMode: 'iam' });

      const { data: updatedTodo, errors } = await client.models.Todo.update({
        id: 'some_id',
        description: 'Updated description',
      });

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(updatedTodo).toBeNull();
      // #endregion assertions
    });

    test('delete an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: null,
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // App.tsx
      Amplify.configure(config);

      /**
       * Representing an error case where the app is not configured to use IAM,
       * but the customer incorrectly supplies the config anyway. This results
       * in us hitting the following util:
       * https://github.com/aws-amplify/amplify-js/blob/main/packages/api-graphql/src/utils/errors/createGraphQLResultWithError.ts
       */
      const client = generateClient<Schema>({ authMode: 'iam' });

      const toBeDeletedTodo = {
        id: '123123213',
      };
      const { data: deletedTodo, errors } =
        await client.models.Todo.delete(toBeDeletedTodo);

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(deletedTodo).toBeNull();
      // #endregion assertions
    });

    test('list items', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: [],
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // App.tsx
      Amplify.configure(config);

      /**
       * Representing an error case where the app is not configured to use IAM,
       * but the customer incorrectly supplies the config anyway. This results
       * in us hitting the following util:
       * https://github.com/aws-amplify/amplify-js/blob/main/packages/api-graphql/src/utils/errors/createGraphQLResultWithError.ts
       */
      const client = generateClient<Schema>({ authMode: 'iam' });

      const { data: todos, errors } = await client.models.Todo.list({
        id: 'some_id',
      });

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(todos).toEqual(expect.arrayContaining([]));
      // #endregion assertions
    });
  });
  /**
   * The following tests demonstrate an error response with a `null` unflattened
   * `data` result, (e.g. `data: createTodo: null`).
   * This can occur when the user attempts to perform an operation that they
   * are not authorized to perform.
   * The error is not caught by the runtime (expected) and `data` is passed
   * through, but the result it not flattened (unexpected).
   */
  describe('error response with `null` result', () => {
    // https://docs.amplify.aws/gen2/build-a-backend/data/mutate-data/

    // data/resource.ts
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          description: a.string(),
          done: a.boolean(),
          priority: a.enum(['low', 'medium', 'high']),
        })
        .authorization([a.allow.owner()]),
    });
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('create an item', async () => {
      // #region mocking
      const { spy, innerSpy, generateClient } = mockedGenerateClient([
        {
          data: { createTodo: null },
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: newTodo, errors } = await client.models.Todo.create({
        content: 'My new todo',
        done: true,
      });
      // #endregion docs code

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(newTodo).toBeNull();
      // #endregion assertions
    });

    test('get an item', async () => {
      // #region mocking
      const { spy, innerSpy, generateClient } = mockedGenerateClient([
        {
          data: { getTodo: null },
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: todo, errors } = await client.models.Todo.get({
        id: 'some-id',
      });
      // #endregion docs code

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(todo).toBeNull();
      // #endregion assertions
    });

    test('update an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { updateTodo: null },
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      const { data: updatedTodo, errors } = await client.models.Todo.update({
        id: 'some_id',
        description: 'Updated description',
      });
      // #endregion docs code

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(updatedTodo).toBeNull();
      // #endregion assertions
    });

    test('delete an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { deleteTodo: null },
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      const toBeDeletedTodo = {
        id: '123123213',
      };
      const { data: deletedTodo, errors } =
        await client.models.Todo.delete(toBeDeletedTodo);
      // #endregion docs code

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(deletedTodo).toBeNull();
      // #endregion assertions
    });

    test('list items', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { listTodo: null },
          errors: [authError1],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: todos, errors } = await client.models.Todo.list({
        id: 'some_id',
      });
      // #endregion docs code

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError1]));
      expect(todos).toEqual(expect.arrayContaining([]));
      // #endregion assertions
    });
  });
  /**
   * The following tests demonstrate an error response with a complete and
   * unflattened `data` result (e.g. `data: createTodo: {id: '123', ...etc }`).
   * This can occur when, for instance, a selection set is provided that
   * includes fields that the user is not authorized to access.
   * The error is not caught by the runtime (expected) and `data` is passed
   * through, but the result it not flattened (unexpected).
   */
  describe('error response with populated `data` result', () => {
    // data/resource.ts

    // Schema that allows public users create-only access to `Note`:
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          description: a.string(),
          additionalInfo: a.hasOne('Note'),
        })
        .authorization([a.allow.public()]),
      Note: a
        .model({
          content: a.string(),
        })
        .authorization([a.allow.public().to(['create']), a.allow.owner()]),
    });

    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test.only('get an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { getTodo: sampleTodo },
          errors: [authError2],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      const { data: getTodo, errors } = await client.models.Todo.get(
        {
          id: 'some_id',
        },
        {
          selectionSet: ['id', 'content', 'additionalInfo.*'],
        },
      );

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError2]));
      expect(getTodo).toEqual({ getTodo: sampleTodo });
      // #endregion assertions
    });
    test('list an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { listTodos: [sampleTodo] },
          errors: [authError2],
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      const { data, errors } = await client.models.Todo.list({
        selectionSet: ['id', 'content', 'additionalInfo.*'],
      });

      // #region assertions
      expect(errors).toEqual(expect.arrayContaining([authError2]));
      expect(data).toEqual({ listTodos: [sampleTodo] });
      // #endregion assertions
    });
  });
});
