import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { configure } from '../src/internals';
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

describe('CustomType required modifier', () => {
  test('.required() does not throw and marks the custom type as required', () => {
    const optionalType = a.customType({ lat: a.float() });
    const requiredType = a.customType({ lat: a.float() }).required();

    expect((optionalType as any).data.valueRequired).toBe(false);
    expect((requiredType as any).data.valueRequired).toBe(true);
    expect((requiredType as any).data.type).toBe('customType');
  });

  test('Implicit CustomType - required', () => {
    const s = a
      .schema({
        Post: a.model({
          location: a
            .customType({
              lat: a.float(),
              long: a.float(),
            })
            .required(),
          optionalLocation: a.customType({
            lat: a.float(),
            long: a.float(),
          }),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toContain('location: PostLocation!');
    expect(result).toContain('optionalLocation: PostOptionalLocation\n');
    expect(result).toMatchSnapshot();
  });

  test('Implicit CustomType nests required implicit CustomType', () => {
    const s = a
      .schema({
        NotificationSubscription: a.customType({
          endpoint: a.string().required(),
          keys: a
            .customType({
              p256dh: a.string().required(),
              auth: a.string().required(),
            })
            .required(),
        }),
        Post: a.model({
          meta: a
            .customType({
              status: a.enum(['unpublished', 'published']),
              nestedMeta: a
                .customType({
                  field1: a.string(),
                })
                .required(),
            })
            .required(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toContain('keys: NotificationSubscriptionKeys!');
    expect(result).toContain('meta: PostMeta!');
    expect(result).toContain('nestedMeta: PostMetaNestedMeta!');
    expect(result).toMatchSnapshot();
  });

  test('Required inline CustomType on a SQL schema', () => {
    const fakeSecret = () => ({}) as any;
    const s = configure({
      database: { engine: 'mysql', connectionUri: fakeSecret() },
    })
      .schema({
        post: a
          .model({
            id: a.string().required(),
            location: a
              .customType({
                lat: a.float(),
                long: a.float(),
              })
              .required(),
          })
          .identifier(['id']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toContain('location: PostLocation!');
  });

  test('Required inline CustomType as custom operation argument and return type', () => {
    const fn1 = defineFunctionStub({});
    const s = a
      .schema({
        getPostDetails: a
          .query()
          .arguments({
            requiredArg: a
              .customType({
                content: a.string(),
                nested: a.customType({ value: a.string() }).required(),
              })
              .required(),
            optionalArg: a.customType({ content: a.string() }),
          })
          .returns(
            a
              .customType({
                title: a.string(),
                details: a.customType({ body: a.string() }).required(),
              })
              .required(),
          )
          .handler(a.handler.function(fn1))
          .authorization((allow) => allow.authenticated()),
        optionalReturn: a
          .query()
          .returns(a.customType({ title: a.string() }))
          .handler(a.handler.function(fn1))
          .authorization((allow) => allow.authenticated()),
      });

    const result = s.transform().schema;

    expect(result).toContain(
      'getPostDetails(requiredArg: GetPostDetailsRequiredArgInput!, optionalArg: GetPostDetailsOptionalArgInput): GetPostDetailsReturnType!',
    );
    expect(result).toContain('nested: GetPostDetailsRequiredArgNestedInput!');
    expect(result).toContain('details: GetPostDetailsReturnTypeDetails!');
    expect(result).toContain('optionalReturn: OptionalReturnReturnType ');
    expect(result).toMatchSnapshot();
  });

  test('Runtime error when calling .required() on a top-level CustomType definition', () => {
    const s = a
      .schema({
        Location: a
          .customType({
            lat: a.float(),
            long: a.float(),
          })
          .required(),
        Post: a.model({
          location: a.ref('Location'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => s.transform()).toThrow(
      "Invalid custom type definition for Location. `.required()` is only supported on inline custom types used as fields, arguments, or return types. To make a reference to Location required, use `a.ref('Location').required()` instead.",
    );
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
