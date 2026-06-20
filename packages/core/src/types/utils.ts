export type PlainObject = Record<string, unknown>;
export type DeepPartial<T> = T extends PlainObject
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
