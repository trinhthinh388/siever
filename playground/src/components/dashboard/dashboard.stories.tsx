import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './dashboard';

const meta = {
  title: 'Dashboard',
  component: Dashboard,
} satisfies Meta<typeof Dashboard>;

export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Default = {} satisfies Story;
