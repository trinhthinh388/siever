import type { Grid } from '../../grid';
import { fromPxToNumber, toPx } from '../../utils';
import { recursiveFindItemElement } from '../../utils/recursive-find-item-element';
import { BaseManager } from '../base';
import { DND_ELEMENT_ATTRIBUTES, DND_ELEMENT_CSS_VARS } from './constants';
import { dndSlice } from './dnd.slice';

export type DNDManagerInitializeParams = {
  grid: Grid;
};

class DNDManager extends BaseManager {
  private grid: Grid;
  private disposes: VoidFunction[] = [];

  private draggingElement: HTMLElement | null = null;
  private cloneDraggingElement: HTMLElement | null = null;

  #setDraggingItem = (id: string) => {
    const item = this.grid.getItem(id);
    this.grid.getStore().dispatch(dndSlice.actions.setDraggingItem(item));
  };

  #resetDraggingItem = () => {
    if (this.cloneDraggingElement) {
      this.grid.getGridElement().removeChild(this.cloneDraggingElement);
    }
    this.draggingElement = null;
    this.cloneDraggingElement = null;
    this.grid.getStore().dispatch(dndSlice.actions.setDraggingItem(undefined));
  };

  /**
   * Returns the dragging HTML element.
   * @throws if no item is being dragged.
   */
  #getDraggingElement = () => {
    const item = dndSlice.selectors.getDraggingItem(this.grid.getStore().getState());
    if (!item) return null;

    if (item.id === this.draggingElement?.id) return this.draggingElement;
    else {
      const queriedElement = window.document.getElementById(item.id);
      if (!queriedElement)
        throw new Error(`Dragging item with id ${item.id} doesn't exist in the DOM`);
      this.draggingElement = queriedElement;
      this.cloneDraggingElement = queriedElement.cloneNode() as HTMLElement;
      this.cloneDraggingElement.style.setProperty('top', '0');
      this.cloneDraggingElement.style.setProperty('left', '0');
      this.cloneDraggingElement.style.setProperty('z-index', '0');
      this.cloneDraggingElement.style.setProperty('opacity', '0.8');
      this.cloneDraggingElement.style.setProperty('transition', 'all 0.3s ease 0s');
      this.cloneDraggingElement.style.setProperty('background-color', 'red');

      this.grid.getGridElement().appendChild(this.cloneDraggingElement);
    }

    return this.draggingElement;
  };

  #setInitialElementState = (el: HTMLElement, e: MouseEvent) => {
    const { top, left, width, height } = el.getBoundingClientRect();

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const transformOriginX = (Math.abs(mouseX - left) / width) * 100;
    const transformOriginY = (Math.abs(mouseY - top) / height) * 100;

    el.setAttribute(DND_ELEMENT_ATTRIBUTES.dataActive, 'true');
    el.setAttribute(DND_ELEMENT_ATTRIBUTES.dataShiftY, toPx(mouseY));
    el.setAttribute(DND_ELEMENT_ATTRIBUTES.dataOriginalWidth, toPx(width));
    el.setAttribute(DND_ELEMENT_ATTRIBUTES.dataShiftX, toPx(mouseX));
    el.setAttribute(DND_ELEMENT_ATTRIBUTES.dataOriginalHeight, toPx(height));

    el.style.setProperty(
      DND_ELEMENT_CSS_VARS.transformOrigin,
      `${transformOriginX}% ${transformOriginY}%`,
    );

    el.classList.add('siever__item--dragging');
  };

  #resetElementState = (el: HTMLElement) => {
    el.removeAttribute(DND_ELEMENT_ATTRIBUTES.dataActive);
    el.removeAttribute(DND_ELEMENT_ATTRIBUTES.dataShiftX);
    el.removeAttribute(DND_ELEMENT_ATTRIBUTES.dataShiftY);
    el.removeAttribute(DND_ELEMENT_ATTRIBUTES.dataOriginalWidth);
    el.removeAttribute(DND_ELEMENT_ATTRIBUTES.dataOriginalHeight);

    el.style.removeProperty(DND_ELEMENT_CSS_VARS.translate);
    el.style.removeProperty(DND_ELEMENT_CSS_VARS.transformOrigin);
    el.classList.remove('siever__item--dragging');
  };

  #onMouseDown = (e: MouseEvent) => {
    const itemEl = recursiveFindItemElement(e.target);
    if (!itemEl) return;

    this.#setInitialElementState(itemEl, e);

    this.#setDraggingItem(itemEl.id);
  };

  #onMouseUp = (e: MouseEvent) => {
    const draggingElement = this.#getDraggingElement();
    if (!draggingElement) return;
    this.#resetElementState(draggingElement);
    this.#resetDraggingItem();
  };

  #onMouseMove = (e: MouseEvent) => {
    const draggingElement = this.#getDraggingElement();
    if (!draggingElement) return;

    const shiftX = fromPxToNumber(draggingElement.getAttribute(DND_ELEMENT_ATTRIBUTES.dataShiftX));
    const shiftY = fromPxToNumber(draggingElement.getAttribute(DND_ELEMENT_ATTRIBUTES.dataShiftY));
    const moveX = toPx(e.clientX - shiftX);
    const moveY = toPx(e.clientY - shiftY);

    draggingElement.style.setProperty(DND_ELEMENT_CSS_VARS.translate, `${moveX} ${moveY} 0`);
  };

  // /**
  //  * Returns the top left cell position of the available dropzone.
  //  *
  //  */
  // #getDropZone = (e: MouseEvent): Coordinate => {
  //   return {
  //     x: 0,
  //     y: 0,
  //   };
  // };

  dropZoneRef = (element: HTMLDivElement | null) => {
    if (!element) return;
  };

  init = (): void => {
    this.disposes.push(
      this.grid.subscribe('mouseDown', this.#onMouseDown),
      this.grid.subscribe('mouseMove', this.#onMouseMove),
      this.grid.subscribe('mouseUp', this.#onMouseUp),
    );
  };

  constructor({ grid }: DNDManagerInitializeParams) {
    super();
    this.grid = grid;
  }
}

export { DNDManager };
