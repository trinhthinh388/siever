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
        <Grid>
          <Item
            x={2}
            y={4}
            width={2}
            height={3}
            component={ItemComponent}
            className="bg-white w-full h-full border rounded-md shadow-md px-10 siever__drag-handle transition-all delay-0 ease-linear data-[active]:scale-105 data-[active]:shadow-2xl"
          >
            1
          </Item>

          <Item
            x={4}
            y={4}
            width={2}
            height={3}
            component={ItemComponent}
            className="bg-white w-full h-full border rounded-md shadow-md px-10 siever__drag-handle transition-all delay-0 ease-linear data-[active]:scale-105 data-[active]:shadow-2xl"
          >
            2
          </Item>
        </Grid>
      </div>
    </SieverProvider>
  );
};
