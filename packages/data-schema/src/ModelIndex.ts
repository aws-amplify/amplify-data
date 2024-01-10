import type { Brand } from '@aws-amplify/data-schema-types';
import { ModelField, string, integer } from './ModelField';
import { ModelType, model } from './ModelType';

const brand = 'modelIndexType';

export type ModelIndexData = {
  partitionKey: string;
  sortKeys: readonly unknown[];
  indexName: string;
  queryField: string;
};

export type InternalModelIndexType = ModelIndexType<any, any, any> & {
  data: ModelIndexData;
};

// TODO: delete test code
const a = {
  model,
  string,
  integer,
  index: modelIndex,
};

const m = a
  .model({
    title: a.string().required(),
    description: a.string().required(),
    optField: a.string(),
    viewCount: a.integer(),
  })
  .secondaryIndexes([
    a.index('title'),
    a.index('description').sortKeys(['viewCount']),
  ]);

export type ModelIndexType<
  ModelFieldKeys extends string,
  PK,
  SK = readonly [],
  K extends keyof ModelIndexType<any, any, any> = never,
> = Omit<
  {
    sortKeys<
      MF extends ModelFieldKeys = ModelFieldKeys,
      const SK extends ReadonlyArray<Exclude<MF, PK>> = readonly [],
    >(
      sortKeys: SK,
    ): ModelIndexType<MF, PK, SK, K | 'sortKeys'>;
    name(name: string): ModelIndexType<ModelFieldKeys, PK, SK, K | 'name'>;
    queryField(
      field: string,
    ): ModelIndexType<ModelFieldKeys, PK, SK, K | 'queryField'>;
  },
  K
> &
  Brand<object, typeof brand>;

function _modelIndex<
  ModelFieldKeys extends string,
  PK extends ModelFieldKeys,
  SK,
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
  } as ModelIndexType<ModelFieldKeys, PK, SK>;

  return { ...builder, data } as InternalModelIndexType as ModelIndexType<
    ModelFieldKeys,
    PK,
    SK
  >;
}

export function modelIndex<
  const ModelFieldKeys extends string,
  PK extends ModelFieldKeys,
  SK,
>(partitionKeyFieldName: PK) {
  return _modelIndex<ModelFieldKeys, PK, SK>(partitionKeyFieldName);
}

/* 
  Temp. Test Area. 
  Delete before opening PR
*/

/* 
  TODOs:
  X fix .sortKeys type
  * add queryField type param
  * narrow PK to string fields only
  * narrow SK to primitives only
  * add benches, then refactor SecondaryIndexToIR to construct intersection and drop UnionToTuple; compare instantiations
  * move method sig types into client types
  * add integ tests
  * sortDirection
  * refactor?
  * 
*/

type A = { a: 1; b: 2 };
type _TestIntersection = A & unknown;
//   ^?

type Fields = 'title' | 'description' | 'optField' | 'viewCount';

const test = {
  myFn<Fields extends string, Pk extends string = Fields>(pk: Pk) {
    pk;
    return this;
  },
  myFn2<Fields extends string, Pk extends string = Fields>(pk: Pk) {
    pk;
    return this;
  },
};

const _tRes = test.myFn<Fields>('title').myFn2('');

// type _GsiMethods = Prettify<ConvertGSIs<MassagedTuple>>;
// const testModelMethods = {} as _GsiMethods;

// const _res = testModelMethods.listByTitleAndOptFieldAndViewCount({
//   title: 'abc',
//   viewCount: { gt: 1 },
// });

type M = typeof m;
type ModelFs = M extends ModelType<infer R, any, any, any>
  ? R['fields']
  : false;

type ResolvedFields = {
  [F in keyof ModelFs]: ModelFs[F] extends ModelField<infer R, any, any>
    ? R
    : never;
};

type GsiShape = {
  label: string;
  pk: { [key: string]: string };
  sk: { [key: string]: unknown };
};

// Create method from Result

type SingleGsiSignature<GSI extends GsiShape> = {
  [K in GSI['label'] & string]: (
    input: GSI['pk'] & {
      [SKField in keyof GSI['sk']]+?: string extends GSI['sk'][SKField]
        ? StringFilter
        : NumericFilter;
    },
  ) => Promise<Array<{ data: ResolvedFields }>>;
};

type _ConvertGSIs<
  GsiTuple extends GsiShape[],
  Res extends Record<string, unknown> = Record<never, never>,
> = GsiTuple extends [infer A extends GsiShape, ...infer B extends GsiShape[]]
  ? _ConvertGSIs<B, Res & SingleGsiSignature<A>>
  : Res;

// Filters
type StringFilter = {
  attributeExists?: boolean;
  beginsWith?: string;
  between?: [string, string];
  contains?: string;
  eq?: string;
  ge?: string;
  gt?: string;
  le?: string;
  lt?: string;
  ne?: string;
  notContains?: string;
};

type NumericFilter = {
  attributeExists?: boolean;
  between?: [number, number];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};
