import type { Grid } from '../grid';
import { generateId } from '../utils';
import { ITEM_ELEMENT_ATTRIBUTES } from './constants';
import type { ItemConfiguration, ItemConstructorParameters } from './types';

export class Item {
  private grid: Grid;
  private id: string;

  getId = () => this.id;

  getDimension = () => this.grid.getItem(this.id).dimension;

  getConfiguration = () => this.grid.getItem(this.id).configuration;

  getElementAttributes = (configuration: ItemConfiguration) => ({
    [ITEM_ELEMENT_ATTRIBUTES.dataSlot]: 'item',
    [ITEM_ELEMENT_ATTRIBUTES.dataComponent]: 'siever',
    [ITEM_ELEMENT_ATTRIBUTES.dataItemX]: configuration.x,
    [ITEM_ELEMENT_ATTRIBUTES.dataItemY]: configuration.y,
    [ITEM_ELEMENT_ATTRIBUTES.dataItemWidth]: configuration.width,
    [ITEM_ELEMENT_ATTRIBUTES.dataItemHeight]: configuration.height,
  });

  constructor({ grid }: ItemConstructorParameters) {
    this.id = generateId();
    this.grid = grid;
  }
}
