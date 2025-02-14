import * as a from '../a';
import { ModelType } from '../ModelType';
import { ModelField } from '../ModelField';
import { RefType } from '../RefType';
import { KindaPretty as _KP } from '../util';

// #region builder types
export type SetKey<T, Key, Value> = {
  [K in keyof T]: K extends Key ? Value : T[K];
};

export type SetInternalKey<
  T extends Nested<any>,
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

export type Nested<T> = { [internal]: T };

const nested = <T>(data: T): Nested<T> => {
  return {
    [internal]: data,
  };
};

export type DeNested<T extends Nested<any>> = T[internal];

const denested = <T extends Nested<any>>(nested: T): DeNested<T> => {
  return nested[internal];
};

export type SchemaDefinition = {
  tables: Record<string, Nested<TableDefinition>>;
};

export type TableDefinition = {
  identifier: string[];
  fields: Record<string, Nested<FieldDefinition>>;
};

export type FieldDefinition = {
  typeName: string;
  typeArgs: string | undefined | null;
  isArray: boolean;
  isRef: boolean;
  isRequired: boolean;
};
// #endregion builder types

// #region API resolution types

export type PrimitiveTypes = {
  varchar: string;
  text: string;
  smallint: number;
  int: number;
  bigint: number;
  real: number;
  'double precision': number;
  boolean: boolean;
};

export const apiBuilderMap = {
  smallint: a.integer,
  int: a.integer,
  bigint: a.integer,
  real: a.float,
  'double precision': a.float,
  varchar: a.string,
  text: a.string,
  boolean: a.boolean,
} as const;

export type PrimitiveType<TypeName> = TypeName extends keyof PrimitiveTypes
  ? PrimitiveTypes[TypeName]
  : never;

export type Arrayatize<
  T,
  Def extends FieldDefinition,
> = Def['isArray'] extends true ? T[] : T;
type Requiredtize<
  T,
  Def extends FieldDefinition,
> = Def['isRequired'] extends true ? T : T | null;

export type FinalFieldType<Def extends FieldDefinition> =
  Def['isRef'] extends true
  ? RefType<{
    type: 'ref';
    array: Def['isArray'];
    arrayRequired: Def['isRequired'];
    valueRequired: Def['isRequired'];
    link: Def['typeName'];
    authorization: [];
  }>
  : Arrayatize<Requiredtize<PrimitiveType<Def['typeName']>, Def>, Def>;

export type ApiModelFields<T extends Record<string, Nested<FieldDefinition>>> =
  {
    -readonly [K in keyof T]: ApiFieldType<DeNested<T[K]>>;
  };

export type ApiFieldType<T extends FieldDefinition> = ModelField<
  FinalFieldType<T>
>;

export type EligibleIdFields<Table extends Nested<TableDefinition>> = {
  [K in keyof DeNested<Table>['fields']as DeNested<
    DeNested<Table>['fields'][K]
  >['isRequired'] extends true
  ? K
  : never]: DeNested<Table>['fields'][K];
};

export type ModelIdentifierDefinition<M, T extends string[]> = {
  pk: PK<M, T>;
  sk: SK<M, T>;
  compositeSk: 'wip';
};

