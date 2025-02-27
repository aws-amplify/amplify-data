import { 
  type Authorization,
  type BaseAllowModifier, 
  type AnyAuthorization,
  allow,
} from './Authorization';
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
  authorization: Authorization<any, any, any>[];
};

type InternalCustomTypeData = CustomTypeData & {
  fields: InternalModelFields;
};

export type CustomTypeParamShape = {
  fields: CustomTypeFields;
  authorization: Authorization<any, any, any>[];
};

/**
 * Custom type container
 *
 * @param T - The shape of the custom type container
 */
export type CustomType<T extends CustomTypeParamShape> = T & Brand<'customType'> & {
    /**
     * Configures authorization rules for public, signed-in user, per user, and per user group data access
     *
     * @param callback A function that receives an allow modifier to define authorization rules
     * @returns A ModelType instance with updated authorization rules
     *
     * @example
     * a.customType({}).authorization((allow) => [
     *   allow.guest(),
     *   allow.publicApiKey(),
     *   allow.authenticated(),
     * ])
     */
    authorization<AuthRuleType extends AnyAuthorization>(
      callback: (
        allow: BaseAllowModifier,
      ) => AuthRuleType | AuthRuleType[],
    ): CustomType<T>;
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
    authorization: [],
  };

  const builder = {
    authorization<AuthRuleType extends AnyAuthorization>(callback: (allow: BaseAllowModifier) => AuthRuleType | AuthRuleType[]) {
      const { resource: _, ...rest } = allow;
      const rules = callback(rest);
      data.authorization = Array.isArray(rules) ? rules : [rules];

      return this;
    },
  }

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
 */
export function customType<T extends CustomTypeFields>(
  fields: T,
): CustomType<{ fields: T, authorization: [] }> {
  return _customType(fields);
}
