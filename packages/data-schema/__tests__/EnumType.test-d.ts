import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type EnumType, enumType } from '../src/EnumType';

describe('EnumType', () => {
  test('Happy case', () => {
    const accessLevel = enumType(['public', 'protected', 'private']);

    type Expected = EnumType<{
      type: 'enum';
      values: ('public' | 'protected' | 'private')[];
    }>;

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
});
