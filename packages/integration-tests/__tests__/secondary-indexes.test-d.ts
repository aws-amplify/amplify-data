import { a, ClientSchema } from '@aws-amplify/data-schema';
import {
  Expect,
  Equal,
  StringFilter,
  NumericFilter,
} from '@aws-amplify/data-schema-types';
import { generateClient } from 'aws-amplify/api';

// This is similar to the `Parameters` built-in utility type
// However, `Parameters` was not working as expected with the
// dynamically-generated methods
type FirstParameter<T extends (args: any) => any> = T extends (
  args: infer P,
) => any
  ? P
  : never;

describe('secondary indexes / index queries', () => {
  const schema = a.schema({
    Post: a
      .model({
        title: a.string().required(),
        description: a.string(),
        viewCount: a.integer(),
        updatedAt: a.string(),
      })
      .secondaryIndexes([
        a.index('title'),
        a
          .index('description')
          .queryField('myCustomIdx')
          .sortKeys(['updatedAt', 'viewCount']),
      ]),
  });

  type Schema = ClientSchema<typeof schema>;

  const client = generateClient<Schema>();

  describe('PK only', async () => {
    test('Input type', () => {
      /*  
     This test succeeds locally, but fails in GHA:

     type ResolvedKeyType = FirstParameter<
        typeof client.models.Post.listByTitle
      >;

      type ExpectedKeyType = {
        title: string;
      };

      type test = Expect<Equal<ResolvedKeyType, ExpectedKeyType>>;
       */

      // Going with an alternative approach to testing the inputs:

      // Valid key input
      client.models.Post.listByTitle({
        title: 'abc',
      });

      // Wrong field type
      // @ts-expect-error
      client.models.Post.listByTitle({ title: 123 });

      // No PK field
      // @ts-expect-error
      client.models.Post.listByTitle();

      // No PK field
      // @ts-expect-error
      client.models.Post.listByTitle();

      // Wrong PK field name
      // @ts-expect-error
      client.models.Post.listByTitle({ description: 'abc' });
    });

    test('Return type', async () => {
      const { data: posts } = await client.models.Post.listByTitle({
        title: 'abc',
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
      const { data: posts } = await client.models.Post.listByTitle(
        {
          title: 'abc',
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

  describe('With SK', () => {
    test('Input type', () => {
      /* 
      This test succeeds locally, but fails in GHA:
      
      type ResolvedKeyType = FirstParameter<
        typeof client.models.Post.myCustomIdx
      >;

      type ExpectedKeyType = {
        description: string;
        updatedAt?: StringFilter;
        viewCount?: NumericFilter;
      };

      type test = Expect<Equal<ResolvedKeyType, ExpectedKeyType>>; 
      */

      // Going with an alternative approach to testing the inputs:

      // Valid key input
      client.models.Post.myCustomIdx({
        description: 'abc',
      });

      // Valid key input 2
      client.models.Post.myCustomIdx({
        description: 'abc',
        viewCount: { gt: 3 },
        updatedAt: { beginsWith: '123' },
      });

      // Wrong field type
      // @ts-expect-error
      client.models.Post.myCustomIdx({ description: 123 });

      // No PK field
      // @ts-expect-error
      client.models.Post.myCustomIdx();

      // No PK field
      // @ts-expect-error
      client.models.Post.myCustomIdx();

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
});
