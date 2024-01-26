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
bench('25 simple models with 1 field each', () => {
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
  }).authorization([a.allow.public()]);
}).types([18015, 'instantiations']);

bench('25 complex models with one additional field each', () => {
  a.schema({
    GlobalPublicAuthModel1: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel1'),
    }),
    ModelLevelAuthModel1: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel1'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel1: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel1'),
    }),
    // using the previous three models, create 97 more models with numbers incrementing without using a loop:
    GlobalPublicAuthModel2: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel2'),
    }),
    ModelLevelAuthModel2: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel2'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel2: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel2'),
    }),
    GlobalPublicAuthModel3: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel3'),
    }),
    ModelLevelAuthModel3: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel3'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel3: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel3'),
    }),
    GlobalPublicAuthModel4: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel4'),
    }),
    ModelLevelAuthModel4: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel4'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel4: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel4'),
    }),
    GlobalPublicAuthModel5: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel5'),
    }),
    ModelLevelAuthModel5: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel5'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel5: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel5'),
    }),
    GlobalPublicAuthModel6: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel6'),
    }),
    ModelLevelAuthModel6: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel6'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel6: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel6'),
    }),
    GlobalPublicAuthModel7: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel7'),
    }),
    ModelLevelAuthModel7: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel7'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel7: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel7'),
    }),
    GlobalPublicAuthModel8: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel8'),
    }),
    ModelLevelAuthModel8: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel8'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel8: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel8'),
    }),
    GlobalPublicAuthModel9: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel9'),
    }),
    ModelLevelAuthModel9: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel9'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel9: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel9'),
    }),
    GlobalPublicAuthModel10: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel10'),
    }),
    ModelLevelAuthModel10: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel10'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel10: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel10'),
    }),
    GlobalPublicAuthModel11: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel11'),
    }),
    ModelLevelAuthModel11: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel11'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel11: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel11'),
    }),
    GlobalPublicAuthModel12: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel12'),
    }),
    ModelLevelAuthModel12: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel12'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel12: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel12'),
    }),
    GlobalPublicAuthModel13: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel13'),
    }),
    ModelLevelAuthModel13: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel13'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel13: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel13'),
    }),
    GlobalPublicAuthModel14: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel14'),
    }),
    ModelLevelAuthModel14: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel14'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel14: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel14'),
    }),
    GlobalPublicAuthModel15: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel15'),
    }),
    ModelLevelAuthModel15: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel15'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel15: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel15'),
    }),
    GlobalPublicAuthModel16: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel16'),
    }),
    ModelLevelAuthModel16: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel16'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel16: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel16'),
    }),
    GlobalPublicAuthModel17: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel17'),
    }),
    ModelLevelAuthModel17: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel17'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel17: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),

      relatedChildren: a.hasMany('GlobalPublicAuthModel17'),
    }),
    GlobalPublicAuthModel18: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel18'),
    }),
    ModelLevelAuthModel18: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel18'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel18: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel18'),
    }),
    GlobalPublicAuthModel19: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel19'),
    }),
    ModelLevelAuthModel19: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel19'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel19: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel19'),
    }),
    GlobalPublicAuthModel20: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel20'),
    }),
    ModelLevelAuthModel20: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel20'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel20: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel20'),
    }),
    GlobalPublicAuthModel21: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel21'),
    }),
    ModelLevelAuthModel21: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel21'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel21: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel21'),
    }),
    GlobalPublicAuthModel22: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel22'),
    }),
    ModelLevelAuthModel22: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel22'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel22: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel22'),
    }),
    GlobalPublicAuthModel23: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel23'),
    }),
    ModelLevelAuthModel23: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel23'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel23: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel23'),
    }),
    GlobalPublicAuthModel24: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel24'),
    }),
    ModelLevelAuthModel24: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel24'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel24: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel24'),
    }),
    GlobalPublicAuthModel25: a.model({
      field1: a.string().required(),
      relatedChild1: a.hasOne('ModelLevelAuthModel25'),
    }),
    ModelLevelAuthModel25: a
      .model({
        field1: a.string().required(),
        relatedParent1: a.belongsTo('GlobalPublicAuthModel25'),
      })
      .authorization([a.allow.private().to(['read']), a.allow.owner()]),
    FieldLevelAuthModel25: a.model({
      field1: a
        .string()
        .required()
        .authorization([a.allow.private().to(['read']), a.allow.owner()]),
      relatedChildren: a.hasMany('GlobalPublicAuthModel25'),
    }),
  }).authorization([a.allow.public()]);
}).types([87524, 'instantiations']);

