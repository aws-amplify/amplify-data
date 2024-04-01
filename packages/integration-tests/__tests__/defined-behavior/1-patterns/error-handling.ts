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
  describe('error response with "empty" `data` result', () => {
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
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
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

      // #region docs code
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: todo, errors } = await client.models.Todo.get({
        id: 'some-id',
      });
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
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
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
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
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
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

      // #region docs code
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: todos, errors } = await client.models.Todo.list({
        id: 'some_id',
      });
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(errors).toBeDefined();
      expect(todos).toEqual({});
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
          data: sampleTodo,
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
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(errors).toBeDefined();
      expect(getTodo).toEqual(sampleTodo);
      // #endregion assertions
    });
    test('list an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: [sampleTodo],
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
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(errors).toBeDefined();
      expect(data).toEqual([sampleTodo]);
      // #endregion assertions
    });
  });
});
