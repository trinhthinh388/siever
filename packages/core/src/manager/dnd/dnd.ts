import type { Grid } from '../../grid';
import { ITEM_ELEMENT_ATTRIBUTES, type SerializedItem } from '../../item';
import { debounce, fromPxToNumber, measure, toPx } from '../../utils';
import { over } from '../../utils/fp';
import { recursiveFindItemElement } from '../../utils/recursive-find-item-element';
import { BaseManager } from '../base';
import { DND_DRAG_STATE, DND_ELEMENT_ATTRIBUTES, DND_ELEMENT_CSS_VARS } from './constants';
import { dndSlice } from './dnd.slice';

export type DNDManagerInitializeParams = {
  grid: Grid;
};

/**
 * In-memory drag state — replaces DOM attribute storage.
 * Created atomically in `#beginDrag`, cleared in `#resetDragState`.
 */
type DragState = {
  item: SerializedItem;
  /** The original element being dragged */
  element: HTMLElement;
  /** The ghost/clone element */
  clonedElement: HTMLElement;
  /** The mouse's position */
  grabOffset: {
    x: number;
    y: number;
  };
  /**
   * The original position of the cloned element
   */
  clonedElementOrigin: {
    x: number;
    y: number;
  };
};

class DNDManager extends BaseManager {
  private grid: Grid;
  private disposes: VoidFunction[] = [];

  private dragState: DragState | undefined;

  /**
   * Entry point for a drag. Finds the target item element, creates
   * the DragState atomically, and appends the clone to the grid.
   */
  #beginDrag = (e: MouseEvent) => {
    const itemElement = recursiveFindItemElement(e.target);
    if (!itemElement) return;

    // If already dragging the same element, bail out.
    if (this.dragState?.element.id === itemElement.id) return;

    // If a previous drag wasn't cleaned up, reset first.
    if (this.dragState) this.#resetDragState();

    // Update Redux store
    const item = this.grid.getItem(itemElement.id);
    this.grid.getStore().dispatch(dndSlice.actions.setDraggingItem(item));

    // Build drag state atomically
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Create the clone element
    const clonedElement = this.#createCloneElement(itemElement);
    // Append clone to grid container
    this.grid.getGridContainerElement().appendChild(clonedElement);
    const clonedElementRect = measure(clonedElement);

    // Setup initial style for the original element
    const { top, left, width, height } = measure(itemElement);
    const transformOriginX = (Math.abs(mouseX - left) / width) * 100;
    const transformOriginY = (Math.abs(mouseY - top) / height) * 100;
    itemElement.style.setProperty(
      DND_ELEMENT_CSS_VARS.transformOrigin,
      `${transformOriginX}% ${transformOriginY}%`,
    );
    itemElement.setAttribute(DND_ELEMENT_ATTRIBUTES.dataDrag, 'true');
    itemElement.setAttribute(DND_ELEMENT_ATTRIBUTES.draggable, 'false');
    this.#markAsIdle(itemElement);

