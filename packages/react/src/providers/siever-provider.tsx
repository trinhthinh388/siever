import { createStore, Grid } from '@core';
import { type PropsWithChildren, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { SieverContext } from './siever-context';

export type SieverProviderProps = PropsWithChildren<unknown>;

export const SieverProvider = ({ children }: SieverProviderProps) => {
  const [store] = useState(createStore);
  const [grid] = useState(new Grid({ store }));

  const ctx = useMemo(() => ({ grid, store }), [grid, store]);

  return (
    <SieverContext.Provider value={ctx}>
      <Provider store={store}>{children}</Provider>
    </SieverContext.Provider>
  );
};
