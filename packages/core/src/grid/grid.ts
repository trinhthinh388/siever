import type { Store } from '../store';
import { DEFAULT_GRID_HEIGHT, DEFAULT_GRID_WIDTH } from './constants';
import { gridSlice } from './slices/grid.slice';

export type GridConstructorParams = {
  store: Store;
  width?: number;
  height?: number;
};

export class Grid {
  #calculateCellSize = (gridWidth = 0, gridHeight = 0) => {
    const cellSize = Math.max(
      gridWidth / gridSlice.selectors.configuration(this.store.getState()).width,
      gridHeight / gridSlice.selectors.configuration(this.store.getState()).height,
    );
    return cellSize;
  };

  #createResizeObserver = () =>
    new ResizeObserver((entries) => {
      const gridEntry = entries.at(0);
      if (!gridEntry) return;

      const { width, height } = gridEntry.contentRect;
      const cellSize = this.#calculateCellSize(width, height);
      this.store.dispatch(
        gridSlice.actions.update({
          dimension: {
            cell: { width: cellSize, height: cellSize },
            grid: {
              width,
              height: cellSize * gridSlice.selectors.configuration(this.store.getState()).height,
            },
          },
        }),
      );
    });

  store: Store;

  observer: ResizeObserver;

  getCellSize = () => gridSlice.selectors.cellDimension(this.store.getState());

  gridRef = (element: HTMLDivElement | null) => {
    if (!element) return;
    this.observer.disconnect();
    this.observer.observe(element);
  };

  constructor({
    store,
    width = DEFAULT_GRID_WIDTH,
    height = DEFAULT_GRID_HEIGHT,
  }: GridConstructorParams) {
    this.observer = this.#createResizeObserver();
    this.store = store;
    this.store.dispatch(
      gridSlice.actions.updateConfiguration({
        width,
        height,
      }),
    );

    this.gridRef = this.gridRef.bind(this);
    this.getCellSize = this.getCellSize.bind(this);
    this.#calculateCellSize = this.#calculateCellSize.bind(this);
    this.#createResizeObserver = this.#createResizeObserver.bind(this);
  }
}
