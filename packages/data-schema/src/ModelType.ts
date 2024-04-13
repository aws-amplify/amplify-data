import type {
  SecondaryIndexIrShape,
  SetTypeSubArg,
} from '@aws-amplify/data-schema-types';
import { Authorization } from './Authorization';
import { CustomType, CustomTypeParamShape } from './CustomType';
import { EnumType, EnumTypeParamShape } from './EnumType';
import { SecondaryIndexToIR } from './MappedTypes/MapSecondaryIndexes';
import { InternalField, ModelField } from './ModelField';
import {
  InternalModelIndexType,
  modelIndex,
  ModelIndexType,
} from './ModelIndex';
import type {
  InternalRelationalField,
  ModelRelationalField,
  ModelRelationalFieldParamShape,
} from './ModelRelationalField';
import { RefType } from './RefType';
import { brand, type brandSymbol } from './util';

const brandName = 'modelType';

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

type InternalModelData = ModelData & {
  fields: InternalModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<InternalModelIndexType>;
  authorization: Authorization<any, any, any>[];
};

export type ModelTypeParamShape = {
  fields: ModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<SecondaryIndexIrShape>;
  authorization: Authorization<any, any, any>[];
};

// Extract field names that can be used to define a secondary index PK or SK
// i.e., nullable string or nullable number fields
type SecondaryIndexFields<T extends Record<string, unknown>> = {
  [Field in keyof T]: T[Field] extends string | number | null | undefined
    ? Field
    : never;
}[keyof T];

type ExtractType<T extends ModelTypeParamShape> = {
  [FieldProp in keyof T['fields'] as T['fields'][FieldProp] extends ModelField<
    any,
    any,
    any
  >
    ? FieldProp
    : never]: T['fields'][FieldProp] extends ModelField<infer R, any, any>
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

export type AddRelationshipFieldsToModelTypeFields<
  Model,
  RelationshipFields extends Record<
    string,
    ModelRelationalField<ModelRelationalFieldParamShape, string, any, any>
  >,
> =
  Model extends ModelType<infer ModelParam, infer HiddenKeys>
    ? ModelType<
        SetTypeSubArg<
          ModelParam,
          'fields',
          ModelParam['fields'] & RelationshipFields
        >,
        HiddenKeys
      >
    : never;

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
  UsedMethod extends keyof ModelType<T> = never,
> = Omit<
  {
    [brandSymbol]: typeof brandName;
    identifier<ID extends IdentifierType<T> = []>(
      identifier: ID,
    ): ModelType<SetTypeSubArg<T, 'identifier', ID>, UsedMethod | 'identifier'>;
    secondaryIndexes<
      const SecondaryIndexPKPool extends string = SecondaryIndexFields<
        ExtractType<T>
      >,
      const Indexes extends readonly ModelIndexType<
        string,
        string,
        unknown,
        readonly [],
        any
      >[] = readonly [],
      const IndexesIR extends readonly any[] = SecondaryIndexToIR<
        Indexes,
        ExtractType<T>
      >,
    >(
      callback: (
        index: <PK extends SecondaryIndexPKPool>(
          pk: PK,
        ) => ModelIndexType<
          SecondaryIndexPKPool,
          PK,
          ReadonlyArray<Exclude<SecondaryIndexPKPool, PK>>
        >,
      ) => Indexes,
    ): ModelType<
      SetTypeSubArg<T, 'secondaryIndexes', IndexesIR>,
      UsedMethod | 'secondaryIndexes'
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      rules: AuthRuleType[],
    ): ModelType<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      UsedMethod | 'authorization'
    >;
  },
  UsedMethod
>;

export interface RDSSchemaModelType<
  T extends ModelTypeParamShape = ModelTypeParamShape,
  ModelName extends string = string,
> extends ModelType<T, 'identifier'> {
  addRelationships<
    Param extends Record<string, ModelRelationalField<any, string, any, any>>,
  >(
    relationships: Param,
  ): Record<ModelName, Param>;
  fields: T['fields'];
}

/**
 * External representation of Model Type that exposes the `addRelationships` modifier.
 * Used on the complete schema object.
 */
export type SchemaModelType<
  T extends ModelTypeParamShape = ModelTypeParamShape,
  ModelName extends string = string,
  IsRDS extends boolean = false,
> = IsRDS extends true
  ? RDSSchemaModelType<T, ModelName>
  : ModelType<T, 'identifier'>;

/**
 * Internal representation of Model Type that exposes the `data` property.
 * Used at buildtime.
 */
export interface InternalModel
  extends SchemaModelType<ModelTypeParamShape, string, true> {
  data: InternalModelData;
}

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
    secondaryIndexes(callback) {
      data.secondaryIndexes = callback(modelIndex);

      return this;
    },
    authorization(rules) {
      data.authorization = rules;

      return this;
    },
    ...brand(brandName),
  } as ModelType<T>;

  return {
    ...builder,
    data,
    addRelationships: ((relationships) => {
      data.fields = { ...data.fields, ...relationships };
    }) as RDSSchemaModelType['addRelationships'],
    fields: data.fields,
  } as ModelType<T>;
}

/**
 * Model Type type guard
 * @param modelType - api-next ModelType
 * @returns true if the given value is a ModelSchema
 */
export const isSchemaModelType = (
  modelType: any | SchemaModelType,
): modelType is SchemaModelType => {
  const internalType = modelType as InternalModel;
  return (
    typeof internalType === 'object' &&
    internalType.data !== undefined &&
    internalType.data.fields !== undefined &&
    internalType.data.authorization !== undefined &&
    internalType.data.identifier !== undefined &&
    internalType.data.secondaryIndexes !== undefined &&
    typeof internalType.addRelationships === 'function'
  );
};

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
