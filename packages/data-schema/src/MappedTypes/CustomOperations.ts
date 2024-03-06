import type { ModelSchema } from '../ModelSchema';
import type { NonModelTypesShape } from './ExtractNonModelTypes';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';
import type { ModelField } from '../ModelField';
import type { RefType, RefTypeParamShape } from '../RefType';
import type {
  ResolveRefsOfCustomType,
  ResolveRefValueArrayTraits,
} from './ResolveFieldProperties';

/**
 * Creates meta types for custom operations from a schema.
 */
export type ResolveCustomOperations<
  Schema extends ModelSchema<any, any>,
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
> = {
  customOperations: {
    [OpName in keyof CustomOpShapes<Schema>]: {
      arguments: CustomOpArguments<CustomOpShapes<Schema>[OpName]>;
      returnType: CustomOpReturnType<
        CustomOpShapes<Schema>[OpName],
        FullyResolvedSchema,
        NonModelTypes
      >;
      functionRef: CustomOpShapes<Schema>[OpName]['functionRef'];
      typeName: CustomOpShapes<Schema>[OpName]['typeName'];
      authorization: CustomOpShapes<Schema>[OpName]['authorization'];
    };
  };
};

/**
 * Filtered, mapped list of custom operations shapes from a schema.
 */
export type CustomOpShapes<Schema extends ModelSchema<any, any>> = {
  [K in keyof Schema['data']['types'] as Schema['data']['types'][K] extends CustomOperation<
    any,
    any
  >
    ? K
    : never]: Schema['data']['types'][K] extends CustomOperation<
    infer Shape,
    any
  >
    ? Shape
    : never;
};

/**
 * Digs out custom operation arguments, mapped to the intended graphql types.
 */
export type CustomOpArguments<Shape extends CustomOperationParamShape> = {
  [FieldName in keyof Shape['arguments']]: Shape['arguments'][FieldName] extends ModelField<
    infer R,
    any,
    any
  >
    ? R
    : never;
};

/**
 * Computes the return type from the `returnType` of a custom operation shape.
 *
 * This entails dereferencing refs and inferring graphql types from field-type defs.
 */
export type CustomOpReturnType<
  Shape extends CustomOperationParamShape,
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
> = Shape['returnType'] extends RefType<infer RefShape, any, any>
  ? ResolveRef<RefShape, FullyResolvedSchema, NonModelTypes>
  : Shape['returnType'] extends ModelField<infer R, any, any>
    ? R
    : never;

/**
 * `a.ref()` resolution specific to custom operations, for which `a.ref()`
 * can refer to a model, custom type, or enum.
 *
 * This utility is a duplication of ResolveRef (src/MappedTypes/ResolveFieldProperties.ts)
 * with the addition that allows .ref() a model with custom operations.
 */
export type ResolveRef<
  Shape extends RefTypeParamShape,
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
  Link = Shape['link'],
  RefValue = Link extends keyof FullyResolvedSchema
    ? FullyResolvedSchema[Link]
    : Link extends keyof NonModelTypes['enums']
      ? NonModelTypes['enums'][Link]
      : Link extends keyof NonModelTypes['customTypes']
        ? ResolveRefsOfCustomType<
            NonModelTypes,
            NonModelTypes['customTypes'][Link]
          >
        : never,
  Value = Shape['valueRequired'] extends true ? RefValue : RefValue | null,
> = ResolveRefValueArrayTraits<Shape, Value>;
