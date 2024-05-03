import type { CustomOperationParamShape } from '../../CustomOperation';
import type { ModelField } from '../../ModelField';
import type { RefType } from '../../RefType';
import type { ResolveFieldRequirements } from '../../MappedTypes/ResolveFieldProperties';
import type { AppSyncResolverHandler } from 'aws-lambda';
import type { CustomType } from '../../CustomType';
import type { FieldTypesOfCustomType } from '../../MappedTypes/ResolveSchema';
import type { ResolveRef } from '../utilities/ResolveRef';
import { ClientSchemaProperty } from './ClientSchemaProperty';

type CustomOperationSubType<Op extends CustomOperationParamShape> =
  `custom${Op['typeName']}`;

/**
 * Derives the signature and types for a lambda handler for a particular
 * custom Query or Mutation from a Schema.
 */
export interface ClientCustomOperation<
  RefBag extends Record<any, any>,
  Op extends CustomOperationParamShape,
> extends ClientSchemaProperty {
  __entityType: CustomOperationSubType<Op>;

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
    CustomOpArguments<Op>,
    LambdaReturnType<CustomOpReturnType<Op, RefBag>>
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
  args: CustomOpArguments<Op>;

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
  returnType: LambdaReturnType<CustomOpReturnType<Op, RefBag>>;

  type: CustomOpReturnType<Op, RefBag>;
}

/**
 * Digs out custom operation arguments, mapped to the intended graphql types.
 */
type CustomOpArguments<Shape extends CustomOperationParamShape> =
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
type CustomOpReturnType<
  Shape extends CustomOperationParamShape,
  RefBag extends Record<string, any>,
> =
  Shape['returnType'] extends RefType<infer RefShape, any, any>
    ? RefShape['link'] extends keyof RefBag
      ? ResolveRef<RefShape, RefBag>
      : never
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