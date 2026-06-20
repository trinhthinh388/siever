import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ItemConfiguration } from '../../item';
import type { DeepPartial, Dimension } from '../../types';
import { calculateItemDimension, merge } from '../../utils';
import { DEFAULT_GRID_HEIGHT, DEFAULT_GRID_WIDTH } from '../constants';

type GridConfiguration = {
  width: number;
  height: number;
};

export type GridState = {
  configuration: GridConfiguration;
  dimension: {
    grid: Dimension;
    cell: Dimension;
  };
  items: Record<
    string,
    {
      dimension: Dimension;
      configuration: ItemConfiguration;
    }
  >;
};

const initialState: GridState = {
  items: {},
  configuration: {
    width: DEFAULT_GRID_WIDTH,
    height: DEFAULT_GRID_HEIGHT,
  },
  dimension: {
    cell: { x: 0, y: 0, width: 0, height: 0 },
    grid: { x: 0, y: 0, width: 0, height: 0 },
  },
};

export const gridSlice = createSlice({
  initialState,
  name: 'grid',
  reducerPath: '_siever/grid',
  selectors: {
    dimension: (state) => state.dimension,
    configuration: (state) => state.configuration,
    cellDimension: (state) => state.dimension.cell,
  },
  reducers: {
    addItem: (state, action: PayloadAction<{ id: string; configuration: ItemConfiguration }>) => {
      state.items[action.payload.id] = {
        configuration: action.payload.configuration,
        dimension: calculateItemDimension(state.dimension.cell.width, action.payload.configuration),
      };
    },
    update: (state, action: PayloadAction<DeepPartial<GridState>>) => {
      const updated = merge(state, action.payload);
      updated.items = Object.fromEntries(
        Object.entries(updated.items).map(([id, item]) => [
          id,
          {
            configuration: item.configuration,
            dimension: calculateItemDimension(updated.dimension.cell.width, item.configuration),
          },
        ]),
      );
      return updated;
    },
  },
});
