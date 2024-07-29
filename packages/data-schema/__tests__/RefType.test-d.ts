import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type _Internal_RefType, ref } from '../src/RefType';

type GetRefTypeParams<T> =
  T extends _Internal_RefType<infer R, any, any> ? R : never;

describe('RefType', () => {
  test('no modifier applied', () => {
    const refField = ref('SomeType');

    type Resolved = GetRefTypeParams<typeof refField>;
    type Expected = {
      type: 'ref';
      link: 'SomeType';
      valueRequired: false;
      array: false;
      arrayRequired: false;
      authorization: [];
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('.required()', () => {
    const refField = ref('SomeType').required();

    type Resolved = GetRefTypeParams<typeof refField>;
    type Expected = {
      type: 'ref';
      link: 'SomeType';
      valueRequired: true;
      array: false;
      arrayRequired: false;
      authorization: [];
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('.array()', () => {
    const refField = ref('SomeType').array();

    type Resolved = GetRefTypeParams<typeof refField>;
    type Expected = {
      type: 'ref';
      link: 'SomeType';
      valueRequired: false;
      array: true;
      arrayRequired: false;
      authorization: [];
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('.required().array()', () => {
    const refField = ref('SomeType').required().array();

    type Resolved = GetRefTypeParams<typeof refField>;
    type Expected = {
      type: 'ref';
      link: 'SomeType';
      valueRequired: true;
      array: true;
      arrayRequired: false;
      authorization: [];
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('.array().required()', () => {
    const refField = ref('SomeType').array().required();

    type Resolved = GetRefTypeParams<typeof refField>;
    type Expected = {
      type: 'ref';
      link: 'SomeType';
      valueRequired: false;
      array: true;
      arrayRequired: true;
      authorization: [];
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });

  test('.required().array().required()', () => {
    const refField = ref('SomeType').required().array().required();

    type Resolved = GetRefTypeParams<typeof refField>;
    type Expected = {
      type: 'ref';
      link: 'SomeType';
      valueRequired: true;
      array: true;
      arrayRequired: true;
      authorization: [];
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });
});
