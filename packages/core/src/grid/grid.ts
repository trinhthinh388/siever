import type { Item } from '../item';
import { DNDManager, EventManager, type MouseEventHandler, type SupportedEvents } from '../manager';
import type { Store } from '../store';
import { measure } from '../utils';
import { CELL_BORDER_SIZE, DEFAULT_GRID_HEIGHT, DEFAULT_GRID_WIDTH } from './constants';
import { gridSlice } from './slices/grid.slice';

export type GridConstructorParams = {
  store: Store;
  width?: number;
  height?: number;
};

type GridManagers = {
  dnd: DNDManager;
  events: EventManager;
};

type GridObservers = {
  resize: ResizeObserver;
  mutation: MutationObserver;
};

export class Grid {
  private store: Store;
  private managers: GridManagers = {
    dnd: new DNDManager({ grid: this }),
    events: new EventManager({ grid: this }),
  };
  #createMutationObserver = () =>
    new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.', mutation.addedNodes);
        } else if (mutation.type === 'attributes') {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
      }
    });
  #createResizeObserver = () =>
    new ResizeObserver((entries) => {
      const gridEntry = entries.at(0);
      if (!gridEntry) return;

      const configuration = gridSlice.selectors.configuration(this.store.getState());
      const measuredRect = measure(gridEntry.target as HTMLElement);
      const cellSize = this.#calculateCellSize(measuredRect.width, measuredRect.height);
      this.store.dispatch(
        gridSlice.actions.update({
          dimension: {
            cell: { width: cellSize, height: cellSize },
            grid: {
              width: measuredRect.width,
              height: cellSize * configuration.height,
            },
          },
        }),
      );
    });

  private observers: GridObservers = {
    resize: this.#createResizeObserver(),
    mutation: this.#createMutationObserver(),
  };

  #calculateCellSize = (gridWidth = 0, gridHeight = 0) => {
    const cellSize = Math.max(
      (gridWidth + 2 * CELL_BORDER_SIZE) /
        gridSlice.selectors.configuration(this.store.getState()).width,
      (gridHeight + 2 * CELL_BORDER_SIZE) /
        gridSlice.selectors.configuration(this.store.getState()).height,
    );
    return cellSize;
  };

  /**
   * Returns the current cell size.
   */
  getCellSize = () => gridSlice.selectors.cellDimension(this.store.getState());

  /**
   * Clean-up everything.
   */
  cleanup = () => {
    this.observers.resize.disconnect();
    this.observers.mutation.disconnect();
  };

  subscribe = (event: SupportedEvents, callback: MouseEventHandler) => {
    return this.managers.events.subscribe(event, callback);
  };

  /**
   * Add item to the current Grid
   */
  addItem = (item: Item) => {
    this.store.dispatch(
      gridSlice.actions.addItem({
        id: item.id,
        configuration: item.getConfiguration(),
      }),
    );
  };

  gridRef = (element: HTMLDivElement | null) => {
    if (!element) return;
    const unregister = this.managers.events.register(element);
    this.observers.resize.observe(element);
    // this.observers.mutation.observe(element, {
    //   childList: true,
    // });

    return () => {
      unregister();
    };
  };

  getManagers = () => this.managers;

  constructor({
    store,
    width = DEFAULT_GRID_WIDTH,
    height = DEFAULT_GRID_HEIGHT,
  }: GridConstructorParams) {
    this.store = store;
    this.store.dispatch(
      gridSlice.actions.update({
        configuration: {
          width,
          height,
        },
      }),
    );

    this.managers.dnd.init();
    this.managers.events.init();
  }
}
