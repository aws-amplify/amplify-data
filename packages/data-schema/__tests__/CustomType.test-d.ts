import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import {
  type CustomType,
  type RequiredCustomType,
  customType,
} from '../src/CustomType';
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
      fields: {
        content: ModelField<string, 'required', undefined, ModelFieldType.String>;
        meta: CustomType<{
          fields: {
            enumField: EnumType<readonly ['value1', 'value2']>;
            deepMeta: CustomType<{
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

  test('Required CustomType', () => {
    const cType = customType({
      lat: float(),
      long: float(),
    }).required();

    type Expected = RequiredCustomType<{
      fields: {
        lat: ModelField<Nullable<number>, never, undefined, ModelFieldType.Float>;
        long: ModelField<Nullable<number>, never, undefined, ModelFieldType.Float>;
      };
    }>;

    type Result = typeof cType;

    type test = Expect<Equal<Result, Expected>>;
  });

  test('Required CustomType is still a CustomType', () => {
    const cType = customType({
      content: string(),
    }).required();

    type test = Expect<
      Equal<typeof cType extends CustomType<any> ? true : false, true>
    >;
  });

  test('Nested required CustomType', () => {
    const cType = customType({
      endpoint: string().required(),
      keys: customType({
        p256dh: string().required(),
        auth: string().required(),
      }).required(),
    });

    type Expected = CustomType<{
      fields: {
        endpoint: ModelField<string, 'required', undefined, ModelFieldType.String>;
        keys: RequiredCustomType<{
          fields: {
            p256dh: ModelField<string, 'required', undefined, ModelFieldType.String>;
            auth: ModelField<string, 'required', undefined, ModelFieldType.String>;
          };
        }>;
      };
    }>;

    type Result = typeof cType;

    type test = Expect<Equal<Result, Expected>>;
  });
});
