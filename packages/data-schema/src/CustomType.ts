import type { Brand } from './util';
import type {
  ModelField,
  InternalField,
  ModelFieldTypeParamOuter,
} from './ModelField';
import type { RefType } from './RefType';
import type { EnumType, EnumTypeParamShape } from './EnumType';

/**
 * Custom Types
 *
 * can be defined in-line to strongly type object types
 *
 */

// `.default()` is not allowed on a Custom Type field
export type CustomTypeAllowedModifiers = 'authorization' | 'array' | 'required';

type CustomTypeFields = Record<
  string,
  | ModelField<ModelFieldTypeParamOuter, CustomTypeAllowedModifiers, any>
  | RefType<any, any, any>
  | EnumType<EnumTypeParamShape>
  | CustomType<CustomTypeParamShape>
>;

type InternalModelFields = Record<string, InternalField>;

type CustomTypeData = {
  fields: CustomTypeFields;
  type: 'customType';
};

type InternalCustomTypeData = CustomTypeData & {
  fields: InternalModelFields;
};

export type CustomTypeParamShape = {
  fields: CustomTypeFields;
};

export type CustomType<T extends CustomTypeParamShape> = T &
  Brand<'customType'>;

/**
 * Internal representation of CustomType that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalCustomType = CustomType<any> & {
  data: InternalCustomTypeData;
};

function _customType<T extends CustomTypeParamShape>(fields: T['fields']) {
  const data: CustomTypeData = {
    fields,
    type: 'customType',
  };

  return { data } as InternalCustomType as CustomType<T>;
}

export function customType<T extends CustomTypeFields>(
  fields: T,
): CustomType<{ fields: T }> {
  return _customType(fields);
}
