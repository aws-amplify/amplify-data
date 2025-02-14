import { a, type AmplifySqlMigration } from "../../../src/index";
import { MySQLSchema } from "./schema-definition";

export const migration: AmplifySqlMigration<MySQLSchema> = [
  a.sqlMigration.migrationStep({
    name: 'create-address-table',
    up: [
      a.sqlMigration.createTable({
        tableName: 'address',
        primaryKey: ['name'],
        columns: [
          {
            name: 'zip',
            type: 'VARCHAR(255)',
            isNullable: false
          },
          {
            name: 'details',
            type: 'TEXT',
          },
        ],
      })
    ],
    down: [
      a.sqlMigration.dropTable({
        tableName: 'address',
      })
    ],
  }),
];


