import { a, ClientSchema } from '@aws-amplify/data-schema';
import {
  type Expect,
  type Equal,
  type CustomQueries,
  type CustomMutations,
  type ModelTypes,
  type GraphQLFormattedError,
  __modelMeta__,
} from '@aws-amplify/data-schema-types';

//
// How an "ideal" client should behave.
//
// Not necessarily how the client from `generateClient()` should behave.
//

type FilteredKeys<T> = {
  [P in keyof T]: T[P] extends never ? never : P;
}[keyof T];

type ExcludeNeverFields<O> = {
  [K in FilteredKeys<O>]: O[K];
};

type TypedClient<T extends Record<any, any> = never> = ExcludeNeverFields<{
  models: ModelTypes<T>;
  queries: CustomQueries<T>;
  mutations: CustomMutations<T>;
}>;

describe('client', () => {
  test('query', async () => {
    const schema = a.schema({
      EchoResult: a.customType({
        resultContent: a.string(),
      }),
      echo: a
        .query()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.ref('EchoResult'))
        .function('echoFunction')
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = {} as TypedClient<Schema>;

    const response = await client.queries.echo({
      inputContent: 'some content',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: {
        resultContent: string | null;
      } | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;
  });

  test('mutation', async () => {
    const schema = a.schema({
      LikeResult: a.customType({
        likes: a.integer().required(),
      }),
      likePost: a
        .mutation()
        .arguments({
          postId: a.string().required(),
        })
        .returns(a.ref('LikeResult'))
        .function('likePost')
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = {} as TypedClient<Schema>;

    const response = await client.queries.likePost({
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
  });
});
