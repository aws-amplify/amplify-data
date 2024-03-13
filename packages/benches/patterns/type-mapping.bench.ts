import { bench } from '@arktype/attest';

type OuterType = {
  p0: InnerType;
  p1: InnerType;
  p2: InnerType;
  p3: InnerType;
  p4: InnerType;
  p5: InnerType;
  p6: InnerType;
  p7: InnerType;
  p8: InnerType;
  p9: InnerType;
};

type InnerType = {
  ip0: string;
  ip1: number;
  ip2: string;
  ip3: number;
  ip4: string;
  ip5: number;
  ip6: string;
  ip7: number;
  ip8: string;
  ip9: number;
};

bench('pass-through map', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: T[K];
  };

  type _T = PatternUnderTest<OuterType>;
}).types([3, 'instantiations']);

bench('deep pass-through remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: {
      [IK in keyof T[K]]: T[K][IK];
    };
  };

  type _T = PatternUnderTest<OuterType>;
}).types([3, 'instantiations']);

bench('simple, shallow remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: boolean;
  };

  type _T = PatternUnderTest<OuterType>;
}).types([3, 'instantiations']);

bench('simple, deep remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: {
      [IK in keyof T[K]]: boolean;
    };
  };

  type _T = PatternUnderTest<OuterType>;
}).types([3, 'instantiations']);

bench('conditional, deep remapping of all types', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: {
      [IK in keyof T[K]]: T[K][IK] extends string ? T[K][IK] : boolean;
    };
  };

  type _T = PatternUnderTest<OuterType>;
})
  .median([0.11, 'ns'])
  .types([3, 'instantiations']);

bench(
  'conditional recursive pass through mapping, conditional at leaf - baseline',
  () => {
    type _PatternUnderTest<T> = {
      [K in keyof T]: T[K] extends Record<string, any>
        ? _PatternUnderTest<T[K]>
        : T[K];
    };
  },
)
  .median([7.48, 'ns'])
  .types([8, 'instantiations']);

bench('conditional recursive pass through mapping, conditional at leaf', () => {
  type PatternUnderTest<T> = {
    [K in keyof T]: T[K] extends Record<string, any>
      ? PatternUnderTest<T[K]>
      : T[K];
  };

  type _T = PatternUnderTest<OuterType>;
})
  .median([7.49, 'ns'])
  .types([11, 'instantiations']);

bench(
  'conditional recursive pass through mapping, conditional at leaf - caching behavior',
  () => {
    type PatternUnderTest<T> = {
      [K in keyof T]: T[K] extends Record<string, any>
        ? PatternUnderTest<T[K]>
        : T[K];
    };

    type _T0 = PatternUnderTest<OuterType>;
    type _T1 = PatternUnderTest<OuterType>;
    type _T2 = PatternUnderTest<OuterType>;
    type _T3 = PatternUnderTest<OuterType>;
    type _T4 = PatternUnderTest<OuterType>;
  },
)
  .median([7.49, 'ns'])
  .types([23, 'instantiations']);

bench(
  'conditional recursive pass through mapping, conditional at top - baseline',
  () => {
    type _PatternUnderTest<T> = T extends Record<string, any>
      ? {
          [K in keyof T]: _PatternUnderTest<T[K]>;
        }
      : T;
  },
)
  .median([7.48, 'ns'])
  .types([8, 'instantiations']);

bench('conditional recursive pass through mapping, conditional at top', () => {
  type PatternUnderTest<T> = T extends Record<string, any>
    ? {
        [K in keyof T]: PatternUnderTest<T[K]>;
      }
    : T;

  type _T = PatternUnderTest<OuterType>;
})
  .median([7.47, 'ns'])
  .types([14, 'instantiations']);

bench(
  'conditional recursive pass through mapping, conditional at top - caching behavior',
  () => {
    type PatternUnderTest<T> = T extends Record<string, any>
      ? {
          [K in keyof T]: PatternUnderTest<T[K]>;
        }
      : T;

    type _T0 = PatternUnderTest<OuterType>;
    type _T1 = PatternUnderTest<OuterType>;
    type _T2 = PatternUnderTest<OuterType>;
    type _T3 = PatternUnderTest<OuterType>;
    type _T4 = PatternUnderTest<OuterType>;
  },
)
  .median([7.48, 'ns'])
  .types([26, 'instantiations']);

bench(
  'conditional recursive pass through mapping, split and merge - baseline',
  () => {
    type _PatternUnderTest<T> = {
      [K in keyof T as T[K] extends Record<string, any>
        ? K
        : never]: _PatternUnderTest<T[K]>;
    } & {
      [K in keyof T as T[K] extends Record<string, any> ? never : K]: T[K];
    };
  },
)
  .median([7.47, 'ns'])
  .types([10, 'instantiations']);

bench('conditional recursive pass through mapping, split and merge', () => {
  type PatternUnderTest<T> = {
    [K in keyof T as T[K] extends Record<string, any>
      ? K
      : never]: PatternUnderTest<T[K]>;
  } & {
    [K in keyof T as T[K] extends Record<string, any> ? never : K]: T[K];
  };

  type _T = PatternUnderTest<OuterType>;
})
  .median([7.47, 'ns'])
  .types([15, 'instantiations']);

bench(
  'conditional recursive pass through mapping, split and merge - caching behavior',
  () => {
    type PatternUnderTest<T> = {
      [K in keyof T as T[K] extends Record<string, any>
        ? K
        : never]: PatternUnderTest<T[K]>;
    } & {
      [K in keyof T as T[K] extends Record<string, any> ? never : K]: T[K];
    };

    type _T0 = PatternUnderTest<OuterType>;
    type _T1 = PatternUnderTest<OuterType>;
    type _T2 = PatternUnderTest<OuterType>;
    type _T3 = PatternUnderTest<OuterType>;
    type _T4 = PatternUnderTest<OuterType>;
  },
)
  .median([7.48, 'ns'])
  .types([27, 'instantiations']);
