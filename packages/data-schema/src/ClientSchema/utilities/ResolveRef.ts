import type { RefTypeParamShape } from '../../RefType';

/**
 * Dereferences an `a.ref()` against a given "bag" of independently resolved types.
 *
 * This util will examine the ref for requiredness and array-ness and wrap/augment
 * to referred-to type accordingly.
 */
export type ResolveRef<
  RefShape extends RefTypeParamShape,
  RefBag extends Record<string, { __entityType: string; type: unknown }>,
> = ResolveRefValueArrayTraits<
  RefShape,
  ApplyRequiredness<
    RefShape['link'] extends keyof RefBag
      ? RefBag[RefShape['link']]['type']
      : never,
    RefShape['valueRequired']
  >
>;

export type ApplyRequiredness<
  Value,
  MakeRequired extends boolean,
> = MakeRequired extends true ? Exclude<Value, null> : Value | null | undefined;

/**
 * Converts the resolved RefType Value type into Array<> according to the
 * `array` and `arrayRequired` properties of the RefType
 */
export type ResolveRefValueArrayTraits<
  Ref extends RefTypeParamShape,
  Value,
> = Ref['array'] extends false
  ? Value
  : Ref['arrayRequired'] extends true
    ? Array<Value>
    : Array<Value> | null | undefined;
