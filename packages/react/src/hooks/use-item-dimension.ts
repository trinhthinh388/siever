import type { SerializedItem } from '@core';
import { useAppSelector } from './use-grid-state';

export const useItem = (id: string): SerializedItem | undefined => {
  const item = useAppSelector((state) => state['_siever/grid'].items[id]);

  return item;
};
