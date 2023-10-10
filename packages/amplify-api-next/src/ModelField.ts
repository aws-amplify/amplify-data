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

type FieldMeta = {
  lastInvokedMethod: null | keyof ModelField<ModelFieldTypeParamOuter>;
};

type FieldData = {
  fieldType: ModelFieldType;
  required: boolean;
  array: boolean;
  arrayRequired: boolean;
  default: undefined | ModelFieldTypeParamOuter;
  authorization: Authorization<any, any>[];
};

type ModelFieldTypeParamInner = string | number | boolean | Date | null;

type ModelFieldTypeParamOuter =
  | ModelFieldTypeParamInner
  | Array<ModelFieldTypeParamInner>
  | null;

/**
 * Field type arg mutators
 */
type Nullable<T> = T | null;
type Required<T> = Exclude<T, null>;
type ArrayField<T> = [T] extends [ModelFieldTypeParamInner]
  ? Array<T> | null // optional by default
  : never;

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
  Auth = undefined,
> = Omit<
  {
    required(): ModelField<Required<T>, K | 'required'>;
    // Exclude `optional` after calling array, because both the value and the array itself can be optional
    array(): ModelField<ArrayField<T>, Exclude<K, 'required'> | 'array'>;
    // TODO: should be T, but .array breaks this constraint. Fix later
    default(val: ModelFieldTypeParamOuter): ModelField<T, K | 'default'>;
    authorization<AuthRuleType extends Authorization<any, any>>(
      rules: AuthRuleType[],
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

/**
 * Model Field Implementation
 *
 * @typeParam T - holds the JS data type of the field; invoking the public methods changes this type accordingly
 * @example
 * string() => T = string | null
 * string().array() => T = Array<string | null> | null
 * string().array().required() => T = Array<string | null>
 * string().required().array().required() => T = Array<string>
 *
 * @param fieldType - stores the GraphQL data type of the field
 */
function _field<T extends ModelFieldTypeParamOuter>(fieldType: ModelFieldType) {
  const _meta: FieldMeta = {
    lastInvokedMethod: null,
  };

  const data: FieldData = {
    fieldType,
    required: false,
    array: false,
    arrayRequired: false,
    default: undefined,
    authorization: [],
  };

  const builder: ModelField<T> = {
    required() {
      if (_meta.lastInvokedMethod === 'array') {
        data.arrayRequired = true;
      } else {
        data.required = true;
      }

      _meta.lastInvokedMethod = 'required';

      return this;
    },
    array(): ModelField<ArrayField<T>> {
      data.array = true;
      _meta.lastInvokedMethod = 'array';

      return this;
    },
    default(val) {
      data.default = val;
      _meta.lastInvokedMethod = 'default';

      return this;
    },
    authorization(rules) {
      data.authorization = rules;
      _meta.lastInvokedMethod = 'authorization';

      return this;
    },
  };

  // this double cast gives us a Subtyping Constraint i.e., hides `data` from the public API,
  // but makes it available internally when needed
  return { ...builder, data } as InternalField as ModelField<T>;
}

function id(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Id);
}

function string(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.String);
}

function integer(): ModelField<Nullable<number>> {
  return _field(ModelFieldType.Integer);
}

function float(): ModelField<Nullable<number>> {
  return _field(ModelFieldType.Float);
}

function boolean(): ModelField<Nullable<boolean>> {
  return _field(ModelFieldType.Boolean);
}

function date(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Date);
}

function time(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Time);
}

function datetime(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.DateTime);
}

function timestamp(): ModelField<Nullable<number>> {
  return _field(ModelFieldType.Timestamp);
}

function email(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Email);
}

function json(): ModelField<Nullable<any>> {
  return _field(ModelFieldType.JSON);
}

function phone(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Phone);
}

function url(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Url);
}

function ipAddress(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.IPAddress);
}

export const fields = {
  id,
  string,
  integer,
  float,
  boolean,
  date,
  time,
  datetime,
  timestamp,
  email,
  json,
  phone,
  url,
  ipAddress,
};
