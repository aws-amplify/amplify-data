import { Brand, brand } from './util';

const brandName = 'modelIndexType';

/**
 * DynamoDB Global Secondary Index (GSI) projection types.
 * - `KEYS_ONLY`: Only the index and primary keys are projected into the index.
 * - `INCLUDE`: In addition to the attributes in KEYS_ONLY, includes specified non-key attributes.
 * - `ALL`: All attributes from the base table are projected into the index.
 */
export type GSIProjectionType = 'KEYS_ONLY' | 'INCLUDE' | 'ALL';

/**
 * Configuration data for a model's secondary index.
 */
export type ModelIndexData = {
  partitionKey: string;
  sortKeys: readonly unknown[];
  indexName: string;
  queryField: string | null;
  /** The projection type for the GSI. Defaults to 'ALL' if not specified. */
  projectionType?: GSIProjectionType;
  /** Non-key attributes to include when projectionType is 'INCLUDE'. */
  nonKeyAttributes?: readonly string[];
};

export type InternalModelIndexType = ModelIndexType<any, any, any, any> & {
  data: ModelIndexData;
};

export type ModelIndexType<
  ModelFieldKeys extends string,
  PK,
  SK = readonly [],
  QueryField = never,
  K extends keyof ModelIndexType<any, any, any, any> = never,
> = Omit<
  {
    sortKeys<
      FieldKeys extends ModelFieldKeys = ModelFieldKeys,
      const SK extends ReadonlyArray<Exclude<FieldKeys, PK>> = readonly [],
    >(
      sortKeys: SK,
    ): ModelIndexType<FieldKeys, PK, SK, QueryField, K | 'sortKeys'>;
    name(
      name: string,
    ): ModelIndexType<ModelFieldKeys, PK, SK, QueryField, K | 'name'>;
    queryField<
      QF extends string | null = never,
      MF extends ModelFieldKeys = ModelFieldKeys,
    >(
      field: QF,
    ): ModelIndexType<MF, PK, SK, QF, K | 'queryField'>;
    projection<
      PT extends GSIProjectionType,
      NKA extends PT extends 'INCLUDE' ? readonly string[] : never = never,
    >(
      type: PT,
      ...args: PT extends 'INCLUDE' ? [nonKeyAttributes: NKA] : []
    ): ModelIndexType<ModelFieldKeys, PK, SK, QueryField, K | 'projection'>;
  },
  K
> &
  Brand<typeof brandName>;

function _modelIndex<
  ModelFieldKeys extends string,
  PK extends ModelFieldKeys,
  SK = readonly [],
  QueryField = never,
>(partitionKeyFieldName: PK) {
  const data: ModelIndexData = {
    partitionKey: partitionKeyFieldName,
    sortKeys: [],
    indexName: '',
    queryField: '',
    projectionType: 'ALL',
    nonKeyAttributes: undefined,
  };

  const builder = {
    sortKeys(sortKeys) {
      data.sortKeys = sortKeys;

      return this;
    },
    name(name) {
      data.indexName = name;

      return this;
    },
    queryField(field) {
      data.queryField = field;

      return this;
    },
    projection(type, ...args) {
      data.projectionType = type;
      if (type === 'INCLUDE') {
        data.nonKeyAttributes = args[0];
      }

      return this;
    },
    ...brand(brandName),
  } as ModelIndexType<ModelFieldKeys, PK, SK, QueryField>;

  return { ...builder, data } as InternalModelIndexType as ModelIndexType<
    ModelFieldKeys,
    PK,
    SK,
    QueryField
  >;
}

export function modelIndex<
  ModelFieldKeys extends string,
  PK extends ModelFieldKeys,
  SK = readonly [],
  QueryField = never,
>(partitionKeyFieldName: PK) {
  return _modelIndex<ModelFieldKeys, PK, SK, QueryField>(partitionKeyFieldName);
}
