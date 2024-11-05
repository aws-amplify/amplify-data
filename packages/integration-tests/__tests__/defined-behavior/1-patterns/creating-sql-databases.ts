import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import type {
  SelectionSet,
  Expect,
  Equal,
  Prettify,
} from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
  expectGraphqlMatches,
} from '../../utils';

const sqlSchema = sql.schema({
  tables: {
    address: sql.table({
      number: sql.field('number').array().required(),
      street: sql.field('string'),
      city: sql.field('string'),
      state: sql.field('string'),
      zip: sql.field('string'),
    }),
    customer: sql.table({
      firstName: sql.field('string'),
      lastName: sql.field('number'),
      favoriteColors: sql.field('string').array(),
      // address: sql.ref('address'),
    }),
  },
});

const typeTest =
  sqlSchema['tables']['customer'][internal].fields.favoriteColors[internal];

const typeTest2 =
  sqlSchema['tables']['address'][internal].fields.number[internal];

type SqlSchema = typeof sqlSchema;

type T001 =
  SqlSchema['tables']['address'][internal]['fields']['number'][internal];

type PrimitiveTypes = {
  string: string;
  number: number;
  boolean: boolean;
};

type PrimitiveType<TypeName> = TypeName extends keyof PrimitiveTypes
  ? PrimitiveTypes[TypeName]
  : never;

type Arrayatize<T, Def extends FieldDefinition> = Def['isArray'] extends true
  ? T[]
  : T;
type Requiredtize<
  T,
  Def extends FieldDefinition,
> = Def['isRequired'] extends true ? T : T | undefined | null;

type FinalFieldType<Def extends FieldDefinition> = Arrayatize<
  Requiredtize<PrimitiveType<Def['typeName']>, Def>,
  Def
>;

type T002 = FinalFieldType<T001>;

const schema = a.schema({
  Address: sqlSchema.tables.address,
});

describe('creating sql databases', () => {
  const datasource = {};
  const schema = {};

  //   type Schema = ClientSchema<typeof schema>;

  test('schema ', async () => {});

  test('something', async () => {});
});
