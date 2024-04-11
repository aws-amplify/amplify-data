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
      .authorization([a.allow.public()]);

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
      .authorization([a.allow.public()]);

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit Enum - auth', () => {
    const s = a
      .schema({
        File: a.model({
          accessLevel: a.ref('AccessLevel').authorization([a.allow.owner()]),
        }),
        AccessLevel: a.enum(['public', 'protected', 'private']),
      })
      .authorization([a.allow.public()]);

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
      .authorization([a.allow.public()]);

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
      .authorization([a.allow.public()]);

    expect(() => {
      testSchema.transform();
    }).toThrow(/not contain any whitespace/);
  });
});
