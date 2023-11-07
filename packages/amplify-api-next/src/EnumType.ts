import { Brand } from '@aws-amplify/amplify-api-next-types-alpha';

type EnumTypeData = {
  type: 'enum';
  values: readonly string[];
};

export type EnumTypeParamShape = {
  type: 'enum';
  values: readonly string[];
};

export type EnumType<T extends EnumTypeParamShape> = Brand<T, 'enum'>;

function _enum<T extends EnumTypeParamShape>(values: T['values']) {
  const data: EnumTypeData = {
    type: 'enum',
    values,
  };

  return data as EnumType<T>;
}

type EnumTypeArgFactory<Values extends readonly string[]> = {
  type: 'enum';
  values: Values;
};

/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
export function enumType<Value extends string, T extends readonly Value[]>(
  values: T,
) {
  return _enum<EnumTypeArgFactory<T>>(values);
}
