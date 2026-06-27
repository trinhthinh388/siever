export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  /** Cancel the pending invocation */
  cancel: () => void;
  /** Immediately invoke the pending call (if any) and cancel the timer */
  flush: (...args: Parameters<T>) => ReturnType<T> | undefined;
}

/**
 * Creates a debounced version of the given function that delays invoking it
 * until after `wait` milliseconds have elapsed since the last call.
 *
 * @param fn - The function to debounce.
 * @param wait - The number of milliseconds to delay (default: 0).
 * @param options.leading - If `true`, invoke on the leading edge of the timeout (default: false).
 * @param options.trailing - If `true`, invoke on the trailing edge of the timeout (default: true).
 * @returns A debounced function with `cancel` and `flush` methods.
 *
 * @example
 * const onResize = debounce(() => recalcLayout(), 200);
 * window.addEventListener('resize', onResize);
 *
 * // Cancel a pending invocation
 * onResize.cancel();
 *
 * // Force immediate invocation of any pending call
 * onResize.flush();
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  wait = 0,
  options: { leading?: boolean; trailing?: boolean } = {},
): DebouncedFunction<T> => {
  const { leading = false, trailing = true } = options;

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastResult: ReturnType<T> | undefined;
  let lastCallTime: number | undefined;

  const invokeFunc = (args: Parameters<T>): ReturnType<T> => {
    lastArgs = undefined;
    lastResult = fn(...args) as ReturnType<T>;
    return lastResult as ReturnType<T>;
  };

  const startTimer = (pendingArgs: Parameters<T>): void => {
    timerId = setTimeout(() => {
      timerId = undefined;
      const shouldCallTrailing = trailing && lastArgs !== undefined;
      if (shouldCallTrailing) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        invokeFunc(lastArgs!);
      }
      lastCallTime = undefined;
    }, wait);
    lastArgs = pendingArgs;
  };

  const debounced = ((...args: Parameters<T>): void => {
    const now = Date.now();
    const isFirstCall = lastCallTime === undefined;

    lastCallTime = now;

    if (leading && isFirstCall) {
      invokeFunc(args);
      startTimer(args);
      return;
    }

    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    startTimer(args);
  }) as DebouncedFunction<T>;

  debounced.cancel = (): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    lastArgs = undefined;
    lastCallTime = undefined;
  };

  debounced.flush = (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }

    const pendingArgs = lastArgs ?? args;
    lastArgs = undefined;
    lastCallTime = undefined;

    if (trailing || leading) {
      return invokeFunc(pendingArgs);
    }

    return lastResult;
  };

  return debounced;
};
