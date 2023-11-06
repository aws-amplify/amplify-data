import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('EnumType transform', () => {
  test('Explicit Enum', () => {
    const s = a.schema({
      File: a.model({
        accessLevel: a.ref('AccessLevel'),
      }),
      AccessLevel: a.enum(['public', 'protected', 'private']),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit Enum - required', () => {
    const s = a.schema({
      File: a.model({
        accessLevel: a.ref('AccessLevel').required(),
      }),
      AccessLevel: a.enum(['public', 'protected', 'private']),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit Enum - auth', () => {
    const s = a.schema({
      File: a.model({
        accessLevel: a.ref('AccessLevel').authorization([a.allow.owner()]),
      }),
      AccessLevel: a.enum(['public', 'protected', 'private']),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit Enum', () => {
    const s = a.schema({
      File: a.model({
        accessLevel: a.enum(['public', 'protected', 'private']),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });
});
