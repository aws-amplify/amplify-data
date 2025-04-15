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
