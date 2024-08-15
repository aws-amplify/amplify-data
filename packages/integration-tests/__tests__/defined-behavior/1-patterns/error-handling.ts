import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
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

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

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
        .authorization((allow) => allow.owner()),
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
      const client = generateClient<Schema>({ authMode: 'identityPool' });

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
      const client = generateClient<Schema>({ authMode: 'identityPool' });

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
      const client = generateClient<Schema>({ authMode: 'identityPool' });

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
      const client = generateClient<Schema>({ authMode: 'identityPool' });

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
      const client = generateClient<Schema>({ authMode: 'identityPool' });

      const { data: todos, errors } = await client.models.Todo.list();

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
        .authorization((allow) => allow.owner()),
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

      const { data: todos, errors } = await client.models.Todo.list();
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
          additionalInfo: a.hasOne('Note', 'todoId'),
        })
        .authorization((allow) => allow.publicApiKey()),
      Note: a
        .model({
          content: a.string(),
          todoId: a.id(),
          todo: a.belongsTo('Todo', 'todoId'),
        })
        .authorization((allow) => [
          allow.publicApiKey().to(['create']),
          allow.owner(),
        ]),
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
      expect(getTodo).toEqual(sampleTodo);
      // #endregion assertions
    });
    test('list an item', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: { listTodos: { items: [sampleTodo] } },
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
      expect(data).toEqual([sampleTodo]);
      // #endregion assertions
    });
  });
});

