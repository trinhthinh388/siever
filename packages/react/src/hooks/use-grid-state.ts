import type { RootState } from '@core';
import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import { useSieverProvider } from './use-siever-provider';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGridState = () => {
  const { useAppSelector } = useSieverProvider();

  return useAppSelector((state) => state['_siever/grid']);
};
