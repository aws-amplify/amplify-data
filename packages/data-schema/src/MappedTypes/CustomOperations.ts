import type { ModelSchema } from '../ModelSchema';
import type { NonModelTypesShape } from './ExtractNonModelTypes';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';
import type { ModelField } from '../ModelField';
import { RefType, RefTypeParamShape } from '../RefType';

export type ResolveCustomOperations<
  Schema extends ModelSchema<any, any>,
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
> = {
  //   customOperationsRaw: CustomOpShapes<Schema>;
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

type CustomOpShapes<Schema extends ModelSchema<any, any>> = {
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

type CustomOpArguments<Shape extends CustomOperationParamShape> = {
  [FieldName in keyof Shape['arguments']]: Shape['arguments'][FieldName] extends ModelField<
    infer R,
    any,
    any
  >
    ? R
    : never;
};

type CustomOpReturnType<
  Shape extends CustomOperationParamShape,
  Bag extends Record<string, unknown>,
> = Shape['returnType'] extends RefType<infer RefShape, any, any>
  ? ResolveRef<RefShape, Bag>
  : Shape['returnType'] extends ModelField<infer R, any, any>
    ? R
    : never;

type ResolveRef<
  Shape extends RefTypeParamShape,
  Bag extends Record<string, unknown>,
> = Shape['link'] extends keyof Bag
  ? Shape['required'] extends true
    ? Bag[Shape['link']]
    : Bag[Shape['link']] | null
  : never;

type Bag<
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
> = FullyResolvedSchema & NonModelTypes['customTypes'] & NonModelTypes['enums'];
