import { a, ClientSchema } from '@aws-amplify/data-schema';
import { ModelMeta } from 'aws-amplify/datastore';
import {
  ExtractNonModelTypes,
  ResolveSchema,
  CreateImplicitModelsFromRelations,
  ResolveFieldProperties,
  SchemaTypes,
  ModelIdentifier,
  ModelSecondaryIndexes,
  RelationalMetadata,
} from '@aws-amplify/data-schema/internals/perf-testing';
import { bench } from '@arktype/attest';

const schema = a.schema({
  EchoResult: a.customType({
    resultContent: a.string().required(),
  }),
  echo: a
    .query()
    .arguments({
      argumentContent: a.string().required(),
    })
    .returns(a.ref('EchoResult'))
    .function('echoFunction')
    .authorization([a.allow.public()]),
  echoString: a
    .query()
    .arguments({
      inputString: a.string().required(),
    })
    .returns(a.string())
    .function('echoStringFunction')
    .authorization([a.allow.public()]),
  PostLikeResult: a.customType({
    likes: a.integer().required(),
  }),
  likePost: a
    .mutation()
    .arguments({
      postId: a.id().required(),
    })
    .returns(a.ref('PostLikeResult'))
    .function('likePost')
    .authorization([a.allow.public()]),
  Post: a
    .model({
      id: a.id().required(),
      content: a.string(),
      comments: a.hasMany('Comment'),
    })
    .authorization([a.allow.public('apiKey'), a.allow.owner()]),
  Comment: a
    .model({
      id: a.id().required(),
      content: a.string().required(),
      post: a.belongsTo('Post'),
    })
    .authorization([a.allow.public('apiKey'), a.allow.owner()]),
  likePostReturnPost: a
    .mutation()
    .arguments({
      postId: a.id().required().array().required(),
    })
    .returns(a.ref('Post'))
    .function('likePostReturnPost')
    .authorization([a.allow.public()]),
});

type Schema = typeof schema;

/**
 * This is just the cost of the builder. All other benchmarks count instantiations
 * ON TOP OF this baseline.
 */
bench('baseline schema', () => {
  const schema = a.schema({
    EchoResult: a.customType({
      resultContent: a.string().required(),
    }),
    echo: a
      .query()
      .arguments({
        argumentContent: a.string().required(),
      })
      .returns(a.ref('EchoResult'))
      .function('echoFunction')
      .authorization([a.allow.public()]),
    echoString: a
      .query()
      .arguments({
        inputString: a.string().required(),
      })
      .returns(a.string())
      .function('echoStringFunction')
      .authorization([a.allow.public()]),
    PostLikeResult: a.customType({
      likes: a.integer().required(),
    }),
    likePost: a
      .mutation()
      .arguments({
        postId: a.id().required(),
      })
      .returns(a.ref('PostLikeResult'))
      .function('likePost')
      .authorization([a.allow.public()]),
    Post: a
      .model({
        id: a.id().required(),
        content: a.string(),
        comments: a.hasMany('Comment'),
      })
      .authorization([a.allow.public('apiKey'), a.allow.owner()]),
    Comment: a
      .model({
        id: a.id().required(),
        content: a.string().required(),
        post: a.belongsTo('Post'),
      })
      .authorization([a.allow.public('apiKey'), a.allow.owner()]),
    likePostReturnPost: a
      .mutation()
      .arguments({
        postId: a.id().required().array().required(),
      })
      .returns(a.ref('Post'))
      .function('likePostReturnPost')
      .authorization([a.allow.public()]),
  });

  type _Schema = typeof schema;
}).types([75455, 'instantiations']);

/**
 * Total cost of defining a schema and export the ClientSchema before anything else
 * touches or "processes" the schema in any way, such as the `generateClient()` type
 * maps or a customer drilling into the schema to find a Model or custom op type.
 *
 * This count should equal `baseline schema + ClientSchema` counts.
 */
bench('baseline schema + ClientSchema<>', () => {
  const schema = a.schema({
    EchoResult: a.customType({
      resultContent: a.string().required(),
    }),
    echo: a
      .query()
      .arguments({
        argumentContent: a.string().required(),
      })
      .returns(a.ref('EchoResult'))
      .function('echoFunction')
      .authorization([a.allow.public()]),
    echoString: a
      .query()
      .arguments({
        inputString: a.string().required(),
      })
      .returns(a.string())
      .function('echoStringFunction')
      .authorization([a.allow.public()]),
    PostLikeResult: a.customType({
      likes: a.integer().required(),
    }),
    likePost: a
      .mutation()
      .arguments({
        postId: a.id().required(),
      })
      .returns(a.ref('PostLikeResult'))
      .function('likePost')
      .authorization([a.allow.public()]),
    Post: a
      .model({
        id: a.id().required(),
        content: a.string(),
        comments: a.hasMany('Comment'),
      })
      .authorization([a.allow.public('apiKey'), a.allow.owner()]),
    Comment: a
      .model({
        id: a.id().required(),
        content: a.string().required(),
        post: a.belongsTo('Post'),
      })
      .authorization([a.allow.public('apiKey'), a.allow.owner()]),
    likePostReturnPost: a
      .mutation()
      .arguments({
        postId: a.id().required().array().required(),
      })
      .returns(a.ref('Post'))
      .function('likePostReturnPost')
      .authorization([a.allow.public()]),
  });

  type Schema = typeof schema;
  type _T = ClientSchema<Schema>;
}).types([133246, 'instantiations']);

