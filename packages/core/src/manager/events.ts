import type { Grid } from '../grid';
import { BaseManager } from './base';

export type MouseEventHandler = (event: MouseEvent) => void;

export type SupportedEvents = 'mouseDown' | 'mouseUp' | 'mouseMove';

type EventManagerConstructorParams = {
  grid: Grid;
};

class EventManager extends BaseManager {
  private grid: Grid;
  private onMouseUpCallbacks: Set<MouseEventHandler> = new Set();
  private onMouseDownCallbacks: Set<MouseEventHandler> = new Set();
  private onMouseMoveCallbacks: Set<MouseEventHandler> = new Set();

  subscribe = (event: SupportedEvents, callback: MouseEventHandler) => {
    switch (event) {
      case 'mouseDown':
        this.onMouseDownCallbacks.add(callback);
        return () => this.onMouseDownCallbacks.delete(callback);
      case 'mouseUp':
        this.onMouseUpCallbacks.add(callback);
        return () => this.onMouseUpCallbacks.delete(callback);
      case 'mouseMove':
        this.onMouseMoveCallbacks.add(callback);
        return () => this.onMouseUpCallbacks.delete(callback);
      default:
        throw new Error(`Not supported event: ${event}`);
    }
  };

  register = (element: HTMLDivElement | null) => {
    if (!element) return () => void 0;

    const onMouseDown = (event: MouseEvent) =>
      Array.from(this.onMouseDownCallbacks).forEach((callback) => callback(event));
    const onMouseUp = (event: MouseEvent) =>
      Array.from(this.onMouseUpCallbacks).forEach((callback) => callback(event));
    const onMouseMove = (event: MouseEvent) =>
      Array.from(this.onMouseMoveCallbacks).forEach((callback) => callback(event));

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseup', onMouseUp);
    };
  };

  init = (): void => {
    // Do nothing
  };

  constructor({ grid }: EventManagerConstructorParams) {
    super();
    this.grid = grid;
  }
}

export { EventManager };
