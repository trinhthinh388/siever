import type { AppDispatch, RootState } from '@core';
import { useDispatch, useSelector } from 'react-redux';
import { useSieverContext } from '../providers/siever-context';

/**
 * Returns the Siever store instance and typed Redux hooks,
 * all pre-bound to the nearest `SieverProvider`.
 *
 * Must be called inside a component wrapped with `SieverProvider`
 * (or `withSieverProvider`).
 *
 * @example
 * const { store, dispatch, useAppSelector } = useSieverProvider();
 * const cellDimension = useAppSelector((state) => state['_siever/grid'].dimension.cell);
 */
export const useSieverProvider = () => {
  const ctx = useSieverContext();
  const dispatch = useDispatch<AppDispatch>();

  const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected): TSelected =>
    useSelector<RootState, TSelected>(selector);

  return { ...ctx, dispatch, useAppSelector } as const;
};
