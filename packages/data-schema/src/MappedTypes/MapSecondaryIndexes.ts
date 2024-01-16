import { ModelIndexType } from '../ModelIndex';

type ModelIndexTypeShape = ModelIndexType<any, any, any, any, any>;

// Move to type utils
type IsEmptyStringOrNever<T extends string | never> = [T] extends [never]
  ? true
  : [T] extends ['']
    ? true
    : false;

/**
 * Maps array of ModelIndexType to SecondaryIndexIrShape
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

type SingleIndexIrFromType<
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
      queryField: IsEmptyStringOrNever<QueryField> extends true
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
