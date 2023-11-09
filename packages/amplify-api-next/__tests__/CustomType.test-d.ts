import type { Equal, Expect } from '@aws-amplify/amplify-data-next-types';
import { type CustomType, customType } from '../src/CustomType';
import { type ModelField, Nullable } from '../src/ModelField';

import { float } from '../src';

describe('CustomType', () => {
  test('Happy case', () => {
    const cType = customType({
      lat: float(),
      long: float(),
    });

    type Expected = CustomType<{
      fields: {
        lat: ModelField<Nullable<number>, never, undefined>;
        long: ModelField<Nullable<number>, never, undefined>;
      };
    }>;

    type Result = typeof cType;

    type test = Expect<Equal<Result, Expected>>;
  });
});
