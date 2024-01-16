import { schema } from './ModelSchema';
import { model } from './ModelType';
import { modelIndex } from './ModelIndex';
import {
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
} from './ModelField';
import { ref } from './RefType';
import { hasOne, hasMany, belongsTo, manyToMany } from './ModelRelationalField';
import { allow } from './Authorization';
import { customType } from './CustomType';
import { enumType } from './EnumType';
import { query, mutation, subscription } from './CustomOperation';

// We are re-exporting with this pattern to make the JSDoc happy.
// Otherwise the JSDoc wouldn't consistently show up as a customer types
// "a."
export {
  schema,
  model,
  modelIndex as index,
  ref,
  customType,
  enumType as enum,
  query,
  mutation,
  subscription,
  hasOne,
  hasMany,
  belongsTo,
  manyToMany,
  allow,
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
