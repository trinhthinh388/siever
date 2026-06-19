type PlainObject = Record<string, unknown>;
type DeepPartial<T> = T extends PlainObject
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

/**
 * Deep merges two or more objects into a new object.
 * - Plain objects are merged recursively.
 * - Arrays and primitives from later sources overwrite earlier values.
 * - The original objects are never mutated.
 */
export const merge = <T extends PlainObject>(one: T, another: DeepPartial<T>): T => {
  const result: PlainObject = { ...one };

  for (const key of Object.keys(another)) {
    const targetVal = result[key];
    const sourceVal = another[key as keyof typeof another];

    if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
      result[key] = merge(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }

  return result as T;
};
