import type { brandSymbol } from './util/Brand.js';

/**
 * Type-level marker tracking whether an inline enum field has been marked `.required()`.
 *
 * This is a lie. The property is never set at runtime. It's only used to carry
 * the required-ness of an inline enum field through the type system.
 */
declare const __enumRequired: unique symbol;

type EnumTypeParamShape<values extends readonly string[] = readonly string[]> =
  {
    type: 'enum';
    values: values;
  };

type EnumTypeData = {
  valueRequired: boolean;
};

/**
 * Enum type definition content
 *
 * @param values - The values of the enum
 * @param IsRequired - Whether the inline enum field has been marked as required via `.required()`
 */
export interface EnumType<
  values extends readonly string[] = readonly string[],
  IsRequired extends boolean = false,
> extends EnumTypeParamShape<values> {
  [brandSymbol]: 'enum';

  /**
   * Type-level marker for whether the enum has been marked `.required()`. Never set at runtime.
   */
  [__enumRequired]?: IsRequired;

  /**
   * Marks an inline enum field as required (non-nullable).
   *
   * Only applies to enums defined inline on a model, custom type, or custom operation argument.
   * It is not supported on top-level enum definitions. To require a field that references a
   * top-level enum, use `a.ref('MyEnum').required()` instead.
   *
   * @example
   * a.model({ status: a.enum(['draft', 'published']).required() })
   */
  required(): EnumType<values, true>;
}

/**
 * Internal representation of Enum that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalEnumType<
  values extends readonly string[] = readonly string[],
> = EnumType<values, boolean> & {
  data: EnumTypeData;
};

function _enum<
  values extends readonly string[],
  IsRequired extends boolean = false,
>(values: values, data: EnumTypeData): EnumType<values, IsRequired> {
  const enumDef = {
    type: 'enum' as const,
    values,
    data,
    // Returns a new definition instead of mutating this one, so that an enum
    // definition shared between fields (or with a top-level enum) is never
    // implicitly marked as required.
    required() {
      return _enum<values, true>(values, { ...data, valueRequired: true });
    },
  };

  return enumDef as InternalEnumType<values> as EnumType<values, IsRequired>;
}

/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
export function enumType<const values extends readonly string[]>(
  values: values,
): EnumType<values> {
  return _enum(values, { valueRequired: false });
}
