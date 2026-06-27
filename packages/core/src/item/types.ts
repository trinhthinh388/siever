import type { Grid } from '../grid';
import type { Dimension } from '../types';

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

export type ItemConstructorParameters = {
  grid: Grid;
};
