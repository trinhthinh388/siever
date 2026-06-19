import { createStore } from '@core';
import { PropsWithChildren, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { SieverContext } from './siever-context';

export type SieverProviderProps = PropsWithChildren<{}>;

export const SieverProvider = ({ children }: SieverProviderProps) => {
  const [store] = useState(createStore);
  const ctx = useMemo(() => ({ store }), [store]);

  return (
    <SieverContext.Provider value={ctx}>
      <Provider store={store}>{children}</Provider>
    </SieverContext.Provider>
  );
};
