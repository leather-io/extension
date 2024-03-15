export type ValueOf<T> = T[keyof T];

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);

export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];