describe('Exceptions', () => {
  const schema = a.schema({
    Todo: a
      .model({
        content: a.string(),
        description: a.string(),
        done: a.boolean(),
        priority: a.enum(['low', 'medium', 'high']),
        notes: a.hasMany('Note', 'todoId'),
        assignee: a.hasOne('Person', 'todoId'),
      })
      .secondaryIndexes((index) => [index('priority').sortKeys(['content'])])
      .authorization((allow) => allow.owner()),
    Note: a
      .model({
        content: a.string(),
        todoId: a.id(),
        todo: a.belongsTo('Todo', 'todoId'),
      })
      .authorization((allow) => allow.owner()),
    Person: a
      .model({
        name: a.string(),
        todoId: a.id(),
        todo: a.belongsTo('Todo', 'todoId'),
      })
      .authorization((allow) => allow.owner()),
    completeTodo: a
      .mutation()
      .arguments({ todoId: a.string() })
      .returns(a.boolean()),
  });
  type Schema = ClientSchema<typeof schema>;

  describe('thrown from fetch()', () => {
    const ERROR_MESSAGE = 'Network Error';

    function mockFetchThrowsNetworkError(fetchSpy?: jest.SpyInstance) {
      (fetchSpy || jest.spyOn(global, 'fetch')).mockImplementation(
        async (...args: any) => {
          throw new Error(ERROR_MESSAGE);
        },
      );
    }

    beforeEach(() => {
      mockFetchThrowsNetworkError();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
      jest.resetModules();
    });

    const TodoModelCases = [
      ['list', {}, []],
      ['get', { id: 'some-id' }, null],
      ['update', { id: 'some-id', content: 'some content' }, null],
      ['delete', { id: 'some-id' }, null],
    ] as const;

    for (const [op, args, returns] of TodoModelCases) {
      test(`in Model.${op}() returns \`{ data: ${JSON.stringify(returns)}, errors: [<fetch error>] }\``, async () => {
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
        const client = generateClient<Schema>();

        // @ts-ignore
        const { data, errors } = await client.models.Todo[op](args);

        expect(data).toEqual(returns);
        expect(errors![0].message).toEqual(ERROR_MESSAGE);
      });
    }

    test('in custom op returns `{ data: null, errors: [<fetch error>] }`', async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data, errors } = await client.mutations.completeTodo({
        todoId: 'some-id',
      });

      expect(data).toEqual(null);
      expect(errors![0].message).toEqual(ERROR_MESSAGE);
    });

    test('in hasOne loader returns `{ data: null, errors: [<fetch error>] }`', async () => {
      // set up mocks to create an *instantiated* object we can lazy-load from.
      jest.clearAllMocks();
      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (...args: any) => {
          return new Response(
            JSON.stringify({
              data: {
                createTodo: {
                  id: 'some-id',
                },
              },
            }),
          );
        });

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: todo } = await client.models.Todo.create({});

      mockFetchThrowsNetworkError(fetchSpy);
      const { data, errors } = await todo!.assignee();

      expect(data).toEqual(null);
      expect(errors![0].message).toEqual(ERROR_MESSAGE);
    });

    test('in hasMany loader returns `{ data: [], errors: [<fetch error>] }`', async () => {
      // set up mocks to create an *instantiated* object we can lazy-load from.
      jest.clearAllMocks();
      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (...args: any) => {
          return new Response(
            JSON.stringify({
              data: {
                createTodo: {
                  id: 'some-id',
                },
              },
            }),
          );
        });

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: todo } = await client.models.Todo.create({});

      mockFetchThrowsNetworkError(fetchSpy);
      const { data, errors } = await todo!.notes();

      expect(data).toEqual([]);
      expect(errors![0].message).toEqual(ERROR_MESSAGE);
    });

    test('in belongsTo loader returns `{ data: null, errors: [<fetch error>] }`', async () => {
      // set up mocks to create an *instantiated* object we can lazy-load from.
      jest.clearAllMocks();
      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (...args: any) => {
          return new Response(
            JSON.stringify({
              data: {
                createNote: {
                  id: 'some-id',
                  todoId: 'some-id',
                },
              },
            }),
          );
        });

      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();

      const { data: note } = await client.models.Note.create({
        todoId: 'some-id',
      });

      mockFetchThrowsNetworkError(fetchSpy);
      const { data, errors } = await note!.todo();

      expect(data).toEqual(null);
      expect(errors![0].message).toEqual(ERROR_MESSAGE);
    });

    // TODO: refer to Asana task to see which failure case ivaartem was specifically asking about.
  });

  describe('Explicit cancellation results in an AbortError', () => {
    function mockSleepingFetch(fetchSpy?: jest.SpyInstance) {
      (fetchSpy || jest.spyOn(global, 'fetch')).mockImplementation(
        (input, init) => {
          const abortSignal = init?.signal;
          return new Promise((_resolve, reject) => {
            if (abortSignal) {
              if (abortSignal.aborted) {
                reject(abortSignal.reason);
              } else {
                abortSignal.addEventListener('abort', (event) => {
                  reject(abortSignal.reason);
                });
              }
            }
          });
        },
      );
    }

    beforeEach(() => {
      mockSleepingFetch();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
      jest.resetModules();
    });

    async function pause(ms = 1) {
      return new Promise((unsleep) => setTimeout(unsleep, ms));
    }

    const TodoModelCases = [
      ['list', {}],
      ['get', { id: 'some-id' }],
      ['create', { id: 'some-id', content: 'some content' }],
      ['update', { id: 'some-id', content: 'some content' }],
      ['delete', { id: 'some-id' }],
    ] as const;

    for (const delay of [true, false]) {
      describe(`when cancel ${delay ? 'is delayed after' : 'immediately follows'}`, () => {
        test(`graphql()`, async () => {
          const config = await buildAmplifyConfig(schema);
          Amplify.configure(config);
          const client = generateClient<Schema>();

          const request = client.graphql({
            query: `query Q { getWhatever { a b c } }`,
          });
          if (delay) await pause();
          if (!(request instanceof Promise)) throw new Error();
          const isCanceled = client.cancel(request);

          expect(isCanceled).toBe(true);
          await expect(request).rejects.toThrow('AbortError');
        });

        for (const [op, args] of TodoModelCases) {
          test(`Model.${op}()`, async () => {
            const config = await buildAmplifyConfig(schema);
            Amplify.configure(config);
            const client = generateClient<Schema>();

            // TS just can't tell whether args matches the op in the loop.
            const request = client.models.Todo[op](args as any);
            if (delay) await pause();
            const isCanceled = client.cancel(request);

            expect(isCanceled).toBe(true);
            await expect(request).rejects.toThrow('AbortError');
          });
        }

        test(`a custom operation`, async () => {
          const config = await buildAmplifyConfig(schema);
          Amplify.configure(config);
          const client = generateClient<Schema>();

          const request = client.mutations.completeTodo({ todoId: '123' });
          if (delay) await pause();
          const isCanceled = client.cancel(request);

          expect(isCanceled).toBe(true);
          await expect(request).rejects.toThrow('AbortError');
        });

        test(`an index query`, async () => {
          const config = await buildAmplifyConfig(schema);
          Amplify.configure(config);
          const client = generateClient<Schema>();

          const request = client.models.Todo.listTodoByPriorityAndContent({
            priority: 'high',
          });
          if (delay) await pause();
          const isCanceled = client.cancel(request);

          expect(isCanceled).toBe(true);
          await expect(request).rejects.toThrow('AbortError');
        });

        test(`a belongsTo lazy loader`, async () => {
          // set up mocks to create an *instantiated* object we can lazy-load from.
          jest.clearAllMocks();
          const fetchSpy = jest
            .spyOn(global, 'fetch')
            .mockImplementation(async (...args: any) => {
              return new Response(
                JSON.stringify({
                  data: {
                    createNote: {
                      id: 'some-id',
                      todoId: 'some-id',
                    },
                  },
                }),
              );
            });

          const config = await buildAmplifyConfig(schema);
          Amplify.configure(config);
          const client = generateClient<Schema>();

          const { data: note } = await client.models.Note.create({
            todoId: 'some-id',
          });

          mockSleepingFetch(fetchSpy);
          const request = note!.todo();
          if (delay) await pause();
          const isCanceled = client.cancel(request);

          expect(isCanceled).toEqual(true);
          await expect(request).rejects.toThrow('AbortError');
        });

        test(`a hasOne lazy loader`, async () => {
          // set up mocks to create an *instantiated* object we can lazy-load from.
          jest.clearAllMocks();
          const fetchSpy = jest
            .spyOn(global, 'fetch')
            .mockImplementation(async (...args: any) => {
              return new Response(
                JSON.stringify({
                  data: {
                    createTodo: {
                      id: 'some-id',
                    },
                  },
                }),
              );
            });

          const config = await buildAmplifyConfig(schema);
          Amplify.configure(config);
          const client = generateClient<Schema>();

          const { data: todo } = await client.models.Todo.create({});

          mockSleepingFetch(fetchSpy);
          const request = todo!.assignee();
          if (delay) await pause();
          const isCanceled = client.cancel(request);

          expect(isCanceled).toEqual(true);
          await expect(request).rejects.toThrow('AbortError');
        });

        test(`a hasMany lazy loader`, async () => {
          // set up mocks to create an *instantiated* object we can lazy-load from.
          jest.clearAllMocks();
          const fetchSpy = jest
            .spyOn(global, 'fetch')
            .mockImplementation(async (...args: any) => {
              return new Response(
                JSON.stringify({
                  data: {
                    createTodo: {
                      id: 'some-id',
                    },
                  },
                }),
              );
            });

          const config = await buildAmplifyConfig(schema);
          Amplify.configure(config);
          const client = generateClient<Schema>();

          const { data: todo } = await client.models.Todo.create({});

          mockSleepingFetch(fetchSpy);
          const request = todo!.notes();
          if (delay) await pause();
          const isCanceled = client.cancel(request);

          expect(isCanceled).toEqual(true);
          await expect(request).rejects.toThrow('AbortError');
        });
      });
    }
  });
});
