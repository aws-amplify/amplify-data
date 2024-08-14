import type { brandSymbol } from './util/Brand.js';

type EnumTypeParamShape<values extends readonly string[] = readonly string[]> =
  {
    type: 'enum';
    values: values;
  };

/**
 * Enum type definition content
 *
 * @param values - The values of the enum
 */
export interface EnumType<values extends readonly string[] = readonly string[]>
  extends EnumTypeParamShape<values> {
  [brandSymbol]: 'enum';
}

function _enum<values extends readonly string[]>(values: values) {
  const data: EnumTypeParamShape = {
    type: 'enum',
    values,
  };

  return data as EnumType<values>;
}

/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
export function enumType<const values extends readonly string[]>(
  values: values,
) {
  return _enum(values);
}
