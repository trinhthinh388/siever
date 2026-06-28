import { Grid, Item, SieverProvider } from '@react';
import type { ComponentPropsWithRef } from 'react';

const ItemComponent = ({ children, ...props }: ComponentPropsWithRef<'div'>) => {
  return (
    <div {...props}>
      <div className="h-full flex items-center justify-center">{children}</div>
    </div>
  );
};

export const Dashboard = () => {
  return (
    <SieverProvider>
      <div className="w-full h-full">
        <Grid className="p-6">
          <Item
            x={0}
            y={0}
            width={3}
            height={4}
            component={ItemComponent}
            className="bg-white w-full h-full border rounded-md shadow-md siever__drag-handle transition-all data-[drag-state='dragging']:transition-transform data-[drag-state='idle']:transition-all data-[drag-state='dropping']:transition-all delay-0 ease-linear data-[drag='true']:scale-105 data-[drag='true']:shadow-2xl"
          >
            1
          </Item>
          <Item
            x={4}
            y={5}
            width={3}
            height={4}
            component={ItemComponent}
            className="bg-white w-full h-full border rounded-md shadow-md siever__drag-handle transition-all data-[drag-state='dragging']:transition-transform data-[drag-state='idle']:transition-all data-[drag-state='dropping']:transition-all delay-0 ease-linear data-[drag='true']:scale-105 data-[drag='true']:shadow-2xl"
          >
            3
          </Item>
        </Grid>
      </div>
    </SieverProvider>
  );
};
