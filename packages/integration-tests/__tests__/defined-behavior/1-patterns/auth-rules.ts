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
  test('Customize your auth rules', () => {
    // #region covers e2f15d81cee3ec1a, 21cf216d105e1ece
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

  test('Global authorization rule (only for getting started)', () => {
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

  test('Model-level authorization rules', () => {
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

  test('Field-level authorization rules', () => {
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

  test('Non-model authorization rules', () => {
    const schema = a.schema({
      // #region covers 5e987afe82e5a1ff, 9b0106fa74c7ae17, 3558bb1b245a4672, 17dfb540da28c8b0
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

  test('Non-model authorization rules - unsupported rules', () => {
    expect(() =>
      a.schema({
        // #region covers 5e987afe82e5a1ff
        CustomType: a.customType({
          value: a.string().required(),
        }),
        listCustomType: a
          .query()
          .returns(a.ref('CustomType').array())
          .handler(a.handler.function('placeholder'))
          .authorization((allow) => [
            // Dynamic auth rules - Not supported
            // (commented out in test because "not supported"!)

            // @ts-expect-error
            allow.owner(),

            // @ts-expect-error
            allow.ownerDefinedIn('owner'),

            // @ts-expect-error
            allow.ownersDefinedIn('otherOwners'),

            // @ts-expect-error
            allow.groupDefinedIn('group'),

            // @ts-expect-error
            allow.groupsDefinedIn('otherGroups'),
          ]),
      }),
    ).toThrow();
    // #endregion
  });

  test('Configure multiple authorization rules', async () => {
    // #region covers d51a9297b3d57373, 02802ed51338dc5f
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

describe('data/customize-authz/configure-custom-identity-and-group-claim', () => {
  test('configure custom identity and group claims', () => {
    // #region covers 97e7b3e58b77c840, 69256d377eecea21
    const schema = a.schema({
      Post: a
        .model({
          id: a.id(),
          owner: a.string(),
          postname: a.string(),
          content: a.string(),
        })
        .authorization((allow) => [
          allow.owner().identityClaim('user_id'),
          allow.groups(['Moderator']).withClaimIn('user_groups'),
        ]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Post',
      directive: [
        '@auth(rules: [',
        '{allow: owner, ownerField: "owner", identityClaim: "user_id"}, ',
        '{allow: groups, groups: ["Moderator"], groupClaim: "user_groups"}',
        '])',
      ].join(''),
    });
  });
});

describe('data/customize-authz/custom-data-access-patterns', () => {
  test('Custom data access using Lambda functions', () => {
    // #region covers 9cc76371f93ceb4b
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
        })
        // STEP 1
        // Indicate which models / fields should use a custom authorization rule
        .authorization((allow) => [allow.custom()]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: custom}])`,
    });
  });
});

describe('customize-authz/grant-lambda-function-access-to-api', () => {
  test('Grant Lambda function access to API and Data', () => {
    // #region covers 06faca1d4de6d812

    // "mock" of the result from `defineFunction`
    const functionWithDataAccess = {
      provides: 'something',
      getInstance() {},
    };

    const schema = a
      .schema({
        Todo: a
          .model({
            name: a.string(),
            description: a.string(),
          })
          .authorization((allow) => allow.owner()),
      })
      .authorization((allow) => [allow.resource(functionWithDataAccess)]);
    // #endregion

    // graphql schema has only the model auth rule directives
    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, ownerField: "owner"}])`,
    });

    // the desired function access is enumerate in the transformed metadata
    expect(schema.transform().functionSchemaAccess[0]).toEqual(
      expect.objectContaining({
        resourceProvider: expect.objectContaining({ provides: 'something' }),
        actions: ['query', 'mutate', 'listen'],
      }),
    );
  });

  test('Grant Lambda function access to API and Data, with explicit to()', () => {
    // #region covers a23fa5edeff73d65

    // "mock" of the result from `defineFunction`
    const functionWithDataAccess = {
      provides: 'something',
      getInstance() {},
    };

    const schema = a
      .schema({
        Todo: a
          .model({
            name: a.string(),
            description: a.string(),
          })
          .authorization((allow) => allow.owner()),
      })
      .authorization((allow) => [
        allow.resource(functionWithDataAccess).to(['query', 'listen']),
      ]);
    // #endregion

    // graphql schema has only the model auth rule directives
    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, ownerField: "owner"}])`,
    });

    // the desired function access is enumerate in the transformed metadata
    expect(schema.transform().functionSchemaAccess[0]).toEqual(
      expect.objectContaining({
        resourceProvider: expect.objectContaining({ provides: 'something' }),
        actions: ['query', 'listen'],
      }),
    );
  });
});

describe('customize-authz/multi-user-data-access', () => {
  test('Add multi-user authorization rule', () => {
    // #region covers c11708f5a31a500d
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          owners: a.string().array(),
        })
        .authorization((allow) => [allow.ownersDefinedIn('owners')]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, ownerField: "owners"}])`,
    });
  });

  test('Override to a list of owners', () => {
    // #region covers e980f738c085ac2f
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          authors: a.string().array(), // record owner information now stored in "authors" field
        })
        .authorization((allow) => [allow.ownersDefinedIn('authors')]),
    });

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, ownerField: "authors"}])`,
    });
    // #endregion
  });
});

describe('customize-authz/per-user-per-owner-data-access', () => {
  test('Add per-user/per-owner authorization rule - base schema', () => {
    // #region covers c235455cb03a5496
    // The "owner" of a Todo is allowed to create, read, update, and delete their own todos
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
        })
        .authorization((allow) => [allow.owner()]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, ownerField: "owner"}])`,
    });
  });

  test('Add per-user/per-owner authorization rule - with operation restrictions', () => {
    // #region covers 4d68a311e1ae39ec
    // The "owner" of a Todo record is only allowed to create, read, and update it.
    // The "owner" of a Todo record is denied to delete it.
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
        })
        .authorization((allow) => [
          allow.owner().to(['create', 'read', 'update']),
        ]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, operations: [create, read, update], ownerField: "owner"}])`,
    });
  });

  test('callout - restricting ownership reassignment', () => {
    // #region covers 82938d1493598d00
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          owner: a
            .string()
            .authorization((allow) => [allow.owner().to(['read', 'delete'])]),
        })
        .authorization((allow) => [allow.owner()]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, ownerField: "owner"}])`,
    });

    expectSchemaFieldDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      field: 'owner',
      directive: `@auth(rules: [{allow: owner, operations: [read, delete], ownerField: "owner"}])`,
    });
  });

  test('Customize the owner field', () => {
    // #region covers f726c21f04df30d2
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          author: a.string(), // record owner information now stored in "author" field
        })
        .authorization((allow) => [allow.ownerDefinedIn('author')]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: owner, ownerField: "author"}])`,
    });
  });
});

describe('ustomize-authz/signed-in-user-data-access', () => {
  test('Use identity pool for signed-in user authentication', () => {
    // #region covers b9b26cd28edf59b6
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
        })
        .authorization((allow) => [allow.authenticated('identityPool')]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Todo',
      directive: `@auth(rules: [{allow: private, provider: iam}])`,
    });
  });
});

describe('customize-authz/user-group-based-data-access', () => {
  test('Add authorization rules for dynamically set user groups', () => {
    // #region covers bf7dbedd18de6bb0
    // Dynamic group authorization with multiple groups
    const schema = a.schema({
      Post: a
        .model({
          title: a.string(),
          groups: a.string().array(),
        })
        .authorization((allow) => [allow.groupsDefinedIn('groups')]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Post',
      directive: `@auth(rules: [{allow: groups, groupsField: "groups"}])`,
    });
  });

  test('Add authorization rules for a single dynamically set user group', () => {
    // #region covers d1d464b81fe796a2
    // Dynamic group authorization with a single group
    const schema = a.schema({
      Post: a
        .model({
          title: a.string(),
          group: a.string(),
        })
        .authorization((allow) => [allow.groupDefinedIn('group')]),
    });
    // #endregion

    expectSchemaModelDirective({
      schema: schema.transform().schema,
      model: 'Post',
      directive: `@auth(rules: [{allow: groups, groupsField: "group"}])`,
    });
  });
});
