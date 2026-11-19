import type { brandSymbol } from './util/Brand.js';
import { brand } from './util';

const brandName = 'enum';

type EnumTypeParamShape<values extends readonly string[] = readonly string[]> =
  {
    type: 'enum';
    values: values;
  };

type EnumTypeData = {
  default: undefined | string;
};

/**
 * Enum type definition content
 *
 * @param values - The values of the enum
 */
export interface EnumType<values extends readonly string[] = readonly string[]>
  extends EnumTypeParamShape<values> {
  [brandSymbol]: 'enum';

  /**
   * Sets a default value for the enum type.
   * @param value - The default value, which must be one of the enum's values
   */
  default(value: values[number]): EnumType<values>;
}

/**
 * Internal representation of Enum that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalEnumType<
  values extends readonly string[] = readonly string[],
> = EnumType<values> & {
  data: EnumTypeData;
};

function _enum<values extends readonly string[]>(values: values) {
  const data: EnumTypeData = {
    default: undefined,
  };

  const builder = {
    default(value: values[number]) {
      data.default = value;

      return this;
    },
    ...brand(brandName),
  };

  return {
    ...builder,
    data,
    type: 'enum',
    values,
  } as InternalEnumType<values> as EnumType<values>;
}

/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
export function enumType<const values extends readonly string[]>(
  values: values,
) {
  return _enum(values);
}
