import { parseMigrationFile } from '../../../migration-apply/src/parse-migration';
import path from 'path';

describe('Migration Parser', () => {
  it('should parse create address migration file', () => {
    const parsedMigration = parseMigrationFile(
      path.resolve(__dirname, 'migrations/20240130_migration_1.ts')
    );
    expect(parsedMigration).toEqual([
      {
        name: 'create-address-table',
        up: [{
          action: 'CREATE_TABLE',
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
        }],
        down: [{
          action: 'DROP_TABLE',
          tableName: 'address',
        }],
      },
    ]);
  });

  it('should parse create table user migration file', () => {
    const parsedMigration = parseMigrationFile(
      path.resolve(__dirname, 'migrations/create-table-user-migration.ts')
    );
    expect(parsedMigration).toEqual([
      {
        name: 'create-user-table',
        up: [{
          action: 'CREATE_TABLE',
          tableName: 'user',
          primaryKey: ['id'],
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
        }],
        down: [{
          action: 'DROP_TABLE',
          tableName: 'user',
        }],
      },
    ]);
  });

  it('should parse add column migration file', () => {
    const parsedMigration = parseMigrationFile(
      path.resolve(__dirname, 'migrations/add-coumn-migration.ts')
    );
    expect(parsedMigration).toEqual([
      {
        name: 'add-age-to-person',
        up: [{
          action: 'ADD_COLUMN',
          tableName: 'person',
          column: {
            name: 'age',
            type: 'INT',
          },
        }],
        down: [{
          action: 'DROP_COLUMN',
          tableName: 'person',
          columnName: 'age',
        }],
      },
    ]);
  });
});
