import { Grid, Item, SieverProvider } from '@react';
import type { PropsWithChildren } from 'react';

const ItemComponent = ({ children }: PropsWithChildren) => {
  return (
    <div draggable className="w-full h-full border rounded-md shadow-md px-10 siever__drag-handle">
      <div className="h-full flex items-center justify-center">{children}</div>
    </div>
  );
};

export const Dashboard = () => {
  return (
    <SieverProvider>
      <div className="w-full h-full">
        <Grid>
          <Item x={2} y={4} width={8} height={5} component={ItemComponent}>
            1
          </Item>
        </Grid>
      </div>
    </SieverProvider>
  );
};
