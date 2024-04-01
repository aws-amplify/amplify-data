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

describe('todo', () => {
  describe('Error responses for create, update, and delete application data', () => {
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
        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {},
            errors: [
              {
                message: 'Unauthorized',
              },
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
        const { errors, data: newTodo } = await client.models.Todo.create({
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

      test('update an item', async () => {
        // #region mocking
        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {},
            errors: [
              {
                message: 'Unauthorized',
              },
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
              },
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
    });
    describe('error response with `data` result', () => {
      // data/resource.ts

      // Schema that allows public users create-only access to `Note`:
      const schema = a.schema({
        Todo: a
          .model({
            content: a.string(),
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

      test('update an item', async () => {
        // #region mocking
        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              updateTodo: sampleTodo,
            },
            errors: [
              {
                message: 'Not Authorized to access additionalInfo on type Todo',
              },
            ],
          },
        ]);

        // simulated amplifyconfiguration.json
        const config = await buildAmplifyConfig(schema);
        // #endregion mocking

        // App.tsx
        Amplify.configure(config);
        const client = generateClient<Schema>();
        const { data: updatedTodo, errors } = await client.models.Todo.update(
          {
            id: 'some_id',
            description: 'Updated description',
          },
          {
            selectionSet: ['id', 'content', 'additionalInfo.*'],
          },
        );

        // #region assertions
        expect(optionsAndHeaders(spy)).toMatchSnapshot();
        expect(errors).toBeDefined();
        expect(updatedTodo).toEqual(sampleTodo);
        // #endregion assertions
      });

      test('delete an item', async () => {
        // #region mocking
        const { spy, generateClient } = mockedGenerateClient([
          {
            data: sampleTodo,
            errors: [
              {
                message: 'Unauthorized',
              },
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
        const { data: deletedTodo, errors } = await client.models.Todo.delete(
          toBeDeletedTodo,
          {
            selectionSet: ['id', 'content', 'additionalInfo.*'],
          },
        );
        // #endregion docs code

        // #region assertions
        expect(optionsAndHeaders(spy)).toMatchSnapshot();
        expect(errors).toBeDefined();
        expect(deletedTodo).toEqual(sampleTodo);
        // #endregion assertions
      });
    });
  });
  describe('Error responses when reading application data', () => {
    // https://docs.amplify.aws/gen2/build-a-backend/data/query-data/

    const sampleTodo = {
      __typename: 'Todo',
      id: 'some-id',
      content: 'some content',
      description: 'something something',
      owner: 'some-body',
      priority: 2,
      done: false,
      updatedAt: '2024-03-01T19:05:44.536Z',
      createdAt: '2024-03-01T18:05:44.536Z',
    };

    // data/resource.ts
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          description: a.string(),
          done: a.boolean(),
          priority: a.integer(),
        })
        .authorization([a.allow.owner(), a.allow.public().to(['read'])]),
      Inventory: a
        .model({
          productId: a.id().required(),
          warehouseId: a.id().required(),
          description: a.string(),
        })
        .identifier(['productId', 'warehouseId'])
        .authorization([a.allow.owner(), a.allow.public().to(['read'])]),
    });
    type Schema = ClientSchema<typeof schema>;

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('List and get your data', async () => {
      // #region mocking
      const sampleInventory = {
        __typeName: 'Inventory',
        productId: 'abc',
        warehouseId: 'xyz',
        description: 'a widget',
        updatedAt: '2024-03-01T19:05:44.536Z',
        createdAt: '2024-03-01T18:05:44.536Z',
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listTodos: {
              items: [sampleTodo],
            },
          },
        },
        {
          data: {
            getInventory: sampleInventory,
          },
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      // App.tsx
      Amplify.configure(config);

      const client = generateClient<Schema>();

      // list all items
      const { data: todos, errors: listTodoErrors } =
        await client.models.Todo.list();

      // get a specific item
      const { data: inventory, errors: getInventoryErrors } =
        await client.models.Inventory.get({
          productId: '...',
          warehouseId: '...',
        });
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(listTodoErrors).toBeUndefined();
      expect(getInventoryErrors).toBeUndefined();
      expect(todos).toEqual([sampleTodo]);
      expect(inventory).toEqual(inventory);
      // #endregion assertions
    });

    test('Filter list queries', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listTodos: {
              items: [sampleTodo],
            },
          },
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
        filter: {
          content: {
            beginsWith: 'hello',
          },
        },
      });
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(errors).toBeUndefined();
      expect(todos).toEqual([sampleTodo]);
      // #endregion assertions
    });

    test('Compound filters', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listTodos: {
              items: [sampleTodo],
            },
          },
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
        filter: {
          or: [
            {
              // BUG!
              // @ts-ignore
              priority: { eq: 1 },
            },
            {
              // BUG!
              // @ts-ignore
              priority: { eq: 2 },
            },
          ],
        },
      });
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(errors).toBeUndefined();
      expect(todos).toEqual([sampleTodo]);
      // #endregion assertions
    });

    test('Paginate list queries', async () => {
      // #region mocking
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listTodos: {
              items: [sampleTodo],
              nextToken: 'some token',
            },
          },
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      // App.tsx
      Amplify.configure(config);

      const client = generateClient<Schema>();

      const {
        data: todos,
        nextToken, // Repeat this API call with the nextToken until the returned nextToken is `null`
        errors,
      } = await client.models.Todo.list({
        limit: 100, // default value is 100
        nextToken: 'eyJ2ZXJzaW9uejE1a2...', // previous nextToken
      });

      // front-end sample code skipped for unit test. we're not mocking full react DX for now.

      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(errors).toBeUndefined();
      expect(todos).toEqual([sampleTodo]);
      // #endregion assertions
    });

    test('Fetch only the data you need with custom selection set', async () => {
      // #region mocking
      // This example uses a more complicated schema to demonstrate CSS
      const schema = a
        .schema({
          Blog: a.model({
            author: a.hasOne('Author'),
            content: a.hasMany('Content'),
            publication: a.hasOne('Publication'),
          }),
          Content: a.model({
            title: a.string(),
            description: a.string(),
          }),
          Author: a.model({
            email: a.string(),
          }),
          Publication: a.model({
            company: a.hasOne('Company'),
          }),
          Company: a.model({
            name: a.string().required(),
            location: a.hasOne('Location'),
          }),
          Location: a.model({
            city: a.string(),
            state: a.string(),
          }),
        })
        .authorization([a.allow.public()]);
      type Schema = ClientSchema<typeof schema>;

      const blogWithSelectionSet = {
        __typeName: 'Blog',
        author: {
          email: 'someone@example.com',
        },
        publication: {
          company: {
            location: {
              city: 'wherever',
            },
          },
        },
        content: [
          {
            title: 'some title',
            description: 'some description',
            id: 'some-id',
            updatedAt: '2024-03-01T19:05:44.536Z',
            createdAt: '2024-03-01T18:05:44.536Z',
          },
        ],
      };

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            getBlog: blogWithSelectionSet,
          },
        },
      ]);

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region docs code
      Amplify.configure(config);

      const client = generateClient<Schema>();

      // same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
      const { data: blogWithSubsetOfData, errors } =
        await client.models.Blog.get(
          { id: '<MY_BLOG_ID>' },
          {
            selectionSet: [
              'author.email',
              'publication.company.location.city',
              'content.*',
            ],
          },
        );
      // #endregion docs code

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(errors).toBeUndefined();
      expect(blogWithSubsetOfData).toEqual(blogWithSelectionSet);
      // #endregion assertions
    });

    test('TypeScript type helpers for Amplify Data part 1', async () => {
      // #region mocking
      // This example uses a more complicated schema to demonstrate CSS
      const schema = a
        .schema({
          Post: a.model({
            content: a.string(),
            author: a.string(),
            comments: a.hasMany('Comment'),
          }),
          Comment: a.model({
            content: a.string(),
            author: a.string(),
          }),
        })
        .authorization([a.allow.public()]);
      type Schema = ClientSchema<typeof schema>;

      // #endregion mocking

      // #region docs code
      type Post = Schema['Post'];

      const [post, setPosts] = useState<Post[]>([]);
      // #endregion docs code

      // #region assertions
      // not shown in the docs snippet, but setPosts should be callable with a list of post
      const newPost: Post = {
        id: 'some-id',
        createdAt: '123',
        updatedAt: '455',

        // normally will be a lazy loader as returned a `.models` method
        comments: {} as any,
      };
      expect(() => setPosts([newPost])).not.toThrow();
      // #endregion assertions
    });

    test('TypeScript type helpers for Amplify Data part 2', async () => {
      // #region mocking
      // This example uses a more complicated schema to demonstrate CSS
      const schema = a
        .schema({
          Post: a.model({
            content: a.string(),
            author: a.string(),
            comments: a.hasMany('Comment'),
          }),
          Comment: a.model({
            content: a.string(),
            author: a.string(),
          }),
        })
        .authorization([a.allow.public()]);
      type Schema = ClientSchema<typeof schema>;

      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listPosts: [],
          },
        },
      ]);
      const client = generateClient<Schema>();
      // #endregion mocking

      // #region docs code
      const selectionSet = ['content', 'author', 'comments.*'] as const;
      type PostWithComments = SelectionSet<Schema['Post'], typeof selectionSet>;

      const [posts, setPosts] = useState<PostWithComments[]>([]);

      async function fetchPosts() {
        const { data: postsWithComments } = await client.models.Post.list({
          selectionSet,
        });
        setPosts(postsWithComments);
      }
      // #endregion docs code

      // #region assertions
      expect(fetchPosts).not.toThrow();
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      // #endregion assertions
    });

    // TODO: Cancel read requests
    // https://docs.amplify.aws/gen2/build-a-backend/data/query-data/#cancel-read-requests
  });
});
