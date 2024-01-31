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
// TODO: add w/ client types

// Library error with 50 models: Maximum call stack size exceeded
// CloudFormation error with 25 models: [FAILED] from custom resource. Message returned: Rate exceeded
// Note: the CloudFormation error *could* be related to dumping the entire schema in at one time.
bench('100 simple models with 1 field each', () => {
  a.schema({
    Model1: a.model({
      field1: a.string(),
    }),
    Model2: a.model({
      field1: a.string(),
    }),
    Model3: a.model({
      field1: a.string(),
    }),
    Model4: a.model({
      field1: a.string(),
    }),
    Model5: a.model({
      field1: a.string(),
    }),
    Model6: a.model({
      field1: a.string(),
    }),
    Model7: a.model({
      field1: a.string(),
    }),
    Model8: a.model({
      field1: a.string(),
    }),
    Model9: a.model({
      field1: a.string(),
    }),
    Model10: a.model({
      field1: a.string(),
    }),
    Model11: a.model({
      field1: a.string(),
    }),
    Model12: a.model({
      field1: a.string(),
    }),
    Model13: a.model({
      field1: a.string(),
    }),
    Model14: a.model({
      field1: a.string(),
    }),
    Model15: a.model({
      field1: a.string(),
    }),
    Model16: a.model({
      field1: a.string(),
    }),
    Model17: a.model({
      field1: a.string(),
    }),
    Model18: a.model({
      field1: a.string(),
    }),
    Model19: a.model({
      field1: a.string(),
    }),
    Model20: a.model({
      field1: a.string(),
    }),
    Model21: a.model({
      field1: a.string(),
    }),
    Model22: a.model({
      field1: a.string(),
    }),
    Model23: a.model({
      field1: a.string(),
    }),
    Model24: a.model({
      field1: a.string(),
    }),
    Model25: a.model({
      field1: a.string(),
    }),
    Model26: a.model({
      field1: a.string(),
    }),
    Model27: a.model({
      field1: a.string(),
    }),
    Model28: a.model({
      field1: a.string(),
    }),
    Model29: a.model({
      field1: a.string(),
    }),
    Model30: a.model({
      field1: a.string(),
    }),
    Model31: a.model({
      field1: a.string(),
    }),
    Model32: a.model({
      field1: a.string(),
    }),
    Model33: a.model({
      field1: a.string(),
    }),
    Model34: a.model({
      field1: a.string(),
    }),
    Model35: a.model({
      field1: a.string(),
    }),
    Model36: a.model({
      field1: a.string(),
    }),
    Model37: a.model({
      field1: a.string(),
    }),
    Model38: a.model({
      field1: a.string(),
    }),
    Model39: a.model({
      field1: a.string(),
    }),
    Model40: a.model({
      field1: a.string(),
    }),
    Model41: a.model({
      field1: a.string(),
    }),
    Model42: a.model({
      field1: a.string(),
    }),
    Model43: a.model({
      field1: a.string(),
    }),
    Model44: a.model({
      field1: a.string(),
    }),
    Model45: a.model({
      field1: a.string(),
    }),
    Model46: a.model({
      field1: a.string(),
    }),
    Model47: a.model({
      field1: a.string(),
    }),
    Model48: a.model({
      field1: a.string(),
    }),
    Model49: a.model({
      field1: a.string(),
    }),
    Model50: a.model({
      field1: a.string(),
    }),
    Model51: a.model({
      field1: a.string(),
    }),
    Model52: a.model({
      field1: a.string(),
    }),
    Model53: a.model({
      field1: a.string(),
    }),
    Model54: a.model({
      field1: a.string(),
    }),
    Model55: a.model({
      field1: a.string(),
    }),
    Model56: a.model({
      field1: a.string(),
    }),
    Model57: a.model({
      field1: a.string(),
    }),
    Model58: a.model({
      field1: a.string(),
    }),
    Model59: a.model({
      field1: a.string(),
    }),
    Model60: a.model({
      field1: a.string(),
    }),
    Model61: a.model({
      field1: a.string(),
    }),
    Model62: a.model({
      field1: a.string(),
    }),
    Model63: a.model({
      field1: a.string(),
    }),
    Model64: a.model({
      field1: a.string(),
    }),
    Model65: a.model({
      field1: a.string(),
    }),
    Model66: a.model({
      field1: a.string(),
    }),
    Model67: a.model({
      field1: a.string(),
    }),
    Model68: a.model({
      field1: a.string(),
    }),
    Model69: a.model({
      field1: a.string(),
    }),
    Model70: a.model({
      field1: a.string(),
    }),
    Model71: a.model({
      field1: a.string(),
    }),
    Model72: a.model({
      field1: a.string(),
    }),
    Model73: a.model({
      field1: a.string(),
    }),
    Model74: a.model({
      field1: a.string(),
    }),
    Model75: a.model({
      field1: a.string(),
    }),
    Model76: a.model({
      field1: a.string(),
    }),
    Model77: a.model({
      field1: a.string(),
    }),
    Model78: a.model({
      field1: a.string(),
    }),
    Model79: a.model({
      field1: a.string(),
    }),
    Model80: a.model({
      field1: a.string(),
    }),
    Model81: a.model({
      field1: a.string(),
    }),
    Model82: a.model({
      field1: a.string(),
    }),
    Model83: a.model({
      field1: a.string(),
    }),
    Model84: a.model({
      field1: a.string(),
    }),
    Model85: a.model({
      field1: a.string(),
    }),
    Model86: a.model({
      field1: a.string(),
    }),
    Model87: a.model({
      field1: a.string(),
    }),
    Model88: a.model({
      field1: a.string(),
    }),
    Model89: a.model({
      field1: a.string(),
    }),
    Model90: a.model({
      field1: a.string(),
    }),
    Model91: a.model({
      field1: a.string(),
    }),
    Model92: a.model({
      field1: a.string(),
    }),
    Model93: a.model({
      field1: a.string(),
    }),
    Model94: a.model({
      field1: a.string(),
    }),
    Model95: a.model({
      field1: a.string(),
    }),
    Model96: a.model({
      field1: a.string(),
    }),
    Model97: a.model({
      field1: a.string(),
    }),
    Model98: a.model({
      field1: a.string(),
    }),
    Model99: a.model({
      field1: a.string(),
    }),
    Model100: a.model({
      field1: a.string(),
    }),
  }).authorization([a.allow.public()]);
}).types([63615, 'instantiations']);
