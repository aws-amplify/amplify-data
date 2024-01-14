import type { Brand, SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { ModelField, InternalField } from './ModelField';
import type {
  ModelRelationalField,
  InternalRelationalField,
} from './ModelRelationalField';
import { Authorization } from './Authorization';
import { RefType } from './RefType';
import { EnumType, EnumTypeParamShape } from './EnumType';
import { CustomType, CustomTypeParamShape } from './CustomType';
import { ModelIndexType, InternalModelIndexType } from './ModelIndex';

const brand = 'modelType';

type ModelFields = Record<
  string,
  | ModelField<any, any, any>
  | ModelRelationalField<any, string, any, any>
  | RefType<any, any, any>
  | EnumType<EnumTypeParamShape>
  | CustomType<CustomTypeParamShape>
>;

type ModelIndexTypeShape = ModelIndexType<any, any, any, any, any>;

type InternalModelFields = Record<
  string,
  InternalField | InternalRelationalField
>;

type ModelData = {
  fields: ModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<ModelIndexTypeShape>;
  authorization: Authorization<any, any, any>[];
};

type InternalModelData = ModelData & {
  fields: InternalModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<InternalModelIndexType>;
  authorization: Authorization<any, any, any>[];
};

type GsiIrShape = {
  label: string;
  pk: { [key: string]: unknown };
  sk: { [key: string]: unknown };
};

export type ModelTypeParamShape = {
  fields: ModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<GsiIrShape>;
  authorization: Authorization<any, any, any>[];
};

type ExtractType<T extends ModelTypeParamShape> = {
  [FieldProp in keyof T['fields']]: T['fields'][FieldProp] extends ModelField<
    infer R,
    any
  >
    ? R
    : never;
};

type GetRequiredFields<T> = {
  [FieldProp in keyof T as T[FieldProp] extends NonNullable<T[FieldProp]>
    ? FieldProp
    : never]: T[FieldProp];
};

type IdentifierMap<T extends ModelTypeParamShape> = GetRequiredFields<
  ExtractType<T>
>;

// extracts model fields that CAN BE used as identifiers (scalar, non-nullable fields)
// TODO: make this also filter out all non-scalars e.g., model fields and custom types
type IdentifierFields<T extends ModelTypeParamShape> = keyof IdentifierMap<T> &
  string;

type IdentifierType<
  T extends ModelTypeParamShape,
  Fields extends string = IdentifierFields<T>,
> = Array<Fields>;

/**
 * For a given ModelTypeParamShape, produces a map of Authorization rules
 * that would *conflict* with the given type.
 *
 * E.g.,
 *
 * ```
 * const test = {
 *  fields: {
 *   title: fields.string(),
 *   otherfield: fields.string().array(),
 *   numfield: fields.integer(),
 *  },
 *  identifier: [],
 *  authorization: [],
 * };
 *
 * ConflictingAuthRulesMap<typeof test> === {
 *  title: Authorization<"title", true>;
 *  otherfield: Authorization<"otherfield", false>;
 *  numfield: Authorization<"numfield", true> | Authorization<"numfield", false>;
 * }
 * ```
 */
type ConflictingAuthRulesMap<T extends ModelTypeParamShape> = {
  [K in keyof ExtractType<T>]: K extends string
    ? string extends ExtractType<T>[K]
      ? Authorization<any, K, true>
      : string[] extends ExtractType<T>[K]
        ? Authorization<any, K, false>
        : Authorization<any, K, true> | Authorization<any, K, false>
    : never;
};

/**
 * For a given ModelTypeParamShape, produces a union of Authorization rules
 * that would *conflict* with the given type.
 *
 * E.g.,
 *
 * ```
 * const test = {
 *  fields: {
 *   title: fields.string(),
 *   otherfield: fields.string().array(),
 *   numfield: fields.integer(),
 *  },
 *  identifier: [],
 *  authorization: [],
 * };
 *
 * ConflictingAuthRules<typeof test> ===
 *  Authorization<"title", true>
 *  | Authorization<"otherfield", false>
 *  | Authorization<"numfield", true> | Authorization<"numfield", false>
 * ;
 * ```
 */
type _ConflictingAuthRules<T extends ModelTypeParamShape> =
  ConflictingAuthRulesMap<T>[keyof ConflictingAuthRulesMap<T>];

export type ModelType<
  T extends ModelTypeParamShape,
  K extends keyof ModelType<T> = never,
  ModelFields = ExtractType<T>,
  ModelFieldKeys extends string = keyof ModelFields & string,
> = Omit<
  {
    identifier<ID extends IdentifierType<T> = []>(
      identifier: ID,
    ): ModelType<
      SetTypeSubArg<T, 'identifier', ID>,
      K | 'identifier',
      ModelFields
    >;
    secondaryIndexes<
      // ModelFieldsKeys2 extends string = keyof ModelFields & string,
      const Indexes extends readonly ModelIndexType<
        ModelFieldKeys,
        ModelFieldKeys,
        unknown,
        never,
        any
      >[] = [],
      IndexesIR extends readonly any[] = GsiIR<Indexes, ModelFields>,
    >(
      indexes: Indexes,
    ): ModelType<
      SetTypeSubArg<T, 'secondaryIndexes', IndexesIR>,
      K | 'secondaryIndexes',
      ModelFields
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      rules: AuthRuleType[],
    ): ModelType<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization',
      ModelFields
    >;
  },
  K
