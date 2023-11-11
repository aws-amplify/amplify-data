import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';
import type { SchemaTypes, ModelTypes } from './ResolveSchema';
import type { ModelField } from '../ModelField';

export type NonModelTypesShape = {
  enums: Record<string, EnumType<any>>;
  customTypes: Record<string, any>;
};

export type ExtractNonModelTypes<Schema> = ResolveNonModelFields<
  ResolveNonModelTypes<Schema, ExtractImplicitNonModelTypes<Schema>>
>;

/**
 * Pulls out implicit, i.e. field-level non-model types from Schema
 */
type ExtractImplicitNonModelTypes<
  Schema,
  ResolvedModels = ModelTypes<SchemaTypes<Schema>>,
  ResolvedModelKeys extends keyof ResolvedModels = keyof ResolvedModels,
> = {
  [Field in keyof ResolvedModels[ResolvedModelKeys] as ResolvedModels[ResolvedModelKeys][Field] extends EnumType<EnumTypeParamShape>
    ? `${Capitalize<Field & string>}`
    : ResolvedModels[ResolvedModelKeys][Field] extends CustomType<CustomTypeParamShape>
    ? `${Capitalize<Field & string>}`
    : never]: ResolvedModels[ResolvedModelKeys][Field];
};

type ResolveNonModelTypes<
  Schema,
  Extracted,
  ResolvedSchema = SchemaTypes<Schema> & Extracted,
> = {
  enums: {
    [Model in keyof ResolvedSchema as ResolvedSchema[Model] extends EnumType<EnumTypeParamShape>
      ? Model
      : never]: ResolvedSchema[Model] extends EnumType<
      infer R extends EnumTypeParamShape
    >
      ? R['values'][number]
      : never;
  };
  customTypes: {
    [Model in keyof ResolvedSchema as ResolvedSchema[Model] extends CustomType<CustomTypeParamShape>
      ? Model
      : never]: ResolvedSchema[Model] extends CustomType<
      infer R extends CustomTypeParamShape
    >
      ? R['fields']
      : never;
  };
};

type ResolveNonModelFields<
  T extends NonModelTypesShape,
  CustomTypes = T['customTypes'],
> = {
  enums: T['enums'];
  customTypes: {
    [CustomType in keyof CustomTypes]: {
      [FieldProp in keyof CustomTypes[CustomType]]: CustomTypes[CustomType][FieldProp] extends ModelField<
        infer R,
        any,
        any
      >
        ? R
        : never;
    };
  };
};
