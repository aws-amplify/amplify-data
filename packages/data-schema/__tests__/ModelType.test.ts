import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a, ClientSchema } from '../src/index';
import { PrivateProviders, Operations, Operation } from '../src/Authorization';
import { configure } from '../src/ModelSchema';

describe('type definition tests', () => {
  // evaluates type defs in corresponding test-d.ts file
  it('should not produce static type errors', async () => {
    await expectTypeTestsToPassAsync(__filename);
  });
});

describe('malformed schema', () => {
  it('models expresses error when function provided instead of field', () => {
    const schema = a.schema({
      // @ts-expect-error
      widget: a.model,
    });
  });
  it('models expresses error when string provided instead of field', () => {
    const schema = a.schema({
      // @ts-expect-error
      widget: 'MyWidget!',
    });
  });
  it('models expresses error when function provided instead of field', () => {
    const schema = a.schema({
      widget: a.model({
        // @ts-expect-error
        title: a.string,
      }),
    });
  });
  it('models expresses error when string provided instead of field', () => {
    const schema = a.schema({
      widget: a.model({
        // @ts-expect-error
        title: 'test',
      }),
    });
  });
});

describe('implicit fields', () => {
  it("generates an `id` field when a custom identifier isn't defined", () => {
    const schema = a.schema({
      widget: a.model({
        title: a.string().required(),
      }),
    });
  });
});

