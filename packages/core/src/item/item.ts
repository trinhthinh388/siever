import { generateId } from '../utils';

export type SerializedItem = {
  id: string;
  configuration: ItemConfiguration;
};

export type ItemConfiguration = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ItemConstructorParams = Partial<ItemConfiguration>;

export class Item {
  id: string;
  configuration: ItemConfiguration = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  serialize = () => ({
    id: this.id,
    configuration: this.configuration,
  });

  constructor({ y = 0, x = 0, width = 0, height = 0 }: ItemConstructorParams = {}) {
    this.id = generateId();
    this.configuration = { x, y, width, height };

    this.getConfiguration = this.getConfiguration.bind(this);
  }

  getConfiguration() {
    return this.configuration;
  }
}
