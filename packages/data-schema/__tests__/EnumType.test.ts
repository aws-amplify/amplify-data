import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('EnumType unsupported modifiers', () => {
  test('Runtime error when calling unsupported modifiers', () => {
    expect(() => {
      // @ts-expect-error
      a.enumType(['public', 'protected', 'private']).required();
    }).toThrowError();

    expect(() => {
      // @ts-expect-error
      a.enumType(['public', 'protected', 'private']).array();
    }).toThrowError();
  });
});

describe('EnumType transform', () => {
  test('Explicit Enum', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a.ref('AccessLevel'),
        }),
        AccessLevel: a.enum(['public', 'protected', 'private']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit Enum - required', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a.ref('AccessLevel').required(),
        }),
        AccessLevel: a.enum(['public', 'protected', 'private']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit Enum - auth', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a
            .ref('AccessLevel')
            .authorization((allow) => allow.owner()),
        }),
        AccessLevel: a.enum(['public', 'protected', 'private']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit Enum - default', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a.ref('AccessLevel').required().default('private'),
        }),
        AccessLevel: a.enum(['public', 'protected', 'private']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit Enum', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a.enum(['public', 'protected', 'private']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit Enum - default', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a
            .enum(['public', 'protected', 'private'])
            .default('private'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  it('throws when the enum values contain whitespace', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          enumField: a.enum(['string string', 'value']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/not contain any whitespace/);
  });

  it('throws when a top-level enum has a default value', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          enumField: a.ref('Status'),
        }),
        Status: a.enum(['draft', 'published']).default('draft'),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/top-level enum `Status`/);
  });

  it('throws when a ref default value is not one of the enum values', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          enumField: a.ref('Status').default('deleted'),
        }),
        Status: a.enum(['draft', 'published']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/is not one of the `Status` enum values: draft, published/);
  });

  it('throws when a ref with a default value does not refer to an enum', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          location: a.ref('Location').default('home'),
        }),
        Location: a.customType({ lat: a.float() }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/refers to `Location`, which is not an enum/);
  });

  it('throws when a ref with a default value refers to a custom operation', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          result: a.ref('getStatus').default('draft'),
        }),
        getStatus: a
          .query()
          .returns(a.string())
          .handler(a.handler.function('myFn'))
          .authorization((allow) => allow.publicApiKey()),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/refers to `getStatus`, which is not an enum/);
  });

  it('throws when an array ref has a default value', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          enumField: a.ref('Status').array().default('draft'),
        }),
        Status: a.enum(['draft', 'published']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/not supported on array fields/);
  });

  it('throws when a custom type ref field has a default value', () => {
    const testSchema = a
      .schema({
        Location: a.customType({
          kind: a.ref('Kind').default('home'),
        }),
        Kind: a.enum(['home', 'work']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/field `kind` of custom type `Location`/);
  });

  it('throws when a custom type enum field has a default value', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          location: a.customType({
            kind: a.enum(['home', 'work']).default('home'),
          }),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/field `kind` of custom type `ModelLocation`/);
  });

  it('throws when a custom operation enum argument has a default value', () => {
    const testSchema = a
      .schema({
        listFiles: a
          .query()
          .arguments({
            accessLevel: a.enum(['public', 'private']).default('public'),
          })
          .returns(a.string())
          .handler(a.handler.function('myFn'))
          .authorization((allow) => allow.publicApiKey()),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/argument `accessLevel` of custom operation `listFiles`/);
  });

  it('throws when a custom operation custom type argument has an enum default value', () => {
    const testSchema = a
      .schema({
        listFiles: a
          .query()
          .arguments({
            filter: a.customType({
              kind: a.enum(['home', 'work']).default('home'),
            }),
          })
          .returns(a.string())
          .handler(a.handler.function('myFn'))
          .authorization((allow) => allow.publicApiKey()),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/argument `filter.kind` of custom operation `listFiles`/);
  });

  it('throws when a custom operation return type has a default value', () => {
    const testSchema = a
      .schema({
        getStatus: a
          .query()
          .returns(a.ref('Status').default('draft'))
          .handler(a.handler.function('myFn'))
          .authorization((allow) => allow.publicApiKey()),
        Status: a.enum(['draft', 'published']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/return type of custom operation `getStatus`/);
  });

  it('throws when a subscription source has a default value', () => {
    const testSchema = a
      .schema({
        Post: a.model({
          title: a.string(),
        }),
        likePost: a
          .mutation()
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFn')),
        onLikePost: a
          .subscription()
          .for(a.ref('likePost').default('x'))
          .handler(a.handler.function('myFn')),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(/subscription source of custom operation `onLikePost`/);
  });
});
