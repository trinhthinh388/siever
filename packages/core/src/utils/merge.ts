type PlainObject = Record<string, unknown>;

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
export const merge = <T extends PlainObject>(...sources: Partial<T>[]): T => {
  const result: PlainObject = {};

  for (const source of sources) {
    if (!isPlainObject(source)) continue;

    for (const key of Object.keys(source)) {
      const targetVal = result[key];
      const sourceVal = source[key as keyof typeof source];

      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        result[key] = merge(targetVal, sourceVal);
      } else {
        result[key] = sourceVal;
      }
    }
  }

  return result as T;
};
