import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
} from '../../utils';
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
  /**
   * The following tests demonstrate an error response with a completely empty
   * `data` result (e.g. `data: {}`).
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
          data: {},
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(newTodo).toEqual({});
      // #endregion assertions
    });

    test('get an item', async () => {
      // #region mocking
      const { spy, innerSpy, generateClient } = mockedGenerateClient([
        {
          data: {},
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(todo).toEqual({});
      // #endregion assertions
    });

    test('update an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {},
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(updatedTodo).toEqual({});
      // #endregion assertions
    });

    test('delete an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {},
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(deletedTodo).toEqual({});
      // #endregion assertions
    });

    test('list items', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {},
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(todos).toEqual({});
      // #endregion assertions
    });
  });
  /**
   * The following tests demonstrate an error response with a `null` `data`
   * result, (e.g. `data: createTodo: null`)
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
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(newTodo).toEqual({ createTodo: null });
      // #endregion assertions
    });

    test('get an item', async () => {
      // #region mocking
      const { spy, innerSpy, generateClient } = mockedGenerateClient([
        {
          data: { getTodo: null },
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(todo).toEqual({ getTodo: null });
      // #endregion assertions
    });

    test('update an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { updateTodo: null },
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(updatedTodo).toEqual({ updateTodo: null });
      // #endregion assertions
    });

    test('delete an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { deleteTodo: null },
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(deletedTodo).toEqual({ deleteTodo: null });
      // #endregion assertions
    });

    test('list items', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { listTodo: null },
          errors: [
            {
              message: 'Unauthorized',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(todos).toEqual({ listTodo: null });
      // #endregion assertions
    });
  });
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

    test('get an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { getTodo: sampleTodo },
          errors: [
            {
              message: 'Not Authorized to access additionalInfo on type Todo',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(getTodo).toEqual({ getTodo: sampleTodo });
      // #endregion assertions
    });
    test('list an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { listTodos: [sampleTodo] },
          errors: [
            {
              message: 'Not Authorized to access additionalInfo on type Todo',
            } as GraphQLError,
          ],
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
      expect(errors).toBeDefined();
      expect(data).toEqual({ listTodos: [sampleTodo] });
      // #endregion assertions
    });
  });
});
