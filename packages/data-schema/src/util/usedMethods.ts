export type methodKeyOf<o> = {
  [k in keyof o]-?: o[k] extends (...args: never) => unknown ? k : never;
}[keyof o];

export type satisfy<base, t extends base> = t;
