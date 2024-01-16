import type { ModelType } from '../ModelType';
import type { ModelSchema } from '../ModelSchema';
import type {
  ModelRelationalField,
  ModelRelationshipTypes,
  RelationTypeFunctionOmitMapping,
} from '../ModelRelationalField';
import type { ModelField } from '../ModelField';
import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';
import type { RefType, RefTypeParamShape } from '../RefType';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';

export type ResolveSchema<Schema> = FieldTypes<ModelTypes<SchemaTypes<Schema>>>;

// TODO: find better name
export type SchemaTypes<T> = T extends ModelSchema<any, any>
  ? T['data']['types']
  : never;

/**
 * Resolves model types
 *
 * Removes CustomTypes and Enums from resolved schema.
 * They are extracted separately in ExtractNonModelTypes.ts and
 * added to ModelMeta in ClientSchema.ts
 */
export type ModelTypes<Schema> = {
  [Model in keyof Schema as Schema[Model] extends
    | EnumType<EnumTypeParamShape>
    | CustomType<CustomTypeParamShape>
    | CustomOperation<CustomOperationParamShape, any>
    ? never
    : Model]: Schema[Model] extends ModelType<infer R, any, any>
    ? R['fields']
    : never;
};

/**
 * Resolves field types
 *
 * Non-model types are replaced with Refs. Refs remain and are resolved in ResolveFieldProperties.ts
 */
export type FieldTypes<T> = {
  [ModelProp in keyof T]: {
    [FieldProp in keyof T[ModelProp]]: T[ModelProp][FieldProp] extends RefType<
      infer R extends RefTypeParamShape,
      any,
      any
    >
      ? // leave Ref as-is. We'll resolve it to the linked entity downstream in ResolveFieldProperties
        R['required'] extends true
        ? T[ModelProp][FieldProp]
        : T[ModelProp][FieldProp] | null
      : // replace non-model types with Ref
        T[ModelProp][FieldProp] extends
            | EnumType<EnumTypeParamShape>
            | CustomType<CustomTypeParamShape>
        ? RefType<{
            link: Capitalize<FieldProp & string>;
            type: 'ref';
            required: false;
            authorization: [];
          }> | null
        : // resolve relational and model fields to the their first type arg
          T[ModelProp][FieldProp] extends ModelRelationalField<
              infer R,
              string,
              RelationTypeFunctionOmitMapping<ModelRelationshipTypes>,
              any
            >
          ? R
          : T[ModelProp][FieldProp] extends ModelField<infer R, any, any>
            ? R
            : never;
  };
};
