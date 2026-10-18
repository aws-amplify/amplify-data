import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type EnumType, enumType } from '../src/EnumType';
import { a, type ClientSchema } from '../src/index';
import type { ClientExtensions } from '../src/runtime';

describe('EnumType', () => {
  test('Happy case', () => {
    const accessLevel = enumType(['public', 'protected', 'private']);

    type Expected = EnumType<readonly ['public', 'protected', 'private']>;

    type Result = typeof accessLevel;

    type test = Expect<Equal<Result, Expected>>;
  });

  test('Error on invalid values', () => {
    // @ts-expect-error
    enumType('public', 'protected', 'private'); // must be array

    // @ts-expect-error
    enumType([1, 2, 3]);

    // @ts-expect-error
    enumType([true, false]);

    // @ts-expect-error
    enumType([null, undefined]);
  });

  test('Default value', () => {
    const accessLevel = enumType(['public', 'private']).default('public');

    type Expected = EnumType<readonly ['public', 'private']>;

    type Result = typeof accessLevel;

    type test = Expect<Equal<Result, Expected>>;

    // @ts-expect-error
    enumType(['public', 'private']).default('secret'); // must be one of the values
  });

  test('Default value does not change the client type', () => {
    const schema = a.schema({
      Post: a.model({
        status: a.enum(['draft', 'published']).default('draft'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    type Expected = 'draft' | 'published' | null | undefined;

    type Result = Schema['Post']['type']['status'];

    type test = Expect<Equal<Result, Expected>>;
  });

  test('enums types extracted from models', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.enum(['draft', 'pending', 'published']),
      }),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = {} as ClientExtensions<Schema>;

    type EnumsProp = typeof client.enums;

    type ExpectedEnumsPropShape = {
      PostStatus: {
        values(): ('draft' | 'pending' | 'published')[];
      };
    };

    type test = Expect<Equal<EnumsProp, ExpectedEnumsPropShape>>;
  });
});
