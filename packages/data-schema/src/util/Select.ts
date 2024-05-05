export type Select<T, M> = {
  [K in keyof T as T[K] extends M ? K : never]: T[K] extends M ? T[K] : never;
};
