import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import type {
  SelectionSet,
  Expect,
  Equal,
} from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
  expectGraphqlMatches,
} from '../../utils';

type SetKey<T, Key extends keyof T, Value> = {
  [K in keyof T]: K extends Key ? Value : T[K];
};

const internal = Symbol('amplifyData');
type internal = typeof internal;

type SchemaDefinition = {
  tables: Record<string, Built<TableDefinition>>;
};

type TableDefinition = {
  fields: Record<string, Built<FieldDefinition>>;
};

type FieldDefinition = {
  type: FieldType;
};

type FieldType = {
  name: string;
  isArray: boolean;
  isRef: boolean;
};

type Built<T> = {
  [internal]: T;
};

function built<const T>(definition: T): Built<T> {
  return {
    [internal]: definition,
  };
}

function builder<T>(of: T) {}

function array<const Self extends Built<FieldDefinition>>(
  this: Self,
): Omit<Self, 'array'> {
  const newBase = this[internal];
  newBase.type.isArray = true;
  const newSelf = {
    ...this,
    [internal]: newBase,
  } as any;
  delete newSelf.array;
  return newSelf;
}

const sql = {
  schema<T extends SchemaDefinition>(def: T) {
    return def;
  },
  table<const T extends TableDefinition['fields']>(fields: T) {
    return built({ fields });
  },
  field<const Name extends string>(name: Name) {
    const base = {
      type: { name, isRef: false, isArray: false },
    };
    return {
      [internal]: base,
      array,
    };
  },
  ref<const Name extends string>(name: Name) {
    const base = {
      type: { name, isRef: true, isArray: false },
    };
    return {
      [internal]: base,
    };
  },
};

const schema = sql.schema({
  tables: {
    address: sql.table({
      number: sql.field('number'),
      street: sql.field('string'),
      city: sql.field('string'),
      state: sql.field('string'),
      zip: sql.field('string'),
    }),
    customer: sql.table({
      firstName: sql.field('string'),
      lastName: sql.field('number'),
      favoriteColors: sql.field('string').array(),
      address: sql.ref('address'),
    }),
  },
});

schema['tables']['customer'][internal].fields.favoriteColors[internal].type
  .isArray;

describe('creating sql databases', () => {
  const datasource = {};
  const schema = {};

  //   type Schema = ClientSchema<typeof schema>;

  test('schema ', async () => {});

  test('something', async () => {});
});
