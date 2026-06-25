import type { GridState } from '../grid/slices/grid.slice';
import type { ItemConfiguration } from '../item';

export const calculateItemDimension = (
  {
    configuration: { gutter },
    dimension: {
      cell: { width: cellSize },
      grid: { paddingTop, paddingLeft },
    },
  }: GridState,
  { x, y, width, height }: ItemConfiguration,
) => {
  const offsetX = x === 0 ? 0 : gutter * Math.max(0, x - 1) + gutter;
  const offsetY = y === 0 ? 0 : gutter * Math.max(0, y - 1) + gutter;

  return {
    y: cellSize * y + offsetY + paddingTop,
    x: cellSize * x + offsetX + paddingLeft,
    width: cellSize * width + Math.max(0, width - 1) * gutter,
    height: cellSize * height + Math.max(0, height - 1) * gutter,
  };
};
