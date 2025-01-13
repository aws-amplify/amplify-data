import { schema } from './ModelSchema';
import { combine } from './CombineSchema';
import { model } from './ModelType';
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
import { hasOne, hasMany, belongsTo } from './ModelRelationshipField';
import { customType } from './CustomType';
import { enumType } from './EnumType';
import { query, mutation, subscription, generation } from './CustomOperation';
import { handler } from './Handler';
import { conversation, dataTool } from './ai/ConversationType';
import { model as aiModel } from './ai/ModelType';

const ai = {
  model: aiModel,
  dataTool,
};

// We are re-exporting with this pattern to make the JSDoc happy.
// Otherwise the JSDoc wouldn't consistently show up as a customer types
// "a."
export {
  schema,
  combine,
  model,
  ref,
  customType,
  enumType as enum,
  query,
  mutation,
  subscription,
  hasOne,
  hasMany,
  belongsTo,
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
  conversation,
  generation,
  ai,
  handler,
};
