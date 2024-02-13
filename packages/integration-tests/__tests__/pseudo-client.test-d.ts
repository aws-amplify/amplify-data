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

type FilteredKeys<T> = {
  [P in keyof T]: T[P] extends never ? never : P;
}[keyof T];

type ExcludeNeverFields<O> = {
  [K in FilteredKeys<O>]: O[K];
};

type PartialClient<T extends Record<any, any> = never> = ExcludeNeverFields<{
  models: ModelTypes<T>;
  queries: CustomQueries<T>;
  mutations: CustomMutations<T>;
}>;

function generateClient<T extends Record<any, any>>() {
  return {} as PartialClient<T>;
}

describe('client', () => {
  test('query returning a primitive type', async () => {
    const schema = a.schema({
      echo: a
        .query()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.string().required())
        .function('echoFunction')
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.echo({
      inputContent: 'some content',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: string;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;
  });

  test('query returning a custom type', async () => {
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
    const client = generateClient<Schema>();

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

  test('query returning a model type', async () => {
    const schema = a.schema({
      DataModel: a.model({
        resultContent: a.string(),
      }),
      getDataModel: a
        .query()
        .arguments({
          modelId: a.string().required(),
        })
        .returns(a.ref('DataModel'))
        .function('echoFunction')
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.getDataModel({
      modelId: 'some-id',
    });

    type ResponseType = typeof response;

    type T = ResponseType['data'];

    type Expected = {
      data: Schema['DataModel'] | null;
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
    const client = generateClient<Schema>();

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
