import {Authorization, ModelFieldType, ModelField, InternalField} from '@aws-amplify/amplify-api-next-types-alpha';


type FieldMeta = {
  lastInvokedMethod: null | keyof ModelField<ModelFieldTypeParamOuter>;
};

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
 * Model Field Implementation
 *
 * @typeParam T - holds the JS data type of the field; invoking the public methods changes this type accordingly
 * @example
 * string() => T = string
 * string().array() => T = string[]
 * string().array().optional() => T = string[] | null
 * string().optional().array().optional() => T = (string | null)[] | null
 *
 * @param fieldType - stores the GraphQL data type of the field
 */
function _field<T extends ModelFieldTypeParamOuter>(fieldType: ModelFieldType) {
  const _meta: FieldMeta = {
    lastInvokedMethod: null,
  };

  const data: FieldData = {
    fieldType,
    optional: false,
    array: false,
    arrayOptional: false,
    default: undefined,
    authorization: [],
  };

  const builder: ModelField<T> = {
    optional() {
      if (_meta.lastInvokedMethod === 'array') {
        data.arrayOptional = true;
      } else {
        data.optional = true;
      }

      _meta.lastInvokedMethod = 'optional';

      return this;
    },
    array(): ModelField<ToArray<T>> {
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

function id(): ModelField<string> {
  return _field(ModelFieldType.Id);
}

function string(): ModelField<string> {
  return _field(ModelFieldType.String);
}

function integer(): ModelField<number> {
  return _field(ModelFieldType.Integer);
}

function float(): ModelField<number> {
  return _field(ModelFieldType.Float);
}

function boolean(): ModelField<boolean> {
  return _field(ModelFieldType.Boolean);
}

function date(): ModelField<Date> {
  return _field(ModelFieldType.Date);
}

function time(): ModelField<Date> {
  return _field(ModelFieldType.Time);
}

function datetime(): ModelField<Date> {
  return _field(ModelFieldType.DateTime);
}

function timestamp(): ModelField<number> {
  return _field(ModelFieldType.Timestamp);
}

function email(): ModelField<string> {
  return _field(ModelFieldType.Email);
}

function json(): ModelField<any> {
  return _field(ModelFieldType.JSON);
}

function phone(): ModelField<string> {
  return _field(ModelFieldType.Phone);
}

function url(): ModelField<string> {
  return _field(ModelFieldType.Url);
}

function ipAddress(): ModelField<string> {
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
