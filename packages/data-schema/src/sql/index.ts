import * as a from '../a';
import {
  ModelType,
  ModelTypeParamShape,
  ModelDefaultIdentifier,
} from '../ModelType';
import { ModelField, InternalField } from '../ModelField';
import { RefType } from '../RefType';
import { KindaPretty } from '../util';

// #region builder types
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

export type SchemaDefinition = {
  tables: Record<string, { [internal]: TableDefinition }>;
};

export type TableDefinition = {
  identifier: string[];
  fields: Record<string, { [internal]: FieldDefinition }>;
};

export type FieldDefinition = {
  typeName: string;
  isArray: boolean;
  isRef: boolean;
  isRequired: boolean;
};
// #endregion builder types

// #region API resolution types

export type PrimitiveTypes = {
  varchar: string;
  text: string;
  int: number;
  float: number;
  boolean: boolean;
};

export const DatabaseToApiTypes = {
  varchar: 'string',
  text: 'string',
  int: 'number',
  float: 'number',
  boolean: 'boolean',
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

export type ApiModelFields<
  T extends Record<string, { [internal]: FieldDefinition }>,
> = {
  [K in keyof T]: ApiFieldType<T[K][internal]>;
};

export type ApiFieldType<T extends FieldDefinition> = ModelField<
  FinalFieldType<T>
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

function identifier<
  const Self extends { [internal]: TableDefinition },
  const Fields extends (keyof Self[internal]['fields'])[],
>(
  this: Self,
  identifier: Fields,
): SetInternalKey<Self, 'identifier', Fields, 'identifier'> {
  return omit(
    {
      ...this,
      [internal]: {
        ...this[internal],
        identifier,
      },
    },
    'identifier',
  ) as any;
}

function field<const TypeName extends string>(typeName: TypeName) {
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
}

function convertSqlTableToApiModel<const T extends TableDefinition>(table: T) {
  const fields = {} as any;
  for (const [fieldName, fieldDef] of Object.entries(table.fields)) {
    fields[fieldName] = convertSqlFieldToApiField(fieldDef[internal]);
  }
  return a
    .model(fields as ApiModelFields<T['fields']>)
    .identifier(table.identifier as any);
}

function convertSqlFieldToApiField<const T extends FieldDefinition>(
  field: T,
): ApiFieldType<T> {
  const modelFieldBuilder = {
    int: a.integer,
    float: a.float,
    varchar: a.string,
    text: a.string,
  }[field.typeName];

  if (!modelFieldBuilder) {
    throw new Error(`Unknown field type ${field.typeName}.`);
  }

  let modelField = modelFieldBuilder() as any;

  if (field.isArray) modelField = modelField.array();
  if (field.isRequired) modelField = modelField.required();

  return modelField;
}

function transformTables(tables: SchemaDefinition['tables']) {
  return Object.entries(tables).map(([tableName, tableDef]) => {
    return {
      tableName,
      columns: transformColumns(tableDef[internal]),
      primaryKey: tableDef[internal].identifier,
    };
  });
}

function transformColumns(table: TableDefinition) {
  return Object.entries(table.fields).map(([fieldName, fieldDef]) => {
    return {
      name: fieldName,
      type: fieldDef[internal].typeName,
      isNullable: fieldDef[internal].isRequired,
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
  table<const T extends TableDefinition['fields']>(fields: T) {
    return {
      [internal]: { fields, identifier: ['id'] },
      identifier,
      toAPIModel() {
        return convertSqlTableToApiModel(this[internal]);
      },
    };
  },
  int() {
    return field('int');
  },
  float() {
    return field('float');
  },
  varchar() {
    return field('varchar');
  },
  text() {
    return field('text');
  },
};
