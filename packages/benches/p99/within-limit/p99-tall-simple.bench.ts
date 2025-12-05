import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

/**
 * This schema does not result in the `ERROR: Type instantiation is excessively
 * deep and possibly infinite` error, but is not large enough to meet our
 * prod-level metrics (goal is 12563 AppSync schema types - object and input
 * objects, excluding enum, interfaces and unions).
 * Result for this schema is `3488` AppSync schema types (`type` + `input`). See
 * corresponding test in `over-limit` folder for the test that matches our metrics.
 */
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
  }).authorization((allow) => allow.publicApiKey());
}).types([11142, 'instantiations']);

bench('100 simple models with 1 field each w/ client types', () => {
  const s = a
    .schema({
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
    })
    .authorization((allow) => allow.publicApiKey());

  type _ = ClientSchema<typeof s>;
}).types([13531, 'instantiations']);
