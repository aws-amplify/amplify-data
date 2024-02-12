import { SchemaConfig, bindConfigToSchema } from '../ModelSchema';

/**
 * Configure wraps schema definition with non-default config to allow usecases other than
 * the default DynamoDb use-case.
 *
 * @param config The SchemaConfig augments the schema with content like the database type
 * @returns
 */
export const configure = (config: SchemaConfig) => {
  return {
    schema: bindConfigToSchema(config),
  };
};
