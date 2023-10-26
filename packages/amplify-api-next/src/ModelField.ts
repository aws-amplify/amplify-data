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
    /**
     * Marks a field as required.
     */
    required(): ModelField<Required<T>, K | 'required'>;
    // Exclude `optional` after calling array, because both the value and the array itself can be optional
    /**
     * Converts a field type definition to an array of the field type.
     */
    array(): ModelField<ArrayField<T>, Exclude<K, 'required'> | 'array'>;
    // TODO: should be T, but .array breaks this constraint. Fix later
    /**
     * Sets a default value for the scalar type.
     * @param value the default value
     */
    default(value: ModelFieldTypeParamOuter): ModelField<T, K | 'default'>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
     * multiple authorization rules for this field.  
     */
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

/**
 * A unique identifier scalar type. This scalar is serialized like a String but isn't meant to be human-readable.
 * If not specified on create operations, a ULID will be auto-generated service-side.
 * @returns ID field definition
 */
function id(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Id);
}

/**
 * A string scalar type that is represented server-side as a UTF-8 character sequence.
 * @returns string field definition
 */
function string(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.String);
}

/**
 * An integer scalar type with a supported value range between -(2^31) and 2^31-1.
 * @returns integer field definition
 */
function integer(): ModelField<Nullable<number>> {
  return _field(ModelFieldType.Integer);
}

/**
 * A float scalar type following represented server-side as an IEEE 754 floating point value.
 * @returns float field definition
 */
function float(): ModelField<Nullable<number>> {
  return _field(ModelFieldType.Float);
}

/**
 * A boolean scalar type that can be either true or false. 
 * @returns boolean field definition
 */
function boolean(): ModelField<Nullable<boolean>> {
  return _field(ModelFieldType.Boolean);
}

/**
 * A date scalar type that is represented server-side as an extended ISO 8601 date string in the format `YYYY-MM-DD`.
 * @returns date field definition
 */
function date(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Date);
}

/**
 * A time scalar type that is represented server-side as an extended ISO 8601 time string in the format `hh:mm:ss.sss`.
 * @returns time field definition
 */
function time(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Time);
}

/**
 * A date time scalar type that is represented server-side as an extended ISO 8601 date and time string in the format `YYYY-MM-DDThh:mm:ss.sssZ`.
 * @returns datetime field definition
 */
function datetime(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.DateTime);
}

/**
 * A timestamp scalar type that is represented by an integer value of the number of seconds before or after `1970-01-01-T00:00Z`.
 * @returns timestamp field definition
 */
function timestamp(): ModelField<Nullable<number>> {
  return _field(ModelFieldType.Timestamp);
}

/**
 * An email scalar type that is represented server-side in the format `local-part@domain-part` as defined by RFC 822. 
 * @returns email field definition
 */
function email(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Email);
}

/**
 * A JSON scalar type that is automatically parsed and loaded server-side as maps, lists, or scalar values
 * rather than as the literal input strings.
 * @returns JSON field definition
 */
function json(): ModelField<Nullable<any>> {
  return _field(ModelFieldType.JSON);
}

/**
 * A phone number scalar type thas is stored as a string server-side. Phone numbers can contain either spaces
 * or hyphens to separate digit groups. Phone numbers without a country code are assumed to be US/North American numbers adhering
 * to the North American Numbering Plan.
 * @returns phone number field definition
 */
function phone(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Phone);
}

/**
 * A URL scalar type as defined by RFC 1738. For example, https://www.amazon.com/dp/B000NZW3KC/ or mailto:example@example.com.
 * URLs must contain a schema (http, mailto) and can't contain two forward slashes (//) in the path part.
 * @returns URL field definition
 */
function url(): ModelField<Nullable<string>> {
  return _field(ModelFieldType.Url);
}

/**
 * A valid IPv4 or IPv6 address scalar type. IPv4 addresses are expected in quad-dotted notation (123.12.34.56). IPv6 addresses
 * are expected in non-bracketed, colon-separated format (1a2b:3c4b:🔢4567). You can include an optional CIDR suffix (123.45.67.89/16)
 * to indicate subnet mask.
 * @returns IP address field definition
 */
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
