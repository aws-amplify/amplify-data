import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a, ClientSchema } from '../index';
import {
  PublicProviders,
  PrivateProviders,
  Operations,
  Operation,
} from '../src/Authorization';
import { ModelRelationalField } from '../src/ModelRelationalField';
import { ModelField } from '../src/ModelField';

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

describe('type definition tests', () => {
  // evaluates type defs in corresponding test-d.ts file
  it('should not produce static type errors', async () => {
    await expectTypeTestsToPassAsync(__filename);
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
        .authorization([a.allow.public()]),
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
          .authorization([a.allow.public('bad-provider')]),
      });
    }).toThrow();
  });

  it('can define private auth with no provider', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization([a.allow.private()]),
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
        .authorization([a.allow.owner()]),
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
        .authorization([a.allow.owner().inField('title')]),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can specify operations `, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization([a.allow.public().to(['create', 'read'])]),
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
        .authorization([a.allow.owner().identityClaim('user_id')]),
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
        .authorization([a.allow.multipleOwners().inField('authors')]),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a "multiple owners" rule on an implied (auto-created) field`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization([a.allow.multipleOwners().inField('authors')]),
    });

    // what customers export
    type Schema = ClientSchema<typeof schema>;

    // If the types are correct, this field should exist
    type AuthorsType = Schema['widget']['authors'];

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
  //       .authorization([a.allow.owner().inField('author')]),
  //   });
  // });

  it(`can create a static Admins group rule`, () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required(),
        })
        .authorization([a.allow.specificGroup('Admins')]),
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
        .authorization([a.allow.specificGroups(['Admins', 'Moderators'])]),
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
        .authorization([a.allow.groupDefinedIn('businessUnitOwner')]),
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
        .authorization([
          a.allow.groupsDefinedIn('sharedWithGroups').to(['read']),
        ]),
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
        .authorization([
          a.allow
            .groupDefinedIn('businessUnitOwner')
            .withClaimIn('someClaimsField'),
        ]),
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
        .authorization([
          a.allow
            .groupsDefinedIn('sharedWithGroups')
            .to(['read'])
            .withClaimIn('someClaimsField'),
        ]),
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
        .authorization([
          a.allow.owner().inField('customOwnerField').to(['create', 'read']),
        ]),
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
        .authorization([
          a.allow
            .multipleOwners()
            .inField('customOwnerField')
            .to(['create', 'read']),
        ]),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`includes auth from fields`, () => {
    const schema = a
      .schema({
        widget: a.model({
          id: a.id().required(),
          title: a
            .string()
            .required()
            .authorization([
              a.allow.owner().inField('customOwner').to(['create', 'read']),
            ]),
        }),
      })
      .authorization([a.allow.public()]);

    type Schema = ClientSchema<typeof schema>;
    type CustomOwnerType = Schema['widget']['customOwner'];

    // single owner should be allowed
    let customOwner: CustomOwnerType = 'abc';

    // multiple owners should not
    // @ts-expect-error
    customOwner = ['multiple', 'owners'];

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`includes auth from related model fields`, () => {
    const schema = a.schema({
      widget: a.model({
        id: a.id().required(),
        parent: a
          .belongsTo('widget')
          .authorization([
            a.allow.owner().inField('customOwner').to(['create', 'read']),
          ]),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    type CustomOwnerType = Schema['widget']['customOwner'];

    // single owner should be allowed
    let customOwner: CustomOwnerType = 'abc';

    // multiple owners should not
    // @ts-expect-error
    customOwner = ['multiple', 'owners'];

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  for (const provider of PublicProviders) {
    it(`can define public with with provider ${provider}`, () => {
      const schema = a.schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .authorization([a.allow.public(provider)]),
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
      it(`can define public with with provider ${provider} for operations ${operations}`, () => {
        const schema = a.schema({
          widget: a
            .model({
              title: a.string().required(),
            })
            .authorization([
              a.allow.public(provider).to(operations),
              // 'whatever',
            ]),
        });

        const graphql = schema.transform().schema;
        expect(graphql).toMatchSnapshot();
      });
    }
  }

  for (const provider of PrivateProviders) {
    it(`can define private with with provider ${provider}`, () => {
      const schema = a.schema({
        widget: a
          .model({
            title: a.string().required(),
          })
          .authorization([a.allow.private(provider)]),
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
            .authorization([a.allow.private(provider).to(operations)]),
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
        .authorization([a.allow.custom()]),
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
          .authorization([a.allow.custom().to(operations)]),
      });

      const graphql = schema.transform().schema;
      expect(graphql).toMatchSnapshot();
    });
  }

  it('can define define field-level owner and model-level public simultaneously', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required().authorization([a.allow.owner()]),
        })
        .authorization([a.allow.public()]),
    });
  });

  it('can define define field-level owner and model-level private simultaneously', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a.string().required().authorization([a.allow.owner()]),
        })
        .authorization([a.allow.private()]),
    });
  });

  it('gives a runtime error if field-level owner and model-level owner conflict', () => {
    const schema = a.schema({
      widget: a
        .model({
          title: a
            .string()
            .required()
            .authorization([a.allow.owner().inField('someOwnerField')]),
        })
        .authorization([a.allow.multipleOwners().inField('someOwnerField')]),
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
        .authorization([a.allow.multipleOwners().inField('someOwnerField')]),
    });
    expect(() => schema.transform().schema).toThrow();
  });

  it('gives a runtime error if model field and field-level owner auth rule conflicts', () => {
    const schema = a.schema({
      widget: a.model({
        title: a
          .string()
          .required()
          .authorization([a.allow.multipleOwners().inField('someOwnerField')]),
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
            .authorization([a.allow.owner().inField('someOwnerField')]),
        }),
      })
      .authorization([a.allow.multipleOwners().inField('someOwnerField')]);
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
      .authorization([a.allow.multipleOwners().inField('someOwnerField')]);
    expect(() => schema.transform().schema).toThrow();
  });

  describe('duplicate field validation does not issue errors for `identifier()`', () => {
    // because `identifier()` doesn't actually need to match on type. it only
    // needs the field to exist. The field types specified by `identifier()` are
    // fallback in case the field isn't defined explicitly.
    it('explicit `id: string` field', () => {
      const schema = a.schema({
        widget: a
          .model({
            id: a.string().required(),
          })
          .identifier(['id']),
      });
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit `id: ID` field', () => {
      const schema = a.schema({
        widget: a
          .model({
            id: a.id().required(),
          })
          .identifier(['id']),
      });
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit `customId: string` field', () => {
      const schema = a.schema({
        widget: a
          .model({
            customId: a.string().required(),
          })
          .identifier(['customId']),
      });
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit multi-field string type PK', () => {
      const schema = a.schema({
        widget: a
          .model({
            idFieldA: a.string().required(),
            idFieldB: a.string().required(),
          })
          .identifier(['idFieldA', 'idFieldB']),
      });
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit multi-field mixed types PK', () => {
      const schema = a.schema({
        widget: a
          .model({
            idFieldA: a.string().required(),
            idFieldB: a.integer().required(),
          })
          .identifier(['idFieldA', 'idFieldB']),
      });
      expect(schema.transform().schema).toMatchSnapshot();
    });
  });
});
