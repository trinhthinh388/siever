import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DNDState = {
  draggingElement: HTMLElement | null;
};

const initialState: DNDState = {
  draggingElement: null,
};

export const dndSlice = createSlice({
  name: 'dnd',
  initialState,
  reducerPath: '_siever/managers/dnd',
  selectors: {
    getDraggingElement: (state) => state.draggingElement,
  },
  reducers: {
    setDraggingElement: (state, action: PayloadAction<DNDState['draggingElement']>) => {
      return { ...state, draggingElement: action.payload };
    },
  },
});
