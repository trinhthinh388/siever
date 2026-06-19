import type { GridConstructorParams } from '@core';
import type { ComponentPropsWithRef } from 'react';
import { withSieverProvider } from '../HOCs';
import { useSieverProvider } from '../hooks';
import { classNames } from '../utils';
// @ts-expect-error scss imports
import '@siever/styles';
import { useGridState } from '../hooks/use-grid-state';

export type GridProps = Omit<GridConstructorParams, 'store'> & ComponentPropsWithRef<'div'>;

export const Grid = withSieverProvider(({ width, height, className, ...props }: GridProps) => {
  const { grid } = useSieverProvider();
  const {
    dimension: { grid: gridDimension, cell: cellDimension },
  } = useGridState();

  return (
    <div
      ref={grid.gridRef}
      className={classNames('siever__grid', className)}
      style={
        {
          '--siever-grid-width': gridDimension.width ? `${gridDimension.width}px` : undefined,
          '--siever-grid-height': gridDimension.height ? `${gridDimension.height}px` : undefined,
          '--siever-grid-cell-size': cellDimension.width ? `${cellDimension.width}px` : undefined,
        } as React.CSSProperties
      }
      {...props}
    />
  );
});