bench('3 simple models w/ 50 fields each', () => {
  a.schema({
    Model1: a.model({
      field1: a.string(),
      field2: a.string(),
      field3: a.string(),
      field4: a.string(),
      field5: a.string(),
      field6: a.string(),
      field7: a.string(),
      field8: a.string(),
      field9: a.string(),
      field10: a.string(),
      field11: a.string(),
      field12: a.string(),
      field13: a.string(),
      field14: a.string(),
      field15: a.string(),
      field16: a.string(),
      field17: a.string(),
      field18: a.string(),
      field19: a.string(),
      field20: a.string(),
      field21: a.string(),
      field22: a.string(),
      field23: a.string(),
      field24: a.string(),
      field25: a.string(),
      field26: a.string(),
      field27: a.string(),
      field28: a.string(),
      field29: a.string(),
      field30: a.string(),
      field31: a.string(),
      field32: a.string(),
      field33: a.string(),
      field34: a.string(),
      field35: a.string(),
      field36: a.string(),
      field37: a.string(),
      field38: a.string(),
      field39: a.string(),
      field40: a.string(),
      field41: a.string(),
      field42: a.string(),
      field43: a.string(),
      field44: a.string(),
      field45: a.string(),
      field46: a.string(),
      field47: a.string(),
      field48: a.string(),
      field49: a.string(),
      field50: a.string(),
    }),
    Model2: a.model({
      field1: a.string(),
      field2: a.string(),
      field3: a.string(),
      field4: a.string(),
      field5: a.string(),
      field6: a.string(),
      field7: a.string(),
      field8: a.string(),
      field9: a.string(),
      field10: a.string(),
      field11: a.string(),
      field12: a.string(),
      field13: a.string(),
      field14: a.string(),
      field15: a.string(),
      field16: a.string(),
      field17: a.string(),
      field18: a.string(),
      field19: a.string(),
      field20: a.string(),
      field21: a.string(),
      field22: a.string(),
      field23: a.string(),
      field24: a.string(),
      field25: a.string(),
      field26: a.string(),
      field27: a.string(),
      field28: a.string(),
      field29: a.string(),
      field30: a.string(),
      field31: a.string(),
      field32: a.string(),
      field33: a.string(),
      field34: a.string(),
      field35: a.string(),
      field36: a.string(),
      field37: a.string(),
      field38: a.string(),
      field39: a.string(),
      field40: a.string(),
      field41: a.string(),
      field42: a.string(),
      field43: a.string(),
      field44: a.string(),
      field45: a.string(),
      field46: a.string(),
      field47: a.string(),
      field48: a.string(),
      field49: a.string(),
      field50: a.string(),
    }),
    Model3: a.model({
      field1: a.string(),
      field2: a.string(),
      field3: a.string(),
      field4: a.string(),
      field5: a.string(),
      field6: a.string(),
      field7: a.string(),
      field8: a.string(),
      field9: a.string(),
      field10: a.string(),
      field11: a.string(),
      field12: a.string(),
      field13: a.string(),
      field14: a.string(),
      field15: a.string(),
      field16: a.string(),
      field17: a.string(),
      field18: a.string(),
      field19: a.string(),
      field20: a.string(),
      field21: a.string(),
      field22: a.string(),
      field23: a.string(),
      field24: a.string(),
      field25: a.string(),
      field26: a.string(),
      field27: a.string(),
      field28: a.string(),
      field29: a.string(),
      field30: a.string(),
      field31: a.string(),
      field32: a.string(),
      field33: a.string(),
      field34: a.string(),
      field35: a.string(),
      field36: a.string(),
      field37: a.string(),
      field38: a.string(),
      field39: a.string(),
      field40: a.string(),
      field41: a.string(),
      field42: a.string(),
      field43: a.string(),
      field44: a.string(),
      field45: a.string(),
      field46: a.string(),
      field47: a.string(),
      field48: a.string(),
      field49: a.string(),
      field50: a.string(),
    }),
  }).authorization([a.allow.public()]);
}).types([4639, 'instantiations']);

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
