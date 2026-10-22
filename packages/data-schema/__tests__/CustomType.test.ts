import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { defineFunctionStub } from './utils';

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

  test('Implicit CustomType authorized by both group and authorized though its custom operation', () => {
    const fn1 = defineFunctionStub({});
    const s = a
      .schema({
        getPostDetailsA: a
          .query()
          .arguments({content: a.customType({content: a.string()})})
          .returns(a.customType({}))
          .handler([
            a.handler.function(fn1),
          ]).authorization((allow) => [allow.authenticated(), allow.group("TestGroup")]),
      });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType authorized by both group and authorized though different custom operations', () => {
    const fn1 = defineFunctionStub({});
    const s = a
      .schema({
        testCustomType: a.customType({ content: a.string() }),
        getPostDetailsA: a
          .query()
          .arguments({})
          .returns(a.ref("testCustomType"))
          .handler([
            a.handler.function(fn1),
          ]).authorization((allow) => [allow.authenticated()]),
        getPostDetailsB: a
          .query()
          .arguments({})
          .returns(a.ref("testCustomType"))
          .handler([
            a.handler.function(fn1),
          ]).authorization((allow) => [allow.group("TestGroup")])
      });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });
});

// https://github.com/aws-amplify/amplify-data/issues/423
describe('CustomType transform with cyclic references', () => {
  /**
   * Asserts each top-level type in the generated schema is emitted exactly once.
   */
  const expectEachTypeDefinedOnce = (schema: string) => {
    const typeNames = [...schema.matchAll(/^(?:type|input|enum) (\w+)/gm)].map(
      ([, name]) => name,
    );
    expect(typeNames.length).toBeGreaterThan(0);
    expect(typeNames).toEqual([...new Set(typeNames)]);
  };

  test('one to many relationship between customTypes returned from a custom query (issue repro)', () => {
    const s = a.schema({
      MasterTenantTable: a
        .model({
          pk: a.string().required(),
          sk: a.string().required(),
          company_id: a.id(),
        })
        .authorization((allow) => [allow.publicApiKey()]),
      Tenant: a.customType({
        company: a.ref('Company'),
        company_id: a.id().required(),
      }),
      Company: a.customType({
        tenants: a.ref('Tenant').array(),
      }),
      getCompanyById: a
        .query()
        .arguments({ company_id: a.id().required() })
        .returns(a.ref('Tenant').array())
        .authorization((allow) => [allow.authenticated()])
        .handler(
          a.handler.custom({
            dataSource: a.ref('MasterTenantTable'),
            entry: './company-resolvers/getCompanyById.js',
          }),
        ),
    });

    const result = s.transform().schema;

    expectEachTypeDefinedOnce(result);
    expect(result).toMatchSnapshot();
  });

  test('indirect recursive CustomTypes used by both models and operations', () => {
    const s = a
      .schema({
        Post: a.model({
          meta: a.customType({
            status: a.enum(['unpublished', 'published']),
            recursiveCustomType: a.ref('CustTypeA'),
          }),
        }),
        getLikedPost: a
          .query()
          .returns(a.ref('CustTypeA').array())
          .handler(a.handler.function('myFunc')),
        CustTypeA: a.customType({
          company: a.ref('CustTypeB'),
        }),
        CustTypeB: a.customType({
          tenants: a.ref('CustTypeA').array(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expectEachTypeDefinedOnce(result);
    expect(result).toMatchSnapshot();
  });

  test('self-referencing CustomType returned from a custom query', () => {
    const s = a.schema({
      TreeNode: a.customType({
        value: a.string(),
        parent: a.ref('TreeNode'),
        children: a.ref('TreeNode').array(),
      }),
      getTree: a
        .query()
        .returns(a.ref('TreeNode'))
        .authorization((allow) => [allow.authenticated()])
        .handler(a.handler.function('myFunc')),
    });

    const result = s.transform().schema;

    expectEachTypeDefinedOnce(result);
    expect(result).toMatchSnapshot();
  });

  test('cycle that passes through an inline CustomType', () => {
    const s = a.schema({
      Tenant: a.customType({
        name: a.string(),
        company: a.ref('Company'),
      }),
      Company: a.customType({
        meta: a.customType({
          owner: a.ref('Tenant'),
        }),
      }),
      getTenant: a
        .query()
        .returns(a.ref('Tenant'))
        .authorization((allow) => [allow.guest()])
        .handler(a.handler.function('myFunc')),
    });

    const result = s.transform().schema;

    expectEachTypeDefinedOnce(result);
    expect(result).toMatchSnapshot();
  });

  test('cyclic CustomTypes returned by operations with different auth inherit all rules', () => {
    const s = a.schema({
      Tenant: a.customType({
        company: a.ref('Company'),
      }),
      Company: a.customType({
        tenants: a.ref('Tenant').array(),
      }),
      getTenant: a
        .query()
        .returns(a.ref('Tenant'))
        .authorization((allow) => [allow.authenticated()])
        .handler(a.handler.function('myFunc')),
      getCompany: a
        .query()
        .returns(a.ref('Company'))
        .authorization((allow) => [allow.publicApiKey()])
        .handler(a.handler.function('myFunc')),
    });

    const result = s.transform().schema;

    expectEachTypeDefinedOnce(result);
    // both types are reachable from both operations, so both inherit both auth modes
    for (const typeName of ['Tenant', 'Company']) {
      const [typeLine] = result.match(
        new RegExp(`^type ${typeName} .*$`, 'm'),
      )!;
      expect(typeLine).toContain('@aws_cognito_user_pools');
      expect(typeLine).toContain('@aws_api_key');
    }
    expect(result).toMatchSnapshot();
  });

  test('cyclic CustomTypes used as custom mutation arguments and return type', () => {
    const s = a.schema({
      Tenant: a.customType({
        name: a.string(),
        company: a.ref('Company'),
      }),
      Company: a.customType({
        tenants: a.ref('Tenant').array(),
      }),
      saveTenant: a
        .mutation()
        .arguments({ tenant: a.ref('Tenant') })
        .returns(a.ref('Tenant'))
        .authorization((allow) => [allow.authenticated()])
        .handler(a.handler.function('myFunc')),
    });

    const result = s.transform().schema;

    expectEachTypeDefinedOnce(result);
    expect(result).toMatchSnapshot();
  });
});
