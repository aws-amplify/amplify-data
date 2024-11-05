import * as a from '../a';
import { ModelType, ModelTypeParamShape } from '../ModelType';
import { ModelField } from '../ModelField';

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
  fields: Record<string, { [internal]: FieldDefinition }>;
};

export type FieldDefinition = {
  typeName: string;
  isArray: boolean;
  isRef: boolean;
  isRequired: boolean;
  apiFieldType: <Self extends FieldDefinition>(
    this: Self,
  ) => FinalFieldType<Self>;
};
// #endregion builder types

// #region API resolution types

export type PrimitiveTypes = {
  string: string;
  number: number;
  boolean: boolean;
};

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

export type FinalFieldType<Def extends FieldDefinition> = Arrayatize<
  Requiredtize<PrimitiveType<Def['typeName']>, Def>,
  Def
>;

export type ApiModelFields<
  T extends Record<string, { [internal]: FieldDefinition }>,
> = {
  [K in keyof T]: ApiFieldType<T[K]>;
};

export type ApiFieldType<T extends { [internal]: FieldDefinition }> =
  ModelField<FinalFieldType<T[internal]>>;

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

export const sql = {
  schema<const T extends SchemaDefinition>(def: T): T {
    return def as any;
  },
  table<const T extends TableDefinition['fields']>(fields: T) {
    return {
      [internal]: { fields },
      toAPIModel() {
        return a.model({} as unknown as ApiModelFields<T>);
      },
    };
  },
  field<const TypeName extends string>(typeName: TypeName) {
    return {
      [internal]: {
        typeName,
        isRef: false,
        isArray: false,
        isRequired: false,
        toApiField() {
          return {} as any;
        },
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
