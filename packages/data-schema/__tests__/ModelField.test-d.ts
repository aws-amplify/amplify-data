import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import {
  type _Internal_ModelField,
  type InternalField,
  string,
  id,
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
  _Internal_Json,
  type BaseModelField,
} from '../src/ModelField';

/**
 * Extracts first type arg from ModelField
 */
type GetFieldTypeArg<T> = T extends BaseModelField<infer R> ? R : never;

test('string() produces expected type args', () => {
  const field = string();
  type Field = GetFieldTypeArg<typeof field>;

  type basicTest = Expect<Equal<Field, string | null>>;

  // @ts-expect-error
  type basicTest2 = Expect<Equal<Field, number>>;

  const fieldReq = string().required();
  type FieldReq = GetFieldTypeArg<typeof fieldReq>;

  type optTest = Expect<Equal<FieldReq, string>>;

  const fieldArr = string().array();
  type FieldArr = GetFieldTypeArg<typeof fieldArr>;

  type arrTest = Expect<Equal<FieldArr, Array<string | null> | null>>;

  const fieldReqArray = string().required().array();
  type FieldReqArray = GetFieldTypeArg<typeof fieldReqArray>;

  type optArrTest = Expect<Equal<FieldReqArray, Array<string> | null>>;

  const fieldReqArrayReq = string().required().array().required();
  type FieldReqArrayReq = GetFieldTypeArg<typeof fieldReqArrayReq>;

  type optArrOptTest = Expect<Equal<FieldReqArrayReq, Array<string>>>;
});

test('ModelField can be cast to InternalField', () => {
  const field = string().required();

  // @ts-expect-error
  field.data;

  const internalField = field as InternalField;
  internalField.data;
});

test('all basic scalar fields produce expected type args', () => {
  type FieldTypeMap = {
    id: string;
    integer: number;
    float: number;
    boolean: boolean;
    date: string;
    time: string;
    datetime: string;
    timestamp: number;
    email: string;
    json: _Internal_Json;
    phone: string;
    url: string;
    ipAddress: string;
  };

  const _id = id();
  type FieldId = GetFieldTypeArg<typeof _id>;

  type basicTestId = Expect<Equal<FieldId, FieldTypeMap['id'] | null>>;

  const _integer = integer();
  type FieldInt = GetFieldTypeArg<typeof _integer>;

  type basicTestInt = Expect<Equal<FieldInt, FieldTypeMap['integer'] | null>>;

  const _float = float();
  type FieldFloat = GetFieldTypeArg<typeof _float>;

  type basicTestFloat = Expect<Equal<FieldInt, FieldTypeMap['float'] | null>>;

  const _boolean = boolean();
  type FieldBool = GetFieldTypeArg<typeof _boolean>;

  type basicTestBool = Expect<Equal<FieldBool, FieldTypeMap['boolean'] | null>>;

  const _date = date();
  type FieldDate = GetFieldTypeArg<typeof _date>;

  type basicTestData = Expect<Equal<FieldDate, FieldTypeMap['date'] | null>>;

  const _time = time();
  type FieldTime = GetFieldTypeArg<typeof _time>;

  type basicTestTime = Expect<Equal<FieldTime, FieldTypeMap['time'] | null>>;

  const _datetime = datetime();
  type FieldDateTime = GetFieldTypeArg<typeof _datetime>;

  type basicTestDateTime = Expect<
    Equal<FieldDateTime, FieldTypeMap['datetime'] | null>
  >;

  const _timestamp = timestamp();
  type FieldTimestamp = GetFieldTypeArg<typeof _timestamp>;

  type basicTestFieldTimestamp = Expect<
    Equal<FieldTimestamp, FieldTypeMap['timestamp'] | null>
  >;

  const _email = email();
  type FieldEmail = GetFieldTypeArg<typeof _email>;

  type basicTestEmail = Expect<Equal<FieldEmail, FieldTypeMap['email'] | null>>;

  const _json = json();
  type FieldJson = GetFieldTypeArg<typeof _json>;

  type basicTestJson = Expect<Equal<FieldJson, FieldTypeMap['json'] | null>>;

  const _phone = phone();
  type FieldPhone = GetFieldTypeArg<typeof _phone>;

  type basicTestPhone = Expect<Equal<FieldPhone, FieldTypeMap['phone'] | null>>;

  const _url = url();
  type FieldUrl = GetFieldTypeArg<typeof _url>;

  type basicTestUrl = Expect<Equal<FieldUrl, FieldTypeMap['url'] | null>>;

  const _ipAddress = ipAddress();
  type FieldIP = GetFieldTypeArg<typeof _ipAddress>;

  type basicTestIP = Expect<Equal<FieldIP, FieldTypeMap['ipAddress'] | null>>;
});
