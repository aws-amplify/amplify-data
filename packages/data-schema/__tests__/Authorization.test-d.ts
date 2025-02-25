import { DefineFunction } from "@aws-amplify/data-schema-types";
import { a } from "../src";
import { AuthorizationCallback } from "../src/Authorization";

describe('AuthorizationCallback definition', () => {
  test('customOperation is compatible with all types except conversations', () => {
    const callback: AuthorizationCallback<'customOperation'> = (a) => {
      [
        a.authenticated(),
        a.custom('function'),
        a.group('test'),
        a.groups(['testGroup']),
        a.guest(),
        a.publicApiKey()
      ]
    };

    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
    // @ts-expect-error customOperation is incompatible with conversation
    const conversationAuth = a.schema({chat: a.conversation({aiModel: a.ai.model("Claude 3 Opus"), systemPrompt: ''}).authorization(callback)});
  });

  test('field is compatible with all types except custom operations and conversations', () => {
    // `model` is the default callback type as it is featurefull and compatable with the most
    //  This is the same as `AuthorizationCallback<'model'>`
    const callback: AuthorizationCallback<'field'> = (a) => [
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
      ];

    // @ts-expect-error field is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
    // @ts-expect-error field is incompatible with conversation
    const conversationAuth = a.schema({chat: a.conversation({aiModel: a.ai.model("Claude 3 Opus"), systemPrompt: ''}).authorization(callback)});
  });

  test('relationship is compatible with all types except custom operations, field, model and conversations', () => {
    const callback: AuthorizationCallback<'relationship'> = (a) => [
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
      ];

    // @ts-expect-error relationship is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    // @ts-expect-error relationship is incompatible with field
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    // @ts-expect-error relationship is incompatible with model
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
    // @ts-expect-error relationship is incompatible with conversation
    const conversationAuth = a.schema({chat: a.conversation({aiModel: a.ai.model("Claude 3 Opus"), systemPrompt: ''}).authorization(callback)});
  });

  test('model is compatible with all types except custom operations and conversations', () => {
    const callback: AuthorizationCallback = (a) => {
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
    };

    // @ts-expect-error model is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
    // @ts-expect-error model is incompatible with conversation
    const conversationAuth = a.schema({chat: a.conversation({aiModel: a.ai.model("Claude 3 Opus"), systemPrompt: ''}).authorization(callback)});
  });

  test('ref is compatible with all types except custom operations, field, model and conversations', () => {
    const callback: AuthorizationCallback<'ref'> = (a) => {
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
    };

    // @ts-expect-error ref is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    // @ts-expect-error ref is incompatible with field
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    // @ts-expect-error ref is incompatible with model
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
    // @ts-expect-error ref is incompatible with conversation
    const conversationAuth = a.schema({chat: a.conversation({aiModel: a.ai.model("Claude 3 Opus"), systemPrompt: ''}).authorization(callback)});
  });

  test('schema is compatible with all types except custom operations, field, model and conversations', () => {
    const callback: AuthorizationCallback<'schema'> = (a) => {
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
    };

    // @ts-expect-error schema is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    // @ts-expect-error schema is incompatible with field
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    // @ts-expect-error schema is incompatible with model
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
    // @ts-expect-error schema is incompatible with conversation
    const conversationAuth = a.schema({chat: a.conversation({aiModel: a.ai.model("Claude 3 Opus"), systemPrompt: ''}).authorization(callback)});
  });

  test('conversation is only compatible with conversations', () => {
    // The owner behavior used elsewhere include a provider override `provider?: OwnerProviders`
    // This is not supported by conversations and makes the types entirely incompatible with other owner authorization types
    const callback: AuthorizationCallback<'conversation'> = (a) => {
      [
        a.owner(),
      ]
    };

    // @ts-expect-error conversation is incompatible with custom operations
    const customOpAuth = a.schema({M: a.query().authorization(callback)});
    // @ts-expect-error conversation is incompatible with field
    const fieldAuth = a.schema({M: a.model({field: a.string().authorization(callback)})});
    // @ts-expect-error conversation is incompatible with relationship
    const relationshipAuth = a.schema({Y: a.model({}), M: a.model({ys: a.hasMany('Y', 'yid').authorization(callback)})});
    // @ts-expect-error conversation is incompatible with model
    const modelAuth = a.schema({M: a.model({}).authorization(callback)});
    // @ts-expect-error conversation is incompatible with ref
    const refAuth = a.schema({R: a.customType({t: a.string()}), M: a.model({field: a.ref('R').authorization(callback)})});
    // @ts-expect-error conversation is incompatible with schema
    const schemaAuth = a.schema({M: a.model({})}).authorization(callback);
    const conversationAuth = a.schema({chat: a.conversation({aiModel: a.ai.model("Claude 3 Opus"), systemPrompt: ''}).authorization(callback)});
  });
});
