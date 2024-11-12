import { DefineFunction } from "@aws-amplify/data-schema-types";
import { a } from "../src";

describe('.authorizationBuilder', () => {
  test('customOperation is compatible with all types', () => {
    const callback = a.authorizationBuilder<'customOperation'>((a) => {
      [
        a.authenticated(),
        a.custom('function'),
        a.group('test'),
        a.groups(['testGroup']),
        a.guest(),
        a.publicApiKey()
      ]
    });

    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
  });

  test('modelField is compatible with all types except custom operations', () => {
    const callback = a.authorizationBuilder<'modelField'>((a) => [
        a.authenticated(),
        a.custom('function'),
        a.group('test'),
        a.groupDefinedIn('group'),
        a.groups(['testGroup']),
        a.groupsDefinedIn('groups'),
        a.guest(),
        a.owner(),
        a.ownerDefinedIn('owner'),
        a.ownersDefinedIn('owners'),
        a.publicApiKey(),
      ]
    );

    // @ts-expect-error modelField is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
  });

  test('modelRelationship is compatible with all types except custom operations, field and model', () => {
    const callback = a.authorizationBuilder<'modelRelationship'>((a) => [
        a.authenticated(),
        a.custom('function'),
        a.group('test'),
        a.groupDefinedIn('group'),
        a.groups(['testGroup']),
        a.groupsDefinedIn('groups'),
        a.guest(),
        a.owner(),
        a.ownerDefinedIn('owner'),
        a.ownersDefinedIn('owners'),
        a.publicApiKey(),
        a.resource({} as DefineFunction),
      ]
    );

    // @ts-expect-error modelRelationship is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    // @ts-expect-error modelRelationship is incompatible with field
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    // @ts-expect-error modelRelationship is incompatible with model
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
  });

  test('modelType is compatible with all types except custom operations', () => {
    const callback = a.authorizationBuilder<'modelType'>((a) => {
      [
        a.authenticated(),
        a.custom('function'),
        a.group('test'),
        a.groupDefinedIn('group'),
        a.groups(['testGroup']),
        a.groupsDefinedIn('groups'),
        a.guest(),
        a.owner(),
        a.ownerDefinedIn('owner'),
        a.ownersDefinedIn('owners'),
        a.publicApiKey(),
      ]
    });

    // @ts-expect-error modelType is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
  });

  test('ref is compatible with all types except custom operations, field and model', () => {
    const callback = a.authorizationBuilder<'ref'>((a) => {
      [
        a.authenticated(),
        a.custom('function'),
        a.group('test'),
        a.groupDefinedIn('group'),
        a.groups(['testGroup']),
        a.groupsDefinedIn('groups'),
        a.guest(),
        a.owner(),
        a.ownerDefinedIn('owner'),
        a.ownersDefinedIn('owners'),
        a.publicApiKey(),
        a.resource({} as DefineFunction),
      ]
    });

    // @ts-expect-error ref is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    // @ts-expect-error ref is incompatible with field
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    // @ts-expect-error ref is incompatible with model
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
  });

  test('schema is compatible with all types except custom operations, field and model', () => {
    const callback = a.authorizationBuilder<'schema'>((a) => {
      [
        a.authenticated(),
        a.custom('function'),
        a.group('test'),
        a.groupDefinedIn('group'),
        a.groups(['testGroup']),
        a.groupsDefinedIn('groups'),
        a.guest(),
        a.owner(),
        a.ownerDefinedIn('owner'),
        a.ownersDefinedIn('owners'),
        a.publicApiKey(),
        a.resource({} as DefineFunction),
      ]
    });

    // @ts-expect-error schema is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    // @ts-expect-error schema is incompatible with field
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    // @ts-expect-error schema is incompatible with model
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
  });
});