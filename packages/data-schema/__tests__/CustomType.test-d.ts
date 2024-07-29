import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type _Internal_CustomType, customType } from '../src/CustomType';
import {
  type _Internal_ModelField,
  _Internal_Nullable,
  string,
} from '../src/ModelField';

import { float } from '../src/a';
import { _Internal_EnumType, enumType } from '../src/EnumType';

describe('CustomType', () => {
  test('Basic CustomType', () => {
    const cType = customType({
      lat: float(),
      long: float(),
    });

    type Expected = _Internal_CustomType<{
      fields: {
        lat: _Internal_ModelField<_Internal_Nullable<number>, never, undefined>;
        long: _Internal_ModelField<
          _Internal_Nullable<number>,
          never,
          undefined
        >;
      };
    }>;

    type Result = typeof cType;

    type test = Expect<Equal<Result, Expected>>;
  });

  test('Nested CustomType', () => {
    const cType = customType({
      content: string().required(),
      meta: customType({
        enumField: enumType(['value1', 'value2']),
        deepMeta: customType({
          description: string().required(),
        }),
      }),
    });

    type Expected = _Internal_CustomType<{
      fields: {
        content: _Internal_ModelField<string, 'required', undefined>;
        meta: _Internal_CustomType<{
          fields: {
            enumField: _Internal_EnumType<readonly ['value1', 'value2']>;
            deepMeta: _Internal_CustomType<{
              fields: {
                description: _Internal_ModelField<
                  string,
                  'required',
                  undefined
                >;
              };
            }>;
          };
        }>;
      };
    }>;

    type Result = typeof cType;

    type test = Expect<Equal<Result, Expected>>;
  });
});
