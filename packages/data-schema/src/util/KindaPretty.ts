/**
 * Prettify without rewriting function types.
 */
export type KindaPretty<T> = T extends (...args: any) => any
  ? T
  : T extends Array<infer innerT>
    ? Array<KindaPretty<innerT>>
    : T extends object
      ? {
          [K in keyof T]: KindaPretty<T[K]>;
        }
      : T;
