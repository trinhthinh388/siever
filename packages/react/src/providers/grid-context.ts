import type { Grid } from '@core';
import { createContext } from 'react';

export type GridContextValue = {
  grid: Grid;
};

export const GridContext = createContext<GridContextValue | null>(null);
