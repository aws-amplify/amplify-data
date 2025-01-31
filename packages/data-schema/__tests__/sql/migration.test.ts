import { parseMigrationFile } from '../../../migration-apply/src/parse-migration';
import path from 'path';

describe('Migration Parser', () => {
  it('should parse a migration file', () => {
    const parsedMigration = parseMigrationFile(
      path.resolve(__dirname, 'migrations/20240130_migration_1.ts')
    );
    expect(parsedMigration).toEqual({
      steps: [
        {
          up: {
            type: 'createTable',
            name: 'address',
            columns: [
              {
                name: 'zip',
                type: 'varchar',
              },
              {
                name: 'details',
                type: 'text',
              },
            ],
          },
          down: {
            type: 'dropTable',
            name: 'address',
          },
        },
      ],
    });
  });
});