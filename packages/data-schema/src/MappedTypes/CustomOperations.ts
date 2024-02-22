import type { ModelSchema } from '../ModelSchema';
import type { NonModelTypesShape } from './ExtractNonModelTypes';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';
import type { ModelField } from '../ModelField';
import { RefType, RefTypeParamShape } from '../RefType';

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
        Bag<FullyResolvedSchema, NonModelTypes>
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
  Bag extends Record<string, unknown>,
> = Shape['returnType'] extends RefType<infer RefShape, any, any>
  ? ResolveRef<RefShape, Bag>
  : Shape['returnType'] extends ModelField<infer R, any, any>
    ? R
    : never;

/**
 * `a.ref()` resolution specific to custom operations, for which `a.ref()`
 * can refer to a model, custom type, or enum.
 */
export type ResolveRef<
  Shape extends RefTypeParamShape,
  Bag extends Record<string, unknown>,
> = Shape['link'] extends keyof Bag
  ? Shape['required'] extends true
    ? Bag[Shape['link']]
    : Bag[Shape['link']] | null
  : never;

/**
 * Small utility to provided a merged view of models, custom types, and enums
 * from a schema and nonModel-types.
 */
export type Bag<
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
> = FullyResolvedSchema & NonModelTypes['customTypes'] & NonModelTypes['enums'];
