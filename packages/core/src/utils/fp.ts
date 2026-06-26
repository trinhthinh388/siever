/**
 * Creates a function that invokes each provided iteratee with the
 * arguments it receives, returning an array of results.
 *
 * Equivalent to `_.over` from lodash/fp.
 *
 * @example
 * const func = over([Math.max, Math.min]);
 * func(1, 2, 3, 4); // [4, 1]
 */

export const over =
  <T extends (...args: any[]) => any>(fns: T[]) =>
  (...args: Parameters<T>): ReturnType<T>[] =>
    fns.map((fn) => fn(...args));
