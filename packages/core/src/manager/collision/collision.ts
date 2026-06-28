import type { Grid } from '../../grid';
import { BaseManager } from '../base';

export type CollisionManagerConstructorParams = {
  grid: Grid;
};

export class CollisionManager extends BaseManager {
  private grid: Grid;

  init = (): void => {
    // Do nothing
  };

  destroy = (): void => {
    // Do nothing
  };

  /**
   * Checks if the given coordinates collide with any other items.
   * @returns `true` if the given coordinates collide with any other items in the Grid and `false` otherwise
   */
  isCollide = (x: number, y: number, width: number, height: number, ignores: string[] = []) => {
    const items = Object.values(this.grid.getItems());

    const inclusiveItems = items.filter((it) => !ignores.includes(it.id));

    return inclusiveItems.some(
      (item) =>
        x < item.configuration.x + item.configuration.width &&
        x + width > item.configuration.x &&
        y < item.configuration.y + item.configuration.height &&
        y + height > item.configuration.y,
    );
  };

  constructor({ grid }: CollisionManagerConstructorParams) {
    super();
    this.grid = grid;
  }
}
