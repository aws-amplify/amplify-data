import { a, generateMigration } from '../../src/index';

const sqlSchema = a.sql.schema({
  tables: {
    address: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
    }),
    customer: a.sql
      .table({
        firstName: a.sql.varchar().required(),
        lastName: a.sql.varchar().required(),
        bio: a.sql.text(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['firstName', 'lastName']),
  },
});

const originalSchema = a.sql.schema({
  tables: {
    address: a.sql.table({
      number: a.sql.int().array().required(),
      street: a.sql.varchar(),
      city: a.sql.varchar(),
      state: a.sql.varchar(),
      zip: a.sql.varchar(),
      country: a.sql.varchar(),
    }),
    user: a.sql
      .table({
        fullName: a.sql.varchar().required(),
        favoriteColors: a.sql.varchar().array(),
      })
      .identifier(['fullName']),
    extraTable: a.sql
      .table({
        fieldName: a.sql.varchar()
      })
  },
});

describe('sql resource definitions', () => {
  test('can produce sql migration when no snapshot is provided', async () => {
    const sqlDefinition = sqlSchema.transform();
    const priorDbSnapshot = undefined;

    const migration = generateMigration(
      sqlDefinition,
      priorDbSnapshot,
    );
    expect(migration.toString()).toMatchSnapshot();
    expect(migration.up[0].type).toEqual('createTable');
    expect(migration.up[0].content).toStrictEqual({
      tableName: 'address',
      columns: [
        {
          name: 'number',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'street',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'city',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'state',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'zip',
          type: 'varchar',
          isNullable: true,
        },
      ],
      primaryKey: ['id'],
    });
    expect(migration.down[0].type).toEqual('dropTable');
    expect(migration.down[0].content).toStrictEqual({
      tableName: 'address',
    });

    expect(migration.up[1].type).toEqual('createTable');
    expect(migration.up[1].content).toStrictEqual({
      tableName: 'customer',
      columns: [
        {
          name: 'firstName',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'lastName',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'bio',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'favoriteColors',
          type: 'varchar',
          isNullable: true,
        },
      ],
      primaryKey: ['firstName', 'lastName'],
    });
    expect(migration.down[1].type).toEqual('dropTable');
    expect(migration.down[1].content).toStrictEqual({
      tableName: 'customer'
    });
  });

  test('can produce sql migration when for a changed schema', async () => {
    const sqlDefinition = sqlSchema.transform();
    const priorDbSnapshot = originalSchema.transform();

    const migration = generateMigration(
      sqlDefinition,
      priorDbSnapshot,
    );

    expect(migration.toString()).toMatchSnapshot();
    expect(migration.up[0].type).toEqual('createTable');
    expect(migration.up[0].content).toStrictEqual({
      "columns": [
        {
          "isNullable": false,
          "name": "firstName",
          "type": "varchar",
        },
        {
          "isNullable": false,
          "name": "lastName",
          "type": "varchar",
        },
        {
          "isNullable": true,
          "name": "bio",
          "type": "text",
        },
        {
          "isNullable": true,
          "name": "favoriteColors",
          "type": "varchar",
        },
      ],
      "primaryKey": [
        "firstName",
        "lastName",
      ],
      "tableName": "customer",
    });
    expect(migration.up[1].type).toEqual('dropTable');
    expect(migration.up[1].content).toStrictEqual({
      tableName: 'user',
    });
    expect(migration.up[2].type).toEqual('dropTable');
    expect(migration.up[2].content).toStrictEqual({
      tableName: 'extraTable',
    });

    expect(migration.down[0].type).toEqual('createTable');
    expect(migration.down[0].content).toStrictEqual({
      "columns": [
        {
          "isNullable": false,
          "name": "fullName",
          "type": "varchar",
        },
        {
          "isNullable": true,
          "name": "favoriteColors",
          "type": "varchar",
        },
      ],
      "primaryKey": [
        "fullName",
      ],
      "tableName": "user",
    });
    expect(migration.down[1].type).toEqual('createTable');
    expect(migration.down[1].content).toStrictEqual({
      "columns": [
        {
          "isNullable": true,
          "name": "fieldName",
          "type": "varchar",
        },
      ],
      "primaryKey": [
        "id",
      ],
      "tableName": "extraTable",
    });
    expect(migration.down[2].type).toEqual('dropTable');
    expect(migration.down[2].content).toStrictEqual({
      tableName: 'customer',
    });
  });
});
