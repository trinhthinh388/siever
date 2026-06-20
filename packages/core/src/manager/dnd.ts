import type { Grid } from '../grid';
import type { Store } from '../store';

export type DNDManagerInitializeParams = {
  grid: Grid;
  store: Store;
};

class DNDManager {
  dropZoneRef = (element: HTMLDivElement | null) => {
    if (!element) return;
  };
}

export { DNDManager };
