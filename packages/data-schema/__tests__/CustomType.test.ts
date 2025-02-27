import { expectTypeTestsToPassAsync } from 'jest-tsd';

import { PrivateProviders, Operations, Operation } from '../src/Authorization';
import { a, ClientSchema } from '../src/index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('CustomType unsupported modifiers', () => {
  test('Runtime error when calling unsupported modifiers', () => {
    expect(() => {
      a.customType({
        lat: a.float(),
        long: a.float(),
        // @ts-expect-error
      }).required();
    }).toThrowError();

    expect(() => {
      a.customType({
        lat: a.float(),
        long: a.float(),
        // @ts-expect-error
      }).default();
    }).toThrowError();

    expect(() => {
      a.customType({
        lat: a.float(),
        long: a.float(),
        // @ts-expect-error
      }).array();
    }).toThrowError();
  });
});

describe('CustomType transform', () => {
  test('Explicit CustomType', () => {
    const s = a
      .schema({
        Post: a.model({
          location: a.ref('Location'),
        }),
        Location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType - required', () => {
    const s = a
      .schema({
        Post: a.model({
          location: a.ref('Location').required(),
        }),
        Location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType nests implicit enum type', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.ref('Meta'),
        }),
        Meta: a.customType({
          status: a.enum(['unpublished', 'published']),
          publishedDate: a.date(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType nests implicit CustomType', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.ref('Meta'),
        }),
        Meta: a.customType({
          status: a.enum(['unpublished', 'published']),
          nestedMeta: a.customType({
            field1: a.string(),
          }),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType nests explicit enum', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.ref('Meta'),
        }),
        Meta: a.customType({
          status: a.ref('PostStatus'),
          publishedDate: a.date(),
        }),
        PostStatus: a.enum(['unpublished', 'published']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType nests explicit CustomType', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.ref('Meta'),
        }),
        Meta: a.customType({
          status: a.ref('PostStatus'),
          nestedMeta: a.ref('AltMeta'),
        }),
        PostStatus: a.enum(['unpublished', 'published']),
        AltMeta: a.customType({
          field1: a.string(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType - with auth', () => {
    const s = a
      .schema({
        Post: a.model({
          location: a.ref('Location').authorization((allow) => allow.owner()),
        }),
        Location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit CustomType', () => {
    const s = a
      .schema({
        Post: a.model({
          location: a.customType({
            lat: a.float(),
            long: a.float(),
          }),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit CustomType nests implicit enum type', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.customType({
            status: a.enum(['unpublished', 'published']),
            publishedDate: a.date(),
          }),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit CustomType nests implicit CustomType', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.customType({
            status: a.enum(['unpublished', 'published']),
            nestedMeta: a.customType({
              field1: a.string(),
            }),
          }),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit CustomType nests explicit enum', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.customType({
            status: a.ref('PostStatus'),
            publishedDate: a.date(),
          }),
        }),
        PostStatus: a.enum(['unpublished', 'published']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit CustomType nests explicit CustomType', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.customType({
            status: a.enum(['unpublished', 'published']),
            nestedMeta: a.ref('AltMeta'),
          }),
        }),
        AltMeta: a.customType({
          field1: a.string(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });
});

// TODO: Remove owner based tests once we have a better way to test auth rules
describe('CustomType auth rules', () => {
  it('can define public auth with no provider', () => {
    const schema = a.schema({
      Post: a
        .customType({
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
        Post: a
          .customType({
            title: a.string().required(),
          })
          // @ts-expect-error
          .authorization((allow) => allow.public('bad-provider')),
      });
    }).toThrow();
  });

  it('can define private auth with no provider', () => {
    const schema = a.schema({
      Post: a
        .customType({
          title: a.string().required(),
        })
        .authorization((allow) => allow.authenticated()),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can specify operations `, () => {
    const schema = a.schema({
      Post: a
        .customType({
          title: a.string().required(),
        })
        .authorization((allow) => allow.publicApiKey().to(['create', 'read'])),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a static Admins group rule`, () => {
    const schema = a.schema({
      Post: a
        .customType({
          title: a.string().required(),
        })
        .authorization((allow) => allow.group('Admins')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a static [Admins, Moderators] groups rule`, () => {
    const schema = a.schema({
      Post: a
        .customType({
          title: a.string().required(),
        })
        .authorization((allow) => allow.groups(['Admins', 'Moderators'])),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a dynamic singular groups rule`, () => {
    const schema = a.schema({
      Post: a
        .customType({
          title: a.string().required(),
        })
        .authorization((allow) => allow.groupDefinedIn('businessUnitOwner')),
    });

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  it(`can create a dynamic multi groups rule`, () => {
    const schema = a.schema({
      Post: a
        .customType({
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
      Post: a
        .customType({
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
      Post: a
        .customType({
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

  for (const provider of PrivateProviders) {
    it(`can define private with with provider ${provider}`, () => {
      const schema = a.schema({
        Post: a
          .customType({
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
      Post: a
        .customType({
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
      Post: a
        .customType({
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
      Post: a
        .customType({
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
      Post: a
        .customType({
          title: a.string().required(),
          someOwnerField: a.string(),
        })
        .authorization((allow) => allow.ownersDefinedIn('someOwnerField')),
    });
    expect(() => schema.transform().schema).toThrow();
  });

  it('gives a runtime error if field-level owner and schema-level owner conflict', () => {
    const schema = a
      .schema({
        Post: a.customType({
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
        Post: a.customType({
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
          Post: a
            .customType({
              id: a.string().required(),
            }),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit `id: ID` field', () => {
      const schema = a
        .schema({
          Post: a
            .customType({
              id: a.id().required(),
            }),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit `customId: string` field', () => {
      const schema = a
        .schema({
          Post: a
            .customType({
              customId: a.string().required(),
            }),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit multi-field string type PK', () => {
      const schema = a
        .schema({
          Post: a
            .customType({
              idFieldA: a.string().required(),
              idFieldB: a.string().required(),
            }),
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('explicit multi-field mixed types PK', () => {
      const schema = a
        .schema({
          Post: a
            .customType({
              idFieldA: a.string().required(),
              idFieldB: a.integer().required(),
            })
        })
        .authorization((allow) => allow.publicApiKey());
      expect(schema.transform().schema).toMatchSnapshot();
    });
  });
});
