import type { Dimension } from '../types';
import { generateId } from '../utils';
import { ITEM_ELEMENT_ATTRIBUTES } from './constants';

export type SerializedItem = {
  id: string;
  dimension: Dimension;
  configuration: ItemConfiguration;
};

export type ItemConfiguration = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class Item {
  private id: string;

  getId = () => this.id;

  getElementAttributes = (configuration: ItemConfiguration) => ({
    [ITEM_ELEMENT_ATTRIBUTES.dataSlot]: 'item',
    [ITEM_ELEMENT_ATTRIBUTES.dataComponent]: 'siever',
    [ITEM_ELEMENT_ATTRIBUTES.dataItemX]: configuration.x,
    [ITEM_ELEMENT_ATTRIBUTES.dataItemY]: configuration.y,
    [ITEM_ELEMENT_ATTRIBUTES.dataItemWidth]: configuration.width,
    [ITEM_ELEMENT_ATTRIBUTES.dataItemHeight]: configuration.height,
  });

  constructor() {
    this.id = generateId();
  }
}
