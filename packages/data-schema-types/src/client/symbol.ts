export const __modelMeta__ = Symbol();
export type ExtractModelMeta<T extends Record<any, any>> =
  T[typeof __modelMeta__];
