import { Item as ItemClass } from '@core';
import { type ComponentPropsWithRef, type ComponentType, useLayoutEffect, useState } from 'react';
import { useGridContext, useItem } from '../hooks';
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
  const { grid } = useGridContext();
  const [instance] = useState(new ItemClass({ grid }));
  const item = useItem(instance.getId());

  useLayoutEffect(() => {
    grid.addItem(instance.getId(), { x, y, width, height });
  }, [grid, instance, x, y, width, height]);

  if (!item) return null;

  return (
    <Component
      {...componentProps}
      id={instance.getId()}
      ref={mergeRefs(ref)}
      style={{
        top: item.dimension.top,
        left: item.dimension.left,
        width: item.dimension.width,
        height: item.dimension.height,
      }}
      className={classNames('siever__item siever__draggable', className)}
      {...instance.getElementAttributes(item.configuration)}
    />
  );
};
