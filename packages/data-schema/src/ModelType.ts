import type {
  Brand,
  SetTypeSubArg,
  SecondaryIndexIrShape,
} from '@aws-amplify/data-schema-types';
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
import { SecondaryIndexToIR } from './MappedTypes/MapSecondaryIndexes';

const brand = 'modelType';

type ModelFields = Record<
  string,
  | ModelField<any, any, any>
  | ModelRelationalField<any, string, any, any>
  | RefType<any, any, any>
  | EnumType<EnumTypeParamShape>
  | CustomType<CustomTypeParamShape>
>;

type InternalModelFields = Record<
  string,
  InternalField | InternalRelationalField
>;

type ModelData = {
  fields: ModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<ModelIndexType<any, any, any, any, any>>;
  authorization: Authorization<any, any, any>[];
};

type DatabaseEngine = {
  engine: 'mysql' | 'ddb' | 'aurora' | 'postgres';
};

type InternalModelData = ModelData & {
  fields: InternalModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<InternalModelIndexType>;
  authorization: Authorization<any, any, any>[];
  databaseEngine: DatabaseEngine;
};

export type ModelTypeParamShape = {
  fields: ModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<SecondaryIndexIrShape>;
  authorization: Authorization<any, any, any>[];
};

// Extract field names that can be used to define a secondary index PK or SK
// i.e., nullable string or nullable number fields
type SecondaryIndexFields<T extends Record<string, unknown>> = keyof {
  [Field in keyof T as NonNullable<T[Field]> extends string | number
    ? Field
    : never]: T[Field];
} &
  string;

type ExtractType<T extends ModelTypeParamShape> = {
  [FieldProp in keyof T['fields'] as T['fields'][FieldProp] extends ModelField<
    any,
    any
  >
    ? FieldProp
    : never]: T['fields'][FieldProp] extends ModelField<infer R, any>
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
  ResolvedModelFields extends Record<string, unknown> = ExtractType<T>,
  IndexFieldKeys extends string = SecondaryIndexFields<ResolvedModelFields>,
> = Omit<
  {
    identifier<ID extends IdentifierType<T> = []>(
      identifier: ID,
    ): ModelType<
      SetTypeSubArg<T, 'identifier', ID>,
      K | 'identifier',
      ResolvedModelFields
    >;
    secondaryIndexes<
      const Indexes extends readonly ModelIndexType<
        IndexFieldKeys,
        IndexFieldKeys,
        unknown,
        never,
        any
      >[] = readonly [],
      const IndexesIR extends readonly any[] = SecondaryIndexToIR<
        Indexes,
        ResolvedModelFields
      >,
    >(
      indexes: Indexes,
    ): ModelType<
      SetTypeSubArg<T, 'secondaryIndexes', IndexesIR>,
      K | 'secondaryIndexes',
      ResolvedModelFields
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      rules: AuthRuleType[],
    ): ModelType<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization',
      ResolvedModelFields
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
 * A data model that creates a matching Amazon database engine (defaults to DynamoDB) table and provides create, read (list and get), update,
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
