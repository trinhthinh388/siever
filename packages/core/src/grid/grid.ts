import type { ItemConfiguration } from '../item';
import { DNDManager, EventManager, type MouseEventHandler, type SupportedEvents } from '../manager';
import type { Store } from '../store';
import type { Coordinate, DeepPartial, Dimension } from '../types';
import { calculateItemDimension, measure } from '../utils';
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
      this.#calculateComponentsDimension(measure(element));
    });

  #calculateCellSize = (grid: Dimension) => {
    const gridSize = grid.contentWidth;
    const configuration = gridSlice.selectors.configuration(this.store.getState());

    const gutterWidth = (configuration.width - 1) * configuration.gutter;
    const cellSize = (gridSize - gutterWidth) / configuration.width;

    return cellSize;
  };

  #calculateComponentsDimension = (grid: Dimension) => {
    const configuration = gridSlice.selectors.configuration(this.store.getState());

    const cellSize = this.#calculateCellSize(grid);
    const contentWidth =
      configuration.width * cellSize + (configuration.width - 1) * configuration.gutter;
    const contentHeight =
      configuration.height * cellSize + (configuration.height - 1) * configuration.gutter;

    this.store.dispatch(
      gridSlice.actions.update({
        status: 'initialized',
        dimension: {
          grid: {
            ...grid,
            contentWidth,
            contentHeight,
          },
          cell: {
            x: 0,
            y: 0,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            width: cellSize,
            contentWidth: 0,
            paddingBottom: 0,
            height: cellSize,
            contentHeight: 0,
          },
        },
      }),
    );
  };

  /**
   * Returns the current cell size.
   */
  getCellSize = () => gridSlice.selectors.cellDimension(this.store.getState());

  /**
   * Given a viewport coordinate (e.g. from a dragged element),
   * returns the nearest grid cell indices and the snapped viewport position
   * of that cell's top-left corner.
   */
  convertViewportCoordinatesToCellCoordinates = (
    viewportX: number,
    viewportY: number,
  ): { cell: Coordinate; viewport: Coordinate } => {
    const state = this.store.getState();
    const { cell, grid } = gridSlice.selectors.dimension(state);
    const configuration = gridSlice.selectors.configuration(state);

    const step = cell.width + configuration.gutter;

    // The grid container is inside the grid element, offset by padding + border.
    // grid.x / grid.y are from getBoundingClientRect (border-box origin).
    // Content starts after padding.
    const contentOriginX = grid.x + grid.paddingLeft;
    const contentOriginY = grid.y + grid.paddingTop;

    // Position relative to the grid content area
    const relX = viewportX - contentOriginX;
    const relY = viewportY - contentOriginY;

    const col = Math.round(relX / step);
    const row = Math.round(relY / step);

    const clampedCol = Math.max(0, Math.min(col, configuration.width - 1));
    const clampedRow = Math.max(0, Math.min(row, configuration.height - 1));

    return {
      cell: { x: clampedCol, y: clampedRow },
      viewport: {
        x: contentOriginX + clampedCol * step,
        y: contentOriginY + clampedRow * step,
      },
    };
  };

  /**
   * Clean-up everything.
   */
  cleanup = () => {
    this.observers.resize.disconnect();
    this.observers.mutation.disconnect();
    this.managers.dnd.destroy();
  };

  subscribe = (event: SupportedEvents, callback: MouseEventHandler) => {
    return this.managers.events.subscribe(event, callback);
  };

  /**
   * Add item to the current Grid
   */
  addItem = (id: string, configuration: ItemConfiguration) => {
    this.store.dispatch(
      gridSlice.actions.addItem({
        id,
        configuration,
        dimension: calculateItemDimension(
          gridSlice.selectors.grid(this.store.getState()),
          configuration,
        ),
      }),
    );
  };

  updateItem = (id: string, configuration: DeepPartial<ItemConfiguration>) => {
    this.store.dispatch(
      gridSlice.actions.updateItem({
        id,
        configuration,
      }),
    );
  };

  /**
   * Returns the Grid's item from the store.
   */
  getItem = (id: string) => {
    const item = gridSlice.selectors.item(this.store.getState())(id);
    if (!item) throw new Error(`Item with id ${id} not found`);
    return item;
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
   * Returns the current DOM element of the Grid
   * @throws if the element is null.
   */
  getGridContainerElement = () => {
    const container = this.getGridElement().querySelector('.siever__grid-container');
    if (!container) throw new Error("Grid container's element doesn't exist in the DOM");
    return container as HTMLElement;
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
