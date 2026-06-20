import { Item as ItemClass } from '@core';
import { type ComponentType, useLayoutEffect, useMemo, useState } from 'react';
import { useGridContext } from '../hooks';
import { useGridState } from '../hooks/use-grid-state';
import { classNames } from '../utils';
import { mergeRefs } from '../utils/merge-refs';

export type ItemProps<TProps> = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  className?: string;
  component?: ComponentType<TProps>;
} & TProps;

export const Item = <TProps,>({
  x = 0,
  y = 0,
  width = 0,
  className,
  height = 0,
  component: Component,
  ...componentProps
}: ItemProps<TProps>) => {
  const { grid } = useGridContext();
  const { items } = useGridState();
  const [item] = useState(new ItemClass({ x, y, width, height }));

  useLayoutEffect(() => {
    grid.addItem(item);
  }, [grid, item]);

  const InnerComponent = useMemo(() => {
    // @ts-expect-error render customized component.
    if (Component) return <Component {...componentProps} />;

    return null;
  }, [componentProps, Component]);

  if (!items[item.id]) return null;

  const { dimension } = items[item.id];

  return (
    <div
      ref={mergeRefs(grid.managers.dnd.register)}
      style={{
        top: dimension.y,
        left: dimension.x,
        width: dimension.width,
        height: dimension.height,
      }}
      className={classNames('siever__item', className)}
    >
      {InnerComponent}
    </div>
  );
};
