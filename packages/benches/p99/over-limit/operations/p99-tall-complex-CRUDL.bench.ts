// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
// import { Amplify } from 'aws-amplify';
// import { generateClient } from 'aws-amplify/api';

bench('baseline', () => {}).types([0, 'instantiations']);

/**
 * The following benchmarks are an extension of `p50.bench.ts`.
 * Here we perform CRUDL operations for a single model.
 */
bench('99 complex models CRUDL', async () => {
  const schema = a
    .schema({
      GlobalPublicAuthModel1: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel1'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel1'),
      }),
      ModelLevelAuthModel1: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel1'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel1: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel1'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel2: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel2'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel2'),
      }),
      ModelLevelAuthModel2: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel2'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel2: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel2'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel3: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel3'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel3'),
      }),
      ModelLevelAuthModel3: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel3'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel3: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel3'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel4: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel4'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel4'),
      }),
      ModelLevelAuthModel4: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel4'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel4: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel4'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel5: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel5'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel5'),
      }),
      ModelLevelAuthModel5: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel5'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel5: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel5'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel6: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel6'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel6'),
      }),
      ModelLevelAuthModel6: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel6'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel6: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel6'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel7: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel7'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel7'),
      }),
      ModelLevelAuthModel7: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel7'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel7: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel7'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel8: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel8'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel8'),
      }),
      ModelLevelAuthModel8: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel8'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel8: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel8'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel9: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel9'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel9'),
      }),
      ModelLevelAuthModel9: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel9'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel9: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel9'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel10: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel10'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel10'),
      }),
      ModelLevelAuthModel10: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel10'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel10: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel10'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel11: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel11'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel11'),
      }),
      ModelLevelAuthModel11: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel11'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel11: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel11'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel12: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel12'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel12'),
      }),
      ModelLevelAuthModel12: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel12'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel12: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel12'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel13: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel13'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel13'),
      }),
      ModelLevelAuthModel13: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel13'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel13: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel13'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel14: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel14'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel14'),
      }),
      ModelLevelAuthModel14: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel14'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel14: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel14'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel15: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel15'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel15'),
      }),
      ModelLevelAuthModel15: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel15'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel15: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel15'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel16: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel16'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel16'),
      }),
      ModelLevelAuthModel16: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel16'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel16: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel16'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel17: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel17'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel17'),
      }),
      ModelLevelAuthModel17: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel17'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel17: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel17'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel18: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel18'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel18'),
      }),
      ModelLevelAuthModel18: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel18'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel18: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel18'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel19: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel19'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel19'),
      }),
      ModelLevelAuthModel19: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel19'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel19: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel19'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel20: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel20'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel20'),
      }),
      ModelLevelAuthModel20: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel20'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel20: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel20'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel21: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel21'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel21'),
      }),
      ModelLevelAuthModel21: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel21'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel21: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel21'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel22: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel22'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel22'),
      }),
      ModelLevelAuthModel22: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel22'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel22: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel22'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel23: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel23'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel23'),
      }),
      ModelLevelAuthModel23: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel23'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel23: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel23'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel24: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel24'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel24'),
      }),
      ModelLevelAuthModel24: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel24'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel24: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel24'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel25: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel25'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel25'),
      }),
      ModelLevelAuthModel25: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel25'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel25: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel25'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel26: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel26'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel26'),
      }),
      ModelLevelAuthModel26: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel26'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel26: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel26'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel27: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel27'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel27'),
      }),
      ModelLevelAuthModel27: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel27'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel27: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel27'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel28: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel28'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel28'),
      }),
      ModelLevelAuthModel28: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel28'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel28: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel28'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel29: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel29'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel29'),
      }),
      ModelLevelAuthModel29: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel29'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel29: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel29'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel30: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel30'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel30'),
      }),
      ModelLevelAuthModel30: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel30'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel30: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel30'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel31: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel31'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel31'),
      }),
      ModelLevelAuthModel31: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel31'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel31: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel31'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel32: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel32'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel32'),
      }),
      ModelLevelAuthModel32: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel32'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel32: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel32'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel33: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel33'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel33'),
      }),
      ModelLevelAuthModel33: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel33'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel33: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel33'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel34: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel34'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel34'),
      }),
      ModelLevelAuthModel34: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel34'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel34: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel34'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel35: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel35'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel35'),
      }),
      ModelLevelAuthModel35: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel35'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel35: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel35'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel36: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel36'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel36'),
      }),
      ModelLevelAuthModel36: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel36'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel36: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel36'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel37: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel37'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel37'),
      }),
      ModelLevelAuthModel37: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel37'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel37: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel37'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel38: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel38'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel38'),
      }),
      ModelLevelAuthModel38: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel38'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel38: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel38'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel39: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel39'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel39'),
      }),
      ModelLevelAuthModel39: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel39'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel39: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel39'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel40: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel40'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel40'),
      }),
      ModelLevelAuthModel40: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel40'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel40: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel40'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel41: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel41'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel41'),
      }),
      ModelLevelAuthModel41: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel41'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel41: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel41'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel42: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel42'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel42'),
      }),
      ModelLevelAuthModel42: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel42'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel42: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel42'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel43: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel43'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel43'),
      }),
      ModelLevelAuthModel43: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel43'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel43: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel43'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel44: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel44'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel44'),
      }),
      ModelLevelAuthModel44: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel44'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel44: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel44'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel45: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel45'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel45'),
      }),
      ModelLevelAuthModel45: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel45'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel45: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel45'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel46: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel46'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel46'),
      }),
      ModelLevelAuthModel46: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel46'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel46: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel46'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel47: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel47'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel47'),
      }),
      ModelLevelAuthModel47: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel47'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel47: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel47'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel48: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel48'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel48'),
      }),
      ModelLevelAuthModel48: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel48'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel48: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel48'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel49: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel49'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel49'),
      }),
      ModelLevelAuthModel49: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel49'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel49: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel49'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel50: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel50'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel50'),
      }),
      ModelLevelAuthModel50: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel50'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel50: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel50'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel51: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel51'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel51'),
      }),
      ModelLevelAuthModel51: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel51'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel51: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel51'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel52: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel52'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel52'),
      }),
      ModelLevelAuthModel52: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel52'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel52: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel52'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel53: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel53'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel53'),
      }),
      ModelLevelAuthModel53: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel53'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel53: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel53'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel54: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel54'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel54'),
      }),
      ModelLevelAuthModel54: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel54'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel54: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel54'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel55: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel55'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel55'),
      }),
      ModelLevelAuthModel55: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel55'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel55: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel55'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel56: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel56'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel56'),
      }),
      ModelLevelAuthModel56: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel56'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel56: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel56'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel57: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel57'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel57'),
      }),
      ModelLevelAuthModel57: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel57'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel57: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel57'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel58: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel58'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel58'),
      }),
      ModelLevelAuthModel58: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel58'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel58: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel58'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel59: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel59'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel59'),
      }),
      ModelLevelAuthModel59: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel59'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel59: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel59'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel60: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel60'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel60'),
      }),
      ModelLevelAuthModel60: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel60'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel60: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel60'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel61: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel61'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel61'),
      }),
      ModelLevelAuthModel61: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel61'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel61: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel61'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel62: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel62'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel62'),
      }),
      ModelLevelAuthModel62: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel62'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel62: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel62'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel63: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel63'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel63'),
      }),
      ModelLevelAuthModel63: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel63'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel63: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel63'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel64: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel64'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel64'),
      }),
      ModelLevelAuthModel64: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel64'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel64: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel64'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel65: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel65'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel65'),
      }),
      ModelLevelAuthModel65: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel65'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel65: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel65'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel66: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel66'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel66'),
      }),
      ModelLevelAuthModel66: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel66'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel66: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel66'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel67: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel67'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel67'),
      }),
      ModelLevelAuthModel67: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel67'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel67: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel67'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel68: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel68'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel68'),
      }),
      ModelLevelAuthModel68: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel68'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel68: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel68'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel69: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel69'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel69'),
      }),
      ModelLevelAuthModel69: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel69'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel69: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel69'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel70: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel70'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel70'),
      }),
      ModelLevelAuthModel70: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel70'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel70: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel70'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel71: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel71'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel71'),
      }),
      ModelLevelAuthModel71: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel71'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel71: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel71'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel72: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel72'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel72'),
      }),
      ModelLevelAuthModel72: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel72'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel72: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel72'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel73: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel73'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel73'),
      }),
      ModelLevelAuthModel73: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel73'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel73: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel73'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel74: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel74'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel74'),
      }),
      ModelLevelAuthModel74: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel74'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel74: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel74'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel75: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel75'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel75'),
      }),
      ModelLevelAuthModel75: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel75'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel75: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel75'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel76: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel76'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel76'),
      }),
      ModelLevelAuthModel76: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel76'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel76: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel76'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel77: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel77'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel77'),
      }),
      ModelLevelAuthModel77: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel77'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel77: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel77'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel78: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel78'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel78'),
      }),
      ModelLevelAuthModel78: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel78'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel78: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel78'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel79: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel79'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel79'),
      }),
      ModelLevelAuthModel79: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel79'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel79: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel79'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel80: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel80'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel80'),
      }),
      ModelLevelAuthModel80: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel80'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel80: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel80'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel81: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel81'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel81'),
      }),
      ModelLevelAuthModel81: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel81'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel81: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel81'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel82: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel82'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel82'),
      }),
      ModelLevelAuthModel82: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel82'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel82: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel82'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel83: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel83'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel83'),
      }),
      ModelLevelAuthModel83: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel83'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel83: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel83'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel84: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel84'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel84'),
      }),
      ModelLevelAuthModel84: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel84'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel84: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel84'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel85: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel85'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel85'),
      }),
      ModelLevelAuthModel85: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel85'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel85: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel85'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel86: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel86'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel86'),
      }),
      ModelLevelAuthModel86: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel86'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel86: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel86'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel87: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel87'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel87'),
      }),
      ModelLevelAuthModel87: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel87'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel87: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel87'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel88: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel88'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel88'),
      }),
      ModelLevelAuthModel88: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel88'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel88: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel88'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel89: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel89'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel89'),
      }),
      ModelLevelAuthModel89: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel89'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel89: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel89'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel90: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel90'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel90'),
      }),
      ModelLevelAuthModel90: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel90'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel90: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel90'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel91: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel91'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel91'),
      }),
      ModelLevelAuthModel91: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel91'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel91: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel91'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel92: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel92'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel92'),
      }),
      ModelLevelAuthModel92: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel92'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel92: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel92'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel93: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel93'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel93'),
      }),
      ModelLevelAuthModel93: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel93'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel93: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel93'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel94: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel94'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel94'),
      }),
      ModelLevelAuthModel94: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel94'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel94: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel94'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel95: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel95'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel95'),
      }),
      ModelLevelAuthModel95: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel95'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel95: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel95'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel96: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel96'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel96'),
      }),
      ModelLevelAuthModel96: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel96'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel96: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel96'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel97: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel97'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel97'),
      }),
      ModelLevelAuthModel97: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel97'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel97: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel97'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel98: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel98'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel98'),
      }),
      ModelLevelAuthModel98: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel98'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel98: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel98'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      GlobalPublicAuthModel99: a.model({
        field1: a.string(),
        relatedChild1: a.hasOne('ModelLevelAuthModel99'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel99'),
      }),
      ModelLevelAuthModel99: a
        .model({
          field1: a.string(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel99'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      FieldLevelAuthModel99: a
        .model({
          field1: a.string().authorization([a.allow.owner()]),
          relatedChildren: a.hasMany('GlobalPublicAuthModel99'),
        })
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      Todo: a
        .model({
          todoId: a.id().required(),
          name: a.string().required(),
          privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
          viewCount: a.integer(),
          complete: a.boolean(),
          employee: a.belongsTo('Employee'),
        })
        .identifier(['todoId', 'name']),
    })
    .authorization([a.allow.public()]);

  type _ = ClientSchema<typeof schema>;

  // TODO:
  // Amplify.configure({
  //   API: {
  //     GraphQL: {
  //       defaultAuthMode: 'userPools',
  //       endpoint: 'https://0.0.0.0/graphql',
  //       region: 'us-east-1',
  //     },
  //   },
  // });

  // // 8,950,148
  // const client = generateClient<Schema>();

  // const result = await client.models.Todo.create({
  //   todoId: '123',
  //   name: 'New Todo',
  // });

  // await client.models.Todo.get({ todoId: result.data.todoId });

  // await client.models.Todo.update({
  //   todoId: result.data.todoId,
  //   name: 'Updated Todo',
  // });

  // await client.models.Todo.delete({ todoId: result.data.todoId });

  // await client.models.Todo.list();
}).types([2935100, 'instantiations']);
