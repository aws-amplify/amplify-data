import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import {
  type CustomQueries,
  type CustomMutations,
  type ModelTypes,
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

bench('custom op returning primitive types; schema only', () => {
  const _schema = a.schema({
    echo: a
      .query()
      .arguments({
        inputContent: a.string().required(),
      })
      .returns(a.string().required())
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
}).types([13553, 'instantiations']);

bench('custom op returning primitive types; schema + ClientSchema', () => {
  const schema = a.schema({
    echo: a
      .query()
      .arguments({
        inputContent: a.string().required(),
      })
      .returns(a.string().required())
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });

  type _Schema = ClientSchema<typeof schema>;
}).types([15427, 'instantiations']);

bench(
  'custom op returning primitive types; schema + ClientSchema + client types',
  () => {
    const schema = a.schema({
      echo: a
        .query()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.string().required())
        .handler(a.handler.function('echoFunction'))
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    const _client = generateClient<Schema>();
  },
).types([15704, 'instantiations']);

bench('custom op returning an enum; schema only', () => {
  const _schema = a.schema({
    Status: a.enum(['Active', 'Inactive', 'Unknown']),
    getStatus: a
      .query()
      .arguments({
        itemId: a.string().required(),
      })
      .returns(a.ref('Status').required())
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
}).types([13752, 'instantiations']);

bench('custom op returning an enum; schema + ClientSchema', () => {
  const schema = a.schema({
    Status: a.enum(['Active', 'Inactive', 'Unknown']),
    getStatus: a
      .query()
      .arguments({
        itemId: a.string().required(),
      })
      .returns(a.ref('Status').required())
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });

  type _Schema = ClientSchema<typeof schema>;
}).types([15625, 'instantiations']);

bench(
  'custom op returning an enum; schema + ClientSchema + client types',
  () => {
    const schema = a.schema({
      Status: a.enum(['Active', 'Inactive', 'Unknown']),
      getStatus: a
        .query()
        .arguments({
          itemId: a.string().required(),
        })
        .returns(a.ref('Status').required())
        .handler(a.handler.function('echoFunction'))
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    const _client = generateClient<Schema>();
  },
).types([15920, 'instantiations']);

bench('custom op returning custom type; schema only', () => {
  const _schema = a.schema({
    EchoResult: a.customType({
      resultContent: a.string(),
    }),
    echo: a
      .query()
      .arguments({
        inputContent: a.string().required(),
      })
      .returns(a.ref('EchoResult'))
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
}).types([13791, 'instantiations']);

bench('custom op returning custom type; schema + ClientSchema', () => {
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
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
  type _Schema = ClientSchema<typeof schema>;
}).types([15664, 'instantiations']);

bench(
  'custom op returning custom type; schema + ClientSchema + client types',
  () => {
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
        .handler(a.handler.function('echoFunction'))
        .authorization((allow) => allow.publicApiKey()),
    });
    type Schema = ClientSchema<typeof schema>;
    const _client = generateClient<Schema>();
  },
).types([15959, 'instantiations']);

bench('custom op returning model; schema only', () => {
  const _schema = a.schema({
    DataModel: a.model({
      resultContent: a.string(),
    }),
    getDataModel: a
      .query()
      .arguments({
        modelId: a.string().required(),
      })
      .returns(a.ref('DataModel'))
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
}).types([13869, 'instantiations']);

bench('custom op returning model; schema + ClientSchema', () => {
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
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
  type _Schema = ClientSchema<typeof schema>;
}).types([15742, 'instantiations']);

bench('custom op returning model; schema + ClientSchema + client types', () => {
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
      .handler(a.handler.function('echoFunction'))
      .authorization((allow) => allow.publicApiKey()),
  });
  type Schema = ClientSchema<typeof schema>;
  const _client = generateClient<Schema>();
}).types([16037, 'instantiations']);
