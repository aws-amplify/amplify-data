import * as a from './src'
import { defineData } from './src/SchemaProcessor';
import { ClientSchema } from './src/ClientSchema';

  /**
   * Defines an authorization rule for your data models and fields. First choose an authorization strategy (`public`, 
   * `private`, `owner`, `group`, or `custom`), then choose an auth provider (`apiKey`, `iam`, `userPools`, `oidc`, or `function`)
   * and optionally use `.to(...)` to specify the operations that can be performed against your data models and fields.
   */
export { a, defineData };

export type { ClientSchema };
