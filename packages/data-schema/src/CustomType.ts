import type { Brand } from './util';
import type { InternalField, BaseModelField } from './ModelField';
import type { RefType } from './RefType';
import type { EnumType } from './EnumType';

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
  | BaseModelField
  | RefType<any, any, any>
  | EnumType
  | CustomType<CustomTypeParamShape>
>;

type InternalModelFields = Record<string, InternalField>;

type CustomTypeData = {
  fields: CustomTypeFields;
  type: 'customType';
  /**
   * Set by `.required()`. Only meaningful when the custom type is used inline
   * as a field, argument, or return type; a top-level custom type definition
   * cannot be marked required (use `a.ref('TypeName').required()` instead).
   */
  valueRequired: boolean;
};

type InternalCustomTypeData = CustomTypeData & {
  fields: InternalModelFields;
};

export type CustomTypeParamShape = {
  fields: CustomTypeFields;
};

/**
 * Type-only marker carried by custom types that have been marked `.required()`.
 * This property is never set at runtime.
 */
declare const requiredCustomTypeMarker: unique symbol;

/**
 * Custom type container
 *
 * @param T - The shape of the custom type container
 */
export type CustomType<T extends CustomTypeParamShape> = T &
  Brand<'customType'> & {
    /**
     * Marks an inline custom type field as required (non-nullable).
     *
     * Only supported where the custom type is defined inline, e.g. as a model field,
     * as a field of another custom type, or as a custom operation argument / return type.
     * To require a reference to a top-level custom type, use `a.ref('TypeName').required()`.
     *
     * @example
     * a.schema({
     *   Post: a.model({
     *     location: a.customType({
     *       lat: a.float().required(),
     *       long: a.float().required(),
     *     }).required(),
     *   }),
     * });
     */
    required(): RequiredCustomType<T>;
  };

/**
 * A custom type that has been marked as required via `.required()`.
 *
 * @param T - The shape of the custom type container
 */
export type RequiredCustomType<T extends CustomTypeParamShape> = CustomType<T> &
  RequiredCustomTypeMarker;

/**
 * Marker used to detect custom types that have been marked `.required()`.
 */
export type RequiredCustomTypeMarker = {
  // This is a lie. This property is never set at runtime. It's just used to
  // smuggle the requiredness of an inline custom type through the type system.
  readonly [requiredCustomTypeMarker]: true;
};

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
    valueRequired: false,
  };

  const builder = {
    required() {
      data.valueRequired = true;

      return this;
    },
  };

  return { ...builder, data } as InternalCustomType as CustomType<T>;
}

/**
 * Define a custom type. This type represents an inline, typed JSON object.
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/#specify-a-custom-field-type}
 * @param fields the fields to be added to the custom type
 * @returns a custom type
 * @example
 * a.schema({
 *   Post: a.model({
 *     location: a.customType({
 *       lat: a.float(),
 *       long: a.float(),
 *     }),
 *     content: a.string(),
 *   }),
 * });
 * @example
 * a.schema({
 *   Location: a.customType({
 *       lat: a.float(),
 *       long: a.float(),
 *   }),
 *
 *   Post: a.model({
 *     location: a.ref('Location'),
 *     content: a.string(),
 *   }),
 *
 *   User: a.model({
 *     lastKnownLocation: a.ref('Location'),
 *   }),
 * });
 * @example
 * // mark an inline custom type field as required
 * a.schema({
 *   Post: a.model({
 *     location: a.customType({
 *       lat: a.float(),
 *       long: a.float(),
 *     }).required(),
 *   }),
 * });
 */
export function customType<T extends CustomTypeFields>(
  fields: T,
): CustomType<{ fields: T }> {
  return _customType(fields);
}
