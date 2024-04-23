import { ModelIndexType } from '../ModelIndex';

type ModelIndexTypeShape = ModelIndexType<any, any, any, any, any>;

/**
 * Maps array of ModelIndexType to SecondaryIndexIrShape (defined in in data-schema-types)
 * */
export type SecondaryIndexToIR<
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
      [...Result, SingleIndexIrFromType<First, ResolvedFields>]
    >
  : Result;

/**
 * @typeParam Idx - accepts a single ModelIndexType
 * @typeParam ResolvedFields - resolved model fields
 *
 * @returns an IR with the following shape:
 * {
 *   queryField: string;
 *   pk: { [fieldName: string]: string | number }
 *   sk: { [fieldName: string]: string | number } | never
 * }
 *
 * @remarks - the IR type alias is defined as SecondaryIndexIrShape in data-schema-types
 */
type SingleIndexIrFromType<Idx extends ModelIndexTypeShape, ResolvedFields> =
  Idx extends ModelIndexType<
    any,
    infer PK extends string,
    infer SK,
    infer QueryField extends string | never,
    any
  >
    ? {
        defaultQueryFieldSuffix: `${QueryFieldLabelFromTuple<SK, Capitalize<PK>>}`;
        queryField: QueryField;
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

/**
 * @typeParam SK - tuple of SortKey field names, e.g. ['viewCount', 'createdAt']
 * @typeParam StrStart - initial string value; expects capitalized Partition Key field name
 *
 * @returns Query field name: concatenated PascalCase string with an `And` separator
 * @example
 * QueryFieldLabelFromTuple<['viewCount', 'createdAt'], 'Title'> => 'TitleAndViewCountAndCreatedAt'
 */
type QueryFieldLabelFromTuple<
  SK,
  StrStart extends string = '',
> = SK extends readonly [infer A extends string, ...infer B extends string[]]
  ? QueryFieldLabelFromTuple<B, `${StrStart}And${Capitalize<A>}`>
  : StrStart;

/**
 * @typeParam SK - tuple of SortKey field names, e.g. ['viewCount', 'createdAt']
 * @typeParam ResolvedFields - resolved model fields
 *
 * @returns object type where the key is the sort key field name and the value is the resolved model field type
 * @example
 * {
 *   viewCount: number;
 *   createdAt: string;
 * }
 */
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
