import { configureStore } from '@reduxjs/toolkit';
import { gridSlice, type GridState } from '../grid/slices/grid.slice';
import { dndSlice } from '../manager/dnd';

export const createStore = () => {
  const store = configureStore({
    middleware: (gdm) =>
      gdm({
        serializableCheck: false,
      }),
    reducer: {
      [dndSlice.reducerPath]: dndSlice.reducer,
      [gridSlice.reducerPath]: gridSlice.reducer,
    },
  });

  return store;
};

export { GridState };
