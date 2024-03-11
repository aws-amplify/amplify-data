import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { a } from '../../index';
import { RefType } from '../../src/RefType';
import {
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
