import type { ModelType } from '../ModelType';
import type { ModelSchema } from '../ModelSchema';
import type { ModelRelationalField } from '../ModelRelationalField';
import type { ModelField } from '../ModelField';
import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';
import type { RefType, RefTypeParamShape } from '../RefType';
import { Authorization } from '../Authorization';

export type ResolveSchema<Schema> = FieldTypes<ModelTypes<SchemaTypes<Schema>>>;

// TODO: find better name
export type SchemaTypes<T> = T extends ModelSchema<infer R>
  ? R['types']
  : never;

/**
 * Resolves model types
 *
 * Removes CustomTypes and Enums from resolved schema.
 * They are extracted separately in ExtractNonModelTypes.ts and
 * added to ModelMeta in ClientSchema.ts
 */
export type ModelTypes<Schema> = {
  [Model in keyof Schema as Schema[Model] extends EnumType<EnumTypeParamShape>
    ? never
    : Schema[Model] extends CustomType<CustomTypeParamShape>
    ? never
    : Model]: Schema[Model] extends ModelType<infer R, any>
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
      never | 'required' | 'authorization',
      never | Authorization<any, any>
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
          never,
          any
        >
      ? R
      : T[ModelProp][FieldProp] extends ModelField<infer R, any, any>
      ? R
      : never;
  };
};
