import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SerializedItem } from '../../item';
import type { DeepPartial, Dimension } from '../../types';
import { calculateItemDimension, merge } from '../../utils';
import { DEFAULT_GRID_GUTTER, DEFAULT_GRID_HEIGHT, DEFAULT_GRID_WIDTH } from '../constants';

export type GridStatus = 'uninitalized' | 'initializing' | 'initialized';

export type GridConfiguration = {
  width: number;
  height: number;
  gutter: number;
};

export type GridState = {
  status: GridStatus;
  configuration: GridConfiguration;
  dimension: {
    cell: Dimension;
    grid: Dimension;
  };
  items: Record<string, SerializedItem & { dimension: Dimension }>;
};

const initialState: GridState = {
  items: {},
  status: 'uninitalized',
  configuration: {
    width: DEFAULT_GRID_WIDTH,
    gutter: DEFAULT_GRID_GUTTER,
    height: DEFAULT_GRID_HEIGHT,
  },
  dimension: {
    cell: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      contentWidth: 0,
      contentHeight: 0,
      paddingBottom: 0,
    },
    grid: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      contentWidth: 0,
      contentHeight: 0,
      paddingBottom: 0,
    },
  },
};

export const gridSlice = createSlice({
  initialState,
  name: 'grid',
  reducerPath: '_siever/grid',
  selectors: {
    grid: (state) => state,
    dimension: (state) => state.dimension,
    configuration: (state) => state.configuration,
    cellDimension: (state) => state.dimension.cell,
    item: (state) => (id: string) => state.items[id],
  },
  reducers: {
    addItem: (state, action: PayloadAction<SerializedItem>) => {
      state.items[action.payload.id] = {
        ...state.items[action.payload.id],
        ...action.payload,
      };
    },
    update: (state, action: PayloadAction<DeepPartial<GridState>>) => {
      const updated = merge(state, action.payload);
      if ('dimension' in action.payload) {
        updated.items = Object.fromEntries(
          Object.entries(updated.items).map(([id, item]) => [
            id,
            {
              ...item,
              dimension: calculateItemDimension(updated, item.configuration),
            },
          ]),
        );
      }
      return updated;
    },
  },
});