    this.dragState = {
      item,
      clonedElement,
      element: itemElement,
      grabOffset: {
        x: mouseX,
        y: mouseY,
      },
      clonedElementOrigin: { x: clonedElementRect.x, y: clonedElementRect.y },
    };
  };

  /**
   * Creates a clone element styled via CSS class instead of inline styles.
   */
  #createCloneElement = (sourceElement: HTMLElement): HTMLElement => {
    const cloned = sourceElement.cloneNode(false) as HTMLElement;
    cloned.id = `${cloned.id}-cloned`;

    // Preserve positioning from source
    cloned.style.setProperty('top', sourceElement.style.getPropertyValue('top'));
    cloned.style.setProperty('left', sourceElement.style.getPropertyValue('left'));
    cloned.style.setProperty('translate', 'var(--siever-item-translate, 0 0)', 'important');

    cloned.classList.add('siever__item--clone');

    return cloned;
  };

  /**
   * Handles mouse movement during a drag.
   * All coordinate data comes from the in-memory `DragState` — no DOM reads.
   */
  #drag = (e: MouseEvent) => over([this.#moveElement, this.#moveCloneElement])(e);

  /**
   * Ends the current drag and cleans up all state.
   */
  #stopDrag = (_e: MouseEvent) => over([this.#drop, this.#resetDragState])();

  /**
   * Resets all drag-related state:
   * - Removes CSS classes and custom properties from the original element
   * - Removes the clone element from the DOM
   * - Clears the Redux dragging state
   * - Nullifies the in-memory DragState
   */
  #resetDragState = () => {
    if (!this.dragState) return;

    const { element, clonedElement } = this.dragState;

    // Reset original element
    element.removeAttribute(DND_ELEMENT_ATTRIBUTES.dataDrag);
    element.removeAttribute(DND_ELEMENT_ATTRIBUTES.draggable);
    element.removeAttribute(DND_ELEMENT_ATTRIBUTES.dataDragState);
    element.style.removeProperty(DND_ELEMENT_CSS_VARS.translate);
    element.style.removeProperty(DND_ELEMENT_CSS_VARS.transformOrigin);

    // Remove clone from DOM
    clonedElement.remove();

    // Clear Redux state
    this.grid.getStore().dispatch(dndSlice.actions.setDraggingItem(undefined));

    this.dragState = undefined;
  };

  #moveElement = (e: MouseEvent) => {
    if (!this.dragState) return;

    const { element, grabOffset } = this.dragState;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Move the original element to follow the mouse
    const moveX = mouseX - grabOffset.x;
    const moveY = mouseY - grabOffset.y;
    element.style.setProperty(DND_ELEMENT_CSS_VARS.translate, `${toPx(moveX)} ${toPx(moveY)} 0`);
    this.#markAsDragging(element);
  };

  #canDrop = (item: SerializedItem) => ({
    atCell: (x: number, y: number) => {
      const hasCollisions = this.grid
        .getManagers()
        .collision.isCollide(x, y, item.configuration.width, item.configuration.height, [item.id]);
      const configuration = this.grid.getConfiguration();
      const availableWidth = configuration.width - x;
      const availableHeight = configuration.height - y;

      if (hasCollisions) return false;

      return (
        item.configuration.width <= availableWidth && item.configuration.height <= availableHeight
      );
    },
  });

  #drop = () => {
    if (!this.dragState) return;

    const { item, element, clonedElement } = this.dragState;

    this.#markAsDragging.cancel();
    this.#markAsDropping(element);
    const newX = fromPxToNumber(clonedElement.getAttribute(ITEM_ELEMENT_ATTRIBUTES.dataItemX));
    const newY = fromPxToNumber(clonedElement.getAttribute(ITEM_ELEMENT_ATTRIBUTES.dataItemY));
    this.grid.updateItem(item.id, {
      x: newX,
      y: newY,
    });
  };

  #moveCloneElement = (e: MouseEvent) => {
    if (!this.dragState) return;

    const { item, element, clonedElement, clonedElementOrigin } = this.dragState;

    // Snap the clone to the nearest grid cell
    const elementRect = measure(element);
    const cell = this.grid
      .getManagers()
      .coordinates.toGridCoordinates(elementRect.x, elementRect.y);
    const viewport = this.grid.getManagers().coordinates.toViewportCoordinates(cell.x, cell.y);

    if (this.#canDrop(item).atCell(cell.x, cell.y)) {
      clonedElement.setAttribute(ITEM_ELEMENT_ATTRIBUTES.dataItemX, `${cell.x}`);
      clonedElement.setAttribute(ITEM_ELEMENT_ATTRIBUTES.dataItemY, `${cell.y}`);
      clonedElement.style.setProperty(
        DND_ELEMENT_CSS_VARS.translate,
        `${toPx(viewport.x - clonedElementOrigin.x)} ${toPx(viewport.y - clonedElementOrigin.y)} 0`,
      );
    }
  };

  #markAsIdle = (element: HTMLElement) => {
    element.setAttribute(DND_ELEMENT_ATTRIBUTES.dataDragState, DND_DRAG_STATE.IDLE);
  };

  #markAsDropping = (element: HTMLElement) => {
    element.setAttribute(DND_ELEMENT_ATTRIBUTES.dataDragState, DND_DRAG_STATE.DROPPING);
  };

  #markAsDragging = (() => {
    const deferMarkAsIdle = debounce(this.#markAsIdle, 100);
    const fn = (element: HTMLElement) => {
      element.setAttribute(DND_ELEMENT_ATTRIBUTES.dataDragState, DND_DRAG_STATE.DRAGGING);
      deferMarkAsIdle(element);
    };
    fn.cancel = deferMarkAsIdle.cancel;
    return fn;
  })();

  init = (): void => {
    this.disposes.push(
      this.grid.subscribe('mouseDown', this.#beginDrag),
      this.grid.subscribe('mouseMove', this.#drag),
      this.grid.subscribe('mouseUp', this.#stopDrag),
    );
  };

  destroy = () => {
    this.#resetDragState();
    this.disposes.forEach((dispose) => dispose());
  };

  constructor({ grid }: DNDManagerInitializeParams) {
    super();
    this.grid = grid;
  }
}

export { DNDManager };
