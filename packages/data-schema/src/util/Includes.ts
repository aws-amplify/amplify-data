export type Includes<T extends readonly any[], U> = {
  [P in T[number]]: true;
}[U] extends true
  ? true
  : false;