> &
  Brand<object, typeof brand>;

/**
 * Internal representation of Model Type that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalModel = ModelType<any> & {
  data: InternalModelData;
};

function _model<T extends ModelTypeParamShape>(fields: T['fields']) {
  const data: ModelData = {
    fields,
    identifier: ['id'],
    secondaryIndexes: [],
    authorization: [],
  };

  const builder = {
    identifier(identifier) {
      data.identifier = identifier;

      return this;
    },
    secondaryIndexes(indexes) {
      data.secondaryIndexes = indexes;

      return this;
    },
    authorization(rules) {
      data.authorization = rules;

      return this;
    },
  } as ModelType<T>;

  return { ...builder, data } as InternalModel as ModelType<T>;
}

/**
 * A data model that creates a matching Amazon DynamoDB table and provides create, read (list and get), update,
 * delete, and subscription APIs.
 *
 * @param fields database table fields. Supports scalar types and relationship types.
 * @returns a data model definition
 */
export function model<T extends ModelFields>(
  fields: T,
): ModelType<{
  fields: T;
  identifier: Array<'id'>;
  secondaryIndexes: [];
  authorization: [];
}> {
  return _model(fields);
}

// TODO: rename and extract into separate file;
// Will breaking apart SecondaryIndexToIR optimize it?
type GsiIR<
  GSI extends readonly ModelIndexTypeShape[],
  ModelFields,
> = SecondaryIndexToIR<GSI, ModelFields>;

type IsEmptyStringOrNever<T extends string | never> = [T] extends [never]
  ? true
  : [T] extends ['']
    ? true
    : false;

/* 
  Maps array of ModelIndexType to GsiIR
*/
type SecondaryIndexToIR<
  Idxs extends ReadonlyArray<ModelIndexTypeShape>,
  ResolvedFields,
  Result extends readonly any[] = readonly [],
> = Idxs extends readonly [
  infer First extends ModelIndexTypeShape,
  ...infer Rest extends ReadonlyArray<ModelIndexTypeShape>,
]
  ? SecondaryIndexToIR<
      Rest,
      ResolvedFields,
      [...Result, SingleGsiIrFromType<First, ResolvedFields>]
    >
  : Result;

type SingleGsiIrFromType<
  Idx extends ModelIndexTypeShape,
  ResolvedFields,
> = Idx extends ModelIndexType<
  any,
  infer PK extends string,
  infer SK,
  infer QueryField extends string | never,
  any
>
  ? {
      label: IsEmptyStringOrNever<QueryField> extends true
        ? `listBy${SkLabelFromTuple<SK, Capitalize<PK>>}`
        : QueryField;
      pk: PK extends keyof ResolvedFields
        ? {
            [Key in PK]: Exclude<ResolvedFields[PK], null>;
          }
        : never;
      // distribute ResolvedFields over SK
      sk: unknown extends SK
        ? never
        : ResolvedSortKeyFields<SK, ResolvedFields>;
    }
  : never;

type SkLabelFromTuple<T, StrStart extends string = ''> = T extends readonly [
  infer A extends string,
  ...infer B extends string[],
]
  ? SkLabelFromTuple<B, `${StrStart}And${Capitalize<A>}`>
  : StrStart;

type ResolvedSortKeyFields<SK, ResolvedFields> = SK extends readonly [
  infer A extends string,
  ...infer B extends string[],
]
  ? A extends keyof ResolvedFields
    ? {
        [Key in A]: Exclude<ResolvedFields[A], null>;
      } & (B extends readonly never[]
        ? unknown // returning `unknown` for empty arrays because it gets absorbed in an intersection, e.g. `{a: 1} & unknown` => `{a: 1}`
        : ResolvedSortKeyFields<B, ResolvedFields>)
    : never
  : never;
