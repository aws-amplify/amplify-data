import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a, ClientSchema } from '../index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('schema generation', () => {
  test('with relationships', () => {
    const schema = a.schema({
      BoringParent: a.model({
        childNormal: a.hasOne('BoringChild'),
        childReciprocal: a.hasOne('BoringReciprocalChild'),
        childHasManyNormal: a.hasMany('BoringHasManyChild'),
        childHasManyReciprocal: a.hasMany('ReciprocalHasManyChild'),
      }),
      BoringChild: a.model({
        value: a.string(),
      }),
      BoringReciprocalChild: a.model({
        parent: a.belongsTo('BoringParent'),
        value: a.string(),
      }),
      BoringHasManyChild: a.model({
        value: a.string(),
      }),
      ReciprocalHasManyChild: a.model({
        value: a.string(),
        parent: a.belongsTo('BoringParent'),
      }),
      CPKParent: a
        .model({
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          childNormal: a.hasOne('CPKChild'),
          childReciprocal: a.hasOne('CPKReciprocalChild'),
          childHasManyNormal: a.hasMany('CPKHasManyChild'),
          childHasManyReciprocal: a.hasMany('CPKReciprocalHasManyChild'),
        })
        .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      CPKChild: a
        .model({
          CPKChildIdFieldA: a.id().required(),
          CPKChildIdFieldB: a.id().required(),
          value: a.string(),
        })
        .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
      CPKReciprocalChild: a
        .model({
          CPKReciprocalChildIdFieldA: a.id().required(),
          CPKReciprocalChildIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent'),
          value: a.string(),
        })
        .identifier([
          'CPKReciprocalChildIdFieldA',
          'CPKReciprocalChildIdFieldB',
        ]),
      CPKHasManyChild: a
        .model({
          CPKHasManyChildIdFieldA: a.id().required(),
          CPKHasManyChildIdFieldB: a.id().required(),
          value: a.string(),
        })
        .identifier(['CPKHasManyChildIdFieldA', 'CPKHasManyChildIdFieldB']),
      CPKReciprocalHasManyChild: a
        .model({
          CPKReciprocalHasManyChildIdFieldA: a.id().required(),
          CPKReciprocalHasManyChildIdFieldB: a.id().required(),
          value: a.string(),
          parent: a.belongsTo('CPKParent'),
        })
        .identifier([
          'CPKReciprocalHasManyChildIdFieldA',
          'CPKReciprocalHasManyChildIdFieldB',
        ]),
    });
    expect(schema.transform().schema).toMatchSnapshot();
  });
});

describe('schema auth rules', () => {
  test('global public auth', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
        B: a.model({
          field: a.json(),
        }),
        C: a.model({
          d: a.hasOne('D'),
        }),
        D: a.model({
          can: a.integer(),
          you: a.boolean(),
          tell: a.float(),
          i: a.date(),
          am: a.ipAddress(),
          getting: a.url(),
          tired: a.enum(['?']),
        }),
      })
      .authorization([a.allow.public()]);
    expect(schema.transform()).toMatchSnapshot();
  });

  test('can define public auth with no provider', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization([a.allow.public()]),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });
});
