import type {
  SetTypeSubArg,
  SecondaryIndexIrShape,
} from '@aws-amplify/data-schema-types';
import { Brand, brand } from './util';
import { ModelField, InternalField } from './ModelField';
import type {
  ModelRelationalField,
  InternalRelationalField,
  ModelRelationalFieldParamShape,
} from './ModelRelationalField';
import { AllowModifier, Authorization, allow } from './Authorization';
import { RefType, RefTypeParamShape } from './RefType';
import { EnumType, EnumTypeParamShape } from './EnumType';
import { CustomType, CustomTypeParamShape } from './CustomType';
import {
  ModelIndexType,
  InternalModelIndexType,
  modelIndex,
} from './ModelIndex';
import { SecondaryIndexToIR } from './MappedTypes/MapSecondaryIndexes';

const brandName = 'modelType';
export type deferredRefResolvingPrefix = 'deferredRefResolving:';

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
  originalName?: string;
};

export type ModelTypeParamShape = {
  fields: ModelFields;
  identifier: string[];
  secondaryIndexes: ReadonlyArray<SecondaryIndexIrShape>;
  authorization: Authorization<any, any, any>[];
};

/**
 * Extract fields that are eligible to be PK or SK fields with their resolved type.
 *
 * Eligible fields include:
 * 1. ModelField that contains string or number
 * 2. inline EnumType
 * 3. RefType that refers to a top level defined EnumType (this is enforced by
 * validation that happens in the Schema Processor)
 *
 * NOTE: at this point, there is no way to resolve the type from a RefType as
 * we don't have access to the NonModelType at this location. So we generate am
 * indicator string, and resolve its corresponding type later in
 * packages/data-schema/src/runtime/client/index.ts
 */
type ExtractSecondaryIndexIRFields<T extends ModelTypeParamShape> = {
  [FieldProp in keyof T['fields'] as T['fields'][FieldProp] extends ModelField<
    infer R,
    any,
    any
  >
    ? NonNullable<R> extends string | number
      ? FieldProp
      : never
    : T['fields'][FieldProp] extends EnumType<EnumTypeParamShape>
      ? FieldProp
      : T['fields'][FieldProp] extends RefType<RefTypeParamShape, any, any>
        ? FieldProp
        : never]: T['fields'][FieldProp] extends ModelField<infer R, any, any>
    ? R
    : T['fields'][FieldProp] extends EnumType<infer R>
      ? R['values'][number]
      : T['fields'][FieldProp] extends RefType<infer R, any, any>
        ? `${deferredRefResolvingPrefix}${R['link']}`
        : never;
};

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
  Model extends ModelType<
    infer ModelParam extends ModelTypeParamShape,
    infer HiddenKeys
  >
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
  K extends keyof ModelType<T> = never,
> = Omit<
  {
    identifier<const ID extends IdentifierType<T> = []>(
      identifier: ID,
    ): ModelType<SetTypeSubArg<T, 'identifier', ID>, K | 'identifier'>;
    secondaryIndexes<
      const SecondaryIndexFields = ExtractSecondaryIndexIRFields<T>,
      const SecondaryIndexPKPool extends string = keyof SecondaryIndexFields &
        string,
      const Indexes extends readonly ModelIndexType<
        string,
        string,
        unknown,
        readonly [],
        any
      >[] = readonly [],
      const IndexesIR extends readonly any[] = SecondaryIndexToIR<
        Indexes,
        SecondaryIndexFields
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
      K | 'secondaryIndexes'
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      callback: (
        allow: Omit<AllowModifier, 'resource'>,
      ) => AuthRuleType | AuthRuleType[],
    ): ModelType<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization'
    >;
  },
  K
> &
  Brand<typeof brandName>;

/**
 * External representation of Model Type that exposes the `relationships` modifier.
 * Used on the complete schema object.
 */
export type SchemaModelType<
  T extends ModelType<ModelTypeParamShape, never | 'identifier'> = ModelType<
    ModelTypeParamShape,
    never | 'identifier'
  >,
  ModelName extends string = string,
  IsRDS extends boolean = false,
> = IsRDS extends true
  ? T & {
      relationships<
        Param extends Record<
          string,
          ModelRelationalField<any, string, any, any>
        > = Record<never, never>,
      >(
        relationships: Param,
      ): Record<ModelName, Param>;
      fields: T extends ModelType<infer R extends ModelTypeParamShape, any>
        ? R['fields']
        : never;
    }
  : T;

/**
 * Internal representation of Model Type that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalModel = SchemaModelType<
  ModelType<ModelTypeParamShape>,
  string,
  true
> & {
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
    secondaryIndexes(callback) {
      data.secondaryIndexes = callback(modelIndex);

      return this;
    },
    authorization(callback) {
      const { resource: _, ...rest } = allow;
      const rules = callback(rest);
      data.authorization = Array.isArray(rules) ? rules : [rules];

      return this;
    },
    ...brand(brandName),
  } as ModelType<T>;

  return {
    ...builder,
    data,
    relationships(relationships) {
      data.fields = { ...data.fields, ...relationships };
    },
    fields: data.fields,
  } as InternalModel as ModelType<T>;
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
    typeof internalType.relationships === 'function'
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
  identifier: ['id'];
  secondaryIndexes: [];
  authorization: [];
}> {
  return _model(fields);
}
