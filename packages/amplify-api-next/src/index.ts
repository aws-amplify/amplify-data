import type { ClientSchema } from './ClientSchema';
import { schema, type ModelSchemaType } from './ModelSchema';
import { model } from './ModelType';
import { fields } from './ModelField';
import { ref } from './ModelRef';
import { hasOne, hasMany, belongsTo, manyToMany } from './ModelRelationalField';
import { allow } from './Authorization';
import { defineData } from './SchemaProcessor';

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

export { a, defineData };

export type { ClientSchema, ModelSchemaType };
