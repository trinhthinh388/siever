export type BaseManagerInitializeParams = {};

export abstract class BaseManager {
  abstract init(): void;
  abstract destroy(): void;
}
