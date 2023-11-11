import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../index';

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
    const s = a.schema({
      Post: a.model({
        location: a.ref('Location'),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType - required', () => {
    const s = a.schema({
      Post: a.model({
        location: a.ref('Location').required(),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Explicit CustomType - with auth', () => {
    const s = a.schema({
      Post: a.model({
        location: a.ref('Location').authorization([a.allow.owner()]),
      }),
      Location: a.customType({
        lat: a.float(),
        long: a.float(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Implicit CustomType', () => {
    const s = a.schema({
      Post: a.model({
        location: a.customType({
          lat: a.float(),
          long: a.float(),
        }),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });
});
