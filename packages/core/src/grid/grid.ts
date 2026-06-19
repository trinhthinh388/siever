import { Store } from '../store';
import { gridSlice } from './slices/grid.slice';

export type GridConstructorParams = {
  store: Store;
  width?: number;
  height?: number;
};

export class Grid {
  #createResizeObserver = () =>
    new ResizeObserver((entries) => {
      const gridEntry = entries.at(0);
      if (!gridEntry) return;

      const { width, height } = gridEntry.contentRect;
      this.store.dispatch(
        gridSlice.actions.updateConfiguration({
          width,
          height,
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

  constructor({ width, store, height }: GridConstructorParams) {
    this.observer = this.#createResizeObserver();
    this.store = store;
    this.store.dispatch(
      gridSlice.actions.updateConfiguration({
        width,
        height,
      }),
    );
  }
}
