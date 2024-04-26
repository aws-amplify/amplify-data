import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal, Prettify } from '@aws-amplify/data-schema-types';
import { generateClient } from 'aws-amplify/api';

describe('secondary indexes / index queries', () => {
  const schema = a.schema({
    Post: a
      .model({
        title: a.string().required(),
        description: a.string(),
        viewCount: a.integer(),
        updatedAt: a.string(),
      })
      .secondaryIndexes((index) => [
        index('title'),
        index('description')
          .queryField('myCustomIdx')
          .sortKeys(['updatedAt', 'viewCount']),
      ]),
  });

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  describe('PK only', async () => {
    test('Input type', () => {
      // Note: here and in the SK Input type tests I was running into issues
      // extracting the dynamic method params via the Parameters util type
      // and then asserting the resolved type.
      // Doing the following input type validation as an alternative:

      // Valid key input
      client.models.Post.listPostByTitle(
        {
          title: 'abc',
        },
        {
          sortDirection: 'ASC',
        },
      );

      // Wrong field type
      // @ts-expect-error
      client.models.Post.listByTitle({ title: 123 });

      // No PK field
      // @ts-expect-error
      client.models.Post.listByTitle({});

      // No PK field empty {}
      // @ts-expect-error
      client.models.Post.listByTitle();

      // Wrong PK field name
      // @ts-expect-error
      client.models.Post.listByTitle({ description: 'abc' });
    });

    test('Return type', async () => {
      const { data: posts } = await client.models.Post.listPostByTitle(
        {
          title: 'abc',
        },
        {
          sortDirection: 'ASC',
        },
      );

      type ResolvedReturnType = typeof posts;
      type ExpectedReturnType = {
        title: string;
        description?: string | null;
        readonly id: string;
        readonly createdAt: string;
        viewCount?: number | null;
        updatedAt?: string | null;
      }[];

      type test = Expect<Equal<ResolvedReturnType, ExpectedReturnType>>;
    });

    test('Custom selection set return type', async () => {
      const { data: posts } = await client.models.Post.listPostByTitle(
        {
          title: 'abc',
        },
        { selectionSet: ['id', 'updatedAt'], sortDirection: 'ASC' },
      );
      type ResolvedReturnType = typeof posts;
      type ExpectedReturnType = {
        readonly id: string;
        readonly updatedAt: string | null | undefined;
      }[];

      type test = Expect<Equal<ResolvedReturnType, ExpectedReturnType>>;
    });
  });

  describe('With SK', () => {
    test('Input type', () => {
      // Valid key input
      client.models.Post.myCustomIdx(
        {
          description: 'abc',
        },
        {
          sortDirection: 'ASC',
        },
      );

      // Valid key input 2
      client.models.Post.myCustomIdx(
        {
          description: 'abc',
          viewCount: { gt: 3 },
          updatedAt: { beginsWith: '123' },
        },
        {
          sortDirection: 'ASC',
        },
      );

      client.models.Post.myCustomIdx(
        {
          description: 'abc',
          viewCount: { gt: 3 },
          updatedAt: { beginsWith: '123' },
        },
        {
          // Wrong `sortDirection` value
          // @ts-expect-error
          sortDirection: 'NOPE',
        },
      );

      // Wrong field type
      // @ts-expect-error
      client.models.Post.myCustomIdx({ description: 123 });

      // No PK field
      // @ts-expect-error
      client.models.Post.myCustomIdx();

      // No PK field empty {}
      // @ts-expect-error
      client.models.Post.myCustomIdx({});

      // Wrong PK field name
      // @ts-expect-error
      client.models.Post.myCustomIdx({ title: 'abc' });

      // Wrong SK field name
      client.models.Post.myCustomIdx({
        description: 'abc',
        // @ts-expect-error
        nonexistent: { gt: 3 },
      });
    });

    test('Return type', async () => {
      const { data: posts } = await client.models.Post.myCustomIdx({
        description: 'post-description',
      });

      type ResolvedReturnType = typeof posts;
      type ExpectedReturnType = {
        title: string;
        description?: string | null;
        readonly id: string;
        readonly createdAt: string;
        viewCount?: number | null;
        updatedAt?: string | null;
      }[];

      type test = Expect<Equal<ResolvedReturnType, ExpectedReturnType>>;
    });

    test('Custom selection set return type', async () => {
      const { data: posts } = await client.models.Post.myCustomIdx(
        {
          description: 'abc',
        },
        { selectionSet: ['id', 'updatedAt'] },
      );

      type ResolvedReturnType = typeof posts;
      type ExpectedReturnType = {
        readonly id: string;
        readonly updatedAt: string | null | undefined;
      }[];

      type test = Expect<Equal<ResolvedReturnType, ExpectedReturnType>>;
    });
  });

  describe('use enum field as index field', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.enum(['open', 'in_progress', 'completed']),
          })
          .secondaryIndexes((index) => [
            index('status').sortKeys(['title']),
            index('title').sortKeys(['status']),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    test('generated query function has expected input type when using the enum field as the partition key', () => {
      // correct input param
      client.models.Todo.listTodoByStatusAndTitle({
        status: 'completed',
        title: { eq: 'test' },
      });

      // incorrect input param
      client.models.Todo.listTodoByStatusAndTitle({
        // @ts-expect-error the string value doesn't conform to the enum values
        status: 'value_not_in_enum',
        // @ts-expect-error the number doesn't conform to string
        title: { eq: 123 },
      });
    });

    test('generated query function has expected input type when using the enum field as the sort key', () => {
      // correct input param
      client.models.Todo.listTodoByTitleAndStatus({
        title: 'test',
        status: { eq: 'completed' },
      });

      // incorrect input param
      client.models.Todo.listTodoByTitleAndStatus({
        // @ts-expect-error the number doesn't conform to string
        title: 123,
        // @ts-expect-error the string value doesn't conform to the enum values
        status: { eq: 'value_not_in_enum' },
      });
    });
  });

  describe('use ref field (that refers to a enum type) as index field', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.ref('Status'),
          })
          .secondaryIndexes((index) => [
            index('status').sortKeys(['title']),
            index('title').sortKeys(['status']),
          ]),
        Status: a.enum(['open', 'in_progress', 'completed']),
      })
      .authorization((allow) => allow.publicApiKey());

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    test('generated query function has expected input type when using the enum field as the partition key', () => {
      // correct input param
      client.models.Todo.listTodoByStatusAndTitle({
        status: 'completed',
        title: { eq: 'test' },
      });

      // incorrect input param
      client.models.Todo.listTodoByStatusAndTitle({
        // @ts-expect-error the string value doesn't conform to the enum values
        status: 'value_not_in_enum',
        // @ts-expect-error the number doesn't conform to string
        title: { eq: 123 },
      });
    });

    test('generated query function has expected input type when using the enum field as the sort key', () => {
      // correct input param
      client.models.Todo.listTodoByTitleAndStatus({
        title: 'test',
        status: { eq: 'completed', beginsWith: 'com', notContains: 'test' },
      });

      // incorrect input param
      client.models.Todo.listTodoByTitleAndStatus({
        // @ts-expect-error the number doesn't conform to string
        title: 123,
        // @ts-expect-error the string value doesn't conform to the enum values
        status: { eq: 'value_not_in_enum' },
      });
    });
  });
});
