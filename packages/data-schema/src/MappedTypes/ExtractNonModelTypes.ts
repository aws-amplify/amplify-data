import type { UnionToIntersection } from '@aws-amplify/data-schema-types';
import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';
import type { SchemaTypes, ModelTypes } from './ResolveSchema';
import type { ModelField } from '../ModelField';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';
import { ResolveRef } from './ResolveFieldProperties';
import { RefType, RefTypeParamShape } from '../RefType';

export type NonModelTypesShape = {
  enums: Record<string, EnumType<any>>;
  customTypes: Record<string, any>;
  customOperations: Record<string, any>;
};

export type ExtractNonModelTypes<Schema> = ResolveRefs<
  ResolveNonModelFields<
    ResolveNonModelTypes<Schema, ExtractImplicitNonModelTypes<Schema>>
  >
>;

type ResolveRefs<Shape extends NonModelTypesShape> = {
  enums: Shape['enums'];
  customTypes: Shape['customTypes'];
  customOperations: {
    [OpName in keyof Shape['customOperations']]: Omit<
      Shape['customOperations'][OpName],
      'returnType'
    > & {
      returnType: Shape['customOperations'][OpName]['returnType'] extends RefType<
        infer RefShape
      >
        ? ResolveRef<Shape, RefShape>
        : never;
    };
  };
};

/**
 * Pulls out implicit, i.e. field-level non-model types from Schema
 */
type ExtractImplicitNonModelTypes<
  Schema,
  ResolvedModels = ModelTypes<SchemaTypes<Schema>>,
> = UnionToIntersection<
  {
    [Model in keyof ResolvedModels]: {
      [Field in keyof ResolvedModels[Model] as ResolvedModels[Model][Field] extends
        | EnumType<EnumTypeParamShape>
        | CustomType<CustomTypeParamShape>
        ? `${Capitalize<Field & string>}`
        : never]: ResolvedModels[Model][Field];
    };
  }[keyof ResolvedModels]
>;

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
  customOperations: {
    [Model in keyof ResolvedSchema as ResolvedSchema[Model] extends CustomOperation<
      CustomOperationParamShape,
      any
    >
      ? Model
      : never]: ResolvedSchema[Model] extends CustomOperation<
      infer R extends CustomOperationParamShape,
      any
    >
      ? R
      : never;
  };
};

type ResolveNonModelFields<
  T extends NonModelTypesShape,
  CustomTypes = T['customTypes'],
  CustomOps = T['customOperations'],
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
  customOperations: {
    [OpName in keyof CustomOps]: CustomOps[OpName] extends CustomOperationParamShape
      ? {
          arguments: {
            [FieldName in keyof CustomOps[OpName]['arguments']]: CustomOps[OpName]['arguments'][FieldName] extends ModelField<
              infer R,
              any,
              any
            >
              ? R
              : never;
          };
          returnType: CustomOps[OpName]['returnType'];
          functionRef: CustomOps[OpName]['functionRef'];
          typeName: CustomOps[OpName]['typeName'];
          authorization: CustomOps[OpName]['authorization'];
        }
      : never;
  };
};
