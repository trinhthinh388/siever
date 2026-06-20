import { useContext } from 'react';
import { GridContext, type GridContextValue } from '../providers';

/**
 * Returns the raw `GridContext` value.
 * Throws if called outside of a `GridProvider`.
 */
export const useGridContext = (): GridContextValue => {
  const ctx = useContext(GridContext);
  if (!ctx) {
    throw new Error('useGridContext must be used within a <GridProvider>.');
  }
  return ctx;
};
