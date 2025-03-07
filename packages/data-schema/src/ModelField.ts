import { brand } from './util';
import { AllowModifier, Authorization, allow } from './Authorization';
import type { methodKeyOf, satisfy } from './util/usedMethods.js';
import type { brandSymbol } from './util/Brand.js';
import {
  ValidationRule,
  FieldTypeToValidationBuilder,
  createValidationBuilder,
} from './Validate';

/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
export const __auth = Symbol('__auth');

/**
 * Used by `.default()` to represent a generated field (SQL).
 */
export const __generated = Symbol('__generated');

const brandName = 'modelField';
const internal = Symbol('internal');

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
  lastInvokedMethod: null | methodKeyOf<ModelField>;
};

type FieldData = {
  fieldType: ModelFieldType;
  required: boolean;
  array: boolean;
  arrayRequired: boolean;
  default: undefined | symbol | ModelFieldTypeParamOuter;
  authorization: Authorization<any, any, any>[];
  validation: ValidationRule[];
};

type ModelFieldTypeParamInner = string | number | boolean | Date | Json | null;

/**
 * A precise, recursive Json type blows the type calculation stack without installing
 * explicit `Json extends T ? short-circuit : ...` type checks all over the place.
 * We may take that on later. But, this is a good-enough approximation for now.
 */
export type Json = null | string | number | boolean | object | any[];

export type ModelFieldTypeParamOuter =
  | ModelFieldTypeParamInner
  | Array<ModelFieldTypeParamInner>
  | null;

/**
 * Field type arg mutators
 */
export type Nullable<T> = T | null;
export type Required<T> = Exclude<T, null>;
export type ArrayField<T> = [T] extends [ModelFieldTypeParamInner]
  ? Array<T> | null // optional by default
  : never;

export type BaseModelField<
  T extends ModelFieldTypeParamOuter = ModelFieldTypeParamOuter,
  FT extends ModelFieldType = ModelFieldType
> = ModelField<T, UsableModelFieldKey, any, FT>

export type UsableModelFieldKey = satisfy<
  methodKeyOf<ModelField>,
  'required' | 'default' | 'authorization' | 'array' | 'validate'
>;

/**
 * Public API for the chainable builder methods exposed by Model Field.
 * The type is narrowing e.g., after calling .array() it will be omitted from intellisense suggestions
 *
 * @typeParam T - holds the JS data type of the field
 * @typeParam UsedMethod - union of strings representing already-invoked method names. Used to improve Intellisense
 * @typeParam Auth - type of the authorization rules attached to the field
 * @typeParam FT - specific ModelFieldType of the field
 */
export type ModelField<
  T extends ModelFieldTypeParamOuter = ModelFieldTypeParamOuter,
  UsedMethod extends UsableModelFieldKey = never,
  Auth = undefined,
  FT extends ModelFieldType = ModelFieldType
> = Omit<
  {
    // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
    [__auth]?: Auth;
    [brandSymbol]: typeof brandName;

    /**
     * Internal non-omittable method that allows `BaseModelField` to retain a reference to `T` type arg in `ModelField`.
     * Since all public methods are omittable, the evaluated `BaseModelField` loses type information unless
     * some property on the type is guaranteed to reference `T`
     * Context: https://github.com/aws-amplify/amplify-data/pull/406/files#r1869481467
     */
    [internal](): ModelField<T, UsedMethod, Auth, FT>;

    /**
     * Marks a field as required.
     */
    required(): ModelField<Required<T>, UsedMethod | 'required', Auth, FT>;
    // Exclude `optional` after calling array, because both the value and the array itself can be optional
    /**
     * Converts a field type definition to an array of the field type.
     */
    array(): ModelField<
      ArrayField<T>,
      Exclude<UsedMethod, 'required'> | 'array' | 'validate',
      Auth,
      FT
    >;
    // TODO: should be T, but .array breaks this constraint. Fix later
    /**
     * Sets a default value for the scalar type.
     * @param value the default value
     */
    default(
      value?: ModelFieldTypeParamOuter,
    ): ModelField<T, UsedMethod | 'default', Auth, FT>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(allow => allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      callback: (
        allow: Omit<AllowModifier, 'resource'>,
      ) => AuthRuleType | AuthRuleType[],
    ): ModelField<T, UsedMethod | 'authorization', AuthRuleType, FT>;
    /**
     * Configures field-level validation rules.
     */
    validate(
      callback: (v: FieldTypeToValidationBuilder<T, FT>) => void
    ): ModelField<T, UsedMethod | 'validate' | 'default' | 'array', Auth, FT>;
  },
  UsedMethod
