import type { GridState } from '../grid/slices/grid.slice';
import type { ItemConfiguration } from '../item';
import type { Dimension } from '../types';

export const calculateItemDimension = (
  {
    configuration: { gutter },
    dimension: {
      cell: { width: cellSize },
    },
  }: GridState,
  { x, y, width, height }: ItemConfiguration,
): Dimension => {
  const offsetX = x === 0 ? 0 : gutter * Math.max(0, x - 1) + gutter;
  const offsetY = y === 0 ? 0 : gutter * Math.max(0, y - 1) + gutter;

  const cellWidth = cellSize * width + Math.max(0, width - 1) * gutter;
  const cellHeight = cellSize * height + Math.max(0, height - 1) * gutter;

  return {
    x: 0,
    y: 0,
    paddingTop: 0,
    paddingLeft: 0,
    width: cellWidth,
    contentHeight: 0,
    paddingBottom: 0,
    height: cellHeight,
    contentWidth: cellWidth,
    paddingRight: cellWidth,
    top: cellSize * y + offsetY,
    left: cellSize * x + offsetX,
  };
};
