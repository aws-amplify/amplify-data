import type { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import {
  type PrimaryIndexIrShape,
  type SecondaryIndexIrShape,
  brand,
} from './util';
import type { InternalField, BaseModelField } from './ModelField';
import type {
  ModelRelationshipField,
  InternalRelationshipField,
  ModelRelationshipFieldParamShape,
} from './ModelRelationshipField';
import { type AllowModifier, type Authorization, allow } from './Authorization';
import type { RefType, RefTypeParamShape } from './RefType';
import type { EnumType } from './EnumType';
import type { CustomType, CustomTypeParamShape } from './CustomType';
import {
  type ModelIndexType,
  type InternalModelIndexType,
  modelIndex,
} from './ModelIndex';
import type {
  PrimaryIndexFieldsToIR,
  SecondaryIndexToIR,
} from './MappedTypes/MapIndexes';
import type { brandSymbol } from './util/Brand.js';
import type { methodKeyOf } from './util/usedMethods.js';

const brandName = 'modelType';
export type deferredRefResolvingPrefix = 'deferredRefResolving:';

type ModelFields = Record<
  string,
  | BaseModelField
  | ModelRelationshipField<any, string, any, any>
  | RefType<any, any, any>
  | EnumType
  | CustomType<CustomTypeParamShape>
>;

type InternalModelFields = Record<
  string,
  InternalField | InternalRelationshipField
>;

export type DisableOperationsOptions =
  | 'queries'
  | 'mutations'
  | 'subscriptions'
  | 'list'
  | 'get'
  | 'create'
  | 'update'
  | 'delete'
  | 'onCreate'
  | 'onUpdate'
  | 'onDelete';

type ModelData = {
  fields: ModelFields;
  identifier: ReadonlyArray<string>;
  secondaryIndexes: ReadonlyArray<ModelIndexType<any, any, any, any, any>>;
  authorization: Authorization<any, any, any>[];
  disabledOperations: ReadonlyArray<DisableOperationsOptions>;
};

type InternalModelData = ModelData & {
  fields: InternalModelFields;
  identifier: ReadonlyArray<string>;
  secondaryIndexes: ReadonlyArray<InternalModelIndexType>;
  authorization: Authorization<any, any, any>[];
  disabledOperations: ReadonlyArray<DisableOperationsOptions>;
  originalName?: string;
};

export type ModelTypeParamShape = {
  fields: ModelFields;
  identifier: PrimaryIndexIrShape;
  secondaryIndexes: ReadonlyArray<SecondaryIndexIrShape>;
  authorization: Authorization<any, any, any>[];
  disabledOperations: ReadonlyArray<DisableOperationsOptions>;
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
export type ExtractSecondaryIndexIRFields<
  T extends ModelTypeParamShape,
> = {
  [FieldProp in keyof T['fields'] as T['fields'][FieldProp] extends BaseModelField<
    infer R
  >
    ? NonNullable<R> extends string | number
      ? FieldProp
      : never
    : T['fields'][FieldProp] extends
          | EnumType
          | RefType<RefTypeParamShape, any, any>
      ? FieldProp
      : never]: T['fields'][FieldProp] extends BaseModelField<infer R>
    ? R
    : T['fields'][FieldProp] extends EnumType<infer values>
      ? values[number]
      : T['fields'][FieldProp] extends RefType<infer R, any, any>
        ? `${deferredRefResolvingPrefix}${R['link']}`
        : never;
};

type ExtractType<T extends ModelTypeParamShape> = {
  [FieldProp in keyof T['fields'] as T['fields'][FieldProp] extends BaseModelField
    ? FieldProp
    : never]: T['fields'][FieldProp] extends BaseModelField<infer R>
    ? R
    : never;
};

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
    ModelRelationshipField<ModelRelationshipFieldParamShape, string, any, any>
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

export type BaseModelType<T extends ModelTypeParamShape = ModelTypeParamShape> =
  ModelType<T, UsableModelTypeKey>;

export type UsableModelTypeKey = methodKeyOf<ModelType>;

/**
 * Model type definition interface
 *
 * @param T - The shape of the model type
 * @param UsedMethod - The method keys already defined
 */
export type ModelType<
  T extends ModelTypeParamShape = ModelTypeParamShape,
  UsedMethod extends UsableModelTypeKey = never,
> = Omit<
  {
    [brandSymbol]: typeof brandName;
    identifier<
      PrimaryIndexFields = ExtractSecondaryIndexIRFields<T>,
      PrimaryIndexPool extends string = keyof PrimaryIndexFields & string,
      const ID extends ReadonlyArray<PrimaryIndexPool> = readonly [],
      const PrimaryIndexIR extends PrimaryIndexIrShape = PrimaryIndexFieldsToIR<
        ID,
        PrimaryIndexFields
      >,
    >(
      identifier: ID,
    ): ModelType<
      SetTypeSubArg<T, 'identifier', PrimaryIndexIR>,
      UsedMethod | 'identifier'
    >;
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
      UsedMethod | 'secondaryIndexes'
    >;
    disableOperations<
      const Ops extends ReadonlyArray<DisableOperationsOptions>,
    >(
      ops: Ops,
    ): ModelType<
      SetTypeSubArg<T, 'disabledOperations', Ops>,
      UsedMethod | 'disableOperations'
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      callback: (
        allow: Omit<AllowModifier, 'resource'>,
      ) => AuthRuleType | AuthRuleType[],
    ): ModelType<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      UsedMethod | 'authorization'
    >;
  },
  UsedMethod
>;

/**
 * External representation of Model Type that exposes the `relationships` modifier.
 * Used on the complete schema object.
 */
export type SchemaModelType<
  T extends BaseModelType = ModelType<ModelTypeParamShape, 'identifier'>,
  ModelName extends string = string,
  IsRDS extends boolean = false,
> = IsRDS extends true
  ? T & {
      relationships<
        Param extends Record<
          string,
          ModelRelationshipField<any, string, any, any>
        > = Record<never, never>,
      >(
        relationships: Param,
      ): Record<ModelName, Param>;
      fields: T extends ModelType<infer R, any> ? R['fields'] : never;
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
    disabledOperations: [],
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
    disableOperations(ops) {
      data.disabledOperations = ops;

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
 * Model default identifier
 *
 * @param pk - primary key
 * @param sk - secondary key
 * @param compositeSk - composite secondary key
 */
export type ModelDefaultIdentifier = {
  pk: { readonly id: string };
  sk: never;
  compositeSk: never;
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
  identifier: ModelDefaultIdentifier;
  secondaryIndexes: [];
  authorization: [];
  disabledOperations: [];
}> {
  return _model(fields);
}
