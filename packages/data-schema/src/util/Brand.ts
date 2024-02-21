const brandSymbol = Symbol('brand');

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
