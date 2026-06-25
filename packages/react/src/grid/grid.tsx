import { toPx, type GridConstructorParams } from '@core';
import '@siever/styles';
import { useEffect, type ComponentPropsWithRef } from 'react';
import { withGridProvider } from '../HOCs';
import { useGridContext } from '../hooks';
import { useGridState } from '../hooks/use-grid-state';
import { classNames } from '../utils';
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
            '--siever-grid-width': toPx(gridDimension.width),
            '--siever-grid-height': toPx(gridDimension.height),
            '--siever-grid-cell-size': toPx(cellDimension.width),
            '--siever-grid-content-width': toPx(gridDimension.contentWidth),
            '--siever-grid-content-height': toPx(gridDimension.contentHeight),
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={classNames('siever__grid-container')}>
          {status === 'initialized' && children}
        </div>
      </div>
    );
  },
);
Grid.displayName = 'Grid';
