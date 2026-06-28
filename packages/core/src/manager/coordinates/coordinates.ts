import type { Grid } from '../../grid';
import { BaseManager } from '../base';

export type CoordinatesManagerConstructorParams = {
  grid: Grid;
};

export class CoordinatesManager extends BaseManager {
  private grid: Grid;

  init = (): void => {
    // Do nothing
  };

  destroy = (): void => {
    // Do nothing
  };

  /**
   * Given a viewport coordinate (e.g. from a dragged element),
   * returns the nearest grid cell indices and the snapped viewport position
   * of that cell's top-left corner.
   */
  toGridCoordinates = (x: number, y: number) => {
    const dimension = this.grid.getDimension();
    const configuration = this.grid.getConfiguration();

    const step = dimension.cell.width + configuration.gutter;

    // The grid container is inside the grid element, offset by padding + border.
    // grid.x / grid.y are from getBoundingClientRect (border-box origin).
    // Content starts after padding.
    const contentOriginX = dimension.grid.x + dimension.grid.paddingLeft;
    const contentOriginY = dimension.grid.y + dimension.grid.paddingTop;

    // Position relative to the grid content area
    const relX = x - contentOriginX;
    const relY = y - contentOriginY;

    const col = Math.round(relX / step);
    const row = Math.round(relY / step);

    const clampedCol = Math.max(0, Math.min(col, configuration.width - 1));
    const clampedRow = Math.max(0, Math.min(row, configuration.height - 1));

    return {
      x: clampedCol,
      y: clampedRow,
    };
  };

  /**
   * Given a Grid coordinate (e.g. from a dragged element),
   * returns corresponding Viewport's position of the grid cell's top-left corner.
   */
  toViewportCoordinates = (x: number, y: number) => {
    const dimension = this.grid.getDimension();
    const configuration = this.grid.getConfiguration();

    const step = dimension.cell.width + configuration.gutter;

    const contentOriginX = dimension.grid.x + dimension.grid.paddingLeft;
    const contentOriginY = dimension.grid.y + dimension.grid.paddingTop;

    return {
      x: x * step + contentOriginX,
      y: y * step + contentOriginY,
    };
  };

  constructor({ grid }: CoordinatesManagerConstructorParams) {
    super();
    this.grid = grid;
  }
}
