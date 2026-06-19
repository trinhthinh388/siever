import { configureStore } from '@reduxjs/toolkit';
import { gridSlice, type GridState } from '../grid/slices/grid.slice';

export const createStore = () => {
  const store = configureStore({
    reducer: {
      [gridSlice.reducerPath]: gridSlice.reducer,
    },
  });

  return store;
};

export { GridState };
