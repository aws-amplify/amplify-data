import type { RefTypeParamShape } from '../../RefType';

/**
 * `a.ref()` resolution specific to custom operations, for which `a.ref()`
 * can refer to a model, custom type, or enum.
 *
 * This utility is a duplication of ResolveRef (src/MappedTypes/ResolveFieldProperties.ts)
 * with the addition that allows .ref() a model with custom operations.
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

type ApplyRequiredness<
  Value,
  MakeRequired extends boolean,
> = MakeRequired extends true ? Exclude<Value, null> : Value | null;

/**
 * Converts the resolved RefType Value type into Array<> according to the
 * `array` and `arrayRequired` properties of the RefType
 */
type ResolveRefValueArrayTraits<
  Ref extends RefTypeParamShape,
  Value,
> = Ref['array'] extends false
  ? Value
  : Ref['arrayRequired'] extends true
    ? Array<Value>
    : Array<Value> | null;
