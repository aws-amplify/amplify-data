import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

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
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel1', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel1', 'parentId'),
      }),
      ModelLevelAuthModel1: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel1', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel1: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel1', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel2: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel2', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel2', 'parentId'),
      }),
      ModelLevelAuthModel2: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel2', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel2: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel2', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel3: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel3', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel3', 'parentId'),
      }),
      ModelLevelAuthModel3: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel3', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel3: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel3', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel4: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel4', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel4', 'parentId'),
      }),
      ModelLevelAuthModel4: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel4', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel4: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel4', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel5: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel5', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel5', 'parentId'),
      }),
      ModelLevelAuthModel5: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel5', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel5: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel5', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel6: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel6', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel6', 'parentId'),
      }),
      ModelLevelAuthModel6: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel6', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel6: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel6', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel7: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel7', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel7', 'parentId'),
      }),
      ModelLevelAuthModel7: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel7', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel7: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel7', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel8: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel8', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel8', 'parentId'),
      }),
      ModelLevelAuthModel8: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel8', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel8: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel8', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel9: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel9', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel9', 'parentId'),
      }),
      ModelLevelAuthModel9: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel9', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel9: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel9', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel10: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel10', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel10', 'parentId'),
      }),
      ModelLevelAuthModel10: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel10', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel10: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel10', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel11: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel11', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel11', 'parentId'),
      }),
      ModelLevelAuthModel11: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel11', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel11: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel11', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel12: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel12', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel12', 'parentId'),
      }),
      ModelLevelAuthModel12: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel12', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel12: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel12', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel13: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel13', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel13', 'parentId'),
      }),
      ModelLevelAuthModel13: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel13', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel13: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel13', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel14: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel14', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel14', 'parentId'),
      }),
      ModelLevelAuthModel14: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel14', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel14: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel14', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel15: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel15', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel15', 'parentId'),
      }),
      ModelLevelAuthModel15: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel15', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel15: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel15', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel16: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel16', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel16', 'parentId'),
      }),
      ModelLevelAuthModel16: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel16', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel16: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel16', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel17: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel17', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel17', 'parentId'),
      }),
      ModelLevelAuthModel17: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel17', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel17: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel17', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel18: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel18', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel18', 'parentId'),
      }),
      ModelLevelAuthModel18: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel18', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel18: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel18', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel19: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel19', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel19', 'parentId'),
      }),
      ModelLevelAuthModel19: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel19', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel19: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel19', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel20: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel20', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel20', 'parentId'),
      }),
      ModelLevelAuthModel20: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel20', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel20: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel20', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel21: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel21', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel21', 'parentId'),
      }),
      ModelLevelAuthModel21: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel21', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel21: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel21', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel22: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel22', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel22', 'parentId'),
      }),
      ModelLevelAuthModel22: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel22', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel22: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel22', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel23: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel23', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel23', 'parentId'),
      }),
      ModelLevelAuthModel23: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel23', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel23: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel23', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel24: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel24', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel24', 'parentId'),
      }),
      ModelLevelAuthModel24: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel24', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel24: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel24', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel25: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel25', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel25', 'parentId'),
      }),
      ModelLevelAuthModel25: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel25', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel25: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel25', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel26: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel26', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel26', 'parentId'),
      }),
      ModelLevelAuthModel26: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel26', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel26: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel26', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel27: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel27', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel27', 'parentId'),
      }),
      ModelLevelAuthModel27: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel27', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel27: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel27', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel28: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel28', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel28', 'parentId'),
      }),
      ModelLevelAuthModel28: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel28', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel28: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel28', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel29: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel29', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel29', 'parentId'),
      }),
      ModelLevelAuthModel29: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel29', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel29: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel29', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel30: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel30', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel30', 'parentId'),
      }),
      ModelLevelAuthModel30: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel30', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel30: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel30', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel31: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel31', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel31', 'parentId'),
      }),
      ModelLevelAuthModel31: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel31', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel31: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel31', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel32: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel32', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel32', 'parentId'),
      }),
      ModelLevelAuthModel32: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel32', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel32: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel32', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel33: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel33', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel33', 'parentId'),
      }),
      ModelLevelAuthModel33: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel33', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel33: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel33', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel34: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel34', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel34', 'parentId'),
      }),
      ModelLevelAuthModel34: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel34', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel34: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel34', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel35: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel35', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel35', 'parentId'),
      }),
      ModelLevelAuthModel35: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel35', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel35: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel35', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel36: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel36', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel36', 'parentId'),
      }),
      ModelLevelAuthModel36: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel36', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel36: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel36', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel37: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel37', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel37', 'parentId'),
      }),
      ModelLevelAuthModel37: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel37', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel37: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel37', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel38: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel38', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel38', 'parentId'),
      }),
      ModelLevelAuthModel38: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel38', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel38: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel38', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel39: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel39', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel39', 'parentId'),
      }),
      ModelLevelAuthModel39: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel39', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel39: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel39', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel40: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel40', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel40', 'parentId'),
      }),
      ModelLevelAuthModel40: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel40', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel40: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel40', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel41: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel41', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel41', 'parentId'),
      }),
      ModelLevelAuthModel41: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel41', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel41: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel41', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel42: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel42', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel42', 'parentId'),
      }),
      ModelLevelAuthModel42: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel42', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel42: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel42', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel43: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel43', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel43', 'parentId'),
      }),
      ModelLevelAuthModel43: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel43', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel43: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel43', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel44: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel44', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel44', 'parentId'),
      }),
      ModelLevelAuthModel44: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel44', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel44: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel44', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel45: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel45', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel45', 'parentId'),
      }),
      ModelLevelAuthModel45: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel45', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel45: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel45', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel46: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel46', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel46', 'parentId'),
      }),
      ModelLevelAuthModel46: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel46', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel46: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel46', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel47: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel47', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel47', 'parentId'),
      }),
      ModelLevelAuthModel47: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel47', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel47: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel47', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel48: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel48', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel48', 'parentId'),
      }),
      ModelLevelAuthModel48: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel48', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel48: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel48', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel49: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel49', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel49', 'parentId'),
      }),
      ModelLevelAuthModel49: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel49', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel49: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel49', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel50: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel50', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel50', 'parentId'),
      }),
      ModelLevelAuthModel50: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel50', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel50: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel50', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel51: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel51', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel51', 'parentId'),
      }),
      ModelLevelAuthModel51: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel51', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel51: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel51', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel52: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel52', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel52', 'parentId'),
      }),
      ModelLevelAuthModel52: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel52', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel52: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel52', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel53: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel53', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel53', 'parentId'),
      }),
      ModelLevelAuthModel53: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel53', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel53: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel53', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel54: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel54', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel54', 'parentId'),
      }),
      ModelLevelAuthModel54: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel54', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel54: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel54', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel55: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel55', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel55', 'parentId'),
      }),
      ModelLevelAuthModel55: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel55', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel55: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel55', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel56: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel56', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel56', 'parentId'),
      }),
      ModelLevelAuthModel56: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel56', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel56: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel56', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel57: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel57', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel57', 'parentId'),
      }),
      ModelLevelAuthModel57: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel57', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel57: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel57', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel58: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel58', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel58', 'parentId'),
      }),
      ModelLevelAuthModel58: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel58', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel58: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel58', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel59: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel59', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel59', 'parentId'),
      }),
      ModelLevelAuthModel59: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel59', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel59: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel59', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel60: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel60', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel60', 'parentId'),
      }),
      ModelLevelAuthModel60: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel60', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel60: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel60', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel61: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel61', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel61', 'parentId'),
      }),
      ModelLevelAuthModel61: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel61', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel61: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel61', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel62: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel62', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel62', 'parentId'),
      }),
      ModelLevelAuthModel62: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel62', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel62: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel62', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel63: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel63', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel63', 'parentId'),
      }),
      ModelLevelAuthModel63: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel63', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel63: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel63', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel64: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel64', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel64', 'parentId'),
      }),
      ModelLevelAuthModel64: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel64', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel64: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel64', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel65: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel65', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel65', 'parentId'),
      }),
      ModelLevelAuthModel65: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel65', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel65: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel65', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel66: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel66', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel66', 'parentId'),
      }),
      ModelLevelAuthModel66: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel66', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel66: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel66', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel67: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel67', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel67', 'parentId'),
      }),
      ModelLevelAuthModel67: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel67', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel67: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel67', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel68: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel68', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel68', 'parentId'),
      }),
      ModelLevelAuthModel68: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel68', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel68: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel68', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel69: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel69', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel69', 'parentId'),
      }),
      ModelLevelAuthModel69: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel69', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel69: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel69', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel70: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel70', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel70', 'parentId'),
      }),
      ModelLevelAuthModel70: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel70', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel70: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel70', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel71: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel71', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel71', 'parentId'),
      }),
      ModelLevelAuthModel71: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel71', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel71: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel71', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel72: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel72', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel72', 'parentId'),
      }),
      ModelLevelAuthModel72: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel72', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel72: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel72', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel73: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel73', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel73', 'parentId'),
      }),
      ModelLevelAuthModel73: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel73', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel73: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel73', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel74: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel74', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel74', 'parentId'),
      }),
      ModelLevelAuthModel74: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel74', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel74: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel74', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel75: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel75', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel75', 'parentId'),
      }),
      ModelLevelAuthModel75: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel75', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel75: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel75', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel76: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel76', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel76', 'parentId'),
      }),
      ModelLevelAuthModel76: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel76', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel76: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel76', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel77: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel77', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel77', 'parentId'),
      }),
      ModelLevelAuthModel77: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel77', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel77: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel77', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel78: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel78', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel78', 'parentId'),
      }),
      ModelLevelAuthModel78: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel78', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel78: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel78', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel79: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel79', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel79', 'parentId'),
      }),
      ModelLevelAuthModel79: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel79', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel79: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel79', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel80: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel80', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel80', 'parentId'),
      }),
      ModelLevelAuthModel80: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel80', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel80: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel80', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel81: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel81', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel81', 'parentId'),
      }),
      ModelLevelAuthModel81: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel81', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel81: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel81', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel82: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel82', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel82', 'parentId'),
      }),
      ModelLevelAuthModel82: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel82', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel82: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel82', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel83: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel83', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel83', 'parentId'),
      }),
      ModelLevelAuthModel83: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel83', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel83: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel83', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel84: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel84', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel84', 'parentId'),
      }),
      ModelLevelAuthModel84: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel84', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel84: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel84', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel85: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel85', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel85', 'parentId'),
      }),
      ModelLevelAuthModel85: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel85', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel85: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel85', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel86: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel86', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel86', 'parentId'),
      }),
      ModelLevelAuthModel86: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel86', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel86: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel86', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel87: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel87', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel87', 'parentId'),
      }),
      ModelLevelAuthModel87: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel87', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel87: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel87', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel88: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel88', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel88', 'parentId'),
      }),
      ModelLevelAuthModel88: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel88', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel88: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel88', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel89: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel89', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel89', 'parentId'),
      }),
      ModelLevelAuthModel89: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel89', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel89: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel89', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel90: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel90', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel90', 'parentId'),
      }),
      ModelLevelAuthModel90: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel90', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel90: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel90', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel91: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel91', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel91', 'parentId'),
      }),
      ModelLevelAuthModel91: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel91', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel91: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel91', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel92: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel92', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel92', 'parentId'),
      }),
      ModelLevelAuthModel92: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel92', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel92: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel92', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel93: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel93', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel93', 'parentId'),
      }),
      ModelLevelAuthModel93: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel93', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel93: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel93', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel94: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel94', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel94', 'parentId'),
      }),
      ModelLevelAuthModel94: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel94', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel94: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel94', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel95: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel95', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel95', 'parentId'),
      }),
      ModelLevelAuthModel95: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel95', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel95: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel95', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel96: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel96', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel96', 'parentId'),
      }),
      ModelLevelAuthModel96: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel96', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel96: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel96', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel97: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel97', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel97', 'parentId'),
      }),
      ModelLevelAuthModel97: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel97', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel97: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel97', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel98: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel98', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel98', 'parentId'),
      }),
      ModelLevelAuthModel98: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel98', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel98: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel98', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),

      GlobalPublicAuthModel99: a.model({
        field1: a.string(),
        parentId: a.id().required(),
        relatedChild1: a.hasOne('ModelLevelAuthModel99', 'parentId'),
        relatedParent1: a.belongsTo('FieldLevelAuthModel99', 'parentId'),
      }),
      ModelLevelAuthModel99: a
        .model({
          field1: a.string(),
          parentId: a.id().required(),
          relatedParent1: a.belongsTo('GlobalPublicAuthModel99', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
      FieldLevelAuthModel99: a
        .model({
          field1: a.string().authorization((allow) => allow.owner()),
          relatedChildren: a.hasMany('GlobalPublicAuthModel99', 'parentId'),
        })
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof schema>;

  Amplify.configure({
    API: {
      GraphQL: {
        apiKey: 'apikey',
        defaultAuthMode: 'apiKey',
        endpoint: 'https://0.0.0.0/graphql',
        region: 'us-east-1',
      },
    },
  });

  const client = generateClient<Schema>();

  const result = await client.models.FieldLevelAuthModel1.create({
    field1: 'something',
  });

  await client.models.FieldLevelAuthModel1.get({ id: result.data!.id });

  await client.models.FieldLevelAuthModel1.update({
    id: result.data!.id,
    field1: 'something else',
  });

  await client.models.FieldLevelAuthModel1.delete({
    id: result.data!.id,
  });

  await client.models.FieldLevelAuthModel1.list();
}).types([772087, 'instantiations']);
