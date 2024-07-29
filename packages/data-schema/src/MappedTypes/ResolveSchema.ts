import type { _Internal_ModelType } from '../ModelType';
import type { GenericModelSchema } from '../ModelSchema';
import type {
  _Internal_ModelRelationalField,
  _Internal_ModelRelationshipTypes,
  RelationTypeFunctionOmitMapping,
} from '../ModelRelationalField';
import type { BaseModelField } from '../ModelField';
import type { _Internal_CustomType, CustomTypeParamShape } from '../CustomType';
import type { _Internal_EnumType } from '../EnumType';
import type { _Internal_RefType, RefTypeParamShape } from '../RefType';
import type {
  _Internal_CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';

export type ResolveSchema<Schema> = FieldTypes<ModelTypes<SchemaTypes<Schema>>>;

// TODO: find better name
export type SchemaTypes<T> =
  T extends GenericModelSchema<any> ? T['data']['types'] : never;

/**
 * Resolves model types
 *
 * Removes CustomTypes and Enums from resolved schema.
 * They are extracted separately in ExtractNonModelTypes.ts and
 * added to ModelMeta in ClientSchema.ts
 */
export type ModelTypes<Schema> = {
  [Model in keyof Schema as Schema[Model] extends
    | _Internal_EnumType
    | _Internal_CustomType<CustomTypeParamShape>
    | _Internal_CustomOperation<CustomOperationParamShape, any>
    ? never
    : Model]: Schema[Model] extends _Internal_ModelType<infer R, any>
    ? R['fields']
    : never;
};

/**
 * Gets the collection of all ModelTypes and CustomTypes which are explicitly
 * defined in the schema.
 */
export type ModelAndCustomTypes<Schema> = {
  [Model in keyof Schema as Schema[Model] extends
    | _Internal_EnumType
    | _Internal_CustomOperation<CustomOperationParamShape, any>
    ? never
    : // TODO: This should use BaseModel, but seems to only work because it relies on
      // omitting extra methods
      Model]: Schema[Model] extends
    | _Internal_ModelType<any, any>
    | _Internal_CustomType<CustomTypeParamShape>
    ? Schema[Model]
    : never;
};

/**
 * Resolves field types
 *
 * Non-model types are replaced with Refs. Refs remain and are resolved in ResolveFieldProperties.ts
 */
export type FieldTypes<T> = {
  [ModelProp in keyof T]: {
    [FieldProp in keyof T[ModelProp]]: T[ModelProp][FieldProp] extends BaseModelField<
      // Match the most common field type to improve resolving performance
      infer R
    >
      ? R
      : T[ModelProp][FieldProp] extends _Internal_RefType<
            infer R extends RefTypeParamShape,
            any,
            any
          >
        ? // leave Ref as-is. We'll resolve it to the linked entity downstream in ResolveFieldProperties
          R['valueRequired'] extends true
          ? T[ModelProp][FieldProp]
          : T[ModelProp][FieldProp] | null
        : // replace non-model types with Ref
          T[ModelProp][FieldProp] extends
              | _Internal_EnumType
              | _Internal_CustomType<CustomTypeParamShape>
          ? _Internal_RefType<{
              link: `${Capitalize<ModelProp & string>}${Capitalize<
                FieldProp & string
              >}`;
              type: 'ref';
              valueRequired: false;
              array: false;
              arrayRequired: false;
              authorization: [];
            }> | null
          : // resolve relational and model fields to the their first type arg
            T[ModelProp][FieldProp] extends _Internal_ModelRelationalField<
                infer R,
                string,
                RelationTypeFunctionOmitMapping<_Internal_ModelRelationshipTypes>,
                any
              >
            ? R
            : never;
  };
};

/**
 * Resolves field types for a CustomType.
 *
 * This utility type is needed in addition to the `FieldTypes` utility type as
 * without checking `ModelRelationalField` can improve ~5% on resolving performance.
 *
 * Non-model types are replaced with Refs. Refs remain and are resolved in ResolveFieldProperties.ts
 */
export type FieldTypesOfCustomType<T> = {
  [CustomTypeName in keyof T]: {
    [FieldProp in keyof T[CustomTypeName]]: T[CustomTypeName][FieldProp] extends BaseModelField<
      infer R
    >
      ? R
      : T[CustomTypeName][FieldProp] extends _Internal_RefType<
            infer R extends RefTypeParamShape,
            any,
            any
          >
        ? // leave Ref as-is. We'll resolve it to the linked entity downstream in ResolveFieldProperties
          R['valueRequired'] extends true
          ? T[CustomTypeName][FieldProp]
          : T[CustomTypeName][FieldProp] | null
        : // replace non-model types with Ref
          T[CustomTypeName][FieldProp] extends
              | _Internal_EnumType
              | _Internal_CustomType<CustomTypeParamShape>
          ? _Internal_RefType<{
              link: `${Capitalize<CustomTypeName & string>}${Capitalize<
                FieldProp & string
              >}`;
              type: 'ref';
              valueRequired: false;
              array: false;
              arrayRequired: false;
              authorization: [];
            }> | null
          : never;
  };
};
