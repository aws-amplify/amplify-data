import { a, type AmplifySqlMigration } from "../../../src/index";
import { MySQLSchema } from "./schema-definition";

export const migration: AmplifySqlMigration<MySQLSchema> = [
  a.sqlMigration.migrationStep({
    name: 'create-user-table',
    up: [
      a.sqlMigration.createTable({
        tableName: 'user',
        columns: [
          {
            name: 'id',
            type: 'INT',
            isNullable: false
          },
          {
            name: 'name',
            type: 'VARCHAR(255)',
            isNullable: false
          },
          {
            name: 'email',
            type: 'VARCHAR(255)',
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'TIMESTAMP',
            isNullable: false
          },
        ],
        primaryKey: ['id'],
      })
    ],
    down: [
      a.sqlMigration.dropTable({
        tableName: 'user',
      })
    ],
  }),
];
