import type { GenericModelSchema } from '../ModelSchema';
import type { NonModelTypesShape } from './ExtractNonModelTypes';
import type {
  CustomOperation,
  CustomOperationParamShape,
} from '../CustomOperation';
import type { ModelField } from '../ModelField';
import type { RefType, RefTypeParamShape } from '../RefType';
import type {
  ResolveFieldRequirements,
  ResolveRefsOfCustomType,
  ResolveRefValueArrayTraits,
} from './ResolveFieldProperties';
import type { AppSyncResolverHandler } from 'aws-lambda';
import type { CustomType } from '../CustomType';
import type { FieldTypesOfCustomType } from './ResolveSchema';

/**
 * Creates meta types for custom operations from a schema.
 */
export type ResolveCustomOperations<
  Schema extends GenericModelSchema<any>,
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
  CustomOperations extends Record<
    string,
    CustomOperationParamShape
  > = CustomOpShapes<Schema>,
> = {
  customOperations: {
    [OpName in keyof CustomOperations]: {
      arguments: CustomOpArguments<CustomOperations[OpName]>;
      returnType: CustomOpReturnType<
        CustomOperations[OpName],
        FullyResolvedSchema,
        NonModelTypes,
        CustomOperations
      >;
      functionRef: CustomOperations[OpName]['functionRef'];
      typeName: CustomOperations[OpName]['typeName'];
      authorization: CustomOperations[OpName]['authorization'];
    };
  };
};

/**
 * Filtered, mapped list of custom operations shapes from a schema.
 */
export type CustomOpShapes<Schema extends GenericModelSchema<any>> = {
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
export type CustomOpArguments<Shape extends CustomOperationParamShape> =
  Shape['arguments'] extends null
    ? never
    : ResolveFieldRequirements<{
        [FieldName in keyof Shape['arguments']]: Shape['arguments'][FieldName] extends ModelField<
          infer R,
          any,
          any
        >
          ? R
          : never;
      }>;

/**
 * Computes the return type from the `returnType` of a custom operation shape.
 *
 * This entails dereferencing refs and inferring graphql types from field-type defs.
 */
export type CustomOpReturnType<
  Shape extends CustomOperationParamShape,
  FullyResolvedSchema extends Record<string, unknown>,
  NonModelTypes extends NonModelTypesShape,
  CustomOperations extends Record<string, CustomOperationParamShape>,
> =
  Shape['returnType'] extends RefType<infer RefShape, any, any>
    ? RefShape['link'] extends keyof CustomOperations
      ? // The case that a custom subscription's return type is set from its resource
        CustomOpReturnType<
          CustomOperations[RefShape['link']],
          FullyResolvedSchema,
          NonModelTypes,
          CustomOperations
        >
      : ResolveRef<
          RefShape,
          FullyResolvedSchema,
          NonModelTypes,
          CustomOperations
        >
    : Shape['returnType'] extends ModelField<infer R, any, any>
      ? R
      : Shape['returnType'] extends CustomType<infer R>
        ?
            | ResolveFieldRequirements<
                FieldTypesOfCustomType<{
                  thisCustomType: R['fields'];
                }>['thisCustomType']
              > // The inline `.customType()` with a custom operation doesn't have
            // `.required()` modifier, hence it's nullable
            | null
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
  CustomOperations extends Record<string, CustomOperationParamShape>,
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
        : Link extends keyof CustomOperations
          ? // e.g. .subscription().for(a.ref('aCustomMutation'))
            CustomOpReturnType<
              CustomOperations[Link],
              FullyResolvedSchema,
              NonModelTypes,
              CustomOperations
            >
          : never,
  Value = Shape['valueRequired'] extends true ? RefValue : RefValue | null,
> = ResolveRefValueArrayTraits<Shape, Value>;

//
// To support exposing custom handler types.
//

/**
 * The kind of shape we need to map to custom handler (e.g., lambda) function
 * signatures.
 */
type CustomOperationsMap = Record<string, CustomOperationMinimalDef>;

/**
 * The minimal amount of structure needed to extract types for a custom handler.
 */
type CustomOperationMinimalDef = {
  arguments: any;
  returnType: any;
};

/**
 * Derives the signature and types for a lambda handler for a particular
 * custom Query or Mutation from a Schema.
 */
type IndividualCustomHandlerTypes<Op extends CustomOperationMinimalDef> = {
  /**
   * Handler type for lambda function implementations. E.g.,
   *
   * ```typescript
   * import type { Schema } from './resource';
   *
   * export const handler: Schema['echo']['functionHandler'] = async (event, context) => {
   *  // event and context will be fully typed inside here.
   * }
   * ```
   */
  functionHandler: AppSyncResolverHandler<
    Op['arguments'],
    LambdaReturnType<Op['returnType']>
  >;

  /**
   * The `context.arguments` type for lambda function implementations.
   *
   * ```typescript
   * import type { Schema } from './resource';
   *
   * export const handler: Schema['echo']['functionHandler'] = async (event, context) => {
   *  // Provides this type, if needed:
   *  const args: Schema['echo']['functionHandlerArguments'] = event.arguments;
   * }
   * ```
   */
  functionHandlerArguments: Op['arguments'];

  /**
   * The return type expected by a lambda function handler.
   *
   * ```typescript
   * import type { Schema } from './resource';
   *
   * export const handler: Schema['echo']['functionHandler'] = async (event, context) => {
   *  // Result type enforced here:
   *  const result: Schema['echo']['functionHandlerResult'] = buildResult(...);
   *
   *  // `Result` type matches expected function return type here:
   *  return result;
   * }
   * ```
   */
  functionHandlerResult: LambdaReturnType<Op['returnType']>;
};

/**
 * Derives the function signatures for a lambda handlers for all the provided
 * custom queries and mutations.
 */
export type CustomOperationHandlerTypes<
  CustomOperations extends CustomOperationsMap,
> = {
  [K in keyof CustomOperations]: IndividualCustomHandlerTypes<
    CustomOperations[K]
  >;
};

/**
 * Returns a return type with lazy loaders removed.
 *
 * (Custom handlers should not return lazy loaded fields -- they're *lazy loaded*.)
 */
type LambdaReturnType<T> =
  T extends Record<string, any>
    ? {
        // Return type can include `null | undefined`, which we can't meaningfully
        // map over.
        [K in keyof Exclude<T, null | undefined> as Exclude<
          T,
          null | undefined
        >[K] extends (...args: any) => any
          ? never
          : K]: Exclude<T, null | undefined>[K];
      }
    :
        | T
        // If the original return type allowed null | undefined, mix them back into
        // the final return type
        | (null extends T ? null : never)
        | (undefined extends T ? undefined : never);