describe('model auth rules', () => {
  it('can define public auth with no provider', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.publicApiKey()),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it('fails loudly on invalid provider', () => {
    expect(() => {
      a.schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          // @ts-expect-error
          .authorization((allow) => allow.public('bad-provider')),
      });
    }).toThrow();
  });

  it('can define private auth with no provider', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.authenticated()),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it('can define owner auth with no provider', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.owner()),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it('can define owner auth with owner field spec', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.ownerDefinedIn('title')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it('can define owner auth with owner field spec on a string-compatible field', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
          authorId: a.id(),
        })
        .authorization((allow) => allow.ownerDefinedIn('authorId')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it('can define multiple owner auth with owner field spec on a string-compatible array field', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
          authorId: a.id().array(),
        })
        .authorization((allow) => allow.ownersDefinedIn('authorId')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it('owner auth with owner field spec on a non-string field throws', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
          authorId: a.integer(),
        })
        .authorization((allow) => allow.ownerDefinedIn('authorId')),
    });

    expect(() => schema.transform().schema).toThrow();
  });

  it(`can specify operations `, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.publicApiKey().to(['create', 'read'])),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can specify an owner identityClaim`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.owner().identityClaim('user_id')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a "multiple owners" rule on an existing field`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
          authors: a.string().required().array().required(),
        })
        .authorization((allow) => allow.ownersDefinedIn('authors')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can merge group authorization to allow groups to be defined by multiple custom operations`, () => {
    const schema = a.schema({
      CustomType: a.customType({
        id: a.string().required(),
        name: a.string().required(),
      }),
      exampleAdminAndUserQuery: a
        .query()
        .arguments({
          arg1: a.string().required(),
        })
        .returns(a.ref("CustomType").required().array().required())
        .handler(a.handler.function('exampleFunc'))
        .authorization((allow) => [allow.groups(["Admin", "User"])]),
      exampleAdminOnlyQuery: a
        .query()
        .arguments({
          arg1: a.string().required(),
        })
        .returns(a.ref("CustomType").required().array().required())
        .handler(a.handler.function('exampleFunc'))
        .authorization((allow) => [allow.groups(["Admin"])]),
      ExampleModel: a.model({
        name: a.ref("CustomType").required().array().required().authorization((allow) => [allow.groups(["Admin3", "User3"])]),
        description: a.string().authorization((allow) => [allow.groups(["Admin3"])]),
      })
      .authorization((allow) => [allow.groups(["Admin2", "User2"])])
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can deduplicate authorization prevent errors from auth defined by multiple custom operations`, () => {
    const schema = a.schema({
      CustomType: a.customType({
        id: a.string().required(),
        name: a.string().required(),
      }),
      getSomething: a
        .query()
        .arguments({
          arg1: a.string().required(),
        })
        .returns(a.ref("CustomType").required().array().required())
        .handler(a.handler.function('exampleFunc'))
        .authorization((allow) => [
          allow.group("Admin"),
          allow.publicApiKey(),
          allow.authenticated(),
          allow.guest(),
          allow.authenticated('identityPool')
        ]),
      getSomething2: a
        .query()
        .arguments({
          arg1: a.string().required(),
        })
        .returns(a.ref("CustomType").required().array().required())
        .handler(a.handler.function('exampleFunc'))
        .authorization((allow) => [
          allow.groups(["Admin", 'User']),
          allow.publicApiKey(),
        ]),
      getSomething3: a
        .query()
        .arguments({
          arg1: a.string().required(),
        })
        .returns(a.ref("CustomType").required().array().required())
        .handler(a.handler.function('exampleFunc'))
        .authorization((allow) => [allow.groups(["Admin", "User"])])
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();

    expect(graphql).toEqual(
      expect.stringContaining(
        'type CustomType @aws_api_key @aws_cognito_user_pools @aws_iam @aws_cognito_user_pools(cognito_groups: ["Admin", "User"])',
      ),
    );
  });

  it(`can create a "multiple owners" rule on an implied (auto-created) field`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.ownersDefinedIn('authors')),
    });

    // what customers export
    type Schema = ClientSchema<typeof schema>;

    // If the types are correct, this field should exist
    type AuthorsType = Schema['widget']['type']['authors'];

    // I should NOT be able to assign a singular `string` to it
    // @ts-expect-error
    let authors: AuthorsType = 'string';

    // I SHOULD be able to assign a `string[]`;
    authors = ['username1', 'username2'];

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  // TODO: re-enable if/when we can sort out a more precise type for `ConflictingAuthRules` in `ModelType.ts`
  // it(`throws a fit of an implied (auto-created) field conflicts with an explicit field`, () => {
  //   const schema = a.schema({
  //     widget: a
  //       .model({
  //         title: a.string().required(),

  //         // pluralized `author` fields
  //         author: a.string().required().array().required(),
  //       })

  //       // authorization expects `author` to be singular `string`
  //       // @ts-expect-error
  //       .authorization((allow) => allow.ownerDefinedIn('author')]),
  //   });
  // });

  it(`can create a static Admins group rule`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.group('Admins')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a static [Admins, Moderators] groups rule`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.groups(['Admins', 'Moderators'])),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a dynamic singular groups rule`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.groupDefinedIn('businessUnitOwner')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a dynamic multi groups rule`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) =>
          allow.groupsDefinedIn('sharedWithGroups').to(['read']),
        ),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a dynamic singular groups rule with withClaimIn`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) =>
          allow
            .groupDefinedIn('businessUnitOwner')
            .withClaimIn('someClaimsField'),
        ),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a dynamic multi groups rule with withClaimIn`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) =>
          allow
            .groupsDefinedIn('sharedWithGroups')
            .to(['read'])
            .withClaimIn('someClaimsField'),
        ),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can chain off of inField rules`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) =>
          allow.ownerDefinedIn('customOwnerField').to(['create', 'read']),
        ),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can chain off of multi-owner inField rules`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) =>
          allow.ownersDefinedIn('customOwnerField').to(['create', 'read']),
        ),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`includes auth from fields`, () => {
    const schema = a.schema({
      widget: a
        .model({
          id: a.id().required(),
          title: a
            .string()
            .required()
            .authorization((allow) =>
              allow.ownerDefinedIn('customOwner').to(['create', 'read']),
            ),
        })
        .authorization((allow) => allow.owner()),
    });

    type Schema = ClientSchema<typeof schema>;
    type CustomOwnerType = Schema['widget']['type']['customOwner'];

    // single owner should be allowed
    let customOwner: CustomOwnerType = 'abc';

    // multiple owners should not
    // @ts-expect-error
    customOwner = ['multiple', 'owners'];

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`includes auth from related model fields`, () => {
    const schema = a
      .schema({
        factory: a
          .model({
            name: a.string(),
            widgets: a.hasMany('widget', ['factoryId']),
          })
          .authorization((allow) => [allow.publicApiKey()]),
        widget: a.model({
          id: a.id().required(),
          factoryId: a.id(),
          parent: a
            .belongsTo('factory', 'factoryId')
            .authorization((allow) =>
              allow.ownerDefinedIn('customOwner').to(['create', 'read']),
            ),
        }),
      })
      .authorization((allow) => allow.owner());

    type Schema = ClientSchema<typeof schema>;
    type CustomOwnerType = Schema['widget']['type']['customOwner'];

    // single owner should be allowed
    let customOwner: CustomOwnerType = 'abc';

    // multiple owners should not
    // @ts-expect-error
    customOwner = ['multiple', 'owners'];

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  for (const provider of PrivateProviders) {
    it(`can define private with with provider ${provider}`, () => {
      const schema = a.schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .authorization((allow) => allow.authenticated(provider)),
      });

      const graphql = schema.transform().schema;
      expect(graphql).toMatchSnapshot();
    });

    const TestOperations: Operation[][] = [
      // each individual operation
      ...Operations.map((op) => [op]),

      // a couple sanity checks to support a combinations
      ['create', 'read', 'update', 'delete'],
      ['create', 'read', 'listen'],
    ];

    for (const operations of TestOperations) {
      it(`can define private with with provider ${provider} for operations ${operations}`, () => {
        const schema = a.schema({
          widget: a
            .model({
              title: a.string().required(),
            })
            .authorization((allow) =>
              allow.authenticated(provider).to(operations),
            ),
        });

        const graphql = schema.transform().schema;
        expect(graphql).toMatchSnapshot();
      });
    }
  }

  it(`can define a custom authorization rule`, () => {
    const schema = a.schema({
      Widget: a
        .model({
          title: a.string().required(),
        })
        .authorization((allow) => allow.custom()),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  const TestOperations: Operation[][] = [
    // each individual operation
    ...Operations.map((op) => [op]),

    // a couple sanity checks to support a combinations
    ['create', 'read', 'update', 'delete'],
    ['create', 'read', 'listen'],
  ];

  for (const operations of TestOperations) {
    it(`can define custom auth rule for operations ${operations}`, () => {
      const schema = a.schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .authorization((allow) => allow.custom().to(operations)),
      });

      const graphql = schema.transform().schema;
      expect(graphql).toMatchSnapshot();
    });
  }

  it('can define define field-level owner and model-level public simultaneously', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a
            .string()
            .required()
            .authorization((allow) => allow.owner()),
        })
        .authorization((allow) => allow.publicApiKey()),
    });
  });

  it('can define define field-level owner and model-level private simultaneously', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a
            .string()
            .required()
            .authorization((allow) => allow.owner()),
        })
        .authorization((allow) => allow.authenticated()),
    });
  });

  it('gives a runtime error if field-level owner and model-level owner conflict', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a
            .string()
            .required()
            .authorization((allow) => allow.ownerDefinedIn('someOwnerField')),
        })
        .authorization((allow) => allow.ownersDefinedIn('someOwnerField')),
    });
    expect(() => schema.transform().schema).toThrow();
  });

  it('gives a runtime error if model field and model-level owner auth rule conflicts', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
          someOwnerField: a.string(),
        })
        .authorization((allow) => allow.ownersDefinedIn('someOwnerField')),
    });
    expect(() => schema.transform().schema).toThrow();
  });

  it('gives a runtime error if model field and field-level owner auth rule conflicts', () => {
    const schema = a.schema({
      widget: a.model({
        title: a
          .string()
          .required()
          .authorization((allow) => allow.ownersDefinedIn('someOwnerField')),
        someOwnerField: a.string(),
      }),
    });
    expect(() => schema.transform().schema).toThrow();
  });

  it('gives a runtime error if field-level owner and schema-level owner conflict', () => {
    const schema = a
      .schema({
        widget: a.model({
          title: a
            .string()
            .required()
            .authorization((allow) => allow.ownerDefinedIn('someOwnerField')),
        }),
      })
      .authorization((allow) => allow.ownersDefinedIn('someOwnerField'));
    expect(() => schema.transform().schema).toThrow();
  });

  it('gives a runtime error if model field and schema-level owner auth rule conflicts', () => {
    const schema = a
      .schema({
        widget: a.model({
          title: a.string().required(),
          someOwnerField: a.string(),
        }),
      })
      .authorization((allow) => allow.ownersDefinedIn('someOwnerField'));
    expect(() => schema.transform().schema).toThrow();
  });

  describe('duplicate field validation does not issue errors for `identifier()`', () => {
    // because `identifier()` doesn't actually need to match on type. it only
    // needs the field to exist. The field types specified by `identifier()` are
    // fallback in case the field isn't defined explicitly.
    it('explicit `id: string` field', () => {
      const schema = a
        .schema({
          widget: a
            .model({
              id: a.string().required(),
            })
            .identifier(['id']),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit `id: ID` field', () => {
      const schema = a
        .schema({
          widget: a
            .model({
              id: a.id().required(),
            })
            .identifier(['id']),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit `customId: string` field', () => {
      const schema = a
        .schema({
          widget: a
            .model({
              customId: a.string().required(),
            })
            .identifier(['customId']),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit multi-field string type PK', () => {
      const schema = a
        .schema({
          widget: a
            .model({
              idFieldA: a.string().required(),
              idFieldB: a.string().required(),
            })
            .identifier(['idFieldA', 'idFieldB']),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit multi-field mixed types PK', () => {
      const schema = a
        .schema({
          widget: a
            .model({
              idFieldA: a.string().required(),
              idFieldB: a.integer().required(),
            })
            .identifier(['idFieldA', 'idFieldB']),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });
  });
});

describe('secondary indexes', () => {
  it('generates a secondary index annotation', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .secondaryIndexes((index) => [index('title')]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates a secondary index annotation with attributes - default', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
            description: a.string().required(),
            timestamp: a.integer().required(),
          })
          .secondaryIndexes((index) => [
            index('title').name('myGSI').sortKeys(['description', 'timestamp']),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates a secondary index annotation with attributes - custom queryField', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
            description: a.string().required(),
            timestamp: a.integer().required(),
          })
          .secondaryIndexes((index) => [
            index('title')
              .name('myGSI')
              .sortKeys(['description', 'timestamp'])
              .queryField('byTitleDescTs'),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates a primary key AND secondary index annotation with attributes', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
            description: a.string().required(),
            timestamp: a.integer().required(),
          })
          .identifier(['title'])
          .secondaryIndexes((index) => [
            index('title')
              .name('myGSI')
              .sortKeys(['description', 'timestamp'])
              .queryField('byTitleDescTs'),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates multiple secondary index annotations on the same field', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
            description: a.string().required(),
            timestamp: a.integer().required(),
          })
          .secondaryIndexes((index) => [
            index('title'),
            index('title').sortKeys(['timestamp']),
            index('title')
              .name('myGSI')
              .sortKeys(['description', 'timestamp'])
              .queryField('byTitleDescTs'),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates secondary index annotations on different fields', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
            description: a.string().required(),
            timestamp: a.integer().required(),
          })
          .secondaryIndexes((index) => [
            index('title'),
            index('description').sortKeys(['timestamp']),
            index('timestamp')
              .sortKeys(['description'])
              .queryField('byTimeStampDesc'),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });
});

describe('disableOperations', () => {
  it('passes expected @model attributes for coarse-grained disable op', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .disableOperations(['mutations', 'subscriptions']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('passes expected @model attributes for fine-grained disable op', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .disableOperations([
            'get',
            'update',
            'delete',
            'onUpdate',
            'onDelete',
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('coarse grained op takes precedence over fine-grained', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .disableOperations(['update', 'delete', 'mutations']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('dupes are ignored', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .disableOperations([
            'update',
            'delete',
            'mutations',
            'update',
            'delete',
            'mutations',
            'update',
            'delete',
            'mutations',
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('exhaustive coarse-grained', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .disableOperations(['queries', 'mutations', 'subscriptions']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('exhaustive fine-grained', () => {
    const schema = a
      .schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .disableOperations([
            'get',
            'list',
            'create',
            'update',
            'delete',
            'onCreate',
            'onUpdate',
            'onDelete',
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });
});

describe("default() to GQL mapping", () => {
  const postgresConfig = configure({
    database: {
      identifier: 'some-identifier',
      engine: 'postgresql',
      connectionUri: '' as any,
    },
  })

  it("should map .default(val) to `@default(value: val)`", () => {
    const schema = a
    .schema({
      Song: a
        .model({
          title: a.string().default("Little Wing"),
        })
    })
    .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  })

  it("should map .default() to `@default`", () => {
    const schema = postgresConfig
    .schema({
      Album: a
        .model({
          trackNumber: a.integer().default(),
          title: a.string(),
        })
    })
    .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  })

  it("should map generated (`.default()`) identifiers to @primaryKey @default", () => {
    const schema = postgresConfig
    .schema({
      Song: a
        .model({
          id: a.integer().default(),
          title: a.string()
        })
      .identifier(["id"])
    })
    .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  })
})
