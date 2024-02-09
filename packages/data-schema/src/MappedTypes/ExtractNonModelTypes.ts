import type { UnionToIntersection } from '@aws-amplify/data-schema-types';
import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';
import type { SchemaTypes, ModelTypes } from './ResolveSchema';
import type { ModelField } from '../ModelField';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';
// import { ResolveRef } from './ResolveFieldProperties';
import { RefType, RefTypeParamShape } from '../RefType';
import { ModelType } from '../ModelType';

export type NonModelTypesShape = {
  enums: Record<string, EnumType<any>>;
  customTypes: Record<string, any>;
  customOperations: Record<string, any>;
};

export type ExtractNonModelTypes<Schema> = ResolveRefs<
  Schema,
  ResolveNonModelFields<
    ResolveNonModelTypes<Schema, ExtractImplicitNonModelTypes<Schema>>
  >
>;

type ResolveCustomOpRef<
  Schema,
  NonModelTypes extends NonModelTypesShape,
  Ref extends RefTypeParamShape,
  Link extends string = Ref['link'],
  Value = Link extends keyof NonModelTypes['enums']
    ? NonModelTypes['enums'][Link]
    : Link extends keyof NonModelTypes['customTypes']
      ? NonModelTypes['customTypes'][Link]
      : Link extends keyof SchemaTypes<Schema>
        ? // kind of getting close here ... but, seems like i'll run into trouble if i
          // try to dig the model type out at this stage. i should probably pass the ref
          // directly through here and dig it out ... later ... right?
          // possibly even in the client. have the client, which has easy access to the
          // fully "resolved" types dig it out. unless ... unless i can ask for the
          // resolved schema/models here. maybe i can do that. this gets added as metadata.
          // so, the "math" that lead up to this can probably be done after models are resolved. :think-face:
          // that might actually make the most sense. but, it's monday's problem now. :beer-glasses-or-whatever:
          SchemaTypes<Schema>[Link]
        : never,
> = Ref['required'] extends true ? Value : Value | null;

type ResolveRefs<Schema, Shape extends NonModelTypesShape> = {
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
        ? ResolveCustomOpRef<Schema, Shape, RefShape>
        : Shape['customOperations'][OpName]['returnType'] extends ModelField<
              infer R,
              any,
              any
            >
          ? R
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
