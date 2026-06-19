import { configureStore } from '@reduxjs/toolkit';
import { gridSlice, type GridState } from '../grid/slices/grid.slice';

export const createStore = () =>
  configureStore({
    reducer: {
      [gridSlice.reducerPath]: gridSlice.reducer,
    },
  });

export { GridState };
