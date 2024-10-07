import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  parseGraphqlSchema,
  expectSchemaModelDirective,
  expectSchemaFieldDirective,
} from '../../utils';
import { print } from 'graphql';

describe('data/customize-authz', () => {
  test('Customize your auth rules', async () => {
    // #region covers e2f15d81cee3ec1a,
    const schema = a.schema({
      Post: a
        .model({
          content: a.string(),
        })
        .authorization((allow) => [
          // Allow anyone auth'd with an API key to read everyone's posts.
          allow.publicApiKey().to(['read']),
          // Allow signed-in user to create, read, update,
          // and delete their __OWN__ posts.
          allow.owner(),
        ]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Post',
      directive:
        '@auth(rules: [{allow: public, provider: apiKey, operations: [read]}, {allow: owner, ownerField: "owner"}])',
    });
  });

  test('Global authorization rule (only for getting started)', async () => {
    // #region covers 76ed8e59fffd0aac
    const schema = a
      .schema({
        // Because no model-level authorization rule is present
        // this model will use the global authorization rule.
        Todo: a.model({
          content: a.string(),
        }),

        // Will use model-level authorization rule
        Notes: a
          .model({
            content: a.string(),
            // [Model-level authorization rule]
          })
          .authorization((allow) => [allow.publicApiKey().to(['read'])]),

        // [Global authorization rule]
      })
      .authorization((allow) => [allow.publicApiKey()]);
    // #endregion

    // Todo gets the global auth rule
    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: '@auth(rules: [{allow: public, provider: apiKey}])',
    });

    // Notes has a model-level auth rule
    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Notes',
      directive:
        '@auth(rules: [{allow: public, provider: apiKey, operations: [read]}])',
    });
  });

  test('Model-level authorization rules', async () => {
    // #region covers 2194b55334d745ad
    const schema = a.schema({
      Post: a
        .model({
          content: a.string(),
          createdBy: a.string(),
          // [Model-level authorization rule]
          // All fields (content, createdBy) will be protected by
          // this authorization rule
        })
        .authorization((allow) => [
          allow.publicApiKey().to(['read']),
          allow.owner(),
        ]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Post',
      directive:
        '@auth(rules: [{allow: public, provider: apiKey, operations: [read]}, {allow: owner, ownerField: "owner"}])',
    });
  });

  test('Field-level authorization rules', async () => {
    // #region covers 714da914aa4034ef
    const schema = a.schema({
      Employee: a
        .model({
          name: a.string(),
          email: a.string(),
          // [Field-level authorization rule]
          // This auth rule will be used for the "ssn" field
          // All other fields will use the model-level auth rule
          ssn: a.string().authorization((allow) => [allow.owner()]),
        })

        // [Model-level authorization rule]
        .authorization((allow) => [
          allow.authenticated().to(['read']),
          allow.owner(),
        ]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Employee',
      directive:
        '@auth(rules: [{allow: private, operations: [read]}, {allow: owner, ownerField: "owner"}])',
    });

    expectSchemaFieldDirective({
      schema: schema.transform().schema,
      model: 'Employee',
      field: 'ssn',
      directive: '@auth(rules: [{allow: owner, ownerField: "owner"}])',
    });
  });

  test('Non-model authorization rules', async () => {
    const schema = a.schema({
      // #region covers 5e987afe82e5a1ff
      CustomType: a.customType({
        value: a.string().required(),
      }),
      listCustomType: a
        .query()
        .returns(a.ref('CustomType').array())
        .handler(
          a.handler.function('placeholder'),

          // TODO: docs page uses `.custom`, which doesn't appear to support
          // `.guest()` or `.authenticated()`. need to determine if this is still
          // the case -- and if so, correct the docs.
          // https://docs.amplify.aws/react/build-a-backend/data/customize-authz/#non-model-authorization-rules
          // a.handler.custom({
          //   entry: './handler.js',
          // }),
        )
        .authorization((allow) => [
          // Static auth rules - Supported
          allow.guest(),
          allow.publicApiKey(),
          allow.authenticated(),
          allow.group('Admin'),
          allow.groups(['Teacher', 'Student']),

          // Dynamic auth rules - Not supported
          // (commented out in test because "not supported"!)
          // allow.owner(),
          // allow.ownerDefinedIn('owner'),
          // allow.ownersDefinedIn('otherOwners'),
          // allow.groupDefinedIn('group'),
          // allow.groupsDefinedIn('otherGroups'),
        ]),
    });
    // #endregion

    expectSchemaFieldDirective({
      schema: schema.transform().schema,
      model: 'Query',
      field: 'listCustomType',
      directive: [
        '@auth(rules: [',
        '{allow: public, provider: iam}, ',
        '{allow: public, provider: apiKey}, ',
        '{allow: private}, ',
        '{allow: groups, groups: ["Admin"]}, ',
        '{allow: groups, groups: ["Teacher", "Student"]}',
        '])',
      ].join(''),
    });
  });

  test('Configure multiple authorization rules', async () => {
    // #region covers d51a9297b3d57373
    const schema = a.schema({
      Post: a
        .model({
          title: a.string(),
          content: a.string(),
        })
        .authorization((allow) => [allow.guest().to(['read']), allow.owner()]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Post',
      directive:
        '@auth(rules: [{allow: public, provider: iam, operations: [read]}, {allow: owner, ownerField: "owner"}])',
    });
  });
});
