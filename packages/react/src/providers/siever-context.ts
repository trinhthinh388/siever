import type { Store } from '@core';
import { createContext, useContext } from 'react';

export type SieverContextValue = {
  store: Store;
};

export const SieverContext = createContext<SieverContextValue | null>(null);

/**
 * Returns the raw `SieverContext` value.
 * Throws if called outside of a `SieverProvider`.
 */
export const useSieverContext = (): SieverContextValue => {
  const ctx = useContext(SieverContext);
  if (!ctx) {
    throw new Error('useSieverContext must be used within a <SieverProvider>.');
  }
  return ctx;
};
