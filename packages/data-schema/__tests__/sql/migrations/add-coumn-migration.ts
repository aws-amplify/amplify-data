import { a, type AmplifySqlMigration } from "../../../src/index";
import { MySQLSchema } from "./schema-definition";

export const migration: AmplifySqlMigration<MySQLSchema> = [
  a.sqlMigration.migrationStep({
    name: 'add-age-to-person',
    up: [
      a.sqlMigration.addColumn({
        tableName: 'person',
        column: {
          name: 'age',
          type: 'INT',
        },
      })
    ],
    down: [
      a.sqlMigration.dropColumn({
        tableName: 'person',
        columnName: 'age',
      })
    ],
  }),
];