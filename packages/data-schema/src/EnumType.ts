import type { brandSymbol } from './util/Brand.js';

type EnumTypeParamShape<values extends readonly string[] = readonly string[]> =
  {
    type: 'enum';
    values: values;
  };

/**
 * # INTERNAL
 *
 * Not intended to be consumed directly, as naming and factoring
 * is subject to change.
 */
export interface _Internal_EnumType<
  values extends readonly string[] = readonly string[],
> extends EnumTypeParamShape<values> {
  [brandSymbol]: 'enum';
}

function _enum<values extends readonly string[]>(values: values) {
  const data: EnumTypeParamShape = {
    type: 'enum',
    values,
  };

  return data as _Internal_EnumType<values>;
}

/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
export function enumType<const values extends readonly string[]>(
  values: values,
) {
  return _enum(values);
}
