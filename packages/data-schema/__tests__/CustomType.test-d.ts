import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type CustomType, customType } from '../src/CustomType';
import { type ModelField, Nullable, string, ModelFieldType } from '../src/ModelField';

import { float } from '../src/a';
import { EnumType, enumType } from '../src/EnumType';

describe('CustomType', () => {
  test('Basic CustomType', () => {
    const cType = customType({
      lat: float(),
      long: float(),
    });

    type Expected = CustomType<{
      authorization: [];
      fields: {
        lat: ModelField<Nullable<number>, never, undefined, ModelFieldType.Float>;
        long: ModelField<Nullable<number>, never, undefined, ModelFieldType.Float>;
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

    type Expected = CustomType<{
      authorization: [];
      fields: {
        content: ModelField<string, 'required', undefined, ModelFieldType.String>;
        meta: CustomType<{
          authorization: [];
          fields: {
            enumField: EnumType<readonly ['value1', 'value2']>;
            deepMeta: CustomType<{
              authorization: [];
              fields: {
                description: ModelField<string, 'required', undefined, ModelFieldType.String>;
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
