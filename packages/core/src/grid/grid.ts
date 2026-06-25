import type { Item } from '../item';
import { DNDManager, EventManager, type MouseEventHandler, type SupportedEvents } from '../manager';
import type { Store } from '../store';
import { bisectLeft, calculateItemDimension, measure } from '../utils';
import { DEFAULT_GRID_HEIGHT, DEFAULT_GRID_WIDTH } from './constants';
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
  private element: HTMLElement | null = null;
  private store: Store;
  private managers: GridManagers = {
    dnd: new DNDManager({ grid: this }),
    events: new EventManager({ grid: this }),
  };
  private observers: GridObservers;
  private prefixWidthSum: Array<number>;
  private prefixHeightSum: Array<number>;

  #calculatePrefixSum = () => {
    const configuration = this.getConfiguration();
    const { width: cellSize } = this.getCellSize();
    const { x, y, paddingTop, paddingLeft } = measure(this.getGridElement());

    const startX = x + paddingLeft;
    const startY = y + paddingTop;

    for (let i = 0; i < configuration.width; i++) {
      this.prefixWidthSum[i] =
        startX + cellSize * i + configuration.gutter * i + configuration.gutter;
    }

    for (let i = 0; i < configuration.height; i++) {
      this.prefixHeightSum[i] =
        startY + cellSize * i + configuration.gutter * i + configuration.gutter;
    }
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

      const element = gridEntry.target as HTMLElement;
      const configuration = gridSlice.selectors.configuration(this.store.getState());
      const measuredRect = measure(element);

      const gridSize = Math.max(measuredRect.contentWidth, measuredRect.contentHeight);
      const cellSize = this.#calculateCellSize(gridSize);

      this.store.dispatch(
        gridSlice.actions.update({
          status: 'initialized',
          dimension: {
            cell: { width: cellSize, height: cellSize },
            grid: {
              contentWidth: gridSize,
              paddingTop: measuredRect.paddingTop,
              width: cellSize * configuration.width,
              paddingLeft: measuredRect.paddingLeft,
              height: cellSize * configuration.height,
              paddingRight: measuredRect.paddingRight,
              paddingBottom: measuredRect.paddingBottom,
              contentHeight: Math.max(gridSize, measuredRect.contentHeight),
            },
          },
        }),
      );
      this.#calculatePrefixSum();
    });

  #calculateCellSize = (gridSize = 0) => {
    const configuration = gridSlice.selectors.configuration(this.store.getState());
    const gutterWidth = (configuration.width - 1) * configuration.gutter;
    const cellSize = (gridSize - gutterWidth) / configuration.width;
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
    item.dimension = calculateItemDimension(
      gridSlice.selectors.grid(this.store.getState()),
      item.configuration,
    );
    this.store.dispatch(gridSlice.actions.addItem(item.serialize()));
  };

  /**
   * Returns the Grid's item from the store.
   */
  getItem = (id: string) => {
    const item = gridSlice.selectors.item(this.store.getState())(id);
    if (!item) throw new Error(`Item with id ${id} not found`);
    return item;
  };

  /**
   * Get the snapped Grid's cell coordinate from the provided X and Y.
   * @example
   * ```js
   * const node = getCellCoordinates(100, 100);
   * // x: 1, h: 2 => the cell is located at the 2nd-column and 3rd-row.
   * ```
   */
  getSnapCoordinates = (x = 0, y = 0) => {
    if (!this.element) throw new Error("Grid's element doesn't exist in the DOM");
    const snapToCellX = bisectLeft(x, this.prefixWidthSum);
    const snapToCellY = bisectLeft(y, this.prefixHeightSum);
    return {
      x: this.prefixWidthSum[snapToCellX],
      y: this.prefixHeightSum[snapToCellY],
      grid: {
        x: snapToCellX,
        y: snapToCellY,
      },
    };
  };

  gridRef = (element: HTMLDivElement | null) => {
    if (!element) return;
    const unregister = this.managers.events.register(element);
    this.observers.resize.observe(element);
    // this.observers.mutation.observe(element, {
    //   childList: true,
    // });

    this.element = element;

    return () => {
      unregister();
      this.element = null;
    };
  };

  /**
   * Returns the Grid's managers.
   */
  getManagers = () => this.managers;

  /**
   * Returns the Grid's store
   */
  getStore = () => this.store;

  /**
   * Returns the current DOM element of the Grid
   * @throws if the element is null.
   */
  getGridElement = () => {
    if (!this.element) throw new Error("Grid's element doesn't exist in the DOM");
    return this.element;
  };

  /**
   * Returns the current Grid's configuration
   */
  getConfiguration = () => gridSlice.selectors.configuration(this.getStore().getState());

  constructor({
    store,
    width = DEFAULT_GRID_WIDTH,
    height = DEFAULT_GRID_HEIGHT,
  }: GridConstructorParams) {
    this.store = store;
    this.observers = {
      resize: this.#createResizeObserver(),
      mutation: this.#createMutationObserver(),
    };
    this.prefixWidthSum = Array.from<number>({ length: width }).fill(0);
    this.prefixHeightSum = Array.from<number>({ length: height }).fill(0);

    this.managers.dnd.init();
    this.managers.events.init();

    this.store.dispatch(
      gridSlice.actions.update({
        status: 'initializing',
        configuration: {
          width,
          height,
        },
      }),
    );
  }
}
