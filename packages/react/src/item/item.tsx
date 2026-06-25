import { Item as ItemClass } from '@core';
import { type ComponentPropsWithRef, type ComponentType, useLayoutEffect, useState } from 'react';
import { useGridContext, useItemDimension } from '../hooks';
import { classNames } from '../utils';
import { mergeRefs } from '../utils/merge-refs';

export type ItemProps<TProps extends ComponentPropsWithRef<'div'>> = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  className?: string;
  component?: ComponentType<TProps> | React.ElementType;
} & TProps;

export const Item = <TProps extends ComponentPropsWithRef<'div'>>({
  ref,
  x = 0,
  y = 0,
  width = 0,
  className,
  height = 0,
  component: Component = 'div',
  ...componentProps
}: ItemProps<TProps>) => {
  const [item] = useState(new ItemClass({ x, y, width, height }));
  const { grid } = useGridContext();
  const dimension = useItemDimension(item.id);

  useLayoutEffect(() => {
    grid.addItem(item);
  }, [grid, item]);

  if (!dimension) return null;

  return (
    <Component
      id={item.id}
      ref={mergeRefs(ref)}
      data-component="siever"
      data-slot="item"
      style={{
        top: dimension.y,
        left: dimension.x,
        width: dimension.width,
        height: dimension.height,
      }}
      className={classNames('siever__item siever__draggable', className)}
      {...componentProps}
    />
  );
};
