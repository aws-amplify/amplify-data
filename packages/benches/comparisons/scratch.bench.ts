import { bench } from '@arktype/attest';
import { UnionToIntersection } from '@aws-amplify/data-schema-types';

/**
 * Looking at extracting records from a union versus UnionToIntersection.
 */

type Lookups = [
  { a: { inner_a: 'value a' } },
  { b: { inner_b: 'value b' } },
  { c: { inner_c: 'value c' } },
  { d: { inner_d: 'value d' } },
  { e: { inner_e: 'value e' } },
  { f: { inner_f: 'value f' } },
  { g: { inner_g: 'value g' } },
  { h: { inner_h: 'value h' } },
  { i: { inner_i: 'value i' } },
  { j: { inner_j: 'value j' } },
];

type Base = {
  a: { baseA: 'baseValueA' };
  b: { baseB: 'baseValueB' };
  c: { baseC: 'baseValueC' };
  d: { baseD: 'baseValueD' };
  e: { baseE: 'baseValueE' };

  f: { baseF: 'baseValueF' };
  g: { baseG: 'baseValueG' };
  h: { baseH: 'baseValueH' };
  i: { baseI: 'baseValueI' };
  j: { baseJ: 'baseValueJ' };

  k: { baseK: 'baseValueK' };
  l: { baseL: 'baseValueL' };
  m: { baseM: 'baseValueM' };
  n: { baseN: 'baseValueN' };
  o: { baseO: 'baseValueO' };

  p: { baseP: 'baseValueP' };
  q: { baseQ: 'baseValueQ' };
  r: { baseR: 'baseValueR' };
  s: { baseS: 'baseValueS' };
  t: { baseT: 'baseValueT' };
};

type RemapArray<T extends ReadonlyArray<any>> = {
  [K in keyof T as T[K] extends Record<
    infer NewK extends string,
    Record<string, string>
  >
    ? NewK
    : never]: DigoutArrayElementType<T[K]>;
};

type DigoutArrayElementType<T> =
  T extends Record<string, infer innerT> ? innerT : never;

bench('large string union as Record key', async () => {
  //             0     1     2     3     4     5     6     7     8     9
  type DIGITS = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j';

  type Identifier = `${DIGITS}${DIGITS}${DIGITS}${DIGITS}`;

  type _T = Record<Identifier, string>;
}).types([4, 'instantiations']);

bench('large string union discrimination', async () => {
  //             0     1     2     3     4     5     6     7     8     9
  type DIGITS = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j';

  type Identifier = `${DIGITS}${DIGITS}${DIGITS}${DIGITS}`;

  type _T = Extract<Identifier, `aaa${string}`>;
}).types([20031, 'instantiations']);

bench('super basic sanity check - simple object prop @ 1', async () => {
  type _test = Base['a'];
}).types([0, 'instantiations']);

bench('super basic sanity check - simple object prop @ 2', async () => {
  type _test = Base['a'];
  type _test2 = Base['b'];
}).types([0, 'instantiations']);

bench('super basic sanity check - simple object prop @ 4', async () => {
  type _test = Base['a'];
  type _test2 = Base['b'];
  type _test3 = Base['c'];
  type _test4 = Base['d'];
}).types([0, 'instantiations']);

bench('basic case - tuple -> union extract', async () => {
  type _test = Extract<Lookups[number], { f: any }>['f'];
}).types([52, 'instantiations']);

bench('basic case - tuple -> UnionToIntersection', async () => {
  type LUT = UnionToIntersection<Lookups[number]>;
  type _test = LUT['f'];
}).types([161, 'instantiations']);

bench('basic case - Tuple remapped to intersection', async () => {
  type LUT = RemapArray<Lookups>;
  type _test = LUT['f'];
  // 2021 with 2
}).types([1990, 'instantiations']);

// #region union extraction scaling
bench('as augmentation - union extract @ 1', async () => {
  type Augmented = {
    [K in keyof Base]: Base[K] &
      (Extract<Lookups[number], Record<K, any>> extends never
        ? unknown
        : Extract<Lookups[number], Record<K, any>>[K]);
  };

  type _Test = {
    a: Augmented['a'];
  };
}).types([283, 'instantiations']);

bench('as augmentation - union extract @ 2', async () => {
  type Augmented = {
    [K in keyof Base]: Base[K] &
      (Extract<Lookups[number], Record<K, any>> extends never
        ? unknown
        : Extract<Lookups[number], Record<K, any>>[K]);
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
  };
}).types([417, 'instantiations']);

bench('as augmentation - union extract @ 4', async () => {
  type Augmented = {
    [K in keyof Base]: Base[K] &
      (Extract<Lookups[number], Record<K, any>> extends never
        ? unknown
        : Extract<Lookups[number], Record<K, any>>[K]);
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
    c: Augmented['c'];
    d: Augmented['d'];
  };
}).types([685, 'instantiations']);

//#endregion union extraction scaling

//#region union extraction with util scaling

bench('as augmentation - union extract - util @ 1', async () => {
  type Merged<
    Base,
    Augmentation extends ReadonlyArray<Record<string, any>>,
    K extends keyof Base,
  > = Base[K] &
    (Extract<Augmentation[number], Record<K, any>> extends never
      ? unknown
      : Extract<Augmentation[number], Record<K, any>>[K]);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
  };
}).types([254, 'instantiations']);

