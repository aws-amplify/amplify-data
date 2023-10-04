import { schema } from './src/ModelSchema';
import { model } from './src/ModelType';
import { fields } from './src/ModelField';
import { ref } from './src/ModelRef';
import { hasOne, hasMany, belongsTo, manyToMany } from './src/ModelRelationalField';
import { allow } from './src/Authorization';
import { defineData } from './src/SchemaProcessor';
import { ClientSchema } from './src/ClientSchema';

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

export type { ClientSchema };
