import type { Prettify, Equal, Expect } from '@aws-amplify/data-schema-types';
import { a, ClientSchema, generateMigration } from '../../src/index';

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

const schema = a
  .schema({
    Address: sqlSchema.tables.address
      .toAPIModel()
      .authorization((allow) => [allow.owner(), allow.group('Admins')]),
    Customer: sqlSchema.tables.customer.toAPIModel(),
    NonSqlTable: a
      .model({
        a: a.string().required(),
        b: a.integer().required(),
        c: a.string().required(),
      })
      .identifier(['a', 'b', 'c']),
  })
  .authorization((allow) => allow.owner());

type Schema = ClientSchema<typeof schema>;

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
});