bench('as augmentation - union extract - util @ 2', async () => {
  type Merged<
    Base,
    Augmentation extends ReadonlyArray<Record<string, any>>,
    K extends keyof Base,
  > = Base[K] &
    (Extract<Augmentation[number], Record<K, any>> extends never
      ? unknown
      : Extract<Augmentation[number], Record<K, any>>[K]);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
  };
}).types([301, 'instantiations']);

bench('as augmentation - union extract - util @ 4', async () => {
  type Merged<
    Base,
    Augmentation extends ReadonlyArray<Record<string, any>>,
    K extends keyof Base,
  > = Base[K] &
    (Extract<Augmentation[number], Record<K, any>> extends never
      ? unknown
      : Extract<Augmentation[number], Record<K, any>>[K]);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
    c: Augmented['c'];
    d: Augmented['d'];
  };
}).types([395, 'instantiations']);

//#endregion union extraction with util scaling

//#endregion union intersection scaling

bench('as augmentation - UnionToIntersection @ 1', async () => {
  type Augmented = {
    [K in keyof Base]: Base[K] &
      (K extends keyof UnionToIntersection<Lookups[number]>
        ? UnionToIntersection<Lookups[number]>[K]
        : unknown);
  };

  type _Test = {
    a: Augmented['a'];
  };
}).types([180, 'instantiations']);

bench('as augmentation - UnionToIntersection @ 2', async () => {
  type Augmented = {
    [K in keyof Base]: Base[K] &
      (K extends keyof UnionToIntersection<Lookups[number]>
        ? UnionToIntersection<Lookups[number]>[K]
        : unknown);
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
  };
}).types([199, 'instantiations']);

bench('as augmentation - UnionToIntersection @ 4', async () => {
  type Augmented = {
    [K in keyof Base]: Base[K] &
      (K extends keyof UnionToIntersection<Lookups[number]>
        ? UnionToIntersection<Lookups[number]>[K]
        : unknown);
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
    c: Augmented['c'];
    d: Augmented['d'];
  };
}).types([237, 'instantiations']);

//#endregion union intersection scaling

//#region union intersection util scaling

bench('as augmentation - UnionToIntersection - util @ 1', async () => {
  type Merged<
    Base,
    Augmentation extends ReadonlyArray<Record<string, any>>,
    K extends keyof Base,
  > = Base[K] &
    (K extends keyof UnionToIntersection<Augmentation[number]>
      ? UnionToIntersection<Augmentation[number]>[K]
      : unknown);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
  };
}).types([250, 'instantiations']);

bench('as augmentation - UnionToIntersection - util @ 2', async () => {
  type Merged<
    Base,
    Augmentation extends ReadonlyArray<Record<string, any>>,
    K extends keyof Base,
  > = Base[K] &
    (K extends keyof UnionToIntersection<Augmentation[number]>
      ? UnionToIntersection<Augmentation[number]>[K]
      : unknown);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
  };
}).types([271, 'instantiations']);

bench('as augmentation - UnionToIntersection - util @ 4', async () => {
  type Merged<
    Base,
    Augmentation extends ReadonlyArray<Record<string, any>>,
    K extends keyof Base,
  > = Base[K] &
    (K extends keyof UnionToIntersection<Augmentation[number]>
      ? UnionToIntersection<Augmentation[number]>[K]
      : unknown);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
    c: Augmented['c'];
    d: Augmented['d'];
  };
}).types([313, 'instantiations']);

//#region union intersection util scaling

//#region union intersection util alt scaling

bench('as augmentation - UnionToIntersection - util @ 1', async () => {
  type Merged<Base, Augmentation, K extends keyof Base> = Base[K] &
    (Augmentation extends ReadonlyArray<Record<string, any>>
      ? K extends keyof UnionToIntersection<Augmentation[number]>
        ? UnionToIntersection<Augmentation[number]>[K]
        : unknown
      : unknown);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
  };
}).types([267, 'instantiations']);

bench('as augmentation - UnionToIntersection - util @ 2', async () => {
  type Merged<Base, Augmentation, K extends keyof Base> = Base[K] &
    (Augmentation extends ReadonlyArray<Record<string, any>>
      ? K extends keyof UnionToIntersection<Augmentation[number]>
        ? UnionToIntersection<Augmentation[number]>[K]
        : unknown
      : unknown);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
  };
}).types([294, 'instantiations']);

bench('as augmentation - UnionToIntersection - util @ 4', async () => {
  type Merged<Base, Augmentation, K extends keyof Base> = Base[K] &
    (Augmentation extends ReadonlyArray<Record<string, any>>
      ? K extends keyof UnionToIntersection<Augmentation[number]>
        ? UnionToIntersection<Augmentation[number]>[K]
        : unknown
      : unknown);

  type Augmented = {
    [K in keyof Base]: Merged<Base, Lookups, K>;
  };

  type _Test = {
    a: Augmented['a'];
    b: Augmented['b'];
    c: Augmented['c'];
    d: Augmented['d'];
  };
}).types([348, 'instantiations']);

//#region union intersection util alt scaling
