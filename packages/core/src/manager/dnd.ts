import type { Grid } from '../grid';
import { BaseManager } from './base';

export type DNDManagerInitializeParams = {
  grid: Grid;
};

class DNDManager extends BaseManager {
  private grid: Grid;
  private disposes: VoidFunction[] = [];

  dropZoneRef = (element: HTMLDivElement | null) => {
    if (!element) return;
  };

  init = (): void => {
    this.disposes.push(
      this.grid.subscribe('mouseDown', (e) => {
        console.log(e.target);
      }),
    );
  };

  constructor({ grid }: DNDManagerInitializeParams) {
    super();
    this.grid = grid;
  }
}

export { DNDManager };
