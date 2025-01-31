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
          { name: 'zip', type: 'varchar' },
          { name: 'details', type: 'text' },
        ],
      }),
      down: a.sqlMigration.dropTable({
        name: 'address',
      }),
    },
  ],
};


const migration2: AmplifySqlMigration<MySQLSchema> = {
  steps: [
    {
      up: a.sqlMigration.addColumn({
        table: 'person',
        column: {
          name: 'age',
          type: 'int',
        },
      }),
      down: a.sqlMigration.dropColumn({
        table: 'person',
        column: {
          name: 'age',
        },
      }),
    },
  ],
};

