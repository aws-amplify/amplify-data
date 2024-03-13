import { bench } from '@arktype/attest';

type SelfRecursiveType = {
  p0: SelfRecursiveType;
  p1: SelfRecursiveType;
  p2: SelfRecursiveType;
  p3: SelfRecursiveType;
  p4: SelfRecursiveType;
  p5: SelfRecursiveType;
  p6: SelfRecursiveType;
  p7: SelfRecursiveType;
  p8: SelfRecursiveType;
  p9: SelfRecursiveType;
};

bench('pass-through map', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: T[K];
  };

  type _T = PatternUnderTest<SelfRecursiveType>;
}).types([3, 'instantiations']);

bench('deep pass-through remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: {
      [IK in keyof T[K]]: T[K][IK];
    };
  };

  type _T = PatternUnderTest<SelfRecursiveType>;
}).types([3, 'instantiations']);

bench('simple, shallow remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: boolean;
  };

  type _T = PatternUnderTest<SelfRecursiveType>;
}).types([3, 'instantiations']);

bench('simple, deep remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: {
      [IK in keyof T[K]]: boolean;
    };
  };

  type _T = PatternUnderTest<SelfRecursiveType>;
}).types([3, 'instantiations']);

bench('conditional, deep remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: {
      [IK in keyof T[K]]: T[K][IK] extends string ? T[K][IK] : boolean;
    };
  };

  type _T = PatternUnderTest<SelfRecursiveType>;
})
  .median([0.11, 'ns'])
  .types([3, 'instantiations']);

bench('conditional recursive pass through mapping, conditional at leaf', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: T[K] extends Record<string, any>
      ? PatternUnderTest<T[K]>
      : T[K];
  };

  type _T = PatternUnderTest<SelfRecursiveType>;
})
  .median([7.5, 'ns'])
  .types([11, 'instantiations']);

bench('conditional recursive pass through mapping, conditional at top', () => {
  type PatternUnderTest<T> = T extends Record<string, any>
    ? {
        [K in keyof T]: PatternUnderTest<T[K]>;
      }
    : T;

  type _T = PatternUnderTest<SelfRecursiveType>;
})
  .median([7.5, 'ns'])
  .types([14, 'instantiations']);

bench('conditional recursive pass through mapping, split and merge', () => {
  type PatternUnderTest<T> = {
    [K in keyof T as T[K] extends Record<string, any>
      ? K
      : never]: PatternUnderTest<T[K]>;
  } & {
    [K in keyof T as T[K] extends Record<string, any> ? never : K]: T[K];
  };

  type _T = PatternUnderTest<SelfRecursiveType>;
})
  .median([7.48, 'ns'])
  .types([15, 'instantiations']);
