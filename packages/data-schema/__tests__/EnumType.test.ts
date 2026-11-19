import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { configure } from '../src/ModelSchema';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('EnumType unsupported modifiers', () => {
  test('Runtime error when calling unsupported modifiers', () => {
    expect(() => {
      // @ts-expect-error
      a.enumType(['public', 'protected', 'private']).default();
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

  test('Implicit Enum - required', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a.enum(['public', 'protected', 'private']).required(),
          visibility: a.enum(['visible', 'hidden']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit Enum - required, in custom types', () => {
    const s = a
      .schema({
        Location: a.customType({
          kind: a.enum(['home', 'work']).required(),
          label: a.enum(['primary', 'secondary']),
        }),
        File: a.model({
          meta: a.customType({
            accessLevel: a.enum(['public', 'protected', 'private']).required(),
          }),
          location: a.ref('Location'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit Enum - required, in custom operation arguments', () => {
    const s = a
      .schema({
        listFiles: a
          .query()
          .arguments({
            accessLevel: a.enum(['public', 'protected', 'private']).required(),
            sort: a.enum(['asc', 'desc']),
            filter: a.customType({
              kind: a.enum(['image', 'video']).required(),
              size: a.enum(['small', 'large']),
            }),
          })
          .returns(a.string())
          .handler(a.handler.function('myFn'))
          .authorization((allow) => allow.publicApiKey()),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit Enum - required, used in a secondary index', () => {
    const s = a
      .schema({
        File: a
          .model({
            accessLevel: a.enum(['public', 'protected', 'private']).required(),
          })
          .secondaryIndexes((index) => [index('accessLevel')]),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit Enum - required, in a SQL schema', () => {
    const s = configure({
      database: {
        engine: 'postgresql',
        connectionUri: 'fake' as any,
      },
    })
      .schema({
        friendship: a
          .model({
            id: a.integer().required(),
            status: a
              .enum(['REJECTED', 'FRIENDS', 'PENDING', 'REQUESTED'])
              .required(),
            note: a.enum(['NONE', 'SOME']),
          })
          .identifier(['id']),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('.required() does not mutate a shared enum definition', () => {
    const accessLevel = a.enum(['public', 'protected', 'private']);

    const s = a
      .schema({
        File: a.model({
          optionalAccessLevel: accessLevel,
          requiredAccessLevel: accessLevel.required(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const result = s.transform().schema;

    expect(result).toContain('optionalAccessLevel: FileOptionalAccessLevel\n');
    expect(result).toContain('requiredAccessLevel: FileRequiredAccessLevel!\n');
  });

  it('throws when a top-level enum is marked required', () => {
    const testSchema = a
      .schema({
        Model: a.model({
          enumField: a.ref('Status'),
        }),
        // @ts-expect-error `.required()` is not supported on top-level enums
        Status: a.enum(['draft', 'published']).required(),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(() => {
      testSchema.transform();
    }).toThrow(
      "`.required()` is not supported on the top-level enum `Status`. Remove it and use `a.ref('Status').required()` on the field that references the enum instead.",
    );
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
});