>;

/**
 * Internal representation of Model Field that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalField<
  T extends ModelFieldTypeParamOuter = ModelFieldTypeParamOuter,
  UsedMethod extends UsableModelFieldKey = never,
  Auth = undefined,
  FT extends ModelFieldType = ModelFieldType
> = ModelField<T, UsedMethod, Auth, FT> & {
  data: FieldData;
}

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
function _field<T extends ModelFieldTypeParamOuter, FT extends ModelFieldType>(
  fieldType: FT
): ModelField<T, never, undefined, FT> {
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
    validation: [],
  };

  const builder = {
    required() {
      if (_meta.lastInvokedMethod === 'array') {
        data.arrayRequired = true;
      } else {
        data.required = true;
      }

      _meta.lastInvokedMethod = 'required';

      return this;
    },
    array(): ModelField<ArrayField<T>, 'array', undefined, FT> {
      data.array = true;
      _meta.lastInvokedMethod = 'array';

      return this;
    },
    default(val) {
      data.default = typeof val === 'undefined' ? __generated : val;
      _meta.lastInvokedMethod = 'default';

      return this;
    },
    authorization(callback) {
      const { resource: _, ...rest } = allow;
      const rules = callback(rest);
      data.authorization = Array.isArray(rules) ? rules : [rules];
      _meta.lastInvokedMethod = 'authorization';

      return this;
    },
    validate(
      callback: (v: FieldTypeToValidationBuilder<T, FT>) => void
    ) {
      const { builder, getRules } = createValidationBuilder<T, FT>();
      callback(builder);
      data.validation = getRules();
      
      _meta.lastInvokedMethod = 'validate';
      
      return this;
    },
    ...brand(brandName),
    [internal]() {
      return this;
    },
  } as ModelField<T, never, undefined, FT>;
  return { ...builder, data } as InternalField as ModelField<T, never, undefined, FT>;
}

/**
 * A unique identifier scalar type. This scalar is serialized like a String but isn't meant to be human-readable.
 * If not specified on create operations, a ULID will be auto-generated service-side.
 * @returns ID field definition
 */
export function id(): ModelField<Nullable<string>, never, undefined, ModelFieldType.Id> {
  return _field<Nullable<string>, ModelFieldType.Id>(ModelFieldType.Id);
}

/**
 * A string scalar type that is represented server-side as a UTF-8 character sequence.
 * @returns string field definition
 */
export function string(): ModelField<Nullable<string>, never, undefined, ModelFieldType.String> {
  return _field<Nullable<string>, ModelFieldType.String>(ModelFieldType.String);
}

/**
 * An integer scalar type with a supported value range between -(2^31) and 2^31-1.
 * @returns integer field definition
 */
export function integer(): ModelField<Nullable<number>, never, undefined, ModelFieldType.Integer> {
  return _field<Nullable<number>, ModelFieldType.Integer>(ModelFieldType.Integer);
}

/**
 * A float scalar type following represented server-side as an IEEE 754 floating point value.
 * @returns float field definition
 */
export function float(): ModelField<Nullable<number>, never, undefined, ModelFieldType.Float> {
  return _field<Nullable<number>, ModelFieldType.Float>(ModelFieldType.Float);
}

/**
 * A boolean scalar type that can be either true or false.
 * @returns boolean field definition
 */
