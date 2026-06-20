import type { Store } from '../store';

export type DNDManagerConstructorParams = {
  store: Store;
};

export class DNDManager {
  store: Store;

  dropZoneRef = (element: HTMLDivElement | null) => {
    if (!element) return;
  };

  register = (element: HTMLDivElement | null) => {
    if (!element) return;

    const onMouseDown = (event: MouseEvent) => {
      element.setAttribute('data-active', 'true');
    };
    const onMouseUp = (event: MouseEvent) => {
      element.removeAttribute('data-active');
    };

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mouseup', onMouseUp);

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mouseup', onMouseUp);
    };
  };

  constructor({ store }: DNDManagerConstructorParams) {
    this.store = store;
  }
}
