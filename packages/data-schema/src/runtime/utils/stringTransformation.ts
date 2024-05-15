/**
 * @param s string to capitalize
 * @returns capitalized string
 */
export function capitalize<T extends string>(s: T): Capitalize<T> {
  return `${s[0].toUpperCase()}${s.slice(1)}` as Capitalize<T>;
}
