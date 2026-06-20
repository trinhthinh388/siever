import type { ItemConfiguration } from '../item';

export const calculateItemDimension = (
  cellSize: number,
  { x, y, width, height }: ItemConfiguration,
) => ({
  x: cellSize * x,
  y: cellSize * y,
  width: cellSize * width,
  height: cellSize * height,
});
