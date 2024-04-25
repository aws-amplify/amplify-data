import { a, ClientSchema } from '../../src/index';
import { ClientSchema as BaseClientSchema } from '../../src/ClientSchema';
import {
  ClientExtensions,
  GraphQLFormattedError,
} from '../../src/runtime/client';
import { Expect, Equal } from '@aws-amplify/data-schema-types';

describe('a', () => {
  test('b', async () => {
    const schema = a.schema({
      Model: a
        .model({
          field: a.string(),
          description: a.string(),
        })
        .authorization((allow) => [allow.publicApiKey()]),
    });
    type Schema = ClientSchema<typeof schema>;
    const client = {} as ClientExtensions<Schema>;
    // const result = await client.models.Model.create({});
    const result = await client.models.Model.list({
      selectionSet: ['createdAt', 'field', 'updatedAt', 'description'],
    });
    const d = result.data;
  });

  test('c', async () => {
    const schema = a.schema({
      Status: a.enum(['a', 'b', 'c']),
      LikeResult: a.customType({
        likes: a.integer().required(),
      }),
      likePost: a
        .mutation()
        .arguments({
          postId: a.string().required(),
        })
        .returns(a.ref('LikeResult'))
        .handler(a.handler.function('likePost'))
        .authorization((allow) => allow.publicApiKey()),

      likeAllPosts: a
        .mutation()
        .returns(a.ref('LikeResult').array())
        .handler(a.handler.function('likeAllPosts'))
        .authorization((allow) => allow.publicApiKey()),

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

    // type T = BaseClientSchema<typeof schema>;
    // type T1 = T['__modelMeta__']['enums']['Status'];

    type Schema = ClientSchema<typeof schema>;
    const client = {} as ClientExtensions<Schema>;

    type T = Schema['likeAllPosts']['returnType'];

    type T2 = Schema['Status']['type'];
    const values = client.enums.Status.values();
    //    ^?

    const response = await client.mutations.likePost({
      postId: 'some-id',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: {
        likes: number;
      } | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;

    // Tests custom mutation w/ no args
    const response2 = await client.mutations.likeAllPosts();

    type Response2Type = typeof response2;
    type Expected2 = {
      data:
        | ({
            likes: number;
          } | null)[]
        | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test2 = Expect<Equal<Response2Type, Expected2>>;
  });

  test('c', async () => {
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

    type T = BaseClientSchema<typeof schema>;

    type Schema = ClientSchema<typeof schema>;
    const client = {} as ClientExtensions<Schema>;

    type T0 = Schema['Post']['createArgs'];
    type T1 = Schema['Post']['indexedQueries'];

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
});
