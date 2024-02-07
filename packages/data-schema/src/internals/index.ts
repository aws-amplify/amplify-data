import { SchemaConfig, schemaBuilder } from '../ModelSchema';

export const configure = (config: SchemaConfig) => {
  return {
    schema: schemaBuilder(config),
  };
};
