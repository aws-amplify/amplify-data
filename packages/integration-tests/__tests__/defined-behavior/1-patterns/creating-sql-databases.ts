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

type SetKey<T, Key, Value> = {
  [K in keyof T]: K extends Key ? Value : T[K];
};

type SetInternalKey<
  T extends { [internal]: any },
  Key,
  Value,
  OmitKey extends string = never,
> = {
  [K in keyof T as K extends OmitKey ? never : K]: K extends internal
    ? SetKey<T[K], Key, Value>
    : T[K];
};

const internal = Symbol('amplifyData');
type internal = typeof internal;

type SchemaDefinition = {
  tables: Record<string, { [internal]: TableDefinition }>;
};

type TableDefinition = {
  fields: Record<string, { [internal]: FieldDefinition }>;
};

type FieldDefinition = {
  typeName: string;
  isArray: boolean;
  isRef: boolean;
  isRequired: boolean;
};

/**
 * Totally forgot we could get TypeScript to infer omitted fields with
 * some clever destructuring. Would some sneakiness like this in the builders
 * be better or worse?
 *
 * Perhaps better in the sense that we'd know with high certainty that the
 * types align with the runtime.
 *
 * @param o
 * @param k
 * @returns
 */
function omit<O extends object, K extends string>(o: O, k: K): Omit<O, K> {
  const { [k]: _omitted, ...oWithKOmitted } = o;
  return oWithKOmitted;
}

function array<const Self extends { [internal]: object }>(
  this: Self,
): SetInternalKey<Self, 'isArray', true, 'array'> {
  return omit(
    {
      ...this,
      [internal]: {
        ...this[internal],
        isArray: true,
      },
    },
    'array',
  ) as any;
}

function required<const Self extends { [internal]: object }>(
  this: Self,
): SetInternalKey<Self, 'isRequired', true, 'required'> {
  return omit(
    {
      ...this,
      [internal]: {
        ...this[internal],
        isRequired: true,
      },
    },
    'required',
  ) as any;
}

const sql = {
  schema<const T extends SchemaDefinition>(def: T): Prettify<T> {
    return def as any;
  },
  table<const T extends TableDefinition['fields']>(fields: T) {
    return { [internal]: { fields } };
  },
  field<const TypeName extends string>(typeName: TypeName) {
    return {
      [internal]: {
        typeName,
        isRef: false,
        isArray: false,
        isRequired: false,
      } as const,
      array,
      required,
    } as const;
  },
  ref<const TypeName extends string>(typeName: TypeName) {
    return {
      [internal]: {
        typeName,
        isRef: true,
        isArray: false,
        isRequired: false,
      } as const,
    } as const;
  },
};

const schema = sql.schema({
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
  schema['tables']['customer'][internal].fields.favoriteColors[internal];

const typeTest2 = schema['tables']['address'][internal].fields.number[internal];

type Schema = typeof schema;

type T001 = Schema['tables']['address'][internal]['fields']['number'][internal];

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

describe('creating sql databases', () => {
  const datasource = {};
  const schema = {};

  //   type Schema = ClientSchema<typeof schema>;

  test('schema ', async () => {});

  test('something', async () => {});
});
