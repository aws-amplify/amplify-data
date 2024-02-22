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
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });
}).types([17419, 'instantiations']);

bench('custom op returning primitive types; schema + ClientSchema', () => {
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

  type _Schema = ClientSchema<typeof schema>;
}).types([56556, 'instantiations']);

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
        .function('echoFunction')
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const _client = generateClient<Schema>();
  },
).types([130540, 'instantiations']);

bench('custom op returning an enum; schema only', () => {
  const _schema = a.schema({
    Status: a.enum(['Active', 'Inactive', 'Unknown']),
    getStatus: a
      .query()
      .arguments({
        itemId: a.string().required(),
      })
      .returns(a.ref('Status').required())
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });
}).types([17560, 'instantiations']);

bench('custom op returning an enum; schema + ClientSchema', () => {
  const schema = a.schema({
    Status: a.enum(['Active', 'Inactive', 'Unknown']),
    getStatus: a
      .query()
      .arguments({
        itemId: a.string().required(),
      })
      .returns(a.ref('Status').required())
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });

  type _Schema = ClientSchema<typeof schema>;
}).types([57822, 'instantiations']);

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
        .function('echoFunction')
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const _client = generateClient<Schema>();
  },
).types([131862, 'instantiations']);

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
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });
}).types([18876, 'instantiations']);

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
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });
  type _Schema = ClientSchema<typeof schema>;
}).types([59193, 'instantiations']);

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
        .function('echoFunction')
        .authorization([a.allow.public()]),
    });
    type Schema = ClientSchema<typeof schema>;
    const _client = generateClient<Schema>();
  },
).types([133233, 'instantiations']);

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
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });
}).types([20043, 'instantiations']);

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
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });
  type _Schema = ClientSchema<typeof schema>;
}).types([69637, 'instantiations']);

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
      .function('echoFunction')
      .authorization([a.allow.public()]),
  });
  type Schema = ClientSchema<typeof schema>;
  const _client = generateClient<Schema>();
}).types([159990, 'instantiations']);
