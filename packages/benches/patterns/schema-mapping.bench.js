"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_schema_1 = require("@aws-amplify/data-schema");
var attest_1 = require("@arktype/attest");
var schema = data_schema_1.a.schema({
    EchoResult: data_schema_1.a.customType({
        resultContent: data_schema_1.a.string().required(),
    }),
    echo: data_schema_1.a
        .query()
        .arguments({
        argumentContent: data_schema_1.a.string().required(),
    })
        .returns(data_schema_1.a.ref('EchoResult'))
        .function('echoFunction')
        .authorization([data_schema_1.a.allow.public()]),
    echoString: data_schema_1.a
        .query()
        .arguments({
        inputString: data_schema_1.a.string().required(),
    })
        .returns(data_schema_1.a.string())
        .function('echoStringFunction')
        .authorization([data_schema_1.a.allow.public()]),
    PostLikeResult: data_schema_1.a.customType({
        likes: data_schema_1.a.integer().required(),
    }),
    likePost: data_schema_1.a
        .mutation()
        .arguments({
        postId: data_schema_1.a.id().required(),
    })
        .returns(data_schema_1.a.ref('PostLikeResult'))
        .function('likePost')
        .authorization([data_schema_1.a.allow.public()]),
    Post: data_schema_1.a
        .model({
        id: data_schema_1.a.id().required(),
        content: data_schema_1.a.string(),
        comments: data_schema_1.a.hasMany('Comment'),
    })
        .authorization([data_schema_1.a.allow.public('apiKey'), data_schema_1.a.allow.owner()]),
    Comment: data_schema_1.a
        .model({
        id: data_schema_1.a.id().required(),
        content: data_schema_1.a.string().required(),
        post: data_schema_1.a.belongsTo('Post'),
    })
        .authorization([data_schema_1.a.allow.public('apiKey'), data_schema_1.a.allow.owner()]),
    likePostReturnPost: data_schema_1.a
        .mutation()
        .arguments({
        postId: data_schema_1.a.id().required().array().required(),
    })
        .returns(data_schema_1.a.ref('Post'))
        .function('likePostReturnPost')
        .authorization([data_schema_1.a.allow.public()]),
});
(0, attest_1.bench)('ClientSchema', function () {
}).types([57791, 'instantiations']);
(0, attest_1.bench)('ModelMeta<ClientSchema>', function () {
}).types([57811, 'instantiations']);
(0, attest_1.bench)('ClientSchema -> ExtractNonModelTypes<Schema>', function () {
}).types([16841, 'instantiations']);
(0, attest_1.bench)('ClientSchema -> ResolveSchema<Schema>', function () {
}).types([888, 'instantiations']);
(0, attest_1.bench)('ClientSchema -> CreateImplicitModelsFromRelations<Schema>', function () {
}).types([2221, 'instantiations']);
(0, attest_1.bench)('ClientSchema -> * -> SchemaTypes<Schema>', function () {
}).types([868, 'instantiations']);
/**
 * Actual count is `count(this) - count(CreateImplicitModelsFromRelations<Schema>)`
 */
(0, attest_1.bench)('ClientSchema -> ImplicitModelsIdentifierMeta', function () {
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
(0, attest_1.bench)('ClientSchema -> ResolveFieldProperties<>', function () {
}).types([50219, 'instantiations']);
/**
 * Actual count is:
 *
 * ```
 * + count(this)
 * - count(SchemaTypes<Schema>)
 * ```
 */
(0, attest_1.bench)('ClientSchema -> ModelIdentifier<Schema>', function () {
}).types([871, 'instantiations']);
/**
 * Actual count is:
 *
 * ```
 * + count(this)
 * - count(SchemaTypes<Schema>)
 * ```
 */
(0, attest_1.bench)('ClientSchema -> ModelSecondaryIndexes<Schema>', function () {
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
(0, attest_1.bench)('ClientSchema -> __modelMeta__ -> RelationalMetadata<>', function () {
}).types([79018, 'instantiations']);
