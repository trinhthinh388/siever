import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { merge } from '../../utils';
import { DEFAULT_GRID_HEIGHT, DEFAULT_GRID_WIDTH } from '../constants';

type Dimension = {
  width: number;
  height: number;
};

type GridConfiguration = {
  width: number;
  height: number;
};

// Define a type for the slice state
export type GridState = {
  configuration: GridConfiguration;
  dimension: {
    grid: Dimension;
    cell: Dimension;
  };
};

// Define the initial state using that type
const initialState: GridState = {
  dimension: { cell: { width: 0, height: 0 }, grid: { width: 0, height: 0 } },
  configuration: {
    width: DEFAULT_GRID_WIDTH,
    height: DEFAULT_GRID_HEIGHT,
  },
};

export const gridSlice = createSlice({
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  name: 'grid',
  reducerPath: '_siever/grid',
  selectors: {
    configuration: (state) => state.configuration,
    cellDimension: (state) => state.dimension.cell,
  },
  reducers: {
    update: (state, action: PayloadAction<Partial<GridState>>) => merge(state, action.payload),
    updateGridDimension: (state, action: PayloadAction<Partial<Dimension>>) =>
      merge(state, { dimension: { grid: action.payload } }),
    updateConfiguration: (state, action: PayloadAction<Partial<GridConfiguration>>) =>
      merge(state, { configuration: action.payload }),
  },
});
