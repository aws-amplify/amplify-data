import { Authorization } from './Authorization';

/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
export const __auth = Symbol('__auth');

export enum ModelFieldType {
  Id = 'ID',
  String = 'String',
  Integer = 'Int',
  Float = 'Float',
  Boolean = 'Boolean',
  Date = 'AWSDate',
  Time = 'AWSTime',
  DateTime = 'AWSDateTime',
  Timestamp = 'AWSTimestamp',
  Email = 'AWSEmail',
  JSON = 'AWSJSON',
  Phone = 'AWSPhone',
  Url = 'AWSURL',
  IPAddress = 'AWSIPAddress',
}

export enum ModelFieldDataType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'Date',
  JSON = 'any',
}

type FieldData = {
  fieldType: ModelFieldType;
  optional: boolean;
  array: boolean;
  arrayOptional: boolean;
  default: undefined | ModelFieldTypeParamOuter;
  authorization: Authorization<any, any>[];
};

type ModelFieldTypeParamInner = string | number | boolean | Date | null;

type ModelFieldTypeParamOuter =
  | ModelFieldTypeParamInner
  | Array<ModelFieldTypeParamInner>
  | null;

type ToArray<T> = [T] extends [ModelFieldTypeParamInner] ? Array<T> : never;

/**
 * Public API for the chainable builder methods exposed by Model Field.
 * The type is narrowing e.g., after calling .array() it will be omitted from intellisense suggestions
 *
 * @typeParam T - holds the JS data type of the field
 * @typeParam K - union of strings representing already-invoked method names. Used to improve Intellisense
 */
export type ModelField<
  T extends ModelFieldTypeParamOuter,
  // rename K
  K extends keyof ModelField<T> = never,
  Auth = undefined
> = Omit<
  {
    optional(): ModelField<T | null, K | 'optional'>;
    // Exclude `optional` after calling array, because both the value and the array itself can be optional
    array(): ModelField<ToArray<T>, Exclude<K, 'optional'> | 'array'>;
    // TODO: should be T, but .array breaks this constraint. Fix later
    default(val: ModelFieldTypeParamOuter): ModelField<T, K | 'default'>;
    authorization<AuthRuleType extends Authorization<any, any>>(
      rules: AuthRuleType[]
    ): ModelField<T, K | 'authorization', AuthRuleType>;
  },
  K
> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
};

/**
 * Internal representation of Model Field that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalField = ModelField<ModelFieldTypeParamOuter, never> & {
  data: FieldData;
};

