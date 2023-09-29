import type { ClientSchema } from './ClientSchema';
import { schema, type ModelSchemaType } from './ModelSchema';
import { model } from './ModelType';
import { fields } from './ModelField';
import { ref } from './ModelRef';
import { hasOne, hasMany, belongsTo, manyToMany } from './ModelRelationalField';
import { allow } from './Authorization';
import { defineData, stringifyModelSchema } from './SchemaProcessor';

const a = {
  schema,
  model,
  ref,
  hasOne,
  hasMany,
  belongsTo,
  manyToMany,
  allow,
  ...fields,
};

export default a;

export { defineData, stringifyModelSchema };

export type { ClientSchema, ModelSchemaType };
