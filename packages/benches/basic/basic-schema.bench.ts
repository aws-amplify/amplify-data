import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';

bench('basic schema', () => {
  a.schema({
    Post: a.model({
      title: a.string().required(),
    }),
  });
}).types([4371, 'instantiations']);

bench('basic schema w client types', () => {
  const s = a.schema({
    Post: a.model({
      title: a.string().required(),
      description: a.string(),
      viewCount: a.integer(),
    }),
  });

  type _ = ClientSchema<typeof s>;
}).types([43233, 'instantiations']);

bench('test', () => {
  type RenameModel<
    OldName extends string,
    NewName extends string,
    Types extends Record<string, (args: any) => unknown>,
  > = {
    [Type in keyof Types as Type extends OldName ? NewName : Type]: Types[Type];
  };

  type RenameModelArr<
    OldNames extends readonly string[],
    NewNames extends readonly string[],
    Types extends Record<string, (args: any) => unknown>,
  > = OldNames extends readonly [
    infer CurOldName extends string,
    ...infer RestOldNames extends readonly string[],
  ]
    ? NewNames extends readonly [
        infer CurNewName extends string,
        ...infer RestNewNames extends readonly string[],
      ]
      ? RenameModelArr<
          RestOldNames,
          RestNewNames,
          RenameModel<CurOldName, CurNewName, Types>
        >
      : Types
    : Types;

  const initial = {
    a: (first: string) => {
      return first + ' yes';
    },
    b: (second: number) => {
      return second * 2;
    },
    c: (second: number) => {
      return second * 2;
    },
    d: (second: number) => {
      return second * 2;
    },
    e: (second: number) => {
      return second * 2;
    },
    f: (second: number) => {
      return second * 2;
    },
    g: (second: number) => {
      return second * 2;
    },
    h: (second: number) => {
      return second * 2;
    },
  };

  function rename<
    const OldNames extends readonly string[],
    const NewNames extends readonly string[],
    T extends Record<string, (args: any) => unknown>,
  >(
    oldNames: OldNames,
    newNames: NewNames,
    initial: T,
  ): RenameModelArr<OldNames, NewNames, T> {
    const res: Record<string, (args: any) => unknown> = {};

    for (let i = 0; i < oldNames.length; i++) {
      const oldName = oldNames[i];
      const newName = newNames[i];

      res[newName] = initial[oldName];
    }

    return res as RenameModelArr<OldNames, NewNames, T>;
  }

  // [ ['a', 'x'], ['b', 'z'] ]
  const r = rename(['a', 'b'], ['x', 'z'], initial);

  type _Res3 = typeof r;
}).types([380, 'instantiations']);

bench('test2', () => {
  const initial = {
    a: 'a',
    b: 'b',
    c: 'c',
    d: 'd',
    e: 'e',
    f: 'f',
    g: 'g',
    h: 'h',
    i: 'i',
    j: 'j',
    k: 'k',
    l: 'l',
    m: 'm',
    n: 'n',
    o: 'o',
    p: 'p',
    q: 'q',
    r: 'r',
    s: 's',
    t: 't',
    u: 'u',
    v: 'v',
  };

  type RenameModel<
    OldName extends string,
    NewName extends string,
    Types extends Record<string, string>,
  > = {
    [Type in keyof Types as Type extends OldName ? NewName : Type]: Types[Type];
  };

  type RenameModelArr2<
    ChangeLog extends readonly [string, string][],
    Types extends Record<string, string>,
  > = ChangeLog extends readonly [
    infer CurPair extends [string, string],
    ...infer Rest extends readonly [string, string][],
  ]
    ? RenameModelArr2<Rest, RenameModel<CurPair[0], CurPair[1], Types>>
    : Types;

  function rename2<
    const ChangeLog extends readonly [string, string][],
    T extends Record<string, string>,
  >(changeLog: ChangeLog, initial: T): RenameModelArr2<ChangeLog, T> {
    const res: Record<string, string> = initial;

    changeLog.forEach(([oldName, newName]) => {
      const swap = res[oldName];
      res[newName] = swap;
      delete res[oldName];
    });

    return res as RenameModelArr2<ChangeLog, T>;
  }

  console.log(initial);

  const r2 = rename2(
    [
      ['a', 'x'],
      ['b', 'z'],
    ],
    initial,
  );

  console.log(r2);

  type _Res4 = typeof r2;
}).types([366, 'instantiations']);
