import { SetTypeSubArg } from '@aws-amplify/data-schema-types';

const dataSymbol = Symbol('DATA');

export type DataObject<Data extends Record<string, any>> = {
  [dataSymbol]: Data;
};

export function bindDataGetter<
  Data extends Record<string, any>,
  DW extends DataObject<Data> = DataObject<Data>,
>(): (obj: DW) => Data {
  return (obj: DW) => obj[dataSymbol];
}

const brandSymbol = Symbol('BRAND');

export type Brand<TBrand extends string> = {
  [brandSymbol]: TBrand;
};

export function brand<B extends string>(brand: B): Brand<B> {
  return { [brandSymbol]: brand };
}

export function bindIsBrand<
  ObjectType extends Record<any, any>,
  B extends string,
>(b: B) {
  return (obj: any): obj is ObjectType => obj[brandSymbol] === b;
}

export function buildData<T extends Record<any, any>>(
  defaultData: T,
): DataObject<T> {
  return { [dataSymbol]: { ...defaultData } };
}

/**
 * Creates a shallow copy of an object with an individual field pruned away.
 *
 * @param original The original object to prune.
 * @param without The field to prune.
 * @returns The pruned object.
 */
export function omit<T extends object, O extends string>(
  original: T,
  without: O,
): Omit<T, O> {
  const { [without]: _, ...pruned } = original;
  return pruned;
}

export type BuilderType<
  BrandName extends string,
  BuildShape extends SetTypeSubArg<Record<any, any>, string, any>,
  BuildFunctions extends Record<string, (...args: any[]) => any>,
  K extends keyof BuilderType<BrandName, BuildShape, BuildFunctions> = never,
> = Omit<DataObject<BuildShape> & BuildFunctions & Brand<BrandName>, K>;
