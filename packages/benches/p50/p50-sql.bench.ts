import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('p50 sql', () => {
  const sqlSchema = a.sql.schema({
    tables: {
      address1: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer1: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
      address2: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer2: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
      address3: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer3: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
      address4: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer4: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
      address5: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer5: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
      address6: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer6: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
      address7: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer7: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
      address8: a.sql.table({
        number: a.sql.int().array().required(),
        street: a.sql.varchar(),
        city: a.sql.varchar(),
        state: a.sql.varchar(),
        zip: a.sql.varchar(),
        lat: a.sql.real(),
        long: a.sql.real(),
      }),
      customer8: a.sql
        .table({
          firstName: a.sql.varchar().required(),
          lastName: a.sql.varchar().required(),
          jobTitle: a.sql.varchar(50),
          bio: a.sql.text(),
          favoriteColors: a.sql.varchar().array(),
        })
        .identifier(['firstName', 'lastName']),
    },
  });

  const schema = a
    .schema({
      Address1: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer1: sqlSchema.tables.customer1.toAPIModel(),
      Address2: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer2: sqlSchema.tables.customer1.toAPIModel(),
      Address3: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer3: sqlSchema.tables.customer1.toAPIModel(),
      Address4: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer4: sqlSchema.tables.customer1.toAPIModel(),
      Address5: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer5: sqlSchema.tables.customer1.toAPIModel(),
      Address6: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer6: sqlSchema.tables.customer1.toAPIModel(),
      Address7: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer7: sqlSchema.tables.customer1.toAPIModel(),
      Address8: sqlSchema.tables.address1
        .toAPIModel()
        .authorization((allow) => [allow.owner(), allow.group('Admins')]),
      Customer8: sqlSchema.tables.customer1.toAPIModel(),
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
}).types([10643, 'instantiations']);
