import { Grid as GridClass, GridConstructorParams } from '@core';
import '@siever/styles';
import { ComponentPropsWithRef, useState } from 'react';
import { withSieverProvider } from '../HOCs';
import { useSieverProvider } from '../hooks';
import { classNames } from '../utils';

export type GridProps = GridConstructorParams & ComponentPropsWithRef<'div'>;

export const Grid = withSieverProvider(({ width, height, className, ...props }: GridProps) => {
  const { store } = useSieverProvider();
  const [grid] = useState(new GridClass({ store, width, height }));

  return <div ref={grid.gridRef} className={classNames('siever__grid', className)} {...props} />;
});
