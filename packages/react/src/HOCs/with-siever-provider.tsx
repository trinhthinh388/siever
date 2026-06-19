import { ComponentType, JSX } from 'react';
import { SieverProvider } from '../providers';

/**
 * Higher-order component that wraps the given component with `SieverProvider`,
 * giving it access to the Siever Redux store.
 *
 * @example
 * const GridWithProvider = withSieverProvider(Grid);
 */
export const withSieverProvider = <P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
): ComponentType<P> => {
  const displayName = Component.displayName ?? Component.name ?? 'Component';

  const WrappedComponent = (props: P) => (
    <SieverProvider>
      <Component {...props} />
    </SieverProvider>
  );

  WrappedComponent.displayName = `withSieverProvider(${displayName})`;

  return WrappedComponent;
};
