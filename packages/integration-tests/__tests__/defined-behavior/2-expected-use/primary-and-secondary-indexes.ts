import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  parseQuery,
  parseGraphqlSchema,
  expectSchemaModelContains,
  expectSchemaModelExcludes,
  expectSelectionSetContains,
  expectVariables,
} from '../../utils';

/**
 * ALL Custom Identifier and Secondary Index permutations
 *
 * Implicit/default identifier ('id') is already tested in ./implicit-system-fields.ts
 *
 * TK
 *
 */

describe('Primary Indexes', () => {
  // TODO: migrate CPK
  describe('Custom identifier with with composite SK', () => {});
});

describe('Secondary Indexes', () => {});