export type ExtractPKandSKFieldNames<T extends string[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? {
    pk: First;
    sk: Rest;
  }
  : never;

export type PK<_M, T extends string[]> = Record<
  ExtractPKandSKFieldNames<T>['pk'],
  string
>;

export type SK<_M, T extends string[]> = Record<
  ExtractPKandSKFieldNames<T>['sk'][number],
  string
>;

// #endregion

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
export function omit<O extends object, K extends string>(
  o: O,
  k: K,
): Omit<O, K> {
  const { [k]: _omitted, ...oWithKOmitted } = o;
  return oWithKOmitted;
}

export function array<const Self extends Nested<object>>(
  this: Self,
): SetInternalKey<Self, 'isArray', true, 'array'> {
  return omit(
    {
      ...this,
      ...nested({
        ...denested(this),
        isArray: true,
      }),
    },
    'array',
  ) as any;
}

export function required<const Self extends Nested<object>>(
  this: Self,
): SetInternalKey<Self, 'isRequired', true, 'required'> {
  return omit(
    {
      ...this,
      ...nested({
        ...denested(this),
        isRequired: true,
      }),
    },
    'required',
  ) as any;
}

export function identifier<
  const Self extends Nested<TableDefinition>,
  const Fields extends (keyof EligibleIdFields<Self>)[],
>(
  this: Self,
  identifier: Fields,
): SetInternalKey<Self, 'identifier', Fields, 'identifier'> {
  return omit(
    {
      ...this,
      ...nested({
        ...denested(this),
        identifier,
      }),
    },
    'identifier',
  ) as any;
}

export function field<const TypeName extends string>(
  typeName: TypeName,
  typeArgs?: string,
): Nested<SetKey<FieldDefinition, 'typeName', TypeName>> & {
  array: typeof array;
  required: typeof required;
} {
  return {
    ...nested({
      typeName,
      typeArgs,
      isRef: false,
      isArray: false,
      isRequired: false,
    }),
    array,
    required,
  };
}

export function toAPIModel<const T extends Nested<TableDefinition>>(
  this: T,
): ModelType<
  {
    fields: ApiModelFields<DeNested<T>['fields']>;
    authorization: [];
    disabledOperations: [];
    secondaryIndexes: [];
    identifier: ModelIdentifierDefinition<
      ApiModelFields<DeNested<T>['fields']>,
      DeNested<T>['identifier']
    >;
  },
  'identifier'
> {
  const fields = {} as any;
  for (const [fieldName, fieldDef] of Object.entries(denested(this).fields)) {
    fields[fieldName] = convertSqlFieldToApiField(denested(fieldDef));
  }
  return a
    .model(fields as ApiModelFields<DeNested<T>['fields']>)
    .identifier(denested(this).identifier as any) as any;
}

export function convertSqlFieldToApiField<const T extends FieldDefinition>(
  field: T,
): ApiFieldType<T> {
  const modelFieldBuilder = (apiBuilderMap as any)[field.typeName];

  if (!modelFieldBuilder) {
    throw new Error(`Unknown field type ${field.typeName}.`);
  }

  let modelField = modelFieldBuilder();

  if (field.isArray) modelField = modelField.array();
  if (field.isRequired) modelField = modelField.required();

  return modelField;
}

export function transformTables(tables: SchemaDefinition['tables']) {
  return Object.entries(tables).map(([tableName, tableDef]) => {
    return {
      tableName,
      columns: transformColumns(denested(tableDef)),
      primaryKey: denested(tableDef).identifier,
    };
  });
}

export function transformColumns(table: TableDefinition) {
  return Object.entries(table.fields).map(([fieldName, fieldDef]) => {
    const internalDef = denested(fieldDef);
    return {
      name: fieldName,
      type: internalDef.typeArgs
        ? `${internalDef.typeName}(${internalDef.typeArgs})`
        : internalDef.typeName,
      isNullable: !internalDef.isRequired,
    };
  });
}

export const sql = {
  schema<const T extends SchemaDefinition>(def: T) {
    return {
      ...def,
      transform() {
        return {
          tables: transformTables(def.tables),
        };
      },
    };
  },
  table<const T extends TableDefinition['fields']>(
    fields: T,
  ): Nested<{
    fields: T;
    identifier: ['id'];
  }> & {
    identifier: typeof identifier;
    toAPIModel: typeof toAPIModel;
  } {
    return {
      ...nested({ fields, identifier: ['id'] }),
      identifier,
      toAPIModel,
    };
  },
  smallint() {
    return field('smallint');
  },
  int() {
    return field('int');
  },
  bigint() {
    return field('bigint');
  },
  real() {
    return field('real');
  },
  double() {
    return field('double precision');
  },
  varchar(size?: number) {
    return field('varchar', size?.toString());
  },
  text() {
    return field('text');
  },
  timestamp() {
    return field('timestamp');
  },
};