/**
 * Individual contribution of `ClientSchema<>` for a "shallow pass".
 * As the customer "navigates" through the schema, TS will lazily perform more work.
 */
bench('ClientSchema', () => {
  type _T = ClientSchema<Schema>;
}).types([57791, 'instantiations']);

/**
 * Example showing the extra work that's done when we "hit" a model in the schema.
 *
 * The actual overhead of drilling into the sample model prop is `count(this) - count(ClientSchema)`.
 * In our example at the time of this writing, it's `6292`.
 */
bench('ClientSchema[<model>]', () => {
  type CS = ClientSchema<Schema>;
  type _T = CS['Comment'];
}).types([64083, 'instantiations']);

bench('ModelMeta<ClientSchema>', () => {
  type _T = ModelMeta<ClientSchema<Schema>>;
}).types([57811, 'instantiations']);

bench('ClientSchema -> ExtractNonModelTypes<Schema>', () => {
  type _T = ExtractNonModelTypes<Schema>;
}).types([16841, 'instantiations']);

bench('ClientSchema -> ResolveSchema<Schema>', () => {
  type _T = ResolveSchema<Schema>;
}).types([888, 'instantiations']);

bench('ClientSchema -> CreateImplicitModelsFromRelations<Schema>', () => {
  type _T = CreateImplicitModelsFromRelations<Schema>;
}).types([2221, 'instantiations']);

bench('ClientSchema -> * -> SchemaTypes<Schema>', () => {
  type _T = SchemaTypes<Schema>;
}).types([868, 'instantiations']);

/**
 * Actual count is `count(this) - count(CreateImplicitModelsFromRelations<Schema>)`
 */
bench('ClientSchema -> ImplicitModelsIdentifierMeta', () => {
  type ImplicitModels = CreateImplicitModelsFromRelations<Schema>;
  type _T = {
    [ImplicitModel in keyof ImplicitModels]: {
      identifier: 'id';
    };
  };
}).types([2242, 'instantiations']);

/**
 * Actual count is:
 *
 * ```
 * + count(this)
 * - count(CreateImplicitModelsFromRelations<Schema>)
 * - count(ExtractNonModelTypes<Schema>)
 * ```
 */
bench('ClientSchema -> ResolveFieldProperties<>', () => {
  type ImplicitModels = CreateImplicitModelsFromRelations<Schema>;
  type NonModelTypes = ExtractNonModelTypes<Schema>;
  type _T = ResolveFieldProperties<Schema, NonModelTypes, ImplicitModels>;
}).types([50219, 'instantiations']);

/**
 * Actual count is:
 *
 * ```
 * + count(this)
 * - count(SchemaTypes<Schema>)
 * ```
 */
bench('ClientSchema -> ModelIdentifier<Schema>', () => {
  type _T = ModelIdentifier<SchemaTypes<Schema>>;
}).types([871, 'instantiations']);

/**
 * Actual count is:
 *
 * ```
 * + count(this)
 * - count(SchemaTypes<Schema>)
 * ```
 */
bench('ClientSchema -> ModelSecondaryIndexes<Schema>', () => {
  type _T = ModelSecondaryIndexes<SchemaTypes<Schema>>;
}).types([871, 'instantiations']);

/**
 * Actual count should be ...
 *
 * ```
 * + count(this)
 * - count(ResolveSchema<Schema>)
 * - count(ExtractNonModelTypes<Schema>)
 * - count(CreateImplicitModelsFromRelations<Schema>)
 * - count(ResolveFieldProperties<...>)
 * - count(ModelIdentifier<...>)
 * ```
 *
 * But, we're getting a count GREATER THAN `ModelMeta<Schema>`, which is somewhat
 * unexpected. But, this is possibly because resolving `ClientSchema` and `ModelMeta<*>`
 * doesn't actually require relational metadata to be resolved.
 */
bench('ClientSchema -> __modelMeta__ -> RelationalMetadata<>', () => {
  type ResolvedSchema = ResolveSchema<Schema>;
  type NonModelTypes = ExtractNonModelTypes<Schema>;
  type ImplicitModels = CreateImplicitModelsFromRelations<Schema>;
  type ResolvedFields = ResolveFieldProperties<
    Schema,
    NonModelTypes,
    ImplicitModels
  >;
  type IdentifierMeta = ModelIdentifier<SchemaTypes<Schema>>;
  type _T = RelationalMetadata<ResolvedSchema, ResolvedFields, IdentifierMeta>;
}).types([79018, 'instantiations']);
