import { Brand, brand } from './util';

const brandName = 'modelIndexType';

export type ModelIndexData = {
  partitionKey: string;
  sortKeys: readonly unknown[];
  indexName: string;
  queryField: string | null;
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
