import { Grid } from '@core';
import { useState, type ComponentType, type JSX } from 'react';
import { GridContext, useSieverContext } from '../providers';

/**
 * Higher-order component that wraps the given component with `GridProvider`,
 * giving it access to the Grid instance.
 *
 * @example
 * const GridWithProvider = withGridProvider(Grid);
 */
export const withGridProvider = <P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
): ComponentType<P> => {
  const displayName = Component.displayName ?? Component.name ?? 'Component';

  const WrappedComponent = (props: P) => {
    const { store } = useSieverContext();
    const [grid] = useState(new Grid({ store }));

    return (
      <GridContext.Provider value={{ grid }}>
        <Component {...props} />
      </GridContext.Provider>
    );
  };

  WrappedComponent.displayName = `withSieverProvider(${displayName})`;

  return WrappedComponent;
};
