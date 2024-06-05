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
}).types([10454, 'instantiations']);

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
}).types([12328, 'instantiations']);

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
).types([12605, 'instantiations']);

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
}).types([10653, 'instantiations']);

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
}).types([12526, 'instantiations']);

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
).types([12821, 'instantiations']);

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
}).types([10692, 'instantiations']);

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
}).types([12565, 'instantiations']);

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
).types([12860, 'instantiations']);

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
}).types([10770, 'instantiations']);

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
}).types([12643, 'instantiations']);

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
}).types([12938, 'instantiations']);
