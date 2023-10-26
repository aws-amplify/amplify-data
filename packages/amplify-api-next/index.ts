import { schema } from './src/ModelSchema';
import { model } from './src/ModelType';
import { fields } from './src/ModelField';
import { ref } from './src/ModelRef';
import {
  hasOne,
  hasMany,
  belongsTo,
  manyToMany,
} from './src/ModelRelationalField';
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
  /**
   * Defines an authorization rule for your data models and fields. First choose an authorization strategy (`public`, 
   * `private`, `owner`, `group`, or `custom`), then choose an auth provider (`apiKey`, `iam`, `userPools`, `oidc`, or `function`)
   * and optionally use `.to(...)` to specify the operations that can be performed against your data models and fields.
   */
  allow,
  ...fields,
};

export { a, defineData };

export type { ClientSchema };
