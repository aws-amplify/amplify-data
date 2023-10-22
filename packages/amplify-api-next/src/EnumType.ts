import {
  Brand,
  // SetTypeSubArg,
} from '@aws-amplify/amplify-api-next-types-alpha';
// import { Authorization } from './Authorization';

type EnumTypeData = {
  type: 'enum';
  values: readonly string[];
  // required: boolean;
  // authorization: Authorization<any, any>[];
};

export type EnumTypeParamShape = {
  type: 'enum';
  values: readonly string[];
  // required: boolean;
  // authorization: Authorization<any, any>[];
};

export type EnumType<
  T extends EnumTypeParamShape,
  // K extends keyof EnumType<T> = never
> = Brand<
  T,
  // Omit<{
  //   required(): EnumType<SetTypeSubArg<T, 'required', true>>;
  // }, K>,
  'enum'
>;

function _enum<T extends EnumTypeParamShape>(values: T['values']) {
  const data: EnumTypeData = {
    type: 'enum',
    values,
    // required: false,
    // authorization: [],
  };

  return data as EnumType<T>;
}

type EnumTypeArgFactory<Values extends readonly string[]> = {
  type: 'enum';
  values: Values;
  // required: false;
  // authorization: [];
};

/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
export function enumType<Value extends string, T extends readonly Value[]>(
  values: T,
) {
  return _enum<EnumTypeArgFactory<T>>(values);
}

/* testing zone */
const _e = enumType(['Hello', 'Is', 'This', 'Me']);
//     ^?

type _Test = typeof _e extends EnumType<infer R> ? R['values'] : false;
//    ^?
