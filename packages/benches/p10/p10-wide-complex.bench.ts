import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('baseline', () => {}).types([0, 'instantiations']);

/**
 * The following benchmarks are for testing different permutations of
 * large production-level schemas ("p10").
 * Permutations include many models with fewer fields, fewer models with many
 * fields, and a mix of both.
 * "Complex" models contain connections, as well as global, model-level, and
 * field-level auth rules.
 * "Simple" models have no connections, and only global public auth rules.
 * (TODO) Each schema represented here has been evaluated to result in roughly
 * the same field and / or type count when it is generated as an AppSync GraphQL
 * Schema.
 */

// TODO: add more fields:
bench('3 complex models w/ 25 additional fields each', () => {
  a.schema({
    GlobalPublicAuthModel1: a.model({
      relatedChild1: a.hasOne('ModelLevelAuthModel1'),
      field1: a.string().required(),
      field2: a.string().required(),
      field3: a.string().required(),
      field4: a.string().required(),
      field5: a.string().required(),
      field6: a.string().required(),
      field7: a.string().required(),
      field8: a.string().required(),
      field9: a.string().required(),
      field10: a.string().required(),
      field11: a.string().required(),
      field12: a.string().required(),
      field13: a.string().required(),
      field14: a.string().required(),
      field15: a.string().required(),
      field16: a.string().required(),
      field17: a.string().required(),
      field18: a.string().required(),
      field19: a.string().required(),
      field20: a.string().required(),
      field21: a.string().required(),
      field22: a.string().required(),
      field23: a.string().required(),
      field24: a.string().required(),
      field25: a.string().required(),
    }),
    ModelLevelAuthModel1: a
      .model({
        relatedParent1: a.belongsTo('GlobalPublicAuthModel1'),
        field1: a.string().required(),
        field2: a.string().required(),
        field3: a.string().required(),
        field4: a.string().required(),
        field5: a.string().required(),
        field6: a.string().required(),
        field7: a.string().required(),
        field8: a.string().required(),
        field9: a.string().required(),
        field10: a.string().required(),
        field11: a.string().required(),
        field12: a.string().required(),
        field13: a.string().required(),
        field14: a.string().required(),
        field15: a.string().required(),
        field16: a.string().required(),
        field17: a.string().required(),
        field18: a.string().required(),
        field19: a.string().required(),
        field20: a.string().required(),
        field21: a.string().required(),
        field22: a.string().required(),
        field23: a.string().required(),
        field24: a.string().required(),
        field25: a.string().required(),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel1: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field2: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field3: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field4: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field5: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field6: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field7: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field8: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field9: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field10: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field11: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field12: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field13: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field14: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field15: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field16: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field17: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field18: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field19: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field20: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field21: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field22: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field23: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field24: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      field25: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel1'),
    }),
  }).authorization([a.allow.public()]);
}).types([8972, 'instantiations']);
