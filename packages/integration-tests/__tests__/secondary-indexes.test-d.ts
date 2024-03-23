import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
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
      client.models.Post.listByTitle(
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
      const { data: posts } = await client.models.Post.listByTitle(
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
      const { data: posts } = await client.models.Post.listByTitle(
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
  test('index query w/ sort direction', async () => {
    const schema = a.schema({
      Customer: a
        .model({
          name: a.string(),
          phoneNumber: a.phone().required(),
          accountRepresentativeId: a.id().required(),
        })
        .secondaryIndexes((index) => [
          index('accountRepresentativeId').sortKeys(['name']),
        ]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    await client.models.Customer.create({
      name: 'John Doe',
      phoneNumber: '+1234567890',
      accountRepresentativeId: '1',
    });

    const response =
      await client.models.Customer.listByAccountRepresentativeIdAndName({
        accountRepresentativeId: '1',
        name: { eq: 'aa' },
      });

    type ResponseType = typeof response;

    type T = ResponseType['data'];

    type Expected = {
      data: {
        phoneNumber: string;
        accountRepresentativeId: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        name?: string | null | undefined;
      }[];
      nextToken?: string | null | undefined;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;
  });
});