export function boolean(): ModelField<Nullable<boolean>, never, undefined, ModelFieldType.Boolean> {
  return _field<Nullable<boolean>, ModelFieldType.Boolean>(ModelFieldType.Boolean);
}

/**
 * A date scalar type that is represented server-side as an extended ISO 8601 date string in the format `YYYY-MM-DD`.
 * @returns date field definition
 */
export function date(): ModelField<Nullable<string>, never, undefined, ModelFieldType.Date> {
  return _field<Nullable<string>, ModelFieldType.Date>(ModelFieldType.Date);
}

/**
 * A time scalar type that is represented server-side as an extended ISO 8601 time string in the format `hh:mm:ss.sss`.
 * @returns time field definition
 */
export function time(): ModelField<Nullable<string>, never, undefined, ModelFieldType.Time> {
  return _field<Nullable<string>, ModelFieldType.Time>(ModelFieldType.Time);
}

/**
 * A date time scalar type that is represented server-side as an extended ISO 8601 date and time string in the format `YYYY-MM-DDThh:mm:ss.sssZ`.
 * @returns datetime field definition
 */
export function datetime(): ModelField<Nullable<string>, never, undefined, ModelFieldType.DateTime> {
  return _field<Nullable<string>, ModelFieldType.DateTime>(ModelFieldType.DateTime);
}

/**
 * A timestamp scalar type that is represented by an integer value of the number of seconds before or after `1970-01-01-T00:00Z`.
 * @returns timestamp field definition
 */
export function timestamp(): ModelField<Nullable<number>, never, undefined, ModelFieldType.Timestamp> {
  return _field<Nullable<number>, ModelFieldType.Timestamp>(ModelFieldType.Timestamp);
}

/**
 * An email scalar type that is represented server-side in the format `local-part@domain-part` as defined by RFC 822.
 * @returns email field definition
 */
export function email(): ModelField<Nullable<string>, never, undefined, ModelFieldType.Email> {
  return _field<Nullable<string>, ModelFieldType.Email>(ModelFieldType.Email);
}

/**
 * A JSON scalar type that is automatically parsed and loaded server-side as maps, lists, or scalar values
 * rather than as the literal input strings.
 * @returns JSON field definition
 */
export function json(): ModelField<Nullable<Json>, never, undefined, ModelFieldType.JSON> {
  return _field<Nullable<Json>, ModelFieldType.JSON>(ModelFieldType.JSON);
}

/**
 * A phone number scalar type thas is stored as a string server-side. Phone numbers can contain either spaces
 * or hyphens to separate digit groups. Phone numbers without a country code are assumed to be US/North American numbers adhering
 * to the North American Numbering Plan.
 * @returns phone number field definition
 */
export function phone(): ModelField<Nullable<string>, never, undefined, ModelFieldType.Phone> {
  return _field<Nullable<string>, ModelFieldType.Phone>(ModelFieldType.Phone);
}

/**
 * A URL scalar type as defined by RFC 1738. For example, https://www.amazon.com/dp/B000NZW3KC/ or mailto:example@example.com.
 * URLs must contain a schema (http, mailto) and can't contain two forward slashes (//) in the path part.
 * @returns URL field definition
 */
export function url(): ModelField<Nullable<string>, never, undefined, ModelFieldType.Url> {
  return _field<Nullable<string>, ModelFieldType.Url>(ModelFieldType.Url);
}

/**
 * A valid IPv4 or IPv6 address scalar type. IPv4 addresses are expected in quad-dotted notation (123.12.34.56). IPv6 addresses
 * are expected in non-bracketed, colon-separated format (1a2b:3c4b:🔢4567). You can include an optional CIDR suffix (123.45.67.89/16)
 * to indicate subnet mask.
 * @returns IP address field definition
 */
export function ipAddress(): ModelField<Nullable<string>, never, undefined, ModelFieldType.IPAddress> {
  return _field<Nullable<string>, ModelFieldType.IPAddress>(ModelFieldType.IPAddress);
}
