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
          up: { type: 'createTable', name: 'User', columns: [{ name: 'id', type: 'uuid' }, { name: 'name', type: 'string' }] },
          down: { type: 'dropTable', name: 'User' },
        },
      ],
    });
  });
});