import type { Prettify } from '@aws-amplify/data-schema-types';
import { a, type AmplifySqlMigration } from "../../../src/index";
import { MySQLSchema, Schema } from "./schema-definition";

type _PrettyClientSchema = Prettify<Schema>;
type _PrettyMySQLSchema = Prettify<MySQLSchema>;

export const migration: AmplifySqlMigration<MySQLSchema> = {
  steps: [
    {
      up: a.sqlMigration.createTable({
        name: 'address',
        columns: [
          { name: 'details', type: 'string' },
          { name: 'city', type: 'string' },
        ],
      }),
      down: a.sqlMigration.dropTable({
        name: 'Address',
      }),
    },
  ],
};

