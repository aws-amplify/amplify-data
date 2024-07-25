import type { brandSymbol } from './util/Brand.js';

type EnumTypeParamShape<values extends readonly string[] = readonly string[]> =
  {
    type: 'enum';
    values: values;
  };

/**
 * INTERNAL: This type is exported to allow users to compile declaration (*.d.ts) files.
 * Direct use of this type may result in changes that break you build across minor versions.
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
