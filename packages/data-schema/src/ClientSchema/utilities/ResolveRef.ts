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
  Link = RefShape['link'],
  RefValue = Link extends keyof RefBag ? RefBag[Link]['type'] : never,
  Value = RefShape['valueRequired'] extends true ? RefValue : RefValue | null,
> = ResolveRefValueArrayTraits<RefShape, Value>;

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
    : Array<Value> | null;
