import { useSieverProvider } from './use-siever-provider';

export const useGridState = () => {
  const { useAppSelector } = useSieverProvider();

  return useAppSelector((state) => state['_siever/grid']);
};
