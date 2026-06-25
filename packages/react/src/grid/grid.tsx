import type { GridConstructorParams } from '@core';
import { useEffect, type ComponentPropsWithRef } from 'react';
import { withGridProvider } from '../HOCs';
import { useGridContext } from '../hooks';
import { classNames } from '../utils';
// @ts-expect-error scss imports
import '@siever/styles';
import { useGridState } from '../hooks/use-grid-state';
import { mergeRefs } from '../utils/merge-refs';

export type GridProps = Omit<GridConstructorParams, 'store'> & ComponentPropsWithRef<'div'>;

export const Grid = withGridProvider(
  ({ ref, width, height, children, className, ...props }: GridProps) => {
    const { grid } = useGridContext();
    const {
      status,
      dimension: { grid: gridDimension, cell: cellDimension },
    } = useGridState();

    useEffect(() => () => grid.cleanup(), [grid]);

    return (
      <div
        data-slot="grid"
        data-component="siever"
        ref={mergeRefs(grid.gridRef, ref)}
        className={classNames('siever__grid', className)}
        style={
          {
            '--siever-grid-cell-size': cellDimension.width ? `${cellDimension.width}px` : undefined,
            '--siever-grid-width': gridDimension.contentWidth
              ? `${gridDimension.contentWidth}px`
              : undefined,
            '--siever-grid-height': gridDimension.contentHeight
              ? `${gridDimension.contentHeight}px`
              : undefined,
          } as React.CSSProperties
        }
        {...props}
      >
        {status === 'initialized' && children}
      </div>
    );
  },
);
Grid.displayName = 'Grid';
