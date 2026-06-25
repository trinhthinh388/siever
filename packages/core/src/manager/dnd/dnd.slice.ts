import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SerializedItem } from '../../item';

export type DNDState = {
  draggingItem?: SerializedItem;
};

const initialState: DNDState = {};

export const dndSlice = createSlice({
  name: 'dnd',
  initialState,
  reducerPath: '_siever/managers/dnd',
  selectors: {
    getDraggingItem: (state) => state.draggingItem,
  },
  reducers: {
    setDraggingItem: (state, action: PayloadAction<DNDState['draggingItem']>) => {
      return { ...state, draggingItem: action.payload };
    },
  },
});
