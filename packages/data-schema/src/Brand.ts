const brand = Symbol('brand');
type brand = typeof brand;

export type Brand<T, TBrand extends string> = T & {
  [brand]: TBrand;
};

export function brandTarget<T extends object, TBrand extends string>(
  target: T,
  brandName: TBrand,
): Brand<T, TBrand> {
  return { ...target, [brand]: brandName };
}
