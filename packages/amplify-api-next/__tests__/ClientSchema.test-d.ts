import { a, ClientSchema } from '..';
import { Expect, Equal } from '@aws-amplify/data-schema-types';

describe('implied fields', () => {
  describe('boring model keys', () => {
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
    });

    type Schema = ClientSchema<typeof schema>;

    test('hasOne FK is implied', () => {
      type assert1 = Expect<
        Equal<
          Schema['BoringParent']['boringParentChildNormalId'],
          string | undefined
        >
      >;
      type assert2 = Expect<
        Equal<
          Schema['BoringParent']['boringParentChildReciprocalId'],
          string | undefined
        >
      >;
    });

    test('repriprocal belongsTo on hasOne implies FK', () => {
      type assert = Expect<
        Equal<
          Schema['BoringReciprocalChild']['boringReciprocalChildParentId'],
          string | undefined
        >
      >;
    });

    test('hasMany FK is implied on children', () => {
      type assert1 = Expect<
        Equal<
          Schema['BoringHasManyChild']['boringParentChildHasManyNormalId'],
          string | undefined
        >
      >;
      type assert2 = Expect<
        Equal<
          Schema['ReciprocalHasManyChild']['boringParentChildHasManyReciprocalId'],
          string | undefined
        >
      >;
    });
  });

  describe('CPK model keys', () => {
    const schema = a.schema({
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
    type Schema = ClientSchema<typeof schema>;

    test('hasOne FKs are implied', () => {
      type hasOneA = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildNormalCPKChildIdFieldA'],
          string | undefined
        >
      >;
      type hasOneB = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildNormalCPKChildIdFieldB'],
          string | undefined
        >
      >;
      type hasOneReciprocatedA = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildReciprocalCPKReciprocalChildIdFieldA'],
          string | undefined
        >
      >;
      type hasOneReciprocatedB = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildReciprocalCPKReciprocalChildIdFieldB'],
          string | undefined
        >
      >;
    });

    test('repriprocal belongsTo on hasOne implies FKs', () => {
      type belongsToA = Expect<
        Equal<
          Schema['CPKReciprocalChild']['cPKReciprocalChildParentCPKParentIdFieldA'],
          string | undefined
        >
      >;
      type belongsToB = Expect<
        Equal<
          Schema['CPKReciprocalChild']['cPKReciprocalChildParentCPKParentIdFieldB'],
          string | undefined
        >
      >;
    });

    test('hasMany FK is implied on children', () => {
      type hasManyA = Expect<
        Equal<
          Schema['CPKHasManyChild']['cPKParentChildHasManyNormalCPKParentIdFieldA'],
          string | undefined
        >
      >;
      type hasManyB = Expect<
        Equal<
          Schema['CPKHasManyChild']['cPKParentChildHasManyNormalCPKParentIdFieldB'],
          string | undefined
        >
      >;
      type hasManyReprocatedA = Expect<
        Equal<
          Schema['CPKReciprocalHasManyChild']['cPKParentChildHasManyReciprocalCPKParentIdFieldA'],
          string | undefined
        >
      >;
      type hasManyReprocatedB = Expect<
        Equal<
          Schema['CPKReciprocalHasManyChild']['cPKParentChildHasManyReciprocalCPKParentIdFieldB'],
          string | undefined
        >
      >;
    });
  });

  describe('schemas with owner/group auth models surface ownership fields', () => {
    const schema = a.schema({
      DefaultOwnerField: a
        .model({
          somefield: a.string(),
        })
        .authorization([a.allow.owner()]),
      CustomOwnerField: a
        .model({
          somefield: a.string(),
        })
        .authorization([a.allow.owner().inField('customOwnerField')]),
      GroupIn: a
        .model({
          somefield: a.string(),
        })
        .authorization([a.allow.groupDefinedIn('myGroupField')]),
      GroupsIn: a
        .model({
          somefield: a.string(),
        })
        .authorization([a.allow.groupsDefinedIn('myGroupsField')]),
    });
    type Schema = ClientSchema<typeof schema>;

    test('default owner', () => {
      type test = Expect<
        Equal<Schema['DefaultOwnerField']['owner'], string | undefined>
      >;
    });

    test('custom owner', () => {
      type test = Expect<
        Equal<
          Schema['CustomOwnerField']['customOwnerField'],
          string | undefined
        >
      >;
    });

    test('group', () => {
      type test = Expect<
        Equal<Schema['GroupIn']['myGroupField'], string | undefined>
      >;
    });

    test('groups', () => {
      type test = Expect<
        Equal<Schema['GroupsIn']['myGroupsField'], string[] | undefined>
      >;
    });
  });

  describe('implicit date fields are surfaced', () => {
    const schema = a.schema({
      // date field customization not yet supported, AFIAK.
      // so, just one model to confirm types on.
      SimpleModel: a.model({
        somefield: a.string(),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('default fields', () => {
      type testCreatedAt = Expect<
        Equal<Schema['SimpleModel']['createdAt'], string>
      >;
      type testUpdatedAt = Expect<
        Equal<Schema['SimpleModel']['updatedAt'], string>
      >;
    });
  });
});
