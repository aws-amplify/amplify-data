/** This can be used internally to efficiently add a type-level brand without an
 * intersection */
export const brandSymbol = Symbol('brand');

/**
 * @typeParam BrandStr - String type to brand this object with
 * @returns A branded empty object type
 *
 * @example
 * Brand<'example'> => {[brandSymbol]: 'example'}
 *
 * Which I might use like this:
 * type MyType = {content: string} & Brand<'example'>
 */
export type Brand<BrandStr extends string> = {
  [brandSymbol]: BrandStr;
};

/**
 * Create an object of a specific type Brand
 * string branded type.
 *
 * @param brand: The string to Brand onto a simple object
 * @returns A branded empty object
 *
 * @example
 * brand('example') => {[brandSymbol]: 'example'}
 *
 * Which I might use like this:
 * const myType = {content: "default content", ...brand<'example'>}
 */
export function brand<BrandStr extends string>(
  brand: BrandStr,
): Brand<BrandStr> {
  return {
    [brandSymbol]: brand,
  };
}

/**
 *
 * @param branded: Branded object
 * @returns The string brand value
 */
export function getBrand(branded: Brand<string>) {
  return branded[brandSymbol];
}
