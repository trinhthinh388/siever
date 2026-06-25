import type { Dimension } from '@core';
import { useAppSelector } from './use-grid-state';

export const useItemDimension = (id: string): Dimension | undefined => {
  const dimension = useAppSelector((state) => state['_siever/grid'].items[id]?.dimension);

  return dimension;
};
