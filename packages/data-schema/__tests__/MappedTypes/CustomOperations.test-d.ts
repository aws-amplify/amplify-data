import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { a } from '../../index';
import { RefType } from '../../src/RefType';
import {
  Bag,
  CustomOpReturnType,
  ResolveRef,
  CustomOpShapes,
  CustomOpArguments,
} from '../../src/MappedTypes/CustomOperations';
import { CustomOperation } from '../../src/CustomOperation';

type Deref<T> = T extends RefType<infer S> ? S : never;
type OpShape<T> = T extends CustomOperation<infer S, any> ? S : never;

describe('Custom Operations mapper utils', () => {
  type Schema = {
    A: 'whatever a';
  };
  type NonModelTypes = {
    customTypes: {
      B: 'whatever b';
    };
    enums: {
      C: 'whatever c';
    };
  };

  type SimpleBag = Bag<Schema, NonModelTypes>;

  test('can create a type bag from a schema and non-model types', () => {
    type Expected = Schema & {
      B: 'whatever b';
    } & {
      C: 'whatever c';
    };

    type T = Expect<Equal<SimpleBag, Expected>>;
  });

  test('can resolve model refs shape from a bag', () => {
    const ref = a.ref('A');
    type Actual = ResolveRef<Deref<typeof ref>, SimpleBag>;
    type T = Expect<Equal<Actual, 'whatever a' | null>>;
  });

  test('can resolve custom type refs shape from a bag', () => {
    const ref = a.ref('B');
    type Actual = ResolveRef<Deref<typeof ref>, SimpleBag>;
    type T = Expect<Equal<Actual, 'whatever b' | null>>;
  });

  test('can resolve enum refs shape from a bag', () => {
    const ref = a.ref('C');
    type Actual = ResolveRef<Deref<typeof ref>, SimpleBag>;
    type T = Expect<Equal<Actual, 'whatever c' | null>>;
  });

  test('can resolve scalar return type', () => {
    const op = a
      .query()
      .arguments({
        inputParam: a.string(),
      })
      .returns(a.string());

    type Actual = CustomOpReturnType<OpShape<typeof op>, {}>;
    type T = Expect<Equal<Actual, string | null>>;
  });

  test('can resolve a ref from a bag', () => {
    const op = a
      .query()
      .arguments({
        inputParam: a.string(),
      })
      .returns(a.ref('a'));

    type Actual = CustomOpReturnType<OpShape<typeof op>, { a: 'sentinel' }>;
    type T = Expect<Equal<Actual, 'sentinel' | null>>;
  });

  test('can resolve arguments from custom op', () => {
    const aMutation = a
      .mutation()
      .arguments({ x: a.string() })
      .returns(a.string())
      .authorization([a.allow.public()])
      .function('asdf');

    type Actual = CustomOpArguments<OpShape<typeof aMutation>>;
    type Expected = {
      x: string | null;
    };

    type T = Expect<Equal<Actual, Expected>>;
  });

  test('can select custom op shapes from a schema', () => {
    const aQuery = a
      .query()
      .arguments({ x: a.string() })
      .returns(a.string())
      .authorization([a.allow.public()])
      .function('asdf');

    const aMutation = a
      .mutation()
      .arguments({ x: a.string() })
      .returns(a.string())
      .authorization([a.allow.public()])
      .function('asdf');

    const schema = a.schema({
      Model: a.model({
        id: a.id(),
      }),
      Enum: a.enum(['a', 'b', 'c']),
      CustomType: a.customType({
        field: a.string(),
      }),
      aQuery,
      aMutation,
    });

    type Actual = CustomOpShapes<typeof schema>;
    type Expected = {
      aQuery: OpShape<typeof aQuery>;
      aMutation: OpShape<typeof aMutation>;
    };

    type T = Expect<Equal<Actual, Expected>>;
  });
});
